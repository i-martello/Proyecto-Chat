import userSchema, {
  hashedPassword,
  matchPassword,
} from "../models/user.model";
import { Request, Response } from "express";
import jwt, { sign } from "jsonwebtoken";
import { serialize } from "cookie";

interface ctrlType {
  addUser: (req: Request, res: Response) => void;
  loginUser: (req: Request, res: Response) => void;
  validateUser: (req: Request, res: Response) => void;
  logoutUser: (req: Request, res: Response) => void;
}

export const ctrlIndex: ctrlType = {
  addUser: async (req, res) => {
    const { user, password } = req.body;
    const findUser = await userSchema.findOne({ user });
    if (findUser) {
      return res.json({ msg: "El usuario ya existe" });
    }
    const encryptPassword = await hashedPassword(password);
    console.log(encryptPassword);
    await userSchema.create({ user, password: encryptPassword });
    res.end();
  },
  loginUser: async (req, res) => {
    const { user, password, googleUser, img } = req.body;
    const username = user || googleUser;

    let validatePassword: boolean | undefined = false;
    if (user || googleUser) {
      if (user) {
        const findUser = await userSchema.findOne({ user });
        if (findUser) {
          validatePassword = await matchPassword(password, findUser?.password!);
        } else {
          return res.json({error: "El usuario no existe"})
        }
      }
      if (validatePassword || googleUser) {
        console.log(username);
        const token = sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
            user: username,
            img: img,
            role: "usuario",
          },
          process.env.JWT_KEY!
        );
        const serialized = serialize("token", token, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 7,
          path: "/",
        });
        try {
          res.setHeader("Set-Cookie", serialized);
          return res.status(200).json({ success: token });
        } catch (error) {
          return res.status(401).json({ message: "Token invalido" });
        }
      }
      return res.json({ error: "Contraseña incorrecta" });
    }
  },
  validateUser: async (req, res) => {
    var token = req.cookies?.token;
    if (!token) return res.json({ msg: "Acceso denegado" });
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_KEY!);
      return res.json({ decodedToken });
    } catch (error) {
      console.log(error);
    }
  },
  logoutUser: async (req, res) => {
    const token = req.cookies?.token; 
    if(!token) return res.json({msg: "Error, no estas logueado"})
    const serialized = serialize("token", token , {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/"
    });
    res.setHeader("Set-Cookie", serialized)
    return res.status(200).json({success: "Cierre de sesión exitosa"})
  }
};
