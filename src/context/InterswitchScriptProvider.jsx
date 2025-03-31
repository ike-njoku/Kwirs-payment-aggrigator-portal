"use client";
import { useEffect, useState, createContext, useContext } from "react";

// Create a context to track script loading status
const InterswitchScriptContext = createContext({
  scriptLoaded: false,
  scriptError: null,
});

export const useInterswitchScript = () => useContext(InterswitchScriptContext);

export default function InterswitchScriptProvider({ children }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(null);

  useEffect(() => {
    // Only run this on the client side
    if (typeof window === "undefined") return;

    // If script is already loaded or in process of loading, don't reload
    if (
      document.querySelector(
        'script[src*="interswitchng.com/inline-checkout.js"]'
      )
    ) {
      // Check if the script has already loaded the window.webpayCheckout function
      if (window.webpayCheckout) {
        setScriptLoaded(true);
        return;
      }

      // Otherwise, wait for it to load
      const checkInterval = setInterval(() => {
        if (window.webpayCheckout) {
          setScriptLoaded(true);
          clearInterval(checkInterval);
        }
      }, 500);

      return () => clearInterval(checkInterval);
    }

    // Script hasn't been added yet, so add it
    const script = document.createElement("script");
    script.src = "https://newwebpay.qa.interswitchng.com/inline-checkout.js";
    script.async = true;

    script.onload = () => {
      // Even after script loads, the webpayCheckout might not be immediately available
      const checkWebpayReady = setInterval(() => {
        if (window.webpayCheckout) {
          setScriptLoaded(true);
          clearInterval(checkWebpayReady);
        }
      }, 500);

      // Clear the interval after 10 seconds to prevent infinite checking
      setTimeout(() => {
        if (!window.webpayCheckout) {
          clearInterval(checkWebpayReady);
          setScriptError(
            new Error("webpayCheckout not available after timeout")
          );
        }
      }, 10000);
    };

    script.onerror = (error) => {
      setScriptError(error);
    };

    document.body.appendChild(script);

    return () => {};
  }, []);

  return (
    <InterswitchScriptContext.Provider value={{ scriptLoaded, scriptError }}>
      {children}
    </InterswitchScriptContext.Provider>
  );
}
