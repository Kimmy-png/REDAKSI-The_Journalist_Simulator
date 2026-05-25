import React, { useState, useEffect } from "react";
import { FileText, ShieldAlert, CheckCircle, AlertTriangle, Table as TableIcon } from "lucide-react";
import { Evidence } from "../types";
import { cn } from "../lib/utils";
import * as XLSX from "xlsx";

interface ExcelViewerProps {
  url: string;
}

const ExcelViewer: React.FC<ExcelViewerProps> = ({ url }) => {
  const [data, setData] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExcel = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch excel file");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        // Using raw: false to get formatted strings from cells
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false }) as any[][];
        setData(jsonData);
      } catch (err) {
        console.error("Error loading excel:", err);
        setError("Could not parse data stream. Encryption or corruption detected.");
      } finally {
        setLoading(false);
      }
    };
    loadExcel();
  }, [url]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 animate-pulse bg-gray-100">
        <TableIcon size={32} className="mb-4" />
        <span className="text-[10px] font-retro tracking-widest uppercase">Opening Spreadsheet...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-gray-100">
        <AlertTriangle size={32} className="mb-4 text-red-600" />
        <span className="text-[10px] font-retro uppercase text-center max-w-[240px] tracking-tight">{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden border-inset bg-white">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse font-sans text-[11px] whitespace-nowrap">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-200 border-b border-gray-400">
              <th className="p-1 w-8 bg-gray-300 border-r border-gray-400 text-center text-[9px] font-bold"></th>
              {data[0]?.map((cell, i) => (
                <th key={i} className="p-1 px-3 text-black border-r border-gray-400 uppercase font-bold bg-gray-200 min-w-[100px]">
                  {String(cell || `COL_${i + 1}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, i) => (
              <tr key={i} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                <td className="p-1 bg-gray-200 border-r border-gray-400 text-center text-[9px] font-bold text-gray-600">{i + 1}</td>
                {row.map((cell, j) => (
                  <td key={j} className="p-1 px-3 text-gray-800 border-r border-gray-100">
                    {String(cell || "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-1 border-t border-gray-400 bg-gray-100 flex justify-between items-center text-[9px] font-retro text-gray-600">
        <div className="flex gap-4">
          <span>Sheet1</span>
          <span>Ready</span>
        </div>
        <span>TOTAL: {data.length} ROWS</span>
      </div>
    </div>
  );
};

const FileContentLoader: React.FC<{ url: string; fallbackText: string }> = ({ url, fallbackText }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (res.ok) {
          const text = await res.text();
          setContent(text);
        } else {
          setContent(fallbackText);
        }
      } catch (err) {
        setContent(fallbackText);
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [url, fallbackText]);

  if (loading) {
    return <div className="text-gray-400 text-[10px] animate-pulse font-retro">Reading disk...</div>;
  }

  return (
    <pre className="font-mono text-xs text-gray-800 leading-relaxed whitespace-pre-wrap break-words bg-transparent border-none p-0 m-0">
      {content}
    </pre>
  );
};

interface EvidenceViewerProps {
  evidence: Evidence[];
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ evidence = [] }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const selected = (evidence || []).find(e => e.id === selectedId);

  // Reset page when selection changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedId]);

  // Reset visibility when selection or page changes
  useEffect(() => {
    // Reset image display if it was hidden by previous error
    const img = document.querySelector('.evidence-image') as HTMLImageElement;
    if (img) {
      img.style.display = 'block';
      const fallback = img.nextElementSibling as HTMLElement;
      if (fallback) fallback.style.display = 'none';
    }
  }, [selectedId, currentPage]);

  const images = selected?.pages || (selected?.asset ? [selected.asset] : []);
  const currentAsset = images[currentPage] || selected?.asset;
  const hasPages = images.length > 1;

  return (
    <div className="flex h-full bg-[var(--win-bg)] font-retro">
      {/* Evidence List */}
      <div className="w-56 border-r border-gray-400 p-1 flex flex-col bg-[var(--win-bg)]">
        <div className="text-[10px] font-bold mb-2 px-2 uppercase tracking-tight border-b border-gray-400 pb-1">
          EVIDENCE_DRIVE (C:)
        </div>
        <div className="flex-1 space-y-0.5 overflow-y-auto bg-white border-inset p-0.5">
          {(evidence || []).map((evd) => (
            <button
              key={evd.id}
              onClick={() => setSelectedId(evd.id)}
              className={cn(
                "w-full text-left p-1.5 transition-all flex items-center gap-2 group",
                selectedId === evd.id 
                  ? "bg-blue-800 text-white" 
                  : "bg-transparent text-black hover:bg-gray-100"
              )}
            >
              <FileText 
                size={14} 
                className={cn(
                  "shrink-0",
                  selectedId === evd.id ? "text-white" : "text-gray-600"
                )} 
              />
              <div className="overflow-hidden">
                <div className="text-[11px] font-bold truncate">
                  {evd.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Viewer */}
      <div className="flex-1 p-4 overflow-y-auto bg-white border-inset m-1 relative">
        {selected ? (
          <div className="max-w-2xl mx-auto relative z-10 font-sans">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] font-bold text-gray-500 uppercase">SOURCE: {selected.source}</div>
                <div className={cn(
                  "px-2 py-0.5 text-[9px] font-bold border-inset flex items-center gap-1",
                  selected.reliability === "TINGGI" || selected.reliability === "VERIFIED" ? "bg-green-100 text-green-900" :
                  selected.reliability === "SEDANG" || selected.reliability === "DISPUTED" ? "bg-amber-100 text-amber-900" :
                  "bg-red-100 text-red-900"
                )}>
                  {selected.reliability}
                </div>
              </div>
              <h2 className="text-black font-retro text-2xl font-bold uppercase mb-1">
                {selected.title}
              </h2>
              <div className="text-[9px] text-gray-400 uppercase flex justify-between">
                <span>LOCATION: {currentAsset || "INTERNAL"}</span>
                {hasPages && (
                  <span className="text-blue-600 font-bold">PAGE {currentPage + 1} OF {images.length}</span>
                )}
              </div>
            </div>

            <div className="text-black">
              <div className="bg-white p-4 border rounded-sm min-h-[300px]">
                {currentAsset && currentAsset.endsWith('.xlsx') ? (
                  <ExcelViewer url={currentAsset} />
                ) : currentAsset && (currentAsset.endsWith('.jpg') || currentAsset.endsWith('.jpeg') || currentAsset.endsWith('.png') || currentAsset.endsWith('.webp')) ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative border-4 border-gray-100 shadow-xl overflow-hidden group">
                      <img 
                        src={currentAsset} 
                        alt={selected.title}
                        className="max-w-full h-auto evidence-image"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="hidden absolute inset-0 bg-gray-100 flex-col items-center justify-center p-6 text-center">
                        <ShieldAlert size={48} className="text-amber-500 mb-4" />
                        <p className="text-[14px] font-bold uppercase mb-2">Image Stream Intercepted</p>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          The requested image asset {currentAsset} could not be loaded directly. 
                          It may be stored on an external encrypted drive.
                        </p>
                      </div>
                    </div>

                    {/* Pagination Controls */}
                    {hasPages && (
                      <div className="flex gap-2 w-full justify-center mt-2 pb-4">
                        <button 
                          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                          disabled={currentPage === 0}
                          className="px-4 py-1 bg-gray-200 border-inset text-[10px] font-bold uppercase disabled:opacity-50"
                        >
                          PREV PAGE
                        </button>
                        <div className="flex items-center px-4 bg-gray-100 text-[10px] font-bold border-inset">
                          {currentPage + 1} / {images.length}
                        </div>
                        <button 
                          onClick={() => setCurrentPage(prev => Math.min(images.length - 1, prev + 1))}
                          disabled={currentPage === images.length - 1}
                          className="px-4 py-1 bg-gray-200 border-inset text-[10px] font-bold uppercase disabled:opacity-50"
                        >
                          NEXT PAGE
                        </button>
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 border w-full">
                      <p className="text-[12px] leading-relaxed text-gray-700 italic">
                        {selected.content}
                      </p>
                    </div>
                  </div>
                ) : currentAsset && currentAsset.endsWith('.pdf') ? (
                  <iframe 
                    src={currentAsset} 
                    className="w-full h-[600px] border-none bg-white shadow-inner"
                    title={selected.title}
                  />
                ) : currentAsset && (currentAsset.endsWith('.txt') || currentAsset.endsWith('.decrypt')) ? (
                  <FileContentLoader url={currentAsset} fallbackText={selected.content} />
                ) : (
                  <pre className="font-mono text-xs text-gray-800 whitespace-pre-wrap break-words bg-transparent border-none p-0 m-0">
                    {selected.content}
                  </pre>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-[9px] text-gray-400">
              <div>FILE_ID: {selected.id}</div>
              <div>TAG: {selected.category}</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-300">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="text-[12px] font-retro uppercase tracking-widest text-center max-w-xs">
              Select a file to preview content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

