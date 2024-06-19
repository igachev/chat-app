import { NextRequest, NextResponse } from 'next/server';
import Chat from '@/models/Chat';
import Message from '@/models/Message';
import User from '@/models/User';
import { initDB } from '@/utils/database';
import mongoose from 'mongoose';

export const POST = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    try {
        await initDB();
        const { from, to, text } = await req.json();

        if (!from || !to || !text) {
            return NextResponse.json({ message: 'from, to, and text are required' }, { status: 400 });
        }

        const fromObjectId = new mongoose.Types.ObjectId(from);
        const toObjectId = new mongoose.Types.ObjectId(to);

        // Find the chat containing both participants
        const chat = await Chat.findOne({
            participants: { $all: [fromObjectId, toObjectId] }
        });

        if (!chat) {
            return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
        }

        // Create a new message
        const newMessage = new Message({
            sender: fromObjectId,
            text: text,
            chat: chat._id
        });

        await newMessage.save();
        let message = await newMessage.populate("chat")
        message = await message.populate('sender')
      //  const populatedMessage = await Message.findById(newMessage._id).populate('chat');
        return NextResponse.json(message, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};

export const GET = async(req: NextRequest): Promise<NextResponse> => {
    try {
        await initDB()
        const {from,to} = Object.fromEntries(req.nextUrl.searchParams);

        const fromObjectId = new mongoose.Types.ObjectId(from);
        const toObjectId = new mongoose.Types.ObjectId(to);

        // Find the chat containing both participants
        const chat = await Chat.findOne({
            participants: { $all: [fromObjectId, toObjectId] }
        });

        if (!chat) {
            return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
        }

        const messages = await Message.find({ chat: chat._id })
        .select('_id sender text')
        .populate('sender','username',User)
      
        return NextResponse.json(messages,{status: 200})

    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}