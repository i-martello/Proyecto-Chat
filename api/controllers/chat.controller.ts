import chatSchema from "../models/chat.model";
import { Request, Response } from "express";

interface ctrlChatType {
  postMsg: (req: Request, res: Response) => void;
  getMsg: (req: Request, res: Response) => void;
}

export const ctrlChat: ctrlChatType = {
  postMsg: async (req, res) => {
    const { user, message } = req.body;
    await chatSchema.create({ user, message });
    res.end();
  },
  getMsg: async (req, res) => {
    const mensajes = await chatSchema.find().sort({createdAt: -1});    
    res.status(200).json(mensajes);
  }
};
