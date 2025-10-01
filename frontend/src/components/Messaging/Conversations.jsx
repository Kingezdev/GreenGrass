import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getConversations } from "../../api/messaging";

const Conversations = () => {
  const { accessToken } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations(accessToken);
        setConversations(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchConversations();
    }
  }, [accessToken]);

  if (loading) return <p className="text-gray-500">Loading conversations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Conversations</h2>
      {conversations.length === 0 ? (
        <p className="text-gray-500">No conversations found.</p>
      ) : (
        <ul className="space-y-2">
          {conversations.map((conv) => (
            <li
              key={conv?.id || Math.random()}
              className="p-3 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200"
            >
              <p className="font-semibold">{conv?.title ?? "Unnamed Conversation"}</p>

              <p className="text-sm text-gray-600">
                Last message:{" "}
                {conv?.last_message
                  ? `${conv.last_message.content} — ${conv.last_message.sender_name}`
                  : "No messages yet"}
              </p>

              <p className="text-xs text-gray-500">
                {conv?.last_message?.created_at
                  ? new Date(conv.last_message.created_at).toLocaleString()
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Conversations;
