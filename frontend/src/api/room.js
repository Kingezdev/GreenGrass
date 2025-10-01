// src/api/room.js
import axios from "axios";

const BASE_URL = "https://greengrass-backend.onrender.com/api";

export const getRoomsByProperty = async (propertyId) => {
  try {
    const response = await axios.get(`${BASE_URL}/rooms/properties/${propertyId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};



// POST add room to property (auth required)
export const addRoomToProperty = async (propertyId, roomData, token) => {
  if (!propertyId) throw new Error("propertyId is required");
  try {
    const response = await axios.post(`${BASE_URL}${propertyId}/`, roomData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

