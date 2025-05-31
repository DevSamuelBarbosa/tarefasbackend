import { RequestHandler } from 'express';
import prisma from '../../prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const criarTarefa: RequestHandler = async (req, res) => {
	const { titulo, descricao } = req.body;
    const userId = (req as any).userId;

	try {
		const tarefa = await prisma.tarefa.create({
			data: {
				titulo,
				descricao,
                usuarioId: userId
			},
		});
		res.status(201).json(tarefa);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao criar tarefa' });
	}
};

export const buscarTarefa: RequestHandler = async (req, res) => {
	const { id } = req.params;
	const userId = (req as any).userId;

	try {
		const tarefa = await prisma.tarefa.findFirst({
			where: { id, usuarioId: userId }
		});

		if (!tarefa) {
			res.status(404).json({ error: 'Tarefa não encontrada' });
            return;
		}

		res.json(tarefa);

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Erro ao buscar tarefa' });
	}
};

export const atualizarTarefa: RequestHandler = async (req, res) => {
	const { id } = req.params;
	const { titulo, descricao } = req.body;
	const userId = (req as any).userId;

	try {
		const tarefa = await prisma.tarefa.updateMany({
			where: { id, usuarioId: userId },
			data: { titulo, descricao }
		});

		if (tarefa.count === 0) {
			res.status(404).json({ error: 'Tarefa não encontrada ou não pertence ao usuário' });
            return;
		}

		res.json({ message: 'Tarefa atualizada com sucesso' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Erro ao atualizar tarefa' });
	}
};


export const iniciarTarefa: RequestHandler = async (req, res) => {
	const { id } = req.params;
    const userId = (req as any).userId;

	try {
        const tarefa = await prisma.tarefa.findUnique({ where: { id } });

        if (!tarefa) {
            res.status(404).json({ error: 'Tarefa não encontrada' });
            return;
        }

        if (tarefa.usuarioId !== userId) {
            res.status(403).json({ error: 'Você não tem permissão para iniciar esta tarefa' });
            return;
        }

        const tarefaAtualizada = await prisma.tarefa.update({
        where: { id },
        data: {
            status: 'iniciada',
            iniciada_em: new Date()
        }
        });

        res.json(tarefaAtualizada);
	} catch (err) {
		res.status(500).json({ error: 'Erro ao iniciar tarefa' });
	}
};

export const pausarTarefa: RequestHandler = async (req, res) => {
	const { id } = req.params;
    const userId = (req as any).userId;

	try {
		const tarefa = await prisma.tarefa.findUniqueOrThrow({ where: { id } });

		if (!tarefa.iniciada_em) {
			res.status(400).json({ error: 'Tarefa não está ativa' });
			return;
		}

        if (tarefa.usuarioId !== userId) {
            res.status(403).json({ error: 'Você não tem permissão para pausar esta tarefa' });
            return;
        }

		const now = new Date();
		const diffSeconds = Math.floor((now.getTime() - tarefa.iniciada_em.getTime()) / 1000);

		const updated = await prisma.tarefa.update({
			where: { id },
			data: {
				tempo_total: tarefa.tempo_total + diffSeconds,
				status: 'pausada',
				iniciada_em: null,
			},
		});

		res.json(updated);
	} catch (err) {
		res.status(500).json({ error: 'Erro ao pausar tarefa' });
	}
};


export const listarTarefas: RequestHandler = async (req, res) => {
	const { status, criadaEm, finalizadaEm } = req.query;
    const userId = (req as any).userId;

	try {
		const where: Record<string, any> = {};

		if (status && typeof status === 'string') {
			where.status = status;
		}

        const dataCriadaEm = new Date(criadaEm as string);
		if (!isNaN(dataCriadaEm.getTime())) {
			const diaSeguinte = new Date(dataCriadaEm);
			diaSeguinte.setDate(dataCriadaEm.getDate() + 1);

			where.criada_em = {
				gte: dataCriadaEm,
				lt: diaSeguinte,
			};
		}

		if (finalizadaEm) {
			const dataFinalizada = new Date(finalizadaEm as string);
			const diaSeguinteFinalizada = new Date(dataFinalizada);
			diaSeguinteFinalizada.setDate(dataFinalizada.getDate() + 1);

			where.finalizada_em = {
				gte: dataFinalizada,
				lt: diaSeguinteFinalizada,
			};
		}

        if (userId) {
            where.usuarioId = userId;
        }

		const tarefas = await prisma.tarefa.findMany({
			where,
			orderBy: { criada_em: 'desc' },
		});

		res.json(tarefas);
	} catch (err) {
		console.error('[Listar Tarefas] Erro:', err);
        res.status(500).json({ error: 'Erro ao listar tarefas' });
	}
};


export const concluirTarefa: RequestHandler = async (req, res) => {
	const { id } = req.params;
    const userId = (req as any).userId;


	try {
		const tarefa = await prisma.tarefa.findUniqueOrThrow({ where: { id } });

		if (tarefa.iniciada_em) {
			res.status(400).json({ error: 'Não é possível concluir uma tarefa que está em andamento' });
			return;
		}

        if (tarefa.status == 'concluída' && tarefa.finalizada_em != null){
            res.status(400).json({ error: 'A tarefa já está concluída' });
			return;
        }

        if (tarefa.usuarioId !== userId) {
            res.status(403).json({ error: 'Você não tem permissão para concluir esta tarefa' });
            return;
        }

		const now = new Date();

		const updated = await prisma.tarefa.update({
			where: { id },
			data: {
				status: 'concluída',
				finalizada_em: now
			},
		});

		res.json(updated);
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2025') {
				res.status(404).json({ error: `A tarefa de ID ${id} não existe.` });
			} else {
				console.error(error);
				res.status(500).json({ error: 'Erro ao concluir tarefa.' });
			}
		} else {
			console.error(error);
			res.status(500).json({ error: 'Erro ao concluir tarefa.' });
		}
	}
};

export const removerTarefa: RequestHandler = async (req, res) => {
	const { id } = req.params;
    const userId = (req as any).userId;

	try {

		const tarefa = await prisma.tarefa.findUniqueOrThrow({ where: { id } });

		if (tarefa.iniciada_em) {
			res.status(400).json({ error: 'Não é possível remover uma tarefa que está em andamento' });
			return;
        }

        if (tarefa.usuarioId !== userId) {
            res.status(403).json({ error: 'Você não tem permissão para remover esta tarefa' });
            return;
        }

		await prisma.tarefa.delete({ where: { id } });

		res.json({
			response: `Tarefa ID ${id} removida com sucesso!`,
		});

	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2025') {
				res.status(404).json({ error: `A tarefa de ID ${id} não existe.` });
			} else {
				console.error(error);
				res.status(500).json({ error: 'Erro ao remover tarefa.' });
			}
		} else {
			console.error(error);
			res.status(500).json({ error: 'Erro ao remover tarefa.' });
		}
	}
};


