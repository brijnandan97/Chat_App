"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const meesage_route_1 = __importDefault(require("./routes/meesage.route"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_1 = require("./socket/socket");
dotenv_1.default.config();
const PORT = process.env.PORT || 5001;
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use(express_1.default.json()); // Middleware to json-ize the incoming request
socket_1.app.use("/api/auth", auth_route_1.default);
socket_1.app.use("/api/messages", meesage_route_1.default);
socket_1.server.listen(PORT, () => {
    console.log("Server is running on port-> ", PORT);
});
