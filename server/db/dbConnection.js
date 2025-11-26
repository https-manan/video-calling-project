import mongoose from "mongoose";

export const DbConnection = async ()=>{
    await mongoose.connect(process.env.DB_URL)
    console.log('Conneted to DB')
}