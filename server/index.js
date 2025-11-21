import express from 'express'
import dotenv from 'dotenv'
import dbConnection from "./db/dbConnection.js";
import Route from './routes/authRuote.js';
const app = express()
import cors from 'cors'
dotenv.config()
const PORT = process.env.PORT
import cookieParser from 'cookie-parser';
import route from './routes/userRoute.js';


app.use(cookieParser());
app.use(cors())
app.use(express.json())
app.use('/api/auth',Route)
app.use('/api/user',route)

dbConnection();

app.listen(PORT,()=>{
    console.log(`Listening on port : ${PORT}`)
})