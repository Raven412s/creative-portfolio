import { useEffect, useState } from "react";

export function useIsTouchDevice(): boolean {

  const getIsTouch = () => {
    if (typeof window === "undefined") return false;

    return (
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  };

  // ✅ lazy initial state (no effect needed for initial value)
  const [isTouch, setIsTouch] = useState<boolean>(getIsTouch);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");

    const handler = (e: MediaQueryListEvent) => {
      setIsTouch(e.matches);
    };

    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
  }, []);

  return isTouch;
}