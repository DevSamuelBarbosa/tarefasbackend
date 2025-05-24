// routes/authRoutes.ts
import { Router } from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/auth/authController';
import { autenticarToken } from '../middlewares/auth'
import { usuarioLogado } from '../controllers/auth/authController'

const router = Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/usuariologado', autenticarToken, usuarioLogado)

export default router;
