import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import requireAuth from "../middlewares/requireAuth.js";
import Conversation from "../models/Conversation.js";

const router = express.Router();

// ✅ Safely trim API key and log it
const apiKey = process.env.GEMINI_API_KEY?.trim();
console.log("Using API key:", `"${apiKey}"`);
const genAI = new GoogleGenerativeAI(apiKey);

// List conversations for current user
router.get("/", requireAuth, async (req, res) => {
    const list = await Conversation.find({ userId: req.user.id })
        .sort({ updatedAt: -1 })
        .select("_id title updatedAt createdAt");
    res.json(list);
});

// Create new conversation
router.post("/", requireAuth, async (req, res) => {
    const { title } = req.body;
    const convo = await Conversation.create({
        userId: req.user.id,
        title: title || "New chat",
        messages: []
    });
    res.status(201).json(convo);
});

// Get single conversation with messages
router.get("/:id", requireAuth, async (req, res) => {
    const convo = await Conversation.findOne({
        _id: req.params.id,
        userId: req.user.id
    });
    if (!convo) return res.status(404).json({ error: "not found" });
    res.json(convo);
});

// Send a message and get model reply (saved to DB)
router.post("/:id/messages", requireAuth, async (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "content required" });

    const convo = await Conversation.findOne({
        _id: req.params.id,
        userId: req.user.id
    });
    if (!convo) return res.status(404).json({ error: "not found" });

    // Push user message
    convo.messages.push({ role: "user", content });
    if (convo.title === "New chat" && content) {
        convo.title = content.slice(0, 40);
    }
    await convo.save();

    // Call model
    let assistantText = "";
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(content);
        console.log("Gemini raw result:", result); // 👈 ye add karo
        assistantText = result.response.text();
    } catch (e) {
        console.error("Model error:", e); // 👈 isko dhyan se dekhna terminal me
        assistantText = "Sorry, I couldn't process that.";
    }

    // Save assistant message
    convo.messages.push({ role: "assistant", content: assistantText });
    await convo.save();

    res.json({ messages: convo.messages });
});

export default router;
