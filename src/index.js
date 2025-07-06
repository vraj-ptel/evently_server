import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import db from "./lib/db.js";
import user from './routes/user.js'
import event from "./routes/event.js"
import { errorMiddleware } from "./middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import Event from "./models/eventModel.js";
import { sendGmail } from "./utils/sendEmail.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
await db()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



//routes
app.use('/api/v1/user',user)
app.use('/api/v1/event',event)
app.use(errorMiddleware)
app.listen(process.env.PORT || 4000, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
