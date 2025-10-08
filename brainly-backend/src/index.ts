// server.ts
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel, ContentModel, LinkModel } from "./db";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./until";

const app = express();
app.use(cors());
app.use(express.json());

// Signup Route
// @ts-ignore
app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;

  const existing = await UserModel.findOne({ username });
  if (existing) {
    return res.status(403).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await UserModel.create({ username, password: hashedPassword });

  return res.json({ message: "Signed up" });
});

// Signin Route
// @ts-ignore
app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;

  console.log(username)

  const user = await UserModel.findOne({ username });
  if (!user) return res.status(401).json({ message: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id ,username: user.username}, JWT_SECRET);
  console.log(token);
  return res.json({ token });
});

// Add Content
// @ts-ignore
app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { link, type, title } = req.body;

  await ContentModel.create({
    link,
    type,
    title,
    userId: req.userId,
    tags: [],
  });

  return res.json({ message: "Content added" });
});

// Get User Content
// @ts-ignore
app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await ContentModel.find({ userId }).populate("userId", "username");
  return res.json(content);
});

// Delete Content
// @ts-ignore
app.delete("/api/v1/brain/content/:id", userMiddleware, async (req, res) => {
  const contentId = req.params.id;
  const userId = req.userId;

  await ContentModel.deleteOne({ _id: contentId, userId });
  return res.json({ message: "Deleted" });
});

// Share Brain Content
// @ts-ignore
app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const { share, regenerate } = req.body;
  const userId = req.userId;

  if (share) {
    if (regenerate) {
      await LinkModel.deleteOne({ userId });
    } else {
      const existingLink = await LinkModel.findOne({ userId });
      if (existingLink) {
        return res.json({ hash: existingLink.hash });
      }
    }

    const hash = random(10);
    await LinkModel.create({ hash, userId });
    return res.json({ hash });
  } else {
    await LinkModel.deleteOne({ userId });
    return res.json({ message: "Removed link" });
  }
});


// Shared Brain Viewer
// @ts-ignore
app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const { shareLink: hash } = req.params;

  const link = await LinkModel.findOne({ hash });
  if (!link) {
    return res.status(404).json({ message: "Invalid share link" });
  }

  const user = await UserModel.findById(link.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const content = await ContentModel.find({ userId: link.userId });

  return res.json({ username: user.username, content });
});

// Start Server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
