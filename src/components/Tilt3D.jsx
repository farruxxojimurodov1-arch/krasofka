import React, { useRef, useState, useCallback } from 'react';

export default function Tilt3D({
  children,
  className = '',
  maxTilt = 12,
  scale = 1.02,
  perspective = 1100,
  glare = true,
  glareOpacity = 0.22,
  style = {},
}) {
  const containerRef = useRef(null);
  const frameRef = useRef(null);

  const [tiltStyle, setTiltStyle] = useState({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
  });

  const [glareState, setGlareState] = useState({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = useCallback(
    (e) => {
      const node = containerRef.current;
      if (!node) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width;
        const py = (clientY - rect.top) / rect.height;

        const rotateY = (px - 0.5) * (maxTilt * 2);
        const rotateX = (0.5 - py) * (maxTilt * 2);

        setTiltStyle({
          transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(
            2
          )}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
          transition: 'transform 0.08s linear',
        });

        if (glare) {
          setGlareState({
            x: Math.round(px * 100),
            y: Math.round(py * 100),
            opacity: glareOpacity,
          });
        }
      });
    },
    [maxTilt, scale, perspective, glare, glareOpacity]
  );

  const handleMouseLeave = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });

    if (glare) {
      setGlareState((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [perspective, glare]);

  return (
    <div
      ref={containerRef}
      className={`tilt-3d-root ${className}`}
      style={{ ...style, ...tiltStyle }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {glare && (
        <div
          className="tilt-3d-glare"
          aria-hidden="true"
          style={{
            opacity: glareState.opacity,
            background: `radial-gradient(circle at ${glareState.x}% ${glareState.y}%, rgba(255, 255, 255, 0.72), rgba(200, 255, 0, 0.16) 36%, transparent 68%)`,
          }}
        />
      )}
    </div>
  );
}