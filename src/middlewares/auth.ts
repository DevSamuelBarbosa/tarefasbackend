import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-inseguro';

export function autenticarToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' });
    return ;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).userId = (payload as any).userId; // guarda o userId no req
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido' });
    return;
  }
}
