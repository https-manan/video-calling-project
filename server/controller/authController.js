import User from "../schema/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


export const SignUp = async (req, res) => {
    try {
        const { name, userName, email, password, profilepic } = req.body;

        if (!name || !userName || !email || !password || !profilepic) {
            return res.status(400).send({ msg: "All credentials needed" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ msg: "User already exists" });
        }

        const hashedPass = bcrypt.hashSync(password, 10);

        const newUser = new User({
            name,
            userName,
            email,
            password: hashedPass,
            profilepic,
        });

        const savedUser = await newUser.save();

        const userToReturn = {
            _id: savedUser._id,
            name: savedUser.name,
            userName: savedUser.userName,
            email: savedUser.email,
            profilepic: savedUser.profilepic,
            createdAt: savedUser.createdAt,
        };

        return res.status(201).send({
            msg: "User created successfully",
            user: userToReturn,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal server error" });
    }
};


export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ msg: "All credentials needed" });
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(409).send({ msg: "User not exists" });
        }
        const verify = bcrypt.compare(password, user.password)
        if (verify) {
            const token = jwt.sign({ id: user._id }, process.env.SECRET, {
                expiresIn: '1d'
            });
            res.cookie('jwt',token,{
                maxAge:30*24*3600000
            })

            return res.status(200).json({
                msg: "Logged in successfully",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    userName: user.userName,
                    profilepic: user.profilepic
                }
            });
        } else {
            return res.status(500).json({ msg: 'wrong password' })
        }
    } catch (error) {
        console.log(error)
    }
}

export const logout = (req,res)=>{
    try {
        res.clearCookie('jwt')
    } catch (error) {
        console.log(error)
    }
}
