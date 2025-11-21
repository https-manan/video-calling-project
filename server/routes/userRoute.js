import express from 'express';
import { allUsers } from '../controller/userController';
const route = express.Router();


route.get('/',allUsers) 



export default route;