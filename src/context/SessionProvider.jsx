"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const socketRef = useRef(null);

  const [userServiceData, setUserServiceData] = useState(null);
  const [formData, setUserData] = useState(null);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // 🔌 CONNECT SOCKET (USE SESSION TOKEN ONLY)
 const connectSocket  = useCallback((sessionToken) => {
  if (isSocketConnected || socketRef.current) return;

  const socket = new WebSocket(
    "wss://video-calling.astrosway.com/chatRoom"
  );

  socketRef.current = socket;

  socket.onopen = () => {
    setMessages([]);
    console.log("Connected to WebSocket server");

    const joinMessage = JSON.stringify({
      event: "joinUserRoom",
      msg: sessionToken,
    });

    socket.send(joinMessage);
    setIsSocketConnected(true);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log("📩 Incoming:", data);

    // ❌ CLOSE EVENT
    if (data.event === "close") {
      setGroupId(null);
      setIsSocketConnected(false);
    }

    // ⚠️ ERROR EVENT
    if (data.event === "error") {
      console.log("Socket error:", data);
    }

    // 🚫 FULL EVENT
    if (data.event === "full") {

      setGroupId(null);
      setIsSocketConnected(false);
    }

    // ✅ MESSAGE + SUCCESS
    if (data.event === "message" || data.event === "success") {
      setGroupId(data.groupId);

      const result = Array.isArray(data.msg)
        ? data.msg
        : [data.msg];

      setMessages((prev) => [...prev, ...result]);
    }

    // 💰 OPTIONAL: rechargeAlert (if you still need UI)
    if (data.event === "rechargeAlert") {
      console.log("Recharge Alert:", data.msg);
    }

    // ✅ OPTIONAL: rechargeSuccess
    if (data.event === "rechargeSuccess") {
      console.log("Recharge Success");
    }
  };

  socket.onclose = () => {
    console.log("❌ Socket Disconnected");

    setIsSocketConnected(false);
    socketRef.current = null;
    setGroupId(null);
  };
}, [isSocketConnected]);

  // 💬 SEND MESSAGE
  const sendMessage = (text) => {
    if (!socketRef.current || !groupId) return;

    socketRef.current.send(
      JSON.stringify({
        event: "sendMessage",
        groupId,
        msg: {
          message: { type: "text", text },
          userRole: "user",
        },
      })
    );

    setMessages((prev) => [
      ...prev,
      { message: { text }, isAstro: 0 },
    ]);
  };

  // ❌ EXIT
  const handleExit = async () => {
    try {
      console.log("🚪 Exiting session...");

      if (userServiceData) {
        await fetch("/api/user/cancel-service", {
          method: "POST",
          body: JSON.stringify({
            serviceType: userServiceData.serviceType,
            roomId: userServiceData.roomId,
          }),
        });
      }

      socketRef.current?.close();

      setMessages([]);
      setGroupId(null);
      setUserServiceData(null);
      setShowQueueModal(false);
      setIsSocketConnected(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        userServiceData,
        setUserServiceData,
        showQueueModal,
        setShowQueueModal,
        messages,
        sendMessage,
        connectSocket,
        handleExit,
        groupId,
        isSocketConnected,
        formData,
        setUserData,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);