"use client";
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3000");

const Chat = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onMessage(msg: string) {
      setMessages((prevMessages) => [...prevMessages, msg]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat message", onMessage);
    };
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input) {
      socket.emit("chat message", input);
      setInput("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex items-end m-0 font-sans min-h-screen">
      <div className="flex flex-col justify-end w-full">
        <div
          id="messagesContainer"
          className="w-full mx-auto p-4 overflow-y-auto overscroll-contain max-h-[90vh]"
          ref={messagesContainerRef}
        >
          <ul id="messages" className="list-none m-0 p-0 space-y-4">
            {messages.map((msg, index) => (
              <li
                key={index}
                className="p-4 rounded-lg relative max-w-3/4 bg-blue-100 self-end text-left"
              >
                {msg}
                <span className="text-xs text-gray-500 absolute bottom-0 right-2">
                  {new Date().getHours()}:
                  {new Date().getMinutes().toString().padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <form
          id="form"
          onSubmit={handleSubmit}
          className="bg-white p-4 flex items-center space-x-4 shadow-lg"
        >
          <input
            id="input"
            autoComplete="off"
            className="border border-gray-300 rounded-full px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full focus:outline-none"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
