import mongoose from "mongoose"

export async function initDB() {
    try {
    mongoose.set('strictQuery',false)
    await mongoose.connect('mongodb://127.0.0.1:27017/chat')
    console.log('DB connected...')
    } catch (err) {
        console.log(err)
    }
}

