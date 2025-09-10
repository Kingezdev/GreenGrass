// src/components/Room/RoomList.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoomsByProperty } from "../../api/room";
import HandleLoading from "../../utils/HandleLoading";

const RoomList = () => {
  const { id } = useParams(); // property ID from URL
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRoomsByProperty(id);
        setRooms(data);
      } catch (err) {
        setError(err.message || "Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [id]);

  return (
    <HandleLoading loading={loading}>
      <div className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {rooms.length === 0 ? (
          <p>No rooms available for this property.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
                <p className="text-gray-600 mb-1">Type: {room.type}</p>
                <p className="text-gray-600 mb-1">Price: ${room.price}</p>
                <p className="text-gray-500 text-sm">{room.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </HandleLoading>
  );
};

export default RoomList;
