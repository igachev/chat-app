import User from "@/models/User";
import { initDB } from "@/utils/database"
import jsonwebtoken from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    email: string;
    password: string;
}

interface Payload {
    userId: string;
    email: string;
}

const JWT_SECRET: string | undefined = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
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

    const payload: Payload = {userId: user._id, email: user.email}
    const token = await jsonwebtoken.sign(payload,JWT_SECRET,{expiresIn: '20h'})

    return new NextResponse(JSON.stringify(token),{status: 200})

} catch (err: any) {
    return new NextResponse(JSON.stringify(err.message),{status: 500})
}
}