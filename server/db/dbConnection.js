import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect("mongodb+srv://mananbhardwaj2705:manan27bhardwaj@cluster0.ttqvo.mongodb.net/video-calling")
        console.log('Connected to DB')
    } catch (error) {
        console.log(error)
    }
}

export default dbConnection;
 