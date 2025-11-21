import User from "../schema/userSchema"
import jwt from 'jsonwebtoken';


export const allUsers = async (req,res)=>{
   try {
    const token = req.cookies.jwt;
    if(!token){
        return res.status(401).send({
            msg:'Not verified'
        })
    }
    const decode = jwt.verify(token, process.env.SECRET)
    const userId = decode.id;
    const allUsers = await User.find({ _id: { $ne: userId } }, "-password")
    return res.status(200).json({
        msg: "All users fetched successfully",
        users: allUsers
    })
   } catch (error) {
    console.log(error)
    return res.status(500).json({
        msg: "Internal server error"
    })
   }
}