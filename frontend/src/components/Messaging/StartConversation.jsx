import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { startConversation } from "../../api/messaging";

const StartConversation = ({ propertyId }) => {
  const { accessToken } = useAuth();
  const [initialMessage, setInitialMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const data = await startConversation(accessToken, {
        property_id: propertyId,   // 👈 important
        message: initialMessage,
      });
      setStatus(`Conversation started with ID: ${data.id}`);
      setInitialMessage("");
    } catch (err) {
      console.error("Error starting conversation:", err);
      setStatus("Failed to start conversation. Try again.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Start New Conversation</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={initialMessage}
          onChange={(e) => setInitialMessage(e.target.value)}
          placeholder="Write your first message..."
          className="w-full border rounded-lg p-2"
          rows="3"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Start Conversation
        </button>
      </form>

      {status && <p className="mt-3 text-sm">{status}</p>}
    </div>
  );
};
export default StartConversation;