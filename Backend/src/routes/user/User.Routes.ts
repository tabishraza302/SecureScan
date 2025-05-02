import express from 'express';

import AuthMiddleware from "../../middlewares/Auth.Middleware";
import UserMiddleware from '../../middlewares/User.Middleware';

import UserController from '../../controllers/users/User.Controller';


const { IsUser } = new UserMiddleware();
const { Authenticate } = new AuthMiddleware();
const userController = new UserController();

const router = express.Router();

router.get("/dashboard", Authenticate, IsUser, userController.GetDashboard);
router.post("/scan/:domain",Authenticate, IsUser, userController.ScanWebsite);
router.get("/reports/:id", Authenticate, IsUser, userController.GetReportsById);
router.get("/reported-website", Authenticate, IsUser, userController.GetReportedWebsite);

export default router;