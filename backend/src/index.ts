import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/meesage.route";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json()); // Middleware to json-ize the incoming request
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(5000, () => {
  console.log("Server Started ");
});
