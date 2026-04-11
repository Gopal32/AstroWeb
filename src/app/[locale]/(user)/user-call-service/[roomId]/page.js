"use client";

import { useEffect, useRef, useState } from "react";
import { Clock3, PhoneCall, PhoneOff, SendHorizontal } from "lucide-react";
import { useSession } from "@/context/SessionProvider";
import WaitingQueueModal from "@/app/components/WaitingQueuerModal";

const DEFAULT_CALL_DURATION = 5 * 60;

const formatTimeLeft = (totalSeconds) => {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const seconds = String(safeSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const formatMessageTime = (value) => {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CallPage = () => {
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
    sessionToken,
  } = useSession();

  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    (userServiceData?.timeSlot || 5) * 60 || DEFAULT_CALL_DURATION
  );
  const bottomRef = useRef(null);

  useEffect(() => {
    if (sessionToken) {
      connectSocket(sessionToken);
    }
  }, [connectSocket, sessionToken]);

  useEffect(() => {
    setTimeLeft((userServiceData?.timeSlot || 5) * 60 || DEFAULT_CALL_DURATION);
  }, [userServiceData?.timeSlot]);

  useEffect(() => {
    if (timeLeft <= 0) return undefined;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const handleCancel = () => {
    setShowQueueModal(false);
    handleExit();
  };

  const handleSend = () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage) return;

    sendMessage(trimmedMessage);
    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const astroName = userServiceData?.astro?.name || "Astro Guide";
  const hasMessages = messages.length > 0;
  const isTimerExpired = timeLeft === 0;

  return (
    <>
      {showQueueModal && !isSocketConnected && (
        <WaitingQueueModal
          isOpen={showQueueModal}
          serviceData={userServiceData}
          formData={formData}
          onCancel={handleCancel}
        />
      )}

      {isSocketConnected && (
        <div className="flex h-screen flex-col bg-[#FAF6ED] text-foreground transition-colors duration-300 dark:bg-background">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/10" />
          </div>

          <header className="border-b border-border/70 bg-background/80 px-4 py-4 backdrop-blur md:px-6">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-lg font-bold text-foreground md:text-xl">
                    Live Audio Call
                  </h1>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  In session with {astroName}
                </p>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-sm sm:flex">
                  <Clock3 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Time Left
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatTimeLeft(timeLeft)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleExit}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-background md:px-4"
                >
                  <PhoneOff className="h-4 w-4" />
                  <span className="hidden sm:inline">End Call</span>
                </button>
              </div>
            </div>

            <div className="mx-auto mt-3 flex w-full max-w-6xl sm:hidden">
              <div className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-3 py-2 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Time Left
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formatTimeLeft(timeLeft)}
                </span>
              </div>
            </div>
          </header>

          <main className="flex min-h-0 flex-1 flex-col">
            <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-3 py-4 md:px-6 md:py-6">
              <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-border/70 bg-card/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-card/90">
                <div className="border-b border-border/70 bg-background/70 px-4 py-4 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <PhoneCall className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Audio session is active
                        </p>
                        <p className="text-sm text-muted-foreground">
                          You can continue exchanging text messages during the call.
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Voice connected
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 md:px-6">
                  {!hasMessages && (
                    <div className="flex h-full items-center justify-center">
                      <div className="max-w-md rounded-3xl border border-dashed border-border bg-background/70 px-6 py-8 text-center shadow-sm">
                        <p className="text-lg font-semibold text-foreground">
                          Your audio call has started
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Use this space to send quick notes or questions while you
                          stay on the call.
                        </p>
                      </div>
                    </div>
                  )}

                  {hasMessages && (
                    <div className="space-y-4">
                      {messages.map((msg, index) => {
                        const isCurrentUser =
                          msg?.isAstro === 0 || msg?.userRole === "user";
                        const messageText = msg?.message?.text || "";
                        const timestamp =
                          msg?.createdAt ||
                          msg?.timestamp ||
                          msg?.time ||
                          msg?.message?.createdAt;

                        return (
                          <div
                            key={`${index}-${messageText}`}
                            className={`flex ${
                              isCurrentUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] rounded-[24px] px-4 py-3 shadow-sm transition-transform duration-200 sm:max-w-[75%] ${
                                isCurrentUser
                                  ? "rounded-br-md bg-sky-600 text-white"
                                  : "rounded-bl-md border border-border/70 bg-white text-slate-800 dark:bg-muted dark:text-foreground"
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                {messageText}
                              </p>
                              <p
                                className={`mt-2 text-[11px] ${
                                  isCurrentUser
                                    ? "text-white/70"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {formatMessageTime(timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      {input.trim() && (
                        <div className="flex justify-end">
                          <div className="rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
                            You are typing...
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>

                <div className="border-t border-border/70 bg-background/80 p-3 sm:p-4">
                  {isTimerExpired && (
                    <div className="mb-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                      Session time has ended. You can still review the call notes,
                      but sending new messages is disabled.
                    </div>
                  )}

                  <div className="flex items-end gap-3">
                    <div className="flex-1 rounded-[24px] border border-border bg-card shadow-sm transition focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15">
                      <textarea
                        rows={1}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        disabled={isTimerExpired}
                        className="max-h-32 min-h-[56px] w-full resize-none bg-transparent px-4 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                      />
                    </div>

                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isTimerExpired}
                      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(250,204,21,0.25)] transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Send message"
                    >
                      <SendHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default CallPage;
