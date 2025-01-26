import express from "express";
import authRoutes from "./routes/auth.route"
import messageRoutes from "./routes/meesage.route"
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes)

app.listen(5000,()=>{
    console.log("Server Started ");
})