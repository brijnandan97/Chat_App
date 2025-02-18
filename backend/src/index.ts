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
  const frontendPath = path.join(__dirname, "..", "..", "frontend", "dist");
  console.log("frontendpath is--->", frontendPath);

  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running on port-> ", PORT);
});
