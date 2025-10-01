// src/pages/RoomsPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoomsByProperty } from "../api/room";

export default function RoomsPage() {
  const { propertyid } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getRoomsByProperty(propertyid);
        setRooms(data);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, [propertyid]);

  if (loading) {
    return <p className="p-4 text-gray-500">Loading rooms...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rooms in Property {propertyid}</h1>
      {rooms.length === 0 ? (
        <p className="text-gray-500">No rooms found for this property.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{room.name}</h2>
              <p className="text-gray-600">{room.description}</p>
              <p className="mt-2 font-bold text-green-600">${room.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
