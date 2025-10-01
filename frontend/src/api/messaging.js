// src/api/messaging.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://greengrass-backend.onrender.com/api/messaging",
});

// ✅ Get all conversations for logged-in user
export const getConversations = async (token) => {
  try {
    const response = await API.get("/conversations/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

// ✅ Start a new conversation
export const startConversation = async (token, conversationData) => {
  try {
    const response = await API.post(
      "/start-conversation/",
      conversationData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Requires auth
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error starting conversation:", error.response?.data || error.message);
    throw error;
  }
};
