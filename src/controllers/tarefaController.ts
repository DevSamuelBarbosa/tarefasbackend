import { RequestHandler } from 'express';
import prisma from '../prisma/client';
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

