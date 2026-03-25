import { useRef, useCallback } from "react";

const ERROR_MESSAGES = {
  REQUEST_TIMEOUT: "Request timed out. Please try again.",
};

export default function useApi() {
  const abortControllerRef = useRef(null);

  const apiCall = useCallback(
    async (endpoint, method = "POST", body = null) => {
      try {
        abortControllerRef.current = new AbortController();

        const timeoutId = setTimeout(
          () => abortControllerRef.current?.abort(),
          10000
        );

        const options = {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          signal: abortControllerRef.current.signal,
        };

        if (body && method !== "GET") {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(endpoint, options);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
      } catch (err) {
        if (err.name === "AbortError") {
          throw new Error(ERROR_MESSAGES.REQUEST_TIMEOUT);
        }
        throw err;
      }
    },
    []
  );

  return { apiCall };
}
