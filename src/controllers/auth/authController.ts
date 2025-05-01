import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../../prisma/client';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'fallback-inseguro';

export const registrarUsuario: RequestHandler = async (req, res) => {
  const { nome, email, senha } = req.body;

  const hash = await bcrypt.hash(senha, 10);

  try {
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: hash }
    });

    res.status(201).json({ message: 'Usuário criado com sucesso', usuario: { id: usuario.id, email: usuario.email } });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário, talvez email já esteja em uso' });
  }
};


export const loginUsuario: RequestHandler = async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    res.status(401).json({ error: 'Credenciais inválidas' });
    return;
  }

  const token = jwt.sign({ userId: usuario.id }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
};
