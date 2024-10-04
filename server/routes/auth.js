import express from 'express';
import { login, logout, regiser } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', regiser);
router.post('/login', login);
router.post('/logout', logout);


export default router;