"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
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
if (process.env.NODE_ENV !== "development") {
    const frontendPath = path_1.default.join(__dirname, "frontend");
    console.log("📂 Frontend Path:", frontendPath);
    socket_1.app.use(express_1.default.static(frontendPath));
    socket_1.app.get("*", (req, res) => {
        const indexPath = path_1.default.join(frontendPath, "index.html");
        console.log("📝 Serving:", indexPath);
        res.sendFile(indexPath);
    });
}
socket_1.server.listen(PORT, () => {
    console.log("Server is running on port-> ", PORT);
});
