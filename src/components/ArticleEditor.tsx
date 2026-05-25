import React, { useState } from "react";
import { Send, Type, AlignLeft, Info, CheckCircle2, ShieldAlert } from "lucide-react";
import { Evidence } from "../types";
import { cn } from "../lib/utils";

interface ArticleEditorProps {
  evidenceList: Evidence[];
  onSubmit: (article: { headline: string; body: string; evidence_used: string[] }) => void;
  isLoading: boolean;
  caseTitle?: string;
  caseBrief?: string;
  editorInstruction?: string;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ 
  evidenceList, 
  onSubmit, 
  isLoading,
  caseTitle,
  caseBrief,
  editorInstruction
}) => {
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);

  const handleToggleEvidence = (id: string) => {
    setSelectedEvidence(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    console.log("Publish button clicked in ArticleEditor");
    if (!headline || !body) {
      console.warn("Publish blocked: headline or body missing");
      return;
    }
    onSubmit({ headline, body, evidence_used: selectedEvidence });
  };

  return (
    <div className="flex h-full bg-[var(--win-bg)] font-retro">
      {/* Editor Main Area */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-white border-inset m-1">
        <div className="mb-6 border-b border-gray-300 pb-3 flex justify-between items-end">
          <div>
            <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-tight">WordPad Draft Processor</div>
            <h2 className="text-black text-2xl font-bold uppercase">
              {caseTitle ? `DRAFT: ${caseTitle}` : "NEW_ARTICLE"}
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 uppercase flex items-center gap-2">
              <Type size={12} /> HEADLINE
            </label>
            <input 
              type="text" 
              value={headline}
              disabled={isLoading}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Type your story head here..."
              className="w-full bg-white border-inset p-3 text-black font-retro text-lg focus:outline-none placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 uppercase flex items-center gap-2">
              <AlignLeft size={12} /> BODY CONTENT
            </label>
            <textarea 
              value={body}
              disabled={isLoading}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Once upon a time in a corrupted world..."
              className="w-full bg-white border-inset p-3 text-black font-sans text-sm min-h-[300px] h-full focus:outline-none placeholder:text-gray-300 resize-y"
            />
          </div>
        </div>
      </div>

      {/* Sidebar: Referenced Evidence */}
      <div className="w-72 flex flex-col p-2 bg-[var(--win-bg)]">
        <div className="text-[10px] font-bold mb-2 uppercase tracking-tight border-b border-gray-400 pb-1">ATTACHMENTS</div>
        <p className="text-[9px] text-gray-600 mb-4 italic">Check files to cite in your story.</p>
        
        <div className="flex-1 space-y-1 overflow-y-auto bg-[var(--win-bg-light)] border-inset p-1">
          {(evidenceList || []).map((evd) => (
            <button
              key={evd.id}
              onClick={() => handleToggleEvidence(evd.id)}
              className={cn(
                "w-full text-left p-2 border transition-all flex items-start justify-between gap-1 group active:border-inset",
                selectedEvidence.includes(evd.id)
                  ? "bg-blue-100 border-inset"
                  : "bg-[var(--win-bg)] border-outset hover:border-blue-400"
              )}
            >
              <div className="overflow-hidden">
                <div className={cn(
                  "text-[10px] font-bold uppercase truncate transition-colors",
                  selectedEvidence.includes(evd.id) ? "text-blue-900" : "text-black"
                )}>
                  {evd.title}
                </div>
                <div className="text-[8px] text-gray-500">{evd.category}</div>
              </div>
              {selectedEvidence.includes(evd.id) && <CheckCircle2 size={12} className="text-blue-800 shrink-0 mt-0.5" />}
            </button>
          ))}
        </div>

        <div className="mt-4 border-outset p-3 bg-[var(--win-bg)]">
           <div className="text-[10px] font-bold mb-1 uppercase">PUBLISH</div>
           <p className="text-[8px] text-red-900 leading-tight mb-3">WARNING: Stories trigger real-time consequences.</p>
           <button
             disabled={isLoading || !headline || !body}
             onClick={handleSubmit}
             className={cn(
               "win-button border-outset w-full py-2 font-bold text-[12px] uppercase flex items-center justify-center gap-2 active:border-inset disabled:opacity-50 disabled:cursor-not-allowed",
               isLoading || !headline || !body
                ? "text-gray-500"
                : "text-black "
             )}
           >
             {isLoading ? "WAIT..." : "PUBLISH NOW"}
             <Send size={12} />
           </button>
        </div>
      </div>
    </div>
  );
};
