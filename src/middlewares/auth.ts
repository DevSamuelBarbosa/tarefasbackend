import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-inseguro';

export async function autenticarToken(req: Request, res: Response, next: NextFunction): Promise<void> {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(' ')[1];

	if (!token) {
		res.status(401).json({ error: 'Token não fornecido' });
		return;
	}

	try {
		const payload = jwt.verify(token, JWT_SECRET) as { userId?: string };

		const usuario = await prisma.usuario.findFirst({
			where: { token_jwt: token }
		});

		if (!usuario) {
			res.status(403).json({ error: 'Token inválido ou expirado' });
			return;
		}

		(req as any).userId = usuario.id;

		next();
	} catch (err) {
		res.status(403).json({ error: 'Token inválido' });
	}
}
