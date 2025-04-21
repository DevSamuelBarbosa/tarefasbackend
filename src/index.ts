import express from 'express';
import cors from 'cors';
import tarefaRoutes from './routes/tarefaRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/tarefas', tarefaRoutes);

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
