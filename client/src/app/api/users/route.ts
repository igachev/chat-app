import Chat from "@/models/Chat";
import User from "@/models/User";
import { initDB } from "@/utils/database";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest): Promise<NextResponse> => {

    try {
        await initDB()
        const users = await User.find({})
        return NextResponse.json(users,{status: 200})
    } catch (err: any) {
        return NextResponse.json({message:err.message},{status: 500})
    }
}

export const POST = async(req: NextRequest,res: NextResponse): Promise<NextResponse> => {

    try {
        await initDB()
        const {from,to} = Object.fromEntries(req.nextUrl.searchParams);

        if (!from || !to) {
            return NextResponse.json({ message: 'Both from and to participants must be provided' }, { status: 400 });
        }

        const fromObjectId = new mongoose.Types.ObjectId(from);
        const toObjectId = new mongoose.Types.ObjectId(to);

        // Check if a chat already exists between the two participants
        const existingChat = await Chat.findOne({
            participants: { $all: [fromObjectId, toObjectId] }
        });

        if (existingChat) {
            return NextResponse.json(existingChat, { status: 200 });
        }

        // If no chat exists, create a new chat
        const newChat = new Chat({
            ownerId: fromObjectId,
            participants: [fromObjectId, toObjectId]
        });
        await newChat.save();
        return NextResponse.json(newChat,{status: 201})
    } catch (err: any) {
        return NextResponse.json({message:err.message},{status: 500})
    }
}