import React, { useState } from "react";
import { Globe, MessageSquare, Twitter, MessageCircle, Heart, Repeat2, Share2, AlertTriangle } from "lucide-react";
import { SocialMediaPlatform, SocialMediaComment } from "../types";
import { cn } from "../lib/utils";

interface SocialFeedProps {
  platforms: Record<string, SocialMediaPlatform>;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({ platforms }) => {
  const [activePlatform, setActivePlatform] = useState<string>("nusantaraX");

  const platformIcons: Record<string, React.ReactNode> = {
    nusantaraX: <Twitter size={14} />,
    forumNusantara: <MessageSquare size={14} />,
    kabarnesia: <MessageCircle size={14} />
  };

  const currentPlatform = platforms[activePlatform] || { platform_name: "Loading...", comments: [] };

  return (
    <div className="flex h-full bg-[var(--win-bg)] font-retro">
      {/* Sidebar Platforms */}
      <div className="w-12 border-r border-gray-400 flex flex-col items-center py-2 gap-2">
        {Object.entries(platforms || {}).map(([id, p]) => (
          <button
            key={id}
            onClick={() => setActivePlatform(id)}
            title={p.platform_name}
            className={cn(
              "win-button w-8 h-8 flex items-center justify-center transition-all",
              activePlatform === id
                ? "border-inset bg-[var(--win-bg-light)]"
                : "border-outset bg-[var(--win-bg)]"
            )}
          >
            {platformIcons[id] || <Globe size={14} />}
          </button>
        ))}
      </div>

      {/* Main Feed Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white border-inset m-1">
        {/* Header */}
        <div className="h-8 border-b border-gray-300 flex items-center justify-between px-3 bg-[var(--win-bg-light)]">
           <div className="flex items-center gap-2">
             <div className="text-[10px] font-bold text-blue-900 uppercase">{currentPlatform.platform_name}</div>
             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
           </div>
           <div className="text-[9px] text-gray-500 uppercase font-bold">
             Browser v1.0
           </div>
        </div>

        {/* Feed List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(!currentPlatform || !currentPlatform.comments || currentPlatform.comments.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full opacity-30">
               <AlertTriangle size={32} className="text-gray-400 mb-2" />
               <p className="text-[10px] uppercase font-bold text-center">No social activity detected.</p>
            </div>
          ) : (
            (currentPlatform.comments || []).map((comment, idx) => (
              <div key={idx} className="border-outset bg-[var(--win-bg)] p-3 active:border-inset">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-sm flex items-center justify-center text-[10px] font-bold text-white shrink-0 border-inset"
                    style={{ backgroundColor: comment.avatar_color }}
                  >
                    {comment.avatar_initial}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[11px] font-bold text-blue-900">{comment.username}</span>
                      {comment.handle && <span className="text-[9px] text-gray-500 truncate">{comment.handle}</span>}
                    </div>
                    <p className="text-[12px] text-black font-sans leading-tight">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[9px] font-bold uppercase">
                      <button className="flex items-center gap-1 hover:text-blue-800"><Heart size={8} /> {comment.likes}</button>
                      <button className="flex items-center gap-1 hover:text-blue-800"><Share2 size={8} /> SHARE</button>
                      
                      <div className={cn(
                        "ml-auto text-[8px] px-1 border-inset bg-white",
                        comment.sentiment === "NEGATIVE" ? "text-red-700" :
                        comment.sentiment === "POSITIVE" ? "text-green-700" :
                        "text-gray-500"
                      )}>
                        {comment.sentiment}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
