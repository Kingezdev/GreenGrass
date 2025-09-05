// pages/Messages.jsx
import React, { useState } from 'react';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');

  // Mock conversations
  const conversations = [
    {
      id: 1,
      property: "Modern Apartment",
      landlord: "Adebola Johnson",
      lastMessage: "Hello, is this still available?",
      time: "2 hours ago",
      unread: true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <div className="divide-y">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{conv.landlord}</h3>
                    <p className="text-sm text-gray-600">{conv.property}</p>
                    <p className="text-sm text-gray-500 mt-1">{conv.lastMessage}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">{conv.time}</span>
                    {conv.unread && (
                      <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Area */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b">
                <h2 className="font-semibold">{selectedConversation.landlord}</h2>
                <p className="text-sm text-gray-600">{selectedConversation.property}</p>
              </div>
              
              <div className="p-4 h-96 overflow-y-auto">
                {/* Messages would go here */}
                <p className="text-center text-gray-500">No messages yet</p>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;