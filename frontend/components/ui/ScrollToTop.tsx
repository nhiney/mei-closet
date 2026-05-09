"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ScrollToTop.module.css";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 30, y: 100 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  useEffect(() => {
    const savedPos = localStorage.getItem("mei-scroll-pos");
    if (savedPos) {
      try {
        setPosition(JSON.parse(savedPos));
      } catch (e) {
        console.error("Failed to load scroll position", e);
      }
    }

    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    hasMoved.current = false;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartPos.current = {
      x: clientX - position.x,
      y: (window.innerHeight - clientY) - position.y
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    hasMoved.current = true;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    const newX = Math.max(10, Math.min(window.innerWidth - 70, clientX - dragStartPos.current.x));
    const newY = Math.max(10, Math.min(window.innerHeight - 70, (window.innerHeight - clientY) - dragStartPos.current.y));

    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem("mei-scroll-pos", JSON.stringify(position));
    }
  }, [isDragging, position]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove, { passive: false });
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const scrollToTop = (e: React.MouseEvent) => {
    if (hasMoved.current) return;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div 
      className={`${styles.wrapper} ${isVisible ? styles.visible : ""}`}
      style={{
        left: `${position.x}px`,
        bottom: `${position.y}px`,
      }}
    >
      {/* Sparkles/Particles Container */}
      <div className={`${styles.particles} ${isHovered ? styles.activeParticles : ""}`}>
        {[...Array(6)].map((_, i) => (
          <span key={i} className={styles.particle}></span>
        ))}
      </div>

      <button
        ref={buttonRef}
        className={`${styles.scrollTop} ${isDragging ? styles.dragging : ""} ${isHovered ? styles.hovered : ""}`}
        onClick={scrollToTop}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Scroll to top"
      >
        <div className={styles.heartContainer}>
          <svg
            className={styles.heartSvg}
            viewBox="0 0 24 24"
            fill="url(#heartGradient)"
          >
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff758c" />
                <stop offset="100%" stopColor="#ff4b2b" />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="rgba(0,0,0,0.2)" />
              </filter>
            </defs>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          
          <div className={styles.arrowInside}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </div>
        </div>
        
        {/* Glow Ring */}
        <div className={styles.glowRing}></div>
      </button>

      {/* Drag Handle Tooltip */}
      {isHovered && !isDragging && (
        <div className={styles.tooltip}>Kéo để di chuyển ✥</div>
      )}
    </div>
  );
}
