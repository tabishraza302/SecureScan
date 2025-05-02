
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { RegisterBody } from "../../types/Types";
import ErrorHandler from "../../utils/ErrorHandler";
import { isBodyEmpty } from "../../utils/General.Utils";
import BaseUserService from "../users/BaseUser.Service";
import UserModel from  "../../database/models/User.Model";

class AuthService {
    private readonly JWT_SECRET: string | undefined = process.env.JWT_SECRET;
    private baseUserService: BaseUserService;

    constructor() {
        this.baseUserService = new BaseUserService();

        if(!this.JWT_SECRET)
            throw new ErrorHandler(500, "JWT Secret missing.")

        this.Login = this.Login.bind(this);
        this.Register = this.Register.bind(this);
    }


    async Register(body: RegisterBody): Promise<Boolean> {
        try {
            const bodyEmpty = isBodyEmpty(body);
            if(bodyEmpty) 
                throw new ErrorHandler(400, "Empty form submitted!"); 

            const {firstName, lastName, email, password, confirmPassword} = body;

            const userCount = await this.baseUserService.CountUserByEmail(email);
            if(userCount && userCount > 0 ) 
                throw new ErrorHandler(409, "User already exist!");

            if(password !== confirmPassword) 
                throw new ErrorHandler(400, "Password doesn't match!");

            // Create the hashes of the password
            const hashedPassword = await bcrypt.hash(password, 11);
            await UserModel.create({
                first_name: firstName,
                last_name: lastName,
                email,
                password: hashedPassword
            });
            
            return true;
        } catch (error) {
            throw error instanceof ErrorHandler? error: new ErrorHandler(500, "Failed to register.")
        }
    }

    
    async Login(body: any): Promise<string> {
        try {
            const bodyEmpty = isBodyEmpty(body);
            if(bodyEmpty) throw Error("Empty form submitted!"); 

            const {email, password} = body;

            const user = await this.baseUserService.FindUserByEmail(email);
            if(!user) throw Error("User not found!");

            const { id, role, password: hashedPassword } = user.dataValues;

            const isMatching = await bcrypt.compare(password, hashedPassword);
            if(!isMatching) throw Error("Password does not match!")

            const token = jwt.sign(
                { id, email, role }, 
                this.JWT_SECRET || "this_is_my_another_secret",
                { expiresIn: "24h" })

            return token;
        } catch (error) {
            console.log(error);   
            throw Error("Login failed!")
        }
    }
}

export default AuthService;
