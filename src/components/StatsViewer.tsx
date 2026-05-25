import React from "react";
import { WorldState, ChainReaction } from "../types";
import { cn } from "../lib/utils";
import { Activity, Shield, Users, TrendingUp, AlertCircle, Zap } from "lucide-react";

interface StatsViewerProps {
  worldState: WorldState;
  chainReactions: ChainReaction[];
}

export const StatsViewer: React.FC<StatsViewerProps> = ({ worldState, chainReactions = [] }) => {
  const metrics = [
    { label: "Public Tension", value: worldState?.public_tension || 0, icon: <Activity size={12} />, color: "text-red-500", bar: "bg-red-500" },
    { label: "Media Trust", value: worldState?.media_trust || 0, icon: <Shield size={12} />, color: "text-blue-400", bar: "bg-blue-400" },
    { label: "Political Pressure", value: worldState?.political_pressure || 0, icon: <TrendingUp size={12} />, color: "text-amber-500", bar: "bg-amber-500" },
    { label: "Misinfo Spread", value: worldState?.misinformation_spread || 0, icon: <Zap size={12} />, color: "text-purple-400", bar: "bg-purple-400" },
    { label: "Institutional Trust", value: worldState?.institutional_trust || 0, icon: <Shield size={12} />, color: "text-green-400", bar: "bg-green-400" },
    { label: "Public Sentiment", value: worldState?.public_sentiment_toward_subject || 0, icon: <Users size={12} />, color: "text-pink-400", bar: "bg-pink-400" },
  ];

  return (
    <div className="h-full bg-[var(--win-bg)] p-4 overflow-y-auto font-retro">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metrics Grid */}
        <div className="space-y-4">
          <div className="text-[10px] text-gray-900 mb-2 uppercase font-bold tracking-tight border-b border-gray-400 pb-1">WORLD_TELEMETRY.EXE</div>
          <div className="bg-white border-inset p-3 space-y-4">
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center px-0.5">
                  <div className={cn("text-[10px] font-bold uppercase flex items-center gap-2", m.color)}>
                    {m.icon} {m.label}
                  </div>
                  <div className="text-[10px] text-black font-bold">{m.value}%</div>
                </div>
                <div className="h-3 w-full border-inset bg-gray-100 p-0.5">
                  <div className={cn("h-full transition-all duration-1000", m.bar)} style={{ width: `${m.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chain Reactions List */}
        <div className="space-y-4 flex flex-col">
          <div className="text-[10px] text-gray-900 mb-2 uppercase font-bold tracking-tight border-b border-gray-400 pb-1">ACTIVE_REACTIONS</div>
          <div className="flex-1 bg-white border-inset p-2 space-y-2 overflow-y-auto min-h-[200px]">
            {(!chainReactions || chainReactions.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <div className="text-[9px] uppercase font-bold">Scanning for anomalies...</div>
              </div>
            ) : (
              <div className="space-y-2">
                {(chainReactions || []).map((cr, idx) => (
                  <div key={idx} className="bg-[var(--win-bg)] border-outset p-2 relative group active:border-inset">
                    <div className={cn(
                      "absolute top-0 right-0 px-1 text-[8px] font-bold uppercase",
                      cr.severity === "CRITICAL" || cr.severity === "CATASTROPHIC" ? "bg-red-700 text-white" :
                      cr.severity === "HIGH" ? "bg-amber-600 text-white" :
                      "bg-gray-400 text-black"
                    )}>
                      {cr.severity}
                    </div>
                    <div className="text-[10px] text-blue-900 font-bold mb-0.5 uppercase tracking-tight">[{cr.id}] Triggered: {cr.trigger}</div>
                    <p className="text-[11px] text-black font-sans leading-tight">
                      {cr.description}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[8px] text-gray-500 font-bold uppercase">
                      <AlertCircle size={8} /> STATUS: {cr.status || "ACTIVE"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Simulation Log */}
      <div className="mt-6 border-outset p-2 bg-[var(--win-bg)]">
         <div className="text-[10px] text-gray-700 mb-1 uppercase font-bold">EVENT_LOG.TXT</div>
         <div className="h-20 border-inset bg-black p-2 overflow-y-auto font-mono text-[9px] text-green-500 leading-tight">
           <div>{new Date().toISOString()} | WORLD_INIT: OK</div>
           <div>{new Date().toISOString()} | POOL_WATCH: OK</div>
           {(chainReactions || []).map((cr, i) => (
             <div key={i}>{new Date().toISOString()} | SEQ_DET: {cr.id} AT HIGH PRESSURE</div>
           ))}
           <div className="animate-pulse">_</div>
         </div>
      </div>
    </div>
  );
};
