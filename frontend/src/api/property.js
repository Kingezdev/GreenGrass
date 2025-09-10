// src/api/property.js
import axios from "axios";

const BASE_URL = "https://greengrass-backend.onrender.com/api/rooms/properties/";

// Get all properties (no auth required)
export const getAllProperties = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get property details by ID (no auth required)
export const getPropertyById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create a new property (Landlord auth required)
export const createProperty = async (propertyData, token) => {
  try {
    const response = await axios.post(BASE_URL, propertyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
