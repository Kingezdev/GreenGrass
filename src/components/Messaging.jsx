import { useEffect, useState } from "react";
import { messages as mockMessages } from "../mocks/messages";

const Messaging = () => {
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    setTimeout(() => setMsgs(mockMessages), 500); // simulate API fetch
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="flex flex-col gap-2">
        {msgs.map((msg) => (
          <div
            key={msg.id}
            className="border p-3 rounded shadow-sm bg-white"
          >
            <p>
              <span className="font-semibold">{msg.sender}</span> →{" "}
              <span className="font-semibold">{msg.receiver}</span>
            </p>
            <p>{msg.content}</p>
            <p className="text-gray-400 text-sm">
              {new Date(msg.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messaging;
