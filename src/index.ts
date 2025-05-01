import express from 'express';
import cors from 'cors';
import tarefaRoutes from './routes/tarefaRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/tarefas', tarefaRoutes);
app.use('/auth', authRoutes);

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
