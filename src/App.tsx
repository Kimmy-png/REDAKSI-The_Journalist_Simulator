import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Globe, 
  BarChart3, 
  Terminal as TerminalIcon, 
  MessageSquare, 
  Layout,
  Newspaper,
  ShieldAlert,
  Loader2,
  AlertCircle,
  Target,
  ShieldCheck,
  Send,
  X,
  RotateCcw,
  LogOut
} from 'lucide-react';
import { Window } from './components/Window';
import { EvidenceViewer } from './components/EvidenceViewer';
import { ArticleEditor } from './components/ArticleEditor';
import { SocialFeed } from './components/SocialFeed';
import { StatsViewer } from './components/StatsViewer';
import { Terminal } from './components/Terminal';
import { EndingScreen } from './components/EndingScreen';
import { BackgroundMusic } from './components/BackgroundMusic';
import { useGame } from './hooks/useGame';
import { AppId } from './ui-types';
import { cn } from './lib/utils';

export default function App() {
  const [booted, setBooted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeWindows, setActiveWindows] = useState<Record<AppId, boolean>>({
    brief: false,
    editor: false,
    feed: false,
    stats: false,
    terminal: false,
    messenger: false
  });
  const [zIndices, setZIndices] = useState<Record<AppId, number>>({
    brief: 1,
    editor: 1,
    feed: 1,
    stats: 1,
    terminal: 1,
    messenger: 1
  });
  const [maxZ, setMaxZ] = useState(1);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  
  const { 
    currentIssue, 
    worldState, 
    isLoading, 
    startNewGame, 
    submitArticle,
    truthExposure,
    socialPlatforms,
    evaluation,
    endingData,
    error,
    unlockNotification,
    setUnlockNotification,
    resetGame
  } = useGame();

  // Handle session persistence: if a game is already in progress, skip the start screen
  useEffect(() => {
    if (currentIssue && !isGameStarted) {
      setIsGameStarted(true);
      // Restore some default windows if everything is closed
      const anyOpen = Object.values(activeWindows).some(v => v);
      if (!anyOpen) {
        setActiveWindows({
          brief: true,
          editor: true,
          feed: false,
          stats: false,
          terminal: false,
          messenger: true
        });
      }
    }
  }, [currentIssue, isGameStarted, activeWindows]);

  // Boot sequence simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setBooted(true), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const focusWindow = (id: AppId) => {
    const nextZ = maxZ + 1;
    setZIndices(prev => ({ ...prev, [id]: nextZ }));
    setMaxZ(nextZ);
  };

  const toggleWindow = (id: AppId) => {
    setActiveWindows(prev => ({ ...prev, [id]: !prev[id] }));
    if (!activeWindows[id]) {
      focusWindow(id);
    }
  };

  const handleStartGame = async () => {
    await startNewGame(1, "Operator_01");
    setIsGameStarted(true);
    setTimeout(() => {
      toggleWindow("messenger");
      toggleWindow("brief");
      toggleWindow("editor");
    }, 500);
  };

  const handleRestart = () => {
    setIsGameStarted(false);
    resetGame();
    setActiveWindows({
      brief: false,
      editor: false,
      feed: false,
      stats: false,
      terminal: false,
      messenger: false
    });
  };

  if (!booted) {
    return (
      <div className="h-screen w-screen bg-[var(--win-teal)] flex flex-col items-center justify-center font-retro text-black crt-soften crt-curve">
        {/* CRT Effects */}
        <div className="crt-overlay crt-scanlines" />
        <div className="crt-overlay crt-vignette" />
        <div className="crt-overlay crt-flicker" />
        <div className="crt-scanline-moving" />
        
        <div className="mb-8 p-4 border-outset bg-[var(--win-bg)] w-80 shadow-md relative z-10">
          <p className="text-[12px] mb-4 text-center font-bold">REDAKSI OS v3.11 // LOADING...</p>
          <div className="w-full h-6 border-inset bg-[var(--win-bg-light)] overflow-hidden p-1">
            <motion.div 
              className="h-full bg-[var(--win-blue)]" 
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-[10px] mt-2 text-center text-gray-700 uppercase tracking-tight">
            {loadingProgress < 30 && "Searching for memory..."}
            {loadingProgress >= 30 && loadingProgress < 60 && "Establishing connection to World.Net..."}
            {loadingProgress >= 60 && loadingProgress < 90 && "Verifying licenses..."}
            {loadingProgress >= 90 && "Welcome back, User_01"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[var(--win-teal)] relative overflow-hidden font-retro select-none crt-soften crt-curve">
      {/* CRT Effects */}
      <div className="crt-overlay crt-scanlines" />
      <div className="crt-overlay crt-vignette" />
      <div className="crt-overlay crt-flicker" />
      <div className="crt-scanline-moving" />
      
      <AnimatePresence>
        {endingData && (
          <EndingScreen endingData={endingData} onRestart={handleRestart} />
        )}
      </AnimatePresence>
      

      {/* Start Screen Overlay */}
      <AnimatePresence>
        {!isGameStarted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/40 flex items-center justify-center p-8 overflow-y-auto"
          >
            <div className="bg-[var(--win-bg)] border-outset p-2 max-w-sm w-full shadow-2xl">
              <div className="title-bar mb-2">
                <span className="text-[12px] font-retro px-1">REDAKSI // WELCOME</span>
              </div>
              <div className="p-4 border-inset bg-[var(--win-bg-light)]">
                 <motion.div
                   initial={{ y: 10, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   className="text-center mb-6"
                 >
                   <div className="inline-block p-2 mb-4">
                     <ShieldAlert size={48} className="text-red-600 mx-auto" />
                   </div>
                   <h1 className="text-black font-retro text-2xl font-bold mb-2">
                     REDAKSI
                   </h1>
                   <p className="text-gray-700 font-retro text-[10px] uppercase tracking-tighter">
                     Journalist Simulator // Zenith Case
                   </p>
                 </motion.div>
                
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={handleStartGame}
                    className="win-button border-outset w-full py-3 font-retro font-bold text-lg uppercase active:border-inset mb-1"
                  >
                    MULAI OPERASI
                  </button>
                  
                  <div className="w-full flex gap-2 mt-2">
                    <button className="win-button border-outset flex-1 p-1 text-[10px] uppercase opacity-50 cursor-not-allowed">
                      Settings
                    </button>
                    <button className="win-button border-outset flex-1 p-1 text-[10px] uppercase opacity-50 cursor-not-allowed">
                      Credits
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock Notification Overlay */}
      <AnimatePresence>
        {unlockNotification && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-10 left-1/2 -translate-x-1/2 z-[4000] max-w-md w-full"
          >
            <div className="bg-[var(--win-bg)] border-outset p-1 shadow-2xl">
              <div className="bg-[var(--win-blue)] text-white flex justify-between items-center px-1 py-0.5 mb-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span className="text-[10px] font-retro">NEW EVIDENCE UNLOCKED</span>
                </div>
                <button onClick={() => setUnlockNotification(null)}>
                  <X size={12} />
                </button>
              </div>
              <div className="p-3 bg-white border-inset">
                <p className="text-[12px] leading-tight mb-3">
                  {unlockNotification.message}
                </p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      setUnlockNotification(null);
                      if (!activeWindows.brief) toggleWindow('brief');
                      focusWindow('brief');
                    }}
                    className="win-button border-outset px-4 py-1 text-[10px] font-bold uppercase active:border-inset"
                  >
                    VIEW EVIDENCE
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[2000] bg-black/40 backdrop-blur-md flex items-center justify-center cursor-wait"
          >
            <div className="bg-[var(--win-bg)] border-outset p-6 shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full">
              <div className="title-bar w-full mb-2">
                <span className="text-[10px] px-1 font-retro">WORLD_ENGINE // PROCESSING</span>
              </div>
              <div className="flex items-center gap-4 w-full">
                <Loader2 className="w-10 h-10 text-[var(--win-blue)] animate-spin shrink-0" />
                <div className="flex-1">
                  <span className="text-[14px] font-bold block mb-1">TRANSMITTING NARATIVES...</span>
                  <p className="text-[10px] text-gray-600 leading-tight uppercase font-retro italic">
                    The World Engine is simulating public reaction and shifting political landscapes. Please standby.
                  </p>
                </div>
              </div>
              <div className="w-full h-4 border-inset bg-white p-0.5 overflow-hidden">
                <div className="h-full bg-[var(--win-blue)] animate-[loading_2s_infinite]"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-[3000] bg-black/50 flex items-center justify-center p-4"
          >
            <div className="bg-[var(--win-bg)] border-outset p-2 max-w-sm w-full shadow-2xl">
              <div className="bg-red-700 text-white flex justify-between items-center px-1 py-0.5 mb-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={14} />
                  <span className="text-[12px] font-retro">SYSTEM_FAILURE.EXE</span>
                </div>
              </div>
              <div className="p-4 bg-[var(--win-bg-light)] border-inset flex flex-col items-center text-center">
                <AlertCircle size={40} className="text-red-700 mb-3" />
                <h3 className="text-lg font-bold mb-2">COMMUNICATION_ERROR</h3>
                <p className="text-[11px] text-gray-800 mb-6 leading-tight font-sans">
                  The World Engine failed to process your request. This is likely due to an unstable connection or missing credentials.
                  <br /><br />
                  <span className="font-bold underline">Error Details:</span><br />
                   {error}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="win-button border-outset w-full py-2 font-bold text-xs uppercase active:border-inset"
                >
                  REBOOT SYSTEM
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Windows Container */}
      <div className="relative h-full w-full">
        {currentIssue && (
          <>
            <Window
              id="messenger"
              title="Inbox - Chief Editor"
              icon={<MessageSquare size={14} />}
              isOpen={activeWindows.messenger}
              onClose={() => toggleWindow('messenger')}
              zIndex={zIndices.messenger}
              onFocus={() => focusWindow('messenger')}
              initialX={40}
              initialY={60}
              width={400}
              height={350}
            >
              <div className="p-0 flex flex-col h-full bg-[var(--win-bg-light)]">
                <div className="flex-1 overflow-y-auto p-3 space-y-4 font-retro text-[13px] custom-scrollbar bg-white">
                  {/* System Message */}
                  <div className="text-center py-1">
                    <span className="text-gray-500 text-[10px] uppercase">
                      --- Encrypted Connection Established ---
                    </span>
                  </div>

                  {/* Editor Message */}
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[11px] font-bold">From: <span className="text-blue-800">CHIEF_EDITOR</span></span>
                    </div>
                    <div className="p-3 border rounded-sm bg-gray-50 text-black border-gray-300">
                      <p className="leading-normal">
                        {currentIssue.opening_narrative}
                      </p>
                    </div>
                  </div>

                  {/* Objective Message */}
                  <div className="flex flex-col gap-1 items-start mt-2">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[11px] font-bold">Subject: <span className="text-red-700">MISSION_ASSIGNMENT</span></span>
                    </div>
                    <div className="p-3 border border-red-200 bg-red-50 text-red-900 rounded-sm">
                      <p className="italic text-[12px]">
                        "{currentIssue.first_article_prompt}"
                      </p>
                    </div>
                  </div>
                  
                  {evaluation && (
                    <motion.div 
                      key={evaluation.narrative_feedback}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-3 border-outset bg-[var(--win-bg)] mt-4"
                    >
                      <div className="flex justify-between items-center mb-1 border-b border-gray-400">
                        <p className="text-[12px] font-bold">MISSION EVALUATION</p>
                        <div className="flex gap-1 text-[8px] font-bold">
                           <span className="text-blue-700">ACC: {evaluation.accuracy_score}</span>
                           <span className="text-amber-700">BAL: {evaluation.balance_score}</span>
                           <span className="text-purple-700">IMP: {evaluation.impact_score}</span>
                        </div>
                      </div>
                      <p className="text-black text-[12px] leading-tight mt-2 italic">
                        "{evaluation.narrative_feedback}"
                      </p>
                      <div className="mt-2 text-[10px] font-bold text-blue-900">
                        CREDIT EARNED: +{evaluation.truth_contribution} TRUTH
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {/* Status Bar */}
                <div className="h-6 border-inset bg-[var(--win-bg)] px-2 flex items-center justify-between">
                  <span className="text-[10px]">Secure Line</span>
                  <span className="text-[10px]">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </Window>

            <Window
              id="brief"
              title="C:\Evidence_Files"
              icon={<FileText size={14} />}
              isOpen={activeWindows.brief}
              onClose={() => toggleWindow('brief')}
              zIndex={zIndices.brief}
              onFocus={() => focusWindow('brief')}
              initialX={460}
              initialY={40}
              width={750}
              height={500}
            >
              <div className="bg-white h-full">
                <EvidenceViewer evidence={currentIssue.evidence_files} />
              </div>
            </Window>

            <Window
              id="editor"
              title="WordPad - Editorial_System"
              icon={<Newspaper size={14} />}
              isOpen={activeWindows.editor}
              onClose={() => toggleWindow('editor')}
              zIndex={zIndices.editor}
              onFocus={() => focusWindow('editor')}
              initialX={150}
              initialY={150}
              width={800}
              height={600}
            >
              <div className="bg-white h-full">
                <ArticleEditor 
                  evidenceList={currentIssue.evidence_files}
                  onSubmit={submitArticle}
                  isLoading={isLoading}
                  caseTitle={currentIssue.title}
                  caseBrief={currentIssue.brief}
                  editorInstruction={currentIssue.opening_narrative}
                />
              </div>
            </Window>

            <Window
              id="feed"
              title="WorldExplorer v1.0"
              icon={<Globe size={14} />}
              isOpen={activeWindows.feed}
              onClose={() => toggleWindow('feed')}
              zIndex={zIndices.feed}
              onFocus={() => focusWindow('feed')}
              initialX={920}
              initialY={40}
              width={450}
              height={500}
            >
              <div className="bg-white h-full">
                <SocialFeed platforms={socialPlatforms} />
              </div>
            </Window>

            <Window
              id="stats"
              title="System Telemetry"
              icon={<BarChart3 size={14} />}
              isOpen={activeWindows.stats}
              onClose={() => toggleWindow('stats')}
              zIndex={zIndices.stats}
              onFocus={() => focusWindow('stats')}
              initialX={920}
              initialY={450}
              width={500}
              height={300}
            >
              <div className="bg-white h-full">
                {worldState && (
                  <StatsViewer 
                    worldState={worldState} 
                    chainReactions={currentIssue.active_chain_reactions} 
                  />
                )}
              </div>
            </Window>

            <Window
              id="terminal"
              title="MS-DOS Prompt"
              icon={<TerminalIcon size={14} />}
              isOpen={activeWindows.terminal}
              onClose={() => toggleWindow('terminal')}
              zIndex={zIndices.terminal}
              onFocus={() => focusWindow('terminal')}
              initialX={50}
              initialY={420}
              width={400}
              height={300}
            >
              <div className="bg-black h-full p-1 border-inset">
                <Terminal onSearch={(q) => console.log("Searching...", q)} />
              </div>
            </Window>
          </>
        )}
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 w-full h-[30px] bg-[var(--win-bg)] border-t-2 border-white flex items-center px-1 z-[500] shadow-[inset_1px_1px_0px_var(--win-bg-light)]">
        <div className="flex items-center h-full relative">
          <button 
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
            className={cn(
              "win-button border-outset h-[22px] px-2 flex items-center gap-1 font-retro font-bold text-[12px] bg-[var(--win-bg)] mr-1",
              isStartMenuOpen ? "border-inset bg-[var(--win-bg-light)]" : "active:border-inset"
            )}
          >
            <div className="w-4 h-4 bg-gray-400 rounded-sm flex items-center justify-center">
              <ShieldAlert size={12} />
            </div>
            Start
          </button>

          {/* Start Menu Popup */}
          <AnimatePresence>
            {isStartMenuOpen && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="absolute bottom-[30px] left-0 w-48 bg-[var(--win-bg)] border-outset p-1 shadow-2xl z-[600]"
              >
                <div className="flex">
                  <div className="w-6 bg-gray-500 flex items-end justify-center pb-2">
                    <span className="text-[10px] text-white font-bold -rotate-90 whitespace-nowrap">REDAKSI OS</span>
                  </div>
                  <div className="flex-1 py-1">
                    <button 
                      onClick={() => {
                        handleRestart();
                        setIsStartMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[var(--win-blue)] hover:text-white group"
                    >
                      <RotateCcw size={16} className="group-hover:text-white" />
                      <span className="text-[11px] font-bold">Restart Session</span>
                    </button>
                    <div className="h-[1px] bg-gray-400 my-1"></div>
                    <button 
                      onClick={() => setIsStartMenuOpen(false)}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[var(--win-blue)] hover:text-white group"
                    >
                      <LogOut size={16} className="group-hover:text-white" />
                      <span className="text-[11px] font-bold">Close Menu</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="w-[1px] h-[20px] bg-gray-500 mx-1 border-r border-white"></div>

          <div className="flex items-center gap-1 h-full py-0.5">
            {[
              { id: "messenger", icon: <MessageSquare size={14} />, label: "Inbox" },
              { id: "brief", icon: <FileText size={14} />, label: "Evidence" },
              { id: "editor", icon: <Newspaper size={14} />, label: "WordPad" },
              { id: "feed", icon: <Globe size={14} />, label: "Web" },
              { id: "stats", icon: <BarChart3 size={14} />, label: "Metrics" },
              { id: "terminal", icon: <TerminalIcon size={14} />, label: "Prompt" },
            ].map((app) => (
              <button
                key={app.id}
                onClick={() => toggleWindow(app.id as AppId)}
                className={cn(
                  "win-button h-[22px] px-2 flex items-center gap-1 transition-all text-[11px]",
                  activeWindows[app.id as AppId] 
                    ? "border-inset bg-[var(--win-bg-light)]" 
                    : "border-outset"
                )}
              >
                {app.icon}
                <span className="hidden sm:inline">{app.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto flex items-center h-full px-1">
          <div className="flex flex-col items-end mr-4">
             <div className="text-[8px] font-bold">TRUTH LEVEL</div>
             <div className="w-24 h-2 border-inset bg-white relative">
               <motion.div 
                 animate={{ width: `${truthExposure}%` }} 
                 className="h-full bg-[var(--win-blue)]"
               />
             </div>
          </div>
          
          <div className="h-[22px] border-inset bg-[var(--win-bg)] px-2 flex items-center gap-2">
             <BackgroundMusic isGameStarted={isGameStarted} />
             <div className="flex items-center gap-1 border-l border-gray-400 pl-2">
                <ShieldCheck size={10} className="text-green-700" />
                <span className="text-[10px] font-bold">
                  {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}


