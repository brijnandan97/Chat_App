import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/meesage.route";
import dotenv from "dotenv";
import { app, server } from "./socket/socket";

dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json()); // Middleware to json-ize the incoming request
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV !== "development") {
  const frontendPath = path.join(__dirname, "frontend");

  console.log("📂 Frontend Path:", frontendPath);

  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    console.log("📝 Serving:", indexPath);
    res.sendFile(indexPath);
  });
}

server.listen(PORT, () => {
  console.log("Server is running on port-> ", PORT);
});
