import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }
})

const Message = mongoose.models.Message || mongoose.model("Message",messageSchema)

export default Message