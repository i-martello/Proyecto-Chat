import userSchema, { hashedPassword, matchPassword } from "../models/user.model";
import { Request, Response } from "express";
import jwt ,{ sign } from "jsonwebtoken";
import { serialize } from "cookie";



interface ctrlType {
  addUser: (req: Request, res: Response) => void;
  loginUser: (req: Request, res: Response) => void;
  validateUser: (req: Request, res: Response) => void
}

export const ctrlIndex: ctrlType = {
  addUser: async (req, res) => {
    const { user, password } = req.body;
    const findUser = await userSchema.findOne({user});
    if (findUser) {
      return res.json({msg: "El usuario ya existe"})
    }
    const encryptPassword = await hashedPassword(password)
    console.log(encryptPassword)
    await userSchema.create({ user, password: encryptPassword });
    res.end();
  },
  loginUser: async (req, res)=> {
    const {user, password} = req.body
    const findUser = await userSchema.findOne({user})
    if(findUser){
      const validatePassword = await matchPassword(password, findUser.password)
      if(validatePassword){
        const token = sign({
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
          user,
          role: "usuario"
        }, process.env.JWT_KEY!);
        const serialized = serialize("token", token, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 7,
          path: '/'
        })
        try {
          res.setHeader('Set-Cookie', serialized);
          console.log("hola")
          return res.status(200).json({success: "Inicio exitoso"})
        } catch (error) {
          return res.status(401).json({message: "Token invalido"})
        }
        
      };
      return res.json({error: "Contraseña incorrecta"})
    }
    res.json({error: "El usuario no existe"})
  },
  validateUser: async (req, res)=>{
    const token = req.cookies?.token;
    if(!token) return res.json({msg: "Acceso negado"})
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_KEY!)
      return res.json({decodedToken}) 
    } catch (error) {
      console.log(error)
    }
  }
};

