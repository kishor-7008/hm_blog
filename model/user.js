import mongoose from "mongoose";

const UserSchema =  mongoose.Schema({
    email:String,
    password:String
})

const User = mongoose.model("User", UserSchema);

export default User;