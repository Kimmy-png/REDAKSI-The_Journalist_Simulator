import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Search, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

interface TerminalProps {
  onSearch: (query: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onSearch }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "Microsoft(R) Windows 95",
    "(C)Copyright Microsoft Corp 1981-1995.",
    "",
    "C:\\> HELP for commands"
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setHistory(prev => [...prev, `C:\\>${cmd}`]);
    
    const parts = cmd.split(" ");
    const action = parts[0].toUpperCase();
    const args = parts.slice(1).join(" ");

    if (action === "SEARCH" || action === "FIND") {
      setHistory(prev => [...prev, `Searching databases for: "${args}"...`, "Scanning encrypted nodes..."]);
      onSearch(args);
    } else if (action === "HELP") {
      setHistory(prev => [...prev, "Available commands:", "- SEARCH <term>: Search evidence database", "- CLEAR: Clear screen", "- STATUS: Current system health"]);
    } else if (action === "CLEAR") {
      setHistory([]);
    } else if (action === "STATUS") {
       setHistory(prev => [...prev, "System: OPERATION_CRITICAL", "Link: STABLE", "Memory: 100% AVAILABLE"]);
    } else {
      setHistory(prev => [...prev, `Unknown command: ${action}`]);
    }

    setInput("");
  };

  return (
    <div 
      ref={containerRef}
      className="h-full bg-black p-2 font-mono text-[12px] overflow-y-auto flex flex-col custom-scrollbar"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 text-gray-200">
        {(history || []).map((line, i) => (
          <div key={i} className="mb-0.5 whitespace-pre-wrap">{line}</div>
        ))}
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-1 mt-2 text-gray-200">
        <span className="font-bold">C:\&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-gray-200 caret-white"
          autoFocus
          spellCheck={false}
        />
        <TerminalIcon size={12} className="opacity-30" />
      </form>
    </div>
  );
};
