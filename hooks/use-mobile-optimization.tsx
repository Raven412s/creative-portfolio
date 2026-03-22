import { useEffect, useState } from "react";

/**
 * Hook for mobile and touch device optimizations
 * Provides various mobile-specific features and utilities
 */
export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // Check if touch device
      const touchCheck =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;

      setIsTouchDevice(touchCheck);

      // Check viewport width
      const width = window.innerWidth;
      const height = window.innerHeight;

      setViewportWidth(width);
      setViewportHeight(height);

      // Mobile: < 768px
      // Tablet: 768px - 1024px
      // Desktop: > 1024px
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);

      // Check orientation
      setIsLandscape(height < width);
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  /**
   * Disable scrolling on body (useful for modals/menus)
   */
  const disableScroll = () => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  };

  /**
   * Enable scrolling on body
   */
  const enableScroll = () => {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };

  /**
   * Detect if user is scrolling
   */
  const useScrollDetection = (callback: (isScrolling: boolean) => void) => {
    useEffect(() => {
      let scrollTimeout: NodeJS.Timeout;

      const handleScroll = () => {
        callback(true);
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => callback(false), 500);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(scrollTimeout);
      };
    }, [callback]);
  };

  /**
   * Safe touch event handler that works across devices
   */
  const handleTouchableClick = (
    callback: () => void,
    options?: { preventDefault?: boolean; stopPropagation?: boolean }
  ) => {
    return (e: React.TouchEvent | React.MouseEvent) => {
      if (options?.preventDefault) {
        e.preventDefault();
      }
      if (options?.stopPropagation) {
        e.stopPropagation();
      }
      callback();
    };
  };

  /**
   * Prevent zoom on double-tap (common on iOS)
   */
  const preventDoubleTapZoom = () => {
    let lastTouchTime = 0;

    const preventZoom = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchTime < 300) {
        e.preventDefault();
      }
      lastTouchTime = now;
    };

    document.addEventListener("touchend", preventZoom, { passive: false });

    return () => {
      document.removeEventListener("touchend", preventZoom);
    };
  };

  return {
    isMobile,
    isTablet,
    isTouchDevice,
    viewportWidth,
    viewportHeight,
    isLandscape,
    disableScroll,
    enableScroll,
    useScrollDetection,
    handleTouchableClick,
    preventDoubleTapZoom,
  };
}
