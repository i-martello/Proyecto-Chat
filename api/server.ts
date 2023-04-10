import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/mongo.database'
import indexRouter from './routes/index.routes'
import chatRouter from './routes/chat.routes'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
const app = express()

// Settings

dotenv.config();

// Middleware
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
app.use(morgan('dev'))
app.use(indexRouter);
app.use(chatRouter);

// Connect Database

(async ()=>{
  await connectDB(process.env.MONGO_URI)
  console.log("Mongo funcionando")
})();

export default app