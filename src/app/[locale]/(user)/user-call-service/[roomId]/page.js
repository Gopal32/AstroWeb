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
    setShowQueueModal,
    formData,
  } = useSession();

  const { user } = useAuth();
  const token = user?.token;

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // 🔌 CONNECT SOCKET (ONLY WHEN SERVICE EXISTS)
  useEffect(() => {
    if (token && userServiceData) {
      connectSocket(token);
    }
  }, [token, userServiceData]);

  // 🔽 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ❌ CANCEL
  const handleCancel = () => {
    setShowQueueModal(false);
    handleExit();
  };

  return (
    <>
      {/* 🔥 WAITING QUEUE MODAL */}
      {!isSocketConnected && (
        <WaitingQueueModal
          isOpen={showQueueModal}
          serviceData={userServiceData}
          formData={formData}
          onCancel={handleCancel}
        />
      )}

      {/* 💬 CHAT SCREEN */}
      {isSocketConnected && (
        <div className="h-screen flex flex-col bg-gray-50">

          {/* 🔝 HEADER */}
          <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={userServiceData?.astro?.photo}
                alt="astro"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-sm">
                  {userServiceData?.astro?.name}
                </h2>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>

            <button
              onClick={handleExit}
              className="text-red-500 text-sm font-semibold"
            >
              End
            </button>
          </div>

          {/* 💬 MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => {
              const isUser = msg?.isAstro === 0 || msg?.userRole === "user";

              return (
                <div
                  key={i}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-xl text-sm shadow ${
                      isUser
                        ? "bg-green-100 text-right"
                        : "bg-white"
                    }`}
                  >
                    <p>{msg?.message?.text}</p>
                  </div>
                </div>
              );
            })}

            {/* 👇 AUTO SCROLL TARGET */}
            <div ref={bottomRef} />
          </div>

          {/* ✍️ INPUT */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
            />

            <button
              onClick={() => {
                if (!input.trim()) return;
                sendMessage(input);
                setInput("");
              }}
              className="bg-black text-white px-4 rounded-lg text-sm"
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