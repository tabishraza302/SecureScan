import { UserType } from "../../types/User.Types";
import UserModel from "../../database/models/User.Model";

class BaseUser {
    async CountUserByEmail(email: string): Promise<number | null> {
        try{
            const userCount = await UserModel.count({ where: { email }});     
            if(userCount)
                return userCount;
            
            return null;
        } catch(error: any) {
            console.log(error); // TODO: Remove console.log
            throw Error("Failed to get user details.")
        }
    }

    async FindUserByEmail(email: string): Promise<UserType | null> {
        try{
            const user = await UserModel.findOne({ where: { email }});     
            if(user)
                return user;
            
            return null;
        } catch(error: any) {
            console.log(error); // TODO: Remove console.log
            throw Error("Failed to get user details.")
        }
    }
}


export default BaseUser;