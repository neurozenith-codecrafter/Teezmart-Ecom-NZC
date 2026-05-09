import { useEffect } from "react";

const DEFAULT_NO_SWIPE_SELECTOR = "[data-no-swipe]";

const getElementFromEventTarget = (target) => {
  if (target instanceof Element) return target;
  return null;
};

const hasHorizontalScrollOwnership = (element) => {
  let current = element;
  while (current && current !== document.body) {
    if (current.hasAttribute("data-no-swipe")) return true;

    const style = window.getComputedStyle(current);
    const overflowX = style.overflowX;
    const canScrollX =
      (overflowX === "auto" || overflowX === "scroll") &&
      current.scrollWidth > current.clientWidth + 2;

    if (canScrollX) return true;
    current = current.parentElement;
  }
  return false;
};

export const useSidebarSwipeGesture = ({
  enabled,
  activationRatio,
  onSwipeMove,
  onSwipeOpen,
  onSwipeCancel,
  noSwipeSelector = DEFAULT_NO_SWIPE_SELECTOR,
  horizontalThreshold = 12,
  verticalThreshold = 12,
  directionDominance = 1.1,
  openVelocity = 260,
  openDistance = 64,
}) => {
  useEffect(() => {
    if (!enabled) return;

    const state = {
      active: false,
      triggered: false,
      owner: null,
      direction: "pending",
      startX: 0,
      startY: 0,
      lastX: 0,
      lastTime: 0,
      velocity: 0,
      activeTouchId: null,
    };

    const reset = () => {
      state.active = false;
      state.triggered = false;
      state.owner = null;
      state.direction = "pending";
      state.activeTouchId = null;
      state.velocity = 0;
    };

    const canStartFromTarget = (target) => {
      const element = getElementFromEventTarget(target);
      if (!element) return true;

      if (element.closest(noSwipeSelector)) return false;
      if (hasHorizontalScrollOwnership(element)) return false;

      return true;
    };

    const startGesture = (x, y, target) => {
      if (x > window.innerWidth * activationRatio) return;

      if (!canStartFromTarget(target)) {
        state.owner = "component";
        return;
      }

      state.owner = "sidebar";
      state.active = true;
      state.triggered = false;
      state.direction = "pending";
      state.startX = x;
      state.startY = y;
      state.lastX = x;
      state.lastTime = Date.now();
      state.velocity = 0;
    };

    const updateGesture = (x, y) => {
      if (!state.active || state.owner !== "sidebar") return false;

      const deltaX = x - state.startX;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(y - state.startY);
      const now = Date.now();
      const dt = now - state.lastTime;

      if (dt > 0) {
        state.velocity = ((x - state.lastX) / dt) * 1000;
      }
      state.lastX = x;
      state.lastTime = now;

      if (state.direction === "pending") {
        const horizontalLock =
          absDeltaX > horizontalThreshold &&
          absDeltaX > absDeltaY * directionDominance;
        const verticalLock =
          absDeltaY > verticalThreshold &&
          absDeltaY > absDeltaX * directionDominance;

        if (verticalLock) {
          reset();
          return false;
        }

        if (horizontalLock) {
          state.direction = "horizontal";
        } else {
          return false;
        }
      }

      if (state.direction === "horizontal" && deltaX > 0) {
        state.triggered = true;
        onSwipeMove?.(deltaX);
        return true;
      }

      return false;
    };

    const endGesture = (x) => {
      if (!state.active || state.owner !== "sidebar") return;

      if (state.direction === "horizontal" && state.triggered) {
        const deltaX = x - state.startX;
        if (state.velocity > openVelocity || deltaX > openDistance) {
          onSwipeOpen?.();
        } else {
          onSwipeCancel?.();
        }
      } else if (state.triggered) {
        onSwipeCancel?.();
      }

      reset();
    };

    const cancelGesture = () => {
      if (state.active && state.triggered) {
        onSwipeCancel?.();
      }
      reset();
    };

    const onPointerDown = (e) => {
      if (e.pointerType === "touch") return;
      startGesture(e.clientX, e.clientY, e.target);
    };

    const onPointerMove = (e) => {
      if (e.pointerType === "touch") return;
      updateGesture(e.clientX, e.clientY);
    };

    const onPointerUp = (e) => {
      if (e.pointerType === "touch") return;
      endGesture(e.clientX);
    };

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      startGesture(touch.clientX, touch.clientY, e.target);
      state.activeTouchId = touch.identifier;
    };

    const onTouchMove = (e) => {
      if (!state.active) return;

      const touch = Array.from(e.touches).find(
        (item) => item.identifier === state.activeTouchId,
      );
      if (!touch) return;

      const shouldPreventDefault = updateGesture(touch.clientX, touch.clientY);
      if (shouldPreventDefault) {
        // Never block page scrolling until horizontal swipe is confirmed.
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      const touch = Array.from(e.changedTouches).find(
        (item) => item.identifier === state.activeTouchId,
      );
      if (!touch) return;
      endGesture(touch.clientX);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", cancelGesture);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", cancelGesture, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", cancelGesture);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", cancelGesture);
    };
  }, [
    enabled,
    activationRatio,
    onSwipeMove,
    onSwipeOpen,
    onSwipeCancel,
    noSwipeSelector,
    horizontalThreshold,
    verticalThreshold,
    directionDominance,
    openVelocity,
    openDistance,
  ]);
};
