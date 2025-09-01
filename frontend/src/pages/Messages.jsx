import React, { useState } from "react";

const Messages = () => {
  const [messages, setMessages] = useState([
    { id: 1, from: "Tunde Ade", text: "Is the 2-bedroom still available?" },
    { id: 2, from: "Chioma Eze", text: "Yes, it's available!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage) return;
    // Block phone numbers/emails (simple regex)
    const hasContact = /\d{10,}|@\w+\.\w+/.test(newMessage);
    if (hasContact) {
      alert("Sharing contact info is not allowed.");
      return;
    }
    setMessages([...messages, { id: messages.length + 1, from: "You", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <div className="h-64 overflow-y-auto mb-4 border p-2 rounded">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-semibold">{msg.from}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
