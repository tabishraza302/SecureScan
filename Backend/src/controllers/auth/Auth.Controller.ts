import { Request, Response, NextFunction } from "express";

import ErrorHandler from "../../utils/ErrorHandler";
import { success } from "../../utils/ResponseHelper";
import { LoginDTO, RegisterDTO } from "../../types/Types";
import AuthService from "../../services/auth/Auth.Service";


class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();

        this.Login = this.Login.bind(this);
        this.Register = this.Register.bind(this);
    }


    async Register(req: Request<{}, {}, RegisterDTO>, res: Response, next: NextFunction):Promise<any> {
        try {
            console.info(`Register attempt for email: ${req.body.email}`);

            const registered = await this.authService.Register(req.body);
            if (!registered) {
                console.warn(`Registration failed for email: ${req.body.email}`);
                throw new ErrorHandler(409, "Failed to register")
            }

            console.info(`User registered successfully: ${req.body.email}`)
            return success(res, 201, "User registered.");
        } catch (error) {
            return next(error);
        }
    }


    async Login(req: Request<{}, {}, LoginDTO>, res: Response, next: NextFunction):Promise<any> {
        try {
            const token = await this.authService.Login(req.body);
            if(!token) throw new ErrorHandler(401, "Invalid credentials")

            return success(res, 200, "Login successful", { token });
        } catch (error) {
            return next(error)
        }
    }
}

export default AuthController;
