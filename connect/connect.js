import mongoose from "mongoose";

const uri = "mongodb+srv://radhika:radhika123@cluster0.turlubz.mongodb.net/blog";

export const connect = ()=>{
    mongoose.set('strictQuery',false)
    
    return mongoose.connect(uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("Db is Connected")
    })
}

