import { Router } from 'express';
import { criarTarefa, iniciarTarefa, pausarTarefa } from '../controllers/tarefaController';

const router = Router();

router.post('/criar', criarTarefa);
router.put('/:id/iniciar', iniciarTarefa);
router.put('/:id/pausar', pausarTarefa);

export default router;