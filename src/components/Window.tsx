import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Square } from "lucide-react";
import { cn } from "../lib/utils";

interface WindowProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
  initialX?: number;
  initialY?: number;
  width?: number;
  height?: number;
  isMaximized?: boolean;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon,
  children,
  isOpen,
  onClose,
  zIndex,
  onFocus,
  initialX = 50,
  initialY = 50,
  width = 600,
  height = 400,
  isMaximized: initialMaximized = false,
}) => {
  const [isMaximized, setIsMaximized] = useState(initialMaximized);
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width, height });
  const windowRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isFocused = zIndex > 10; // Simple heuristic for active window styling

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: isMaximized ? "100%" : size.width,
        height: isMaximized ? "calc(100% - 28px)" : size.height,
        x: isMaximized ? 0 : position.x,
        y: isMaximized ? 0 : position.y,
      }}
      transition={{ type: "tween", duration: 0.1 }}
      onMouseDown={onFocus}
      className={cn(
        "absolute bg-[var(--win-bg)] border-outset flex flex-col overflow-hidden shadow-sm",
        isMaximized ? "" : ""
      )}
      style={{ zIndex }}
    >
      {/* Title Bar */}
      <div 
        className={cn(
          "h-[20px] px-1 py-0.5 flex items-center justify-between cursor-move select-none",
          isFocused ? "bg-[var(--win-blue)] text-white" : "bg-[var(--win-bg-dark)] text-[var(--win-bg-light)]"
        )}
        onMouseDown={(e) => {
          if (isMaximized) return;
          const startX = e.clientX - position.x;
          const startY = e.clientY - position.y;
          
          const onMouseMove = (moveEvent: MouseEvent) => {
            setPosition({
              x: moveEvent.clientX - startX,
              y: moveEvent.clientY - startY,
            });
          };
          
          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };
          
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        }}
      >
        <div className="flex items-center gap-1 overflow-hidden">
          <div className="scale-75 flex-shrink-0">{icon}</div>
          <span className="text-[12px] font-retro whitespace-nowrap overflow-hidden text-ellipsis px-1">
            {title}
          </span>
        </div>
        
        <div className="flex items-center gap-0.5">
          <button onClick={() => setIsMaximized(!isMaximized)} className="win-icon-button">
            <Square size={8} fill="currentColor" strokeWidth={3} />
          </button>
          <button onClick={onClose} className="win-icon-button">
            <X size={10} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Content Area with Inset Border */}
      <div className="flex-1 p-1 overflow-hidden">
        <div className="w-full h-full border-inset bg-white overflow-auto relative">
          {children}
        </div>
      </div>

      {/* Resize Handle (Simplified) */}
      {!isMaximized && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize opacity-0" />
      )}
    </motion.div>
  );
};
