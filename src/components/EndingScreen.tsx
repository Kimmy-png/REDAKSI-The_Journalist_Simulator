import React from "react";
import { motion } from "motion/react";
import { Trophy, ShieldAlert, Newspaper, Users, BarChart3, RotateCcw, X } from "lucide-react";
import { cn } from "../lib/utils";

interface EndingScreenProps {
  endingData: any;
  onRestart: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ endingData, onRestart }) => {
  if (!endingData) return null;

  const { ending_title, ending_type, player_legacy, true_ending, generated_ending } = endingData;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[2000] bg-black/50 flex items-center justify-center p-8 overflow-y-auto font-retro"
    >
      <div className="bg-[var(--win-bg)] border-outset p-2 max-w-4xl w-full shadow-2xl">
        <div className="title-bar mb-4">
          <span className="text-[14px] px-1 font-bold">SESSION_TERMINATED.LOG</span>
          <div className="win-icon-button !m-0"><X size={10} strokeWidth={3} /></div>
        </div>

        <div className="p-6 bg-[var(--win-bg-light)] border-inset overflow-y-auto max-h-[80vh]">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-black font-retro text-4xl md:text-6xl font-bold uppercase tracking-tight mb-2"
            >
              {ending_title}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-700 text-sm uppercase font-bold"
            >
              TYPE: {ending_type} // STATUS: ARCHIVED
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Narrative Section */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-white border-inset p-6 h-full">
                <h3 className="text-black font-bold text-lg mb-4 uppercase border-b border-gray-300">The Outcome</h3>
                <p className="text-gray-800 font-sans leading-relaxed text-sm">
                  {true_ending?.description || generated_ending?.description}
                </p>
              </div>
            </motion.div>

            {/* Legacy & Stats Section */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-[var(--win-bg)] border-outset p-6 text-center">
                <div className="text-[10px] font-bold text-gray-600 mb-2 uppercase">Journalist Legacy</div>
                <div className="text-black font-retro text-2xl font-bold uppercase mb-4">
                  {player_legacy.title}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-2 bg-white border-inset">
                     <div className="text-[8px] text-gray-500 uppercase font-bold">Trust Score</div>
                     <div className="text-lg font-bold text-blue-900">{player_legacy?.score || 0}</div>
                  </div>
                  <div className="p-2 bg-white border-inset">
                     <div className="text-[8px] text-gray-500 uppercase font-bold">Truth Exposed</div>
                     <div className="text-lg font-bold text-blue-900">{player_legacy?.stats_breakdown?.truth_exposed || 0}%</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                 <div className="text-[10px] text-gray-600 uppercase font-bold border-b border-gray-300 pb-1">Final Metrics</div>
                 <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "Articles Published", value: player_legacy?.stats_breakdown?.articles_published || 0, icon: <Newspaper size={12} /> },
                      { label: "Chain Reactions triggered", value: player_legacy?.stats_breakdown?.chain_reactions_triggered || 0, icon: <ShieldAlert size={12} /> },
                      { label: "Public Tension CAUSED", value: player_legacy?.stats_breakdown?.total_public_tension_caused || 0, icon: <Users size={12} /> },
                      { label: "Avg. Accuracy Rating", value: `${player_legacy?.stats_breakdown?.average_accuracy || 0}%`, icon: <BarChart3 size={12} /> },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white border-inset">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-700 uppercase">
                          {stat.icon} {stat.label}
                        </div>
                        <div className="text-xs font-bold text-black">{stat.value}</div>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          </div>
          
          <div className="flex justify-center flex-col items-center gap-4">
            <button 
              onClick={onRestart}
              className="win-button border-outset px-12 py-3 font-bold uppercase text-lg active:border-inset flex items-center gap-2"
            >
              <RotateCcw size={18} /> New Session
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
