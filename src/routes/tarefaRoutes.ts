import { Router } from 'express';
import { criarTarefa, iniciarTarefa, pausarTarefa, removerTarefa, concluirTarefa, listarTarefas, buscarTarefa, atualizarTarefa } from '../controllers/tarefa/tarefaController';
import { autenticarToken } from '../middlewares/auth';

const router = Router();

router.get('/', autenticarToken, listarTarefas);
router.get('/:id', autenticarToken, buscarTarefa);
router.put('/:id', autenticarToken, atualizarTarefa);
router.post('/criar', autenticarToken, criarTarefa);
router.put('/:id/iniciar', autenticarToken, iniciarTarefa);
router.put('/:id/pausar', autenticarToken, pausarTarefa);
router.put('/:id/concluir', autenticarToken, concluirTarefa);
router.delete('/:id/remover', autenticarToken, removerTarefa);

export default router;