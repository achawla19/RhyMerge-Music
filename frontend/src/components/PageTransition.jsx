import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/**
 * PageTransition — wraps page content with a slide animation.
 *
 * Behavior:
 *   - Back navigation  → slides in from LEFT (new page slides right-to-left out, left-to-right in)
 *   - Forward navigation → slides in from RIGHT (standard)
 *   - Two-finger trackpad swipe right → navigate back with slide
 *   - Two-finger trackpad swipe left  → navigate forward with slide
 *
 * We track the history stack length to detect direction:
 *   if new length < old length → going back → slide from left
 *   if new length > old length → going forward → slide from right
 */

let _historyStack = [window.location.pathname];
let _lastDirection = "forward";

export const getNavDirection = () => _lastDirection;

export const trackNavigation = (location, action) => {
  if (action === "POP") {
    // Browser back/forward — detect by checking if path was in stack
    const idx = _historyStack.lastIndexOf(location.pathname);
    if (idx !== -1 && idx < _historyStack.length - 1) {
      _lastDirection = "back";
      _historyStack = _historyStack.slice(0, idx + 1);
    } else {
      _lastDirection = "forward";
      _historyStack.push(location.pathname);
    }
  } else if (action === "PUSH") {
    _lastDirection = "forward";
    _historyStack.push(location.pathname);
  } else if (action === "REPLACE") {
    _lastDirection = "forward";
    _historyStack[_historyStack.length - 1] = location.pathname;
  }
};

const SLIDE_DURATION = 280; // ms

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [display, setDisplay] = useState(children);
  const [phase, setPhase] = useState("idle"); // idle | entering
  const [dir, setDir] = useState("forward");
  const prevKey = useRef(location.key);
  const swipeRef = useRef({ startX: 0, startY: 0, active: false });

  useEffect(() => {
    if (location.key === prevKey.current) return;
    prevKey.current = location.key;

    const direction = _lastDirection;
    setDir(direction);
    setPhase("entering");
    setDisplay(children);

    const t = setTimeout(() => setPhase("idle"), SLIDE_DURATION);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Always keep display in sync when idle
  useEffect(() => {
    if (phase === "idle") setDisplay(children);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, phase]);

  // Two-finger swipe detection on the main content area
  useEffect(() => {
    let accX = 0;
    let accY = 0;
    let frames = 0;
    const THRESHOLD = 60;

    const onWheel = (e) => {
      // Only fire on trackpad horizontal swipes (not vertical scroll)
      // deltaX > deltaY means horizontal gesture
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 5) {
        accX += e.deltaX;
        accY += e.deltaY;
        frames++;

        clearTimeout(onWheel._t);
        onWheel._t = setTimeout(() => {
          if (
            Math.abs(accX) > THRESHOLD &&
            Math.abs(accX) > Math.abs(accY) * 2
          ) {
            if (accX < 0) {
              // Swipe right → go back
              window.history.back();
            } else {
              // Swipe left → go forward
              window.history.forward();
            }
          }
          accX = 0;
          accY = 0;
          frames = 0;
        }, 80);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      clearTimeout(onWheel._t);
    };
  }, []);

  // Build transform for enter animation
  const getStyle = () => {
    if (phase === "idle") return {};
    const fromRight = dir === "forward";
    return {
      animation: `rmSlide${fromRight ? "FromRight" : "FromLeft"} ${SLIDE_DURATION}ms cubic-bezier(0.22,1,0.36,1) forwards`,
    };
  };

  return (
    <>
      <style>{`
        @keyframes rmSlideFromRight {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes rmSlideFromLeft {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div style={getStyle()}>{display}</div>
    </>
  );
};

export default PageTransition;
