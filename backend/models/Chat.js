import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: { type: String, required: true },
      image: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
