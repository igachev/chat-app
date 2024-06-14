import User from "@/models/User";
import { initDB } from "@/utils/database"
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    email: string;
    password: string;
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

    const response = NextResponse.json({message: 'Login successful'},{status: 200})
    
    return response

} catch (err: any) {
    return new NextResponse(JSON.stringify(err.message),{status: 500})
}
}