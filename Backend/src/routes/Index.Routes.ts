import express from "express";

import WebRoutes from "./web/Web.Routes";
import AuthRoutes from "./auth/Auth.Routes";
import UserRoutes from "./user/User.Routes";
import AdminRoutes from "./admin/Admin.Routes";
import BrowserExtensionRoutes from "./browserExtension/BrowserExtension.Routes"


const router = express.Router();

router.use("/web", WebRoutes)
router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);
router.use("/admin", AdminRoutes);
router.use("/browser-extension", BrowserExtensionRoutes);


export default router;