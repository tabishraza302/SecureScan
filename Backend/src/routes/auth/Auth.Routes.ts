import express from 'express';
import AuthController from "../../controllers/auth/Auth.Controller";

const { Login, Register } = new AuthController();

const router = express.Router();

router.post('/login', Login);
router.post('/register', Register);

export default router;
