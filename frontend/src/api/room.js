// src/api/room.js
import axios from "axios";

const BASE_URL = "https://greengrass-backend.onrender.com/api/rooms/properties/";

// GET all rooms for a property (no auth)
export const getRoomsByProperty = async (propertyId) => {
  try {
    const response = await axios.get(`${BASE_URL}${propertyId}/`);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// POST add room to property (auth required)
export const addRoomToProperty = async (propertyId, roomData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}${propertyId}/`, roomData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
