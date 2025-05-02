import express from 'express';

import AuthMiddleware from "../../middlewares/Auth.Middleware";
import AdminMiddleware from '../../middlewares/Admin.Middleware';
import AdminController from "../../controllers/users/Admin.Controller";

const { IsAdmin } = new AdminMiddleware();
const { Authenticate } = new AuthMiddleware();

const adminController = new AdminController();

const router = express.Router();

router.get('/dashboard', Authenticate, IsAdmin, adminController.GetDashboardData);
router.get('/users', Authenticate, IsAdmin, adminController.GetUsersList);
router.delete('/user/:id', Authenticate, IsAdmin, adminController.DeleteUserById);
router.get('/reports/:id', Authenticate, IsAdmin, adminController.GetReportsById);
router.get('/scanned-websites', Authenticate, IsAdmin, adminController.GetScannedWebsitesList);
router.get('/reported-website', Authenticate, IsAdmin, adminController.GetReportedWebsite);
router.get('/website-report/:id', Authenticate, IsAdmin, adminController.GetWebsiteReportById);

export default router;
