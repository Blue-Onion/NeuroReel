"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { 
  Play, 
  Settings, 
  Terminal, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  Video,
  Clapperboard,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductionState } from "@/lib/state-manager";

export default function DashboardPage() {
  const params = useParams();
  const id = params.id as string;
  const [state, setState] = useState<ProductionState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/production/${id}`);
        if (res.ok) {
          const data = await res.json();
          setState(data);
        }
      } catch (err) {
        console.error("Polling failed", err);
      }
    };

    const interval = setInterval(poll, 2000);
    poll(); // initial check

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state?.logs]);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 rounded-3xl">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12 px-6 rounded-3xl overflow-hidden transition-all duration-700 animate-in fade-in">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        
        {/* Left Column: Progress & Logs */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900 border-slate-800 p-6 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold tracking-widest text-blue-400 uppercase">
                <span>Production Progress</span>
                <span>{Math.round(state.progress)}%</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-4 border-y border-slate-800">
              <div className={`p-2 rounded-lg ${state.status === 'processing' ? 'bg-blue-900/50 text-blue-400' : state.status === 'failed' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>
                {state.status === 'processing' ? <Loader2 className="animate-spin" /> : state.status === 'failed' ? <AlertCircle /> : <CheckCircle />}
              </div>
              <div>
                <p className="font-bold">
                  {state.status === 'processing' ? 'Engine is Running' : state.status === 'failed' ? 'Production Failed' : 'Production Complete'}
                </p>
                <p className="text-xs text-slate-400">{state.id}</p>
              </div>
            </div>

            {/* Micro-Terminal for Director Logs */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                <Terminal size={14} /> Director's Live Feed
              </h3>
              <div 
                ref={scrollRef}
                className="h-96 overflow-y-auto bg-black/50 rounded-xl p-4 font-mono text-[11px] leading-relaxed border border-slate-800 custom-scrollbar"
              >
                {state.logs.map((log, i) => (
                  <div key={i} className={`mb-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : log.type === 'tool_call' ? 'text-yellow-400' : 'text-slate-400'}`}>
                    <span className="text-slate-600 mr-2">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                    <span className="font-semibold">{log.message}</span>
                  </div>
                ))}
                {state.status === 'processing' && (
                  <div className="flex gap-1 mt-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Scenes & Output */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Output Preview */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Clapperboard className="text-blue-500" /> Production Studio
            </h2>
            <Card className="aspect-video bg-black rounded-3xl overflow-hidden border-4 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center relative group">
              {state.status === 'completed' ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-slate-900 to-slate-800">
                   <div className="text-center space-y-6">
                      <div className="p-10 bg-blue-600/20 rounded-full text-blue-500 inline-block ring-4 ring-blue-500/30">
                        <Play size={80} fill="currentColor" />
                      </div>
                      <h3 className="text-3xl font-Archivo font-bold">Watch Your Cinematic Masterpiece</h3>
                      <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-lg transition-all shadow-xl hover:scale-105">
                        Download Export (.mp4)
                      </button>
                   </div>
                </div>
              ) : state.status === 'failed' ? (
                <div className="text-center space-y-4 p-8">
                   <AlertCircle size={64} className="text-red-500 mx-auto" />
                   <h3 className="text-xl font-bold">Production Halted</h3>
                   <p className="text-slate-400">{state.error || "An unknown error occurred during generation."}</p>
                </div>
              ) : (
                <div className="text-center space-y-6 max-w-sm px-6">
                  <div className="relative inline-block">
                    <Video size={64} className="text-slate-700 animate-pulse" />
                    <Settings 
                      size={24} 
                      className="absolute -top-1 -right-1 text-blue-500 animate-[spin_3s_linear_infinite]" 
                    />
                  </div>
                  <p className="text-slate-400 font-medium italic">
                    "The Director is currently coordinating the sub-agents to render your vision..."
                  </p>
                </div>
              )}
            </Card>
          </section>

          {/* Scene Breakdown */}
          <section className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" /> Script & Storyboard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.scenes.length > 0 ? (
                state.scenes.map((scene) => (
                  <Card 
                    key={scene.id} 
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                      scene.status === 'completed' 
                      ? 'bg-blue-900/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                      : 'bg-slate-900/50 border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {scene.id}
                      </div>
                      {scene.status === 'completed' && <CheckCircle className="text-green-500" size={18} />}
                      {scene.status === 'processing' && <Loader2 className="animate-spin text-blue-500" size={18} />}
                    </div>
                    <h4 className="font-bold mb-2 text-blue-400">{scene.title}</h4>
                    <p className="text-slate-400 text-[13px] line-clamp-3 leading-relaxed">
                      {scene.content}
                    </p>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                  <AlertCircle className="mx-auto mb-3 text-slate-700" size={32} />
                  <p className="text-slate-600 font-medium">No scenes generated yet. Writing script...</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
