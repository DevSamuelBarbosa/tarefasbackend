import { RequestHandler } from 'express';
import prisma from '../prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DateTime } from 'luxon';

const agoraBrasil = DateTime.now().setZone('America/Sao_Paulo').toJSDate();

export const criarTarefa: RequestHandler = async (req, res) => {
	const { titulo, descricao } = req.body;

	try {
		const tarefa = await prisma.tarefa.create({
			data: {
				titulo,
				descricao,
			},
		});
		res.status(201).json(tarefa);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao criar tarefa' });
	}
};


export const iniciarTarefa: RequestHandler = async (req, res) => {
	const { id } = req.params;
	try {
		const tarefa = await prisma.tarefa.update({
			where: { id },
			data: {
				status: 'ativa',
				iniciada_em: agoraBrasil
			},
		});
		res.status(201).json(tarefa);
	} catch (err) {
		res.status(500).json({ error: 'Erro ao iniciar tarefa' });
	}
};

export const pausarTarefa: RequestHandler = async (req, res) => {
	const { id } = req.params;

	try {
		const tarefa = await prisma.tarefa.findUniqueOrThrow({ where: { id } });

		if (!tarefa.iniciada_em) {
			res.status(400).json({ error: 'Tarefa não está ativa' });
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

	try {
		const where: any = {};

		if (status) {
			where.status = status;
		}

		if (criadaEm) {
			const data = new Date(criadaEm as string);
			const diaSeguinte = new Date(data);
			diaSeguinte.setDate(data.getDate() + 1);

			where.criada_em = {
				gte: data,
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

		const tarefas = await prisma.tarefa.findMany({
			where,
			orderBy: { criada_em: 'desc' },
		});

		res.json(tarefas);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erro ao listar tarefas' });
	}
};


export const concluirTarefa: RequestHandler = async (req, res) => {
	const { id } = req.params;

	try {
		const tarefa = await prisma.tarefa.findUniqueOrThrow({ where: { id } });

		if (tarefa.iniciada_em) {
			res.status(400).json({ error: 'Não é possível concluir uma tarefa que está em andamento' });
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

	try {

		const tarefa = await prisma.tarefa.findUniqueOrThrow({ where: { id } });

		if (tarefa.iniciada_em) {
			res.status(400).json({ error: 'Não é possível remover uma tarefa que está em andamento' });
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


