import { Router } from 'express';
import { criarTarefa, iniciarTarefa, pausarTarefa, removerTarefa, concluirTarefa, listarTarefas } from '../controllers/tarefaController';

const router = Router();

router.get('/', listarTarefas);
router.post('/criar', criarTarefa);
router.put('/:id/iniciar', iniciarTarefa);
router.put('/:id/pausar', pausarTarefa);
router.put('/:id/concluir', concluirTarefa);
router.delete('/:id/remover', removerTarefa);

export default router;