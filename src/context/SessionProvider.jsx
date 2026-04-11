"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import useApi from "@/hooks/useApi";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { apiCall } = useApi();

  const [userServiceData, setUserServiceData] = useState(null);
  const [formData, setUserData] = useState(null);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);

  // 🔌 CONNECT SOCKET (USE SESSION TOKEN ONLY)

  const connectSocket = useCallback((sessionToken) => {
    if (isSocketConnected || socketRef.current) return;

    const socket = new WebSocket(
      "wss://video-calling.astrosway.com/chatRoom"
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Socket Connected");

      socket.send(
        JSON.stringify({
          event: "joinUserRoom",
          msg: sessionToken, // 🔥 CORRECT TOKEN
        })
      );

      setIsSocketConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("📩 Incoming:", data);

      if (data.event === "close") {
        handleExit(); // 🔥 IMPORTANT
      }

      if (data.event === "message" || data.event === "success") {
        setGroupId(data.groupId);

        const result = Array.isArray(data.msg)
          ? data.msg
          : [data.msg];

        setMessages((prev) => [...prev, ...result]);

        setShowQueueModal(false);
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
        await apiCall("/api/user/cancel-service",
          "POST", {
          serviceType: userServiceData.serviceType,
          roomId: userServiceData.roomId,
        }
        )
      }

      socketRef.current?.close();

      setMessages([]);
      setGroupId(null);
      setUserServiceData(null);
      setShowQueueModal(false);
      setIsSocketConnected(false);

      window.history.back();
    } catch (err) {
      console.error(err);
    }
  };

  const checkStatus = async () => {
    try {
      console.log("CAlling checkStatus")
      const checkStatus = await apiCall("api/user/service-active-status", 'POST', {
        serviceType: userServiceData.serviceType,
        roomId: userServiceData.roomId,
      }
      )
      if (checkStatus?.data) {
        setModalVisible(true);
        setGroupId(checkStatus.data.serviceToken);
      } else if (shouldClearIfNotFound) {
        // Onl if explicitly told to (e.g., on initial mount, not on navigation)
        setModalVisible(false);
      }
    } catch (error) {
      console.log('🚀 ~ checkServiceStatus ~ error:', error);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);


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
        sessionToken,
        setSessionToken,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);