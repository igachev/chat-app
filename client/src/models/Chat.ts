import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema)

export default Chat