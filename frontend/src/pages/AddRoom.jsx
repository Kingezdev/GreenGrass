// src/pages/AddRoom.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { addRoomToProperty } from "../api/room";
import { useAuth } from "../context/AuthContext";
import HandleLoading from "../utils/HandleLoading";

const AddRoom = () => {
  const { property_id } = useParams(); // ✅ matches route param
  const { accessToken } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!property_id) {
      setError("Property ID is missing.");
      setLoading(false);
      return;
    }

    try {
      const data = await addRoomToProperty(property_id, formData, accessToken);
      setSuccess("Room added successfully!");
      setFormData({ name: "", type: "", price: "", description: "" });
    } catch (err) {
      console.error(err);
      setError(err?.error || err?.message || "Failed to add room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HandleLoading loading={loading}>
      <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold">Add New Room</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Room Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="type"
            placeholder="Room Type (e.g., Single, Double)"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price per month"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Add Room
          </button>
        </form>
      </div>
    </HandleLoading>
  );
};

export default AddRoom;
