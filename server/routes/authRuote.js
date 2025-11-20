import express from 'express'
import { Login, logout, SignUp } from '../controller/authController.js'
import islogin from '../../middleware/islogin.js'

const Route = express.Router()

Route.post('/signUp', SignUp)
Route.post('/login',Login)
Route.post('logout',islogin,logout)


export default Route
