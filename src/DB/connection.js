import mongoose from "mongoose";

const connectDB = async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            serverSelectionTimeoutMS: 5000 ,
        })
        console.log('Database conncted')
    } catch (error) {
        console.log('Database Connection Error',error.message)
    }
}
export default connectDB