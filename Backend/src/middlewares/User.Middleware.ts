import { error } from "../utils/ResponseHelper";
import JWT from "jsonwebtoken";

class UserMiddleware {
    IsUser(req: any, res: any, next: any) {
        if(req.user_role !== "user")
            error(res, 401, "Not allowed");

        next();
    }
}


export default UserMiddleware;