import User from "@/models/User"
import { initDB } from "@/utils/database"

interface UserData {
    userId: string;
    username: string;
}

interface RequestBody {
    email: string;
    password: string;
    username: string;
    profileImage?: string;
}

export const POST = async(req:any,res: any) => {
    const {email,password,username,profileImage}: RequestBody = await req.json()
    try {
        await initDB()

        const user = await User.findOne({email:email});
        if(user) {
            throw new Error("User already exists!")
        }

        const newUser = new User({email,password,username,profileImage})
        await newUser.save()
        const userData: UserData = {userId: newUser._id, username: newUser.username}
        return new Response(JSON.stringify(userData), {status: 201})
    } catch (err:any) {
        return new Response(JSON.stringify(err.message),{status: 500})
    }
}



