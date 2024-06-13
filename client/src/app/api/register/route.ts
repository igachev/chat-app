import User from "@/models/User"
import { initDB } from "@/utils/database"

export const POST = async(req:any,res: any) => {
    const {email,password} = await req.json()
    try {
        await initDB()

        const user = await User.findOne({email:email});
        if(user) {
            throw new Error("User already exists!")
        }

        const newUser = new User({email,password})
        await newUser.save()

        return new Response(JSON.stringify(newUser), {status: 201})
    } catch (err:any) {
        return new Response(JSON.stringify(err.message),{status: 500})
    }
}



