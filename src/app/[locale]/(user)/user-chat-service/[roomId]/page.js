"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/context/SessionProvider";
import { useAuth } from "@/context/AuthProvider";
import WaitingQueueModal from "@/app/components/WaitingQueuerModal";

const ChatPage = () => {
  const {
    messages,
    sendMessage,
    connectSocket,
    handleExit,
    isSocketConnected,
    userServiceData,
    showQueueModal,
    formData,
    setShowQueueModal,
  } = useSession();

  const { token } = useAuth();

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (token && userServiceData) {
      connectSocket(token);
    }
  }, [token, userServiceData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCancel = () => {
    setShowQueueModal(false);
    handleExit();
  };

  return (
    <>
      {/* 🔥 MODAL */}
      {showQueueModal && !isSocketConnected && (
        <WaitingQueueModal
          isOpen={showQueueModal}
          serviceData={userServiceData}
          formData={formData}
          onCancel={handleCancel}
        />
      )}

      {/* 💬 CHAT */}
      {isSocketConnected && (
        <div className="h-screen flex flex-col bg-gray-50">

          {/* HEADER */}
          <div className="flex justify-between p-4 border-b bg-white">
            <span>{userServiceData?.astro?.name}</span>
            <button onClick={handleExit} className="text-red-500">
              End
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-xs px-3 py-2 rounded ${
                  msg?.isAstro
                    ? "ml-auto bg-yellow-100"
                    : "bg-gray-100"
                }`}
              >
                {msg?.message?.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-4 flex gap-2 border-t">
            <input
              className="flex-1 border px-3 py-2 rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              onClick={() => {
                if (!input.trim()) return;
                sendMessage(input);
                setInput("");
              }}
              className="bg-black text-white px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPage;