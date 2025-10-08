"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const until_1 = require("./until");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Signup Route
// @ts-ignore
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existing = yield db_1.UserModel.findOne({ username });
    if (existing) {
        return res.status(403).json({ message: "User already exists" });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    yield db_1.UserModel.create({ username, password: hashedPassword });
    return res.json({ message: "Signed up" });
}));
// Signin Route
// @ts-ignore
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log(username);
    const user = yield db_1.UserModel.findOne({ username });
    if (!user)
        return res.status(401).json({ message: "User not found" });
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid)
        return res.status(401).json({ message: "Invalid password" });
    const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, config_1.JWT_SECRET);
    console.log(token);
    return res.json({ token });
}));
// Add Content
// @ts-ignore
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    yield db_1.ContentModel.create({
        link,
        type,
        title,
        userId: req.userId,
        tags: [],
    });
    return res.json({ message: "Content added" });
}));
// Get User Content
// @ts-ignore
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({ userId }).populate("userId", "username");
    return res.json(content);
}));
// Delete Content
// @ts-ignore
app.delete("/api/v1/brain/content/:id", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.params.id;
    const userId = req.userId;
    yield db_1.ContentModel.deleteOne({ _id: contentId, userId });
    return res.json({ message: "Deleted" });
}));
// Share Brain Content
// @ts-ignore
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share, regenerate } = req.body;
    const userId = req.userId;
    if (share) {
        if (regenerate) {
            yield db_1.LinkModel.deleteOne({ userId });
        }
        else {
            const existingLink = yield db_1.LinkModel.findOne({ userId });
            if (existingLink) {
                return res.json({ hash: existingLink.hash });
            }
        }
        const hash = (0, until_1.random)(10);
        yield db_1.LinkModel.create({ hash, userId });
        return res.json({ hash });
    }
    else {
        yield db_1.LinkModel.deleteOne({ userId });
        return res.json({ message: "Removed link" });
    }
}));
// Shared Brain Viewer
// @ts-ignore
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shareLink: hash } = req.params;
    const link = yield db_1.LinkModel.findOne({ hash });
    if (!link) {
        return res.status(404).json({ message: "Invalid share link" });
    }
    const user = yield db_1.UserModel.findById(link.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const content = yield db_1.ContentModel.find({ userId: link.userId });
    return res.json({ username: user.username, content });
}));
// Start Server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
