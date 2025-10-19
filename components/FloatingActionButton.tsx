'use client';

import React, { useState, useEffect, useRef } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Initialize position from localStorage or default
  useEffect(() => {
    const savedPosition = localStorage.getItem('fab-position');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      // Default position: bottom-right
      const isMobile = window.innerWidth < 640;
      setPosition({
        x: window.innerWidth - 88, // 64px button + 24px margin
        y: window.innerHeight - (isMobile ? 120 : 88) // account for bottom nav on mobile
      });
    }
  }, []);

  // Handle drag start
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  // Handle drag move
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;

    // Constrain to viewport bounds
    const buttonWidth = 64;
    const buttonHeight = 64;
    const maxX = window.innerWidth - buttonWidth;
    const maxY = window.innerHeight - buttonHeight;

    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));

    setPosition({ x: constrainedX, y: constrainedY });
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Save position to localStorage
    localStorage.setItem('fab-position', JSON.stringify(position));
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  // Handle click (only if not dragged)
  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if we just finished dragging
    if (isDragging) {
      e.preventDefault();
      return;
    }
    onClick();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none', // Prevent default touch behaviors
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      className={`z-40 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50 hover:shadow-3xl hover:shadow-purple-500/70 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-shadow duration-300 flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-purple-500/30 ${
        isDragging ? 'scale-110' : 'hover:scale-110 active:scale-95'
      }`}
      aria-label="Add expense (drag to move)"
    >
      {/* Pulse animation ring - only when not dragging */}
      {!isDragging && (
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-75 group-hover:animate-ping"></span>
      )}

      {/* Plus icon */}
      <span className={`relative text-3xl sm:text-4xl font-light leading-none transition-transform duration-300 ${
        isDragging ? '' : 'group-hover:rotate-90'
      }`}>
        +
      </span>
    </button>
  );
}
