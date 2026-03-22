import { useEffect, useRef } from "react";

/**
 * Hook to detect if user is scrolling
 * @param callback Function called with boolean indicating if scrolling (true) or idle (false)
 * @example
 * const { cleanup } = useScrollDetection((isScrolling) => {
 *   console.log('User is scrolling:', isScrolling);
 * });
 */
export function useScrollDetection(callback: (isScrolling: boolean) => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      callbackRef.current(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        callbackRef.current(false);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
}
