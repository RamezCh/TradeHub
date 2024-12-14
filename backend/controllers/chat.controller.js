import Chat from "../models/Chat.js";
import { v2 as cloudinary } from "cloudinary";

export const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;
    const chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (chat) {
      return res.status(200).json(chat);
    }
    const newChat = new Chat({
      participants: [senderId, receiverId],
    });
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error("Error in createChat controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ participants: userId });
    if (!chats) {
      return res.status(404).json({ message: "No chats found" });
    }
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error in getChats controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (
      userId.toString() !== chat.participants[0].toString() &&
      userId.toString() !== chat.participants[1].toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error in getChat controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.params;
    const { content } = req.body;
    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const chat = await Chat.findById(chatId);
    if (
      userId.toString() !== chat.participants[0].toString() &&
      userId.toString() !== chat.participants[1].toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const newMessage = {
      senderId: userId,
      content,
      image: imageUrl,
    };

    chat.messages.push(newMessage);
    const savedChat = await chat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
