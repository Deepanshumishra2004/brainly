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
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const until_1 = require("./until");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        // create the new user with provided username and password
        yield db_1.UserModel.create({ username, password });
        res.json({ message: "signed up" });
    }
    catch (e) {
        res.status(403).json({ message: "user already exists" });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existingUser = yield db_1.UserModel.findOne({ username, password });
    if (existingUser) {
        // Generate JWT token with the users ID
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, config_1.JWT_SECRET);
        res.json({
            token: token //send token response
        });
    }
    else {
        res.json({
            message: "Incorrect credentials"
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, link, type } = req.body;
    const userId = req.userId;
    //create the new content of the user account
    yield db_1.ContentModel.create({
        link,
        title,
        type,
        userId,
        tags: []
    });
    res.json({
        message: "content collected"
    });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    // fetch all the content related with the user ID populate username
    const content = yield db_1.ContentModel.findOne({
        userId: userId
    }).populate("userId", "username"); // The "populate" function is used include addtional details from the referenced 'userId'
    res.json({
        content
    });
}));
app.delete("/api/v1/brain/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    const userId = req.userId;
    // deleted the particular content on the userId
    const content = yield db_1.ContentModel.deleteOne({ _id: contentId, userId });
    console.log(content);
    res.json({
        message: "Deleted"
    });
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    const userId = req.userId;
    if (share) {
        const existingLink = yield db_1.LinkModel.findOne({ userId });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
        }
        const hash = (0, until_1.random)(10);
        res.json({
            message: hash
        });
        yield db_1.LinkModel.create({ hash, userId });
    }
    else {
        yield db_1.LinkModel.deleteOne({ userId });
        res.json({
            message: "removed link"
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    console.log("the hash is:", hash);
    const link = yield db_1.LinkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({
            message: "invalid sharelink"
        });
        return;
    }
    const userId = link.userId;
    const content = yield db_1.LinkModel.find({ userId });
    const user = yield db_1.UserModel.findOne({ _id: link.userId });
    if (!user) {
        res.status(404).json({
            message: "user not found"
        });
        return;
    }
    // send username and content as the response
    res.json({
        username: user.username,
        content
    });
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
