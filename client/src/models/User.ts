import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,'email is required']
    },
    password: {
        type: String,
        required: [true,'password is required']
    },
    username: {
        type: String,
        required: [true,'username is required']
    },
    profileImage: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
    }
})

userSchema.pre('save',async function() {
    const hashedPassword = await bcrypt.hash(this.password,10)
    this.password = hashedPassword
})

userSchema.methods.validatePassword = async function(addedPassword: string) {
    const result = await bcrypt.compare(addedPassword,this.password)
    return result
}

const User = mongoose.models.User || mongoose.model("User",userSchema)

export default User