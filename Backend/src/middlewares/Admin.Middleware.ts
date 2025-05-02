import { Response, NextFunction } from "express";

import { error } from "../utils/ResponseHelper";
import { AuthenticatedRequest } from "../types/Types";


class AdminMiddleware {
    IsAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        if(req.user_role !== "admin") {
            error(res, 401, "Action not allowed.")
            return;
        }

        next()
    }
}

export default AdminMiddleware;