// src/api/apiClient.js
import axios from "axios";

const BASE_URL = "https://greengrass-backend.onrender.com";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const registerUser = async (userData) => {
  return api.post("/api/accounts/register/", userData);
};

export const loginUser = async (credentials) => {
  return api.post("/api/accounts/login/", credentials);
};

export const getToken = async (credentials) => {
  return api.post("/api/token/", credentials);
};

// Accounts
export const getMyProfile = async () => {
  return api.get("/api/accounts/profile/");
};

export const getUserProfile = async (username) => {
  return api.get(`/api/accounts/profile/${username}/`);
};

export const getLandlords = async () => {
  return api.get("/api/accounts/landlords/");
};

// Properties
export const listProperties = async () => {
  return api.get("/api/rooms/properties/");
};

export const createProperty = async (propertyData) => {
  return api.post("/api/rooms/properties/", propertyData);
};

export const getPropertyDetails = async (propertyId) => {
  return api.get(`/api/rooms/properties/${propertyId}/`);
};

// Rooms
export const listRooms = async (propertyId) => {
  return api.get(`/api/rooms/properties/${propertyId}/`);
};

export const addRoom = async (propertyId, roomData) => {
  return api.post(`/api/rooms/properties/${propertyId}/`, roomData);
};

// Messaging
export const listConversations = async () => {
  return api.get("/api/messaging/conversations/");
};

export const startConversation = async (conversationData) => {
  return api.post("/api/messaging/start-conversation/", conversationData);
};

// Reviews
export const listReviews = async (propertyId) => {
  return api.get(`/api/rooms/properties/${propertyId}/reviews/`);
};

export const createReview = async (propertyId, reviewData) => {
  return api.post(`/api/rooms/properties/${propertyId}/reviews/`, reviewData);
};

// Favorites
export const listFavorites = async () => {
  return api.get("/api/rooms/favorites/");
};

export const addFavorite = async (propertyId) => {
  return api.post("/api/rooms/favorites/", { property_id: propertyId });
};

export const removeFavorite = async (propertyId) => {
  return api.delete(`/api/rooms/favorites/${propertyId}/`);
};

export default api;
