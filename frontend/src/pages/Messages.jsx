import React from "react";
import Conversations from "../components/Messaging/Conversations";
import StartConversation from "../components/Messaging/StartConversation";

const Messages = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <Conversations />
      <StartConversation />
    </div>
  );
};

export default Messages;
