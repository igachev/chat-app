import User from "@/models/User";
import { initDB } from "@/utils/database"
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    email: string;
    password: string;
}

interface UserData {
    userId: string;
    username: string;
}

export const POST = async(req:NextRequest,res:NextResponse): Promise<NextResponse> => {
    const {email,password}: RequestBody = await req.json()
try {
    await initDB();

    const user = await User.findOne({email:email})
    if(!user) {
        throw new Error("Invalid username or password")
    }

    const checkPassword: boolean = await user.validatePassword(password)
    
    if(!checkPassword) {
        throw new Error("Invalid username or password")
    }

    const userData: UserData = {userId: user._id, username: user.username}

    const response = NextResponse.json(userData,{status: 200})
    return response

} catch (err: any) {
    return new NextResponse(JSON.stringify(err.message),{status: 500})
}
}