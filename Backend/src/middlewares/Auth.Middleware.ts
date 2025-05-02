import { Response, NextFunction } from "express";
import JWT from "jsonwebtoken";

import ErrorHandler from "../utils/ErrorHandler";
import { AuthenticatedRequest, JWTDecodedData } from "../types/Types";


class Middleware {
    Authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(" ")[1];

            if (!token)
                return next(new ErrorHandler(401, "Access denied! No token provided."));

            const secret = process.env.JWT_SECRET;
            if (!secret)
                return next(new ErrorHandler(500, "Server misconfiguration. JWT Secret missing!"));

            const { id, email, role} = JWT.verify(token, secret) as JWTDecodedData;

            req.user_id = id;
            req.user_email = email;
            req.user_role = role;

            next();
        } catch (error) {
            next(new ErrorHandler(401, "Invalid or expired token."));
        }
    }
}

export default Middleware;
