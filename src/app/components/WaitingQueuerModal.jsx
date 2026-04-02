"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/context/SessionProvider";

const WaitingQueueModal = ({
  isOpen,
  serviceData,
  formData,
  onCancel,
}) => {
  const { isSocketConnected } = useSession();

  const [queueTime, setQueueTime] = useState("00:00");
  const [loading, setLoading] = useState(false);

  const intervalRef = useRef(null);

  // FETCH + COUNTDOWN
useEffect(() => {
  if (!serviceData?.astro?.astroId) return;

  const fetchQueueTime = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/user/queueTime/${serviceData.astro.astroId}`
      );

      const data = await res.json();

      if (data?.statusCode === 200) {
        const time = data.data; // "00:01:35"
        startCountdown(time);   //  only start once
      }
    } catch (err) {
      console.error("Queue error:", err);
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = (timeStr) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const [h, m, s] = timeStr.split(":").map(Number);
    let totalSeconds = h * 3600 + m * 60 + s;

    intervalRef.current = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(intervalRef.current);
        setQueueTime("00:00:00");
        return;
      }

      totalSeconds--;

      const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const secs = String(totalSeconds % 60).padStart(2, "0");

      setQueueTime(`${hrs}:${mins}:${secs}`);
    }, 1000);
  };

  //  CALL ONLY ONCE
  fetchQueueTime();

  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, [serviceData]);

  //  AUTO CLOSE WHEN CONNECTED
  useEffect(() => {
    if (isSocketConnected) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isSocketConnected]);

  //  HIDE MODAL IF CONNECTED
  if (!isOpen || !serviceData || isSocketConnected) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md text-center space-y-5 shadow-2xl">

        {/*  HEADER */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={serviceData?.astro?.photo}
            alt="astro"
            className="w-20 h-20 rounded-full object-cover"
          />

          <h2 className="text-xl font-bold">
            {serviceData?.astro?.name}
          </h2>

          <p className="text-xs text-gray-500 uppercase">
            {serviceData?.serviceType} session
          </p>
        </div>

        {/*  STATUS */}
        <div className="bg-yellow-100 text-yellow-600 text-sm px-4 py-2 rounded-full">
          Waiting in queue...
        </div>

        {/*  TIMER */}
        <div className="text-4xl font-bold text-yellow-500">
          {loading ? "..." : queueTime}
        </div>

        {/* DETAILS */}
        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm">
          <div><b>Name:</b> {formData?.fullName || "N/A"}</div>
          <div><b>Gender:</b> {formData?.gender || "N/A"}</div>
          <div><b>DOB:</b> {formData?.dateOfBirth || "N/A"}</div>
          <div><b>Time:</b> {formData?.timeOfBirth || "N/A"}</div>
          <div><b>Place:</b> {formData?.placeOfBirth || "N/A"}</div>
        </div>

        {/*  SESSION */}
        <div className="flex justify-between text-sm bg-gray-100 p-3 rounded-xl">
          <span>Duration</span>
          <span className="font-semibold">
            {serviceData?.slotTime} mins
          </span>
        </div>

        {/*  CANCEL */}
        <button
          onClick={onCancel}
          className="w-full py-3 rounded-xl border hover:bg-gray-100"
        >
          Cancel Request
        </button>

      </div>
    </div>
  );
};

export default WaitingQueueModal;