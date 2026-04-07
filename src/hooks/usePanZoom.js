import { useState, useRef, useCallback, useEffect } from "react";

export function usePanZoom() {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const containerRef = useRef(null);
  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((prev) => {
      const newScale = Math.min(Math.max(prev.scale * delta, 0.2), 3);
      return { ...prev, scale: newScale };
    });
  }, []);

  const handleMouseDown = useCallback(
    (e) => {
      // 중앙 버튼 또는 스페이스+클릭
      if (e.button === 1 || e.button === 0) {
        isPanning.current = true;
        startPoint.current = {
          x: e.clientX - transform.x,
          y: e.clientY - transform.y,
        };
        e.currentTarget.style.cursor = "grabbing";
      }
    },
    [transform.x, transform.y],
  );

  const handleMouseMove = useCallback((e) => {
    if (!isPanning.current) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - startPoint.current.x,
      y: e.clientY - startPoint.current.y,
    }));
  }, []);

  const handleMouseUp = useCallback((e) => {
    isPanning.current = false;
    if (e.currentTarget) {
      e.currentTarget.style.cursor = "grab";
    }
  }, []);

  const resetTransform = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return {
    containerRef,
    transform,
    resetTransform,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
}
