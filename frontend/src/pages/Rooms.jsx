// src/pages/Rooms.jsx
import React from "react";
import { Link } from "react-router-dom";
import RoomList from "../components/Rooms/RoomList";
const Rooms = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Rooms</h1>
      <RoomList />
      <Link
        to="/rooms/:property_id"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        ADD new room
      </Link>

    </div>
  );
};

export default Rooms;
