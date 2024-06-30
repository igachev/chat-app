import User from "@/models/User"
import { initDB } from "@/utils/database"
import { writeFile } from "fs/promises";

import { NextRequest } from "next/server";
import path from "path";
import fs from "fs"

interface UserData {
    userId: string;
    username: string;
}


export const POST = async(req:NextRequest,res: any) => {
    const data = await req.formData();
    const email = data.get('email');
    const password = data.get('password')
    const username = data.get('username')
    const file: File | null = data.get('file') as unknown as File
    let uniqueFileName;
    if(file) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        uniqueFileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, uniqueFileName);
        
        if(!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir)
        }

        await writeFile(filePath,buffer)

    }
    try {
        await initDB()

        const user = await User.findOne({email:email});
        if(user) {
            throw new Error("User already exists!")
        }

        const newUser = new User({email,password,username,profileImage:uniqueFileName})
        await newUser.save()
        const userData: UserData = {userId: newUser._id, username: newUser.username}
        return new Response(JSON.stringify(userData), {status: 201})
    } catch (err:any) {
        return new Response(JSON.stringify(err.message),{status: 500})
    }
}



