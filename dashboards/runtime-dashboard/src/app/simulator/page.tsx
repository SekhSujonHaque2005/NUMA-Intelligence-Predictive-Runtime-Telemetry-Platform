"use client";

import { useState, useEffect } from "react";
import { 
  Cpu, 
  Database, 
  ArrowRightLeft, 
  ChevronRight, 
  Terminal, 
  Zap, 
  HelpCircle,
  Lightbulb,
  ArrowUpRight,
  Globe,
  Lock,
  ArrowRight,
  Activity as ActivityIcon,
  Server,
  Gauge
} from "lucide-react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Types ---
interface MemoryBlock {
  id: string;
  nodeId: number;
  allocated: boolean;
}

interface AccessEvent {
  id: string;
  sourceNode: number;
  targetNode: number;
  latency: number;
  timestamp: number;
}

// --- Constants ---
const NUM_NODES = 2;
const BLOCKS_PER_NODE = 16;
const LOCAL_LATENCY_BASE = 80;
const REMOTE_LATENCY_BASE = 185;

export default function SimulatorPage() {
  const [nodes, setNodes] = useState<MemoryBlock[][]>([]);
  const [accessHistory, setAccessHistory] = useState<AccessEvent[]>([]);
  const [lastAccess, setLastAccess] = useState<AccessEvent | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activePath, setActivePath] = useState<string | null>(null);
  
  // Initialize memory nodes
  useEffect(() => {
    const initialNodes = Array.from({ length: NUM_NODES }, (_, nIdx) =>
      Array.from({ length: BLOCKS_PER_NODE }, (_, bIdx) => ({
        id: `node${nIdx}-block${bIdx}`,
        nodeId: nIdx,
        allocated: Math.random() > 0.6,
      }))
    );
    setNodes(initialNodes);
  }, []);

  const toggleAllocation = (nIdx: number, bIdx: number | "all") => {
    const newNodes = [...nodes];
    if (bIdx === "all") {
       const anyAllocated = newNodes[nIdx].some(b => b.allocated);
       newNodes[nIdx] = newNodes[nIdx].map(b => ({ ...b, allocated: !anyAllocated }));
    } else {
      newNodes[nIdx][bIdx].allocated = !newNodes[nIdx][bIdx].allocated;
    }
    setNodes(newNodes);
  };

  const simulateAccess = (sourceNode: number) => {
    if (isSimulating) return;
    
    const allocatedBlocks = nodes.flat().filter(b => b.allocated);
    if (allocatedBlocks.length === 0) {
      alert("Try This First: Click on some RAM blocks below to 'load data' into the machine!");
      return;
    }

    setIsSimulating(true);
    const targetBlock = allocatedBlocks[Math.floor(Math.random() * allocatedBlocks.length)];
    const isLocal = targetBlock.nodeId === sourceNode;
    
    setActivePath(`path-${sourceNode}-${targetBlock.nodeId}`);

    const latency = isLocal ? LOCAL_LATENCY_BASE + (Math.random() * 10) : REMOTE_LATENCY_BASE + (Math.random() * 20);

    const event: AccessEvent = {
      id: Math.random().toString(36).substr(2, 9),
      sourceNode,
      targetNode: targetBlock.nodeId,
      latency: Number(latency.toFixed(1)),
      timestamp: Date.now(),
    };

    setTimeout(() => {
      setLastAccess(event);
      setAccessHistory(prev => [event, ...prev].slice(0, 10));
      setIsSimulating(false);
      setActivePath(null);
    }, 800);
  };

  const getLatencyMsg = (l: number) => {
    if (l < 110) return { text: "Optimal Speed", desc: "Super Fast! The CPU found the data in its own home.", color: "text-geist-success" };
    return { text: "Degraded Speed", desc: "A bit slow. The information had to travel across the bridge.", color: "text-geist-error" };
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-accents-2 bg-background text-foreground">
      <main className="flex-1 w-full mx-auto max-w-[1700px] border-x border-accents-2">
        {/* Simplified Educational Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-x divide-accents-2 border-b border-accents-2">
           <div className="p-12 lg:p-16 col-span-2">
              <div className="flex items-center gap-2 mb-6 text-[10px] uppercase font-bold tracking-widest text-[#0070f3]">
                 <Server size={14} />
                 <span>How a Computer Thinks</span>
                 <ChevronRight size={10} className="text-accents-2" />
                 <span className="text-accents-5">Memory Playground</span>
              </div>
              <h2 className="text-7xl font-black tracking-tighter italic mb-8">Play & Learn.</h2>
              <p className="max-w-3xl text-accents-4 text-lg leading-relaxed mb-10">
                 Think of this like a delivery system. When a CPU (the brain) wants data, it checks its local library first. If it's not there, it has to travel to another node—and that takes more time!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { step: 1, icon: Database, label: "Add Information", desc: "Click the grey boxes below to fill them with data (Node 0 or 1)." },
                   { step: 2, icon: Zap, label: "Send a Request", desc: "Click 'FETCH DATA' on a CPU to ask for that information." },
                   { step: 3, icon: Lightbulb, label: "Watch the Path", desc: "See the colors move: Green means fast, Red means slow!" }
                 ].map(item => (
                   <div key={item.step} className="p-6 border border-accents-3 bg-accents-1 rounded-sm relative group hover:border-[#0070f3] transition-all">
                      <div className="absolute top-3 right-3 text-sm font-black text-accents-2 italic group-hover:text-[#0070f3]">0{item.step}</div>
                      <item.icon size={20} className="text-accents-6 mb-4" />
                      <h4 className="text-xs font-black uppercase tracking-widest mb-2 border-b border-accents-2 pb-1 inline-block">{item.label}</h4>
                      <p className="text-xs text-accents-5 font-bold italic leading-relaxed">{item.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
           
           {/* Speed Gauge - Educational View */}
           <div className="p-12 lg:p-16 bg-accents-1/30 flex flex-col justify-center">
              <div className="vercel-card p-10 border-4 border-accents-2 relative overflow-hidden bg-background">
                 <div className="absolute top-0 right-0 p-5 opacity-10"><Gauge size={60} /></div>
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-accents-5 mb-8 border-b border-accents-2 pb-3 italic">Speed Result</h4>
                 
                 {lastAccess ? (
                   <div className="space-y-8">
                      <div className="flex items-baseline gap-3">
                        <span className={`text-[90px] font-black italic tracking-tighter tabular-nums leading-none ${lastAccess.sourceNode === lastAccess.targetNode ? 'text-geist-success' : 'text-geist-error'}`}>
                          {lastAccess.latency.toFixed(0)}
                        </span>
                        <span className="text-xl font-bold text-accents-4 uppercase tracking-widest">ns</span>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between text-xs uppercase font-black tracking-widest italic">
                            <span className={getLatencyMsg(lastAccess.latency).color}>{getLatencyMsg(lastAccess.latency).text}</span>
                            <span className="text-accents-4">{lastAccess.sourceNode === lastAccess.targetNode ? "LOCAL" : "REMOTE"}</span>
                         </div>
                         <div className="h-4 w-full bg-accents-2 rounded-full overflow-hidden border border-accents-3 p-0.5">
                            <div 
                              className={`h-full transition-all duration-1000 rounded-full ${lastAccess.latency < 100 ? "bg-geist-success" : "bg-geist-error"}`} 
                              style={{ width: `${Math.max(10, 100 - (lastAccess.latency - 80) / 1.5)}%` }}
                            />
                         </div>
                         <p className="text-[10px] text-accents-4 italic font-bold leading-relaxed">{getLatencyMsg(lastAccess.latency).desc}</p>
                      </div>
                   </div>
                 ) : (
                   <div className="py-20 flex flex-col items-center justify-center gap-6 text-accents-3">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-accents-2 flex items-center justify-center animate-[spin_5s_linear_infinite]">
                         <Zap size={24} className="opacity-50" />
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-center italic">Awaiting your first<br/>instruction click...</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* High-Contrast SVG Architecture Diagram */}
        <div className="p-10 lg:p-24 bg-background relative overflow-hidden min-h-[800px] flex items-center justify-center">
           {/* Stronger Grid for Visibility */}
           <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
           
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
             <defs>
               <filter id="edu-glow">
                 <feGaussianBlur stdDeviation="5" result="blur"/>
                 <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
               </filter>
             </defs>

             {/* Path: CPU 0 -> RAM 0 (Local) */}
             <path 
               d="M 400 350 L 400 500" 
               stroke={activePath === "path-0-0" ? "#0070f3" : "#333"} 
               strokeWidth={activePath === "path-0-0" ? "8" : "3"}
               fill="none"
               strokeDasharray={activePath === "path-0-0" ? "none" : "8 8"}
               className="transition-all duration-500"
               filter={activePath === "path-0-0" ? "url(#edu-glow)" : "none"}
             />
             
             {/* Path: CPU 1 -> RAM 1 (Local) */}
             <path 
               d="M 1200 350 L 1200 500" 
               stroke={activePath === "path-1-1" ? "#0070f3" : "#333"} 
               strokeWidth={activePath === "path-1-1" ? "8" : "3"}
               fill="none"
               strokeDasharray={activePath === "path-1-1" ? "none" : "8 8"}
               className="transition-all duration-500"
               filter={activePath === "path-1-1" ? "url(#edu-glow)" : "none"}
             />

             {/* REMOTE BUS: Pulse RED for travel */}
             <path 
               d="M 400 350 L 800 350 L 1200 350 L 1200 500" 
               stroke={activePath === "path-0-1" ? "#ee0000" : "#333"} 
               strokeWidth={activePath === "path-0-1" ? "8" : "3"}
               fill="none"
               strokeDasharray={activePath === "path-0-1" ? "none" : "12 12"}
               className="transition-all duration-500"
               filter={activePath === "path-0-1" ? "url(#edu-glow)" : "none"}
             />

             <path 
               d="M 1200 350 L 800 350 L 400 350 L 400 500" 
               stroke={activePath === "path-1-0" ? "#ee0000" : "#333"} 
               strokeWidth={activePath === "path-1-0" ? "8" : "3"}
               fill="none"
               strokeDasharray={activePath === "path-1-0" ? "none" : "12 12"}
               className="transition-all duration-500"
               filter={activePath === "path-1-0" ? "url(#edu-glow)" : "none"}
             />
           </svg>

           <div className="relative z-10 w-full grid grid-cols-2 gap-[450px]">
              {/* NODE 0 */}
              <div className="flex flex-col items-center gap-24">
                 <div className={`w-72 p-10 border-4 transition-all duration-500 bg-background relative ${activePath?.startsWith("path-0") ? "border-[#0070f3] scale-105 shadow-[0_0_40px_#0070f344]" : "border-accents-2"}`}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-foreground text-background text-xs font-black uppercase tracking-[0.2em] italic">Processor A</div>
                    <Cpu size={40} className="mx-auto mb-8 text-accents-5" />
                    <button 
                      onClick={() => simulateAccess(0)}
                      disabled={isSimulating}
                      className="w-full bg-[#0070f3] text-background text-sm font-black uppercase tracking-widest py-4 rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_0_#0059c1]"
                    >
                      FETCH DATA
                    </button>
                    <p className="mt-4 text-center text-[10px] uppercase font-black text-accents-5 tracking-widest underline decoration-accents-2 underline-offset-4 decoration-2 italic">Direct Node Path</p>
                 </div>

                 <div className="w-80 p-8 border-2 border-accents-3 bg-accents-1 rounded">
                    <div className="flex items-center justify-between mb-6">
                       <span className="text-xs font-black uppercase tracking-widest italic decoration-2 decoration-geist-success underline underline-offset-4">Safe Storage [A]</span>
                       <button onClick={() => toggleAllocation(0, "all")} className="text-[10px] text-[#0070f3] font-black uppercase hover:underline">Clear All</button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                       {nodes[0]?.map((block, bIdx) => (
                         <button
                           key={block.id}
                           onClick={() => toggleAllocation(0, bIdx)}
                           className={`h-12 border-2 transition-all duration-200 flex items-center justify-center ${
                             block.allocated ? "bg-foreground border-foreground text-background" : "bg-accents-1 border-accents-2 text-accents-2 hover:border-accents-4"
                           }`}
                         >
                            <div className={`w-2 h-2 rounded-full ${block.allocated ? 'bg-background' : 'bg-accents-2 opacity-50'}`} />
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              {/* NODE 1 */}
              <div className="flex flex-col items-center gap-24">
                 <div className={`w-72 p-10 border-4 transition-all duration-500 bg-background relative ${activePath?.startsWith("path-1") ? "border-[#0070f3] scale-105 shadow-[0_0_40px_#0070f344]" : "border-accents-2"}`}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-foreground text-background text-xs font-black uppercase tracking-[0.2em] italic">Processor B</div>
                    <Cpu size={40} className="mx-auto mb-8 text-accents-5" />
                    <button 
                      onClick={() => simulateAccess(1)}
                      disabled={isSimulating}
                      className="w-full bg-[#0070f3] text-background text-sm font-black uppercase tracking-widest py-4 rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_0_#0059c1]"
                    >
                      FETCH DATA
                    </button>
                    <p className="mt-4 text-center text-[10px] uppercase font-black text-accents-5 tracking-widest underline decoration-accents-2 underline-offset-4 decoration-2 italic">Direct Node Path</p>
                 </div>

                 <div className="w-80 p-8 border-2 border-accents-3 bg-accents-1 rounded">
                    <div className="flex items-center justify-between mb-6">
                       <span className="text-xs font-black uppercase tracking-widest italic decoration-2 decoration-geist-success underline underline-offset-4">Safe Storage [B]</span>
                       <button onClick={() => toggleAllocation(1, "all")} className="text-[10px] text-[#0070f3] font-black uppercase hover:underline">Clear All</button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                       {nodes[1]?.map((block, bIdx) => (
                         <button
                           key={block.id}
                           onClick={() => toggleAllocation(1, bIdx)}
                           className={`h-12 border-2 transition-all duration-200 flex items-center justify-center ${
                             block.allocated ? "bg-foreground border-foreground text-background" : "bg-accents-1 border-accents-2 text-accents-2 hover:border-accents-4"
                           }`}
                         >
                            <div className={`w-2 h-2 rounded-full ${block.allocated ? 'bg-background' : 'bg-accents-2 opacity-50'}`} />
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Central Hub - High Contrast */}
           <div className="absolute top-[340px] left-1/2 -translate-x-1/2 text-center">
              <div className={`p-6 border-4 transition-all duration-500 rounded-full inline-flex bg-background ${activePath?.includes("remote") || (activePath && activePath.split('-')[1] !== activePath.split('-')[2]) ? "border-geist-error scale-125 shadow-[0_0_50px_#ee000066]" : "border-accents-2"}`}>
                <ArrowRightLeft size={32} className={activePath?.includes("remote") || (activePath && activePath.split('-')[1] !== activePath.split('-')[2]) ? "text-geist-error animate-pulse" : "text-accents-3"} />
              </div>
              <p className="mt-6 text-sm font-black uppercase tracking-[0.5em] italic text-accents-5">The Communication Bridge</p>
              <p className="text-[10px] text-accents-3 font-bold uppercase mt-2">Crossing this bridge creates "Lag"</p>
           </div>
        </div>

        {/* Detailed Logs & Strategy - Educational Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-accents-2 border-y border-accents-2">
           <div className="p-16 space-y-10">
              <div className="flex items-center justify-between border-b-2 border-accents-2 pb-6">
                 <h3 className="text-3xl font-black italic tracking-tighter uppercase underline decoration-geist-success underline-offset-[12px] decoration-4">What Just Happened?</h3>
                 <Terminal size={20} className="text-[#0070f3]" />
              </div>
              <div className="space-y-4">
                 {accessHistory.map((e, idx) => (
                   <div key={e.id} className="p-6 border-2 border-accents-2 bg-accents-1/30 flex items-center justify-between group transition-all hover:bg-accents-1/60 hover:border-accents-5">
                      <div className="flex items-center gap-6">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black italic ${e.sourceNode === e.targetNode ? "bg-geist-success text-background shadow-[0_0_15px_#0070f344]" : "bg-geist-error text-background shadow-[0_0_15px_#ee000044]"}`}>
                            {idx + 1}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-widest text-foreground leading-none mb-1">Processor {e.sourceNode === 0 ? 'A' : 'B'} fetched from Storage {e.targetNode === 0 ? 'A' : 'B'}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${e.sourceNode === e.targetNode ? 'text-geist-success' : 'text-geist-error italic underline decoration-geist-error decoration-1'}`}>
                               {e.sourceNode === e.targetNode ? '✓ SHORT_PATH_SUCCESS' : '⚠ REMOTE_BRIDGE_TRAVERSAL'}
                            </span>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className={`text-xl font-black italic tabular-nums ${e.sourceNode === e.targetNode ? "text-foreground" : "text-geist-error underline"}`}>{e.latency-80 < 5 ? 'FAST' : `+${(e.latency-80).toFixed(0)}ns Lag`}</span>
                         <p className="text-[9px] font-bold text-accents-3 uppercase tracking-tighter mt-1">{e.latency} Total nanoseconds</p>
                      </div>
                   </div>
                 ))}
                 {accessHistory.length === 0 && (
                   <div className="py-24 text-center border-2 border-dashed border-accents-2 text-accents-3 font-black uppercase tracking-[0.3em] italic text-xs opacity-50">Instruction Log Empty... Use the diagram above!</div>
                 )}
              </div>
           </div>

           <div className="p-16 bg-accents-1/10 space-y-12">
              <div className="p-10 border-4 border-dashed border-[#0070f3/20] bg-background relative overflow-hidden flex flex-col items-center text-center">
                 <div className="p-4 bg-geist-success/10 rounded-full mb-6">
                    <Lightbulb size={32} className="text-[#0070f3]" />
                 </div>
                 <h4 className="text-xl font-black uppercase tracking-widest italic mb-6">The Golden Rule of Performance</h4>
                 <p className="text-lg italic text-accents-5 leading-relaxed max-w-md">
                    "Always keep your data close to your processor. Crossing the red center bridge is like taking the long way home—it works, but it slows everything down!"
                 </p>
                 <div className="mt-10 flex gap-4">
                    <div className="px-6 py-2 bg-geist-success text-background font-black uppercase text-xs rounded-full italic shadow-lg">Rule 1: LOCALITY-FIRST</div>
                 </div>
              </div>

              <div className="vercel-card p-10 border-2 border-accents-2 flex justify-between items-center group hover:bg-accents-1 transition-colors">
                 <div>
                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-accents-4 mb-2">Efficiency Rating</h5>
                    <p className="text-3xl font-black italic tracking-tighter">Your Demo Flow:</p>
                    <p className={`text-2xl font-black mt-2 underline decoration-4 ${accessHistory.length > 0 && accessHistory[0].sourceNode === accessHistory[0].targetNode ? 'text-geist-success decoration-geist-success' : 'text-geist-error decoration-geist-error'}`}>
                       {accessHistory.length === 0 ? 'AWAITING_INPUT' : accessHistory[0].sourceNode === accessHistory[0].targetNode ? 'FAST_IS_BETTER' : 'AVOID_BRIDGE'}
                    </p>
                 </div>
                 <ArrowUpRight size={40} className="text-accents-2 group-hover:text-foreground transition-all group-hover:translate-x-2 group-hover:-translate-y-2" />
              </div>
           </div>
        </div>
      </main>

      {/* Professional Footer (Clean) */}
      <footer className="bg-background border-t border-accents-2 p-20 pt-32">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3 text-2xl font-black italic uppercase tracking-tighter">
              <ActivityIcon size={24} className="text-foreground" />
              NUMA Intelligence
            </div>
            <p className="text-accents-5 max-w-sm italic font-bold leading-relaxed">
              Empowering developers to build faster, more efficient software on complex hardware architectures through predictive intelligence.
            </p>
            <div className="flex gap-6">
              <Link href="/docs" className="w-10 h-10 border border-accents-2 rounded grid place-items-center hover:bg-accents-1 hover:border-foreground transition-all group cursor-pointer" title="Global Connectivity">
                 <Globe size={18} className="text-accents-3 group-hover:text-foreground" />
              </Link>
              <Link href="/docs" className="w-10 h-10 border border-accents-2 rounded grid place-items-center hover:bg-accents-1 hover:border-foreground transition-all group cursor-pointer" title="Enterprise Security">
                 <Lock size={18} className="text-accents-3 group-hover:text-foreground" />
              </Link>
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">Resources</h4>
            <ul className="space-y-4 text-sm text-accents-5 font-bold italic">
               <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
               <li><Link href="/simulator" className="hover:text-foreground">Learning Center</Link></li>
               <li><Link href="/docs" className="hover:text-foreground">API Reference</Link></li>
               <li><Link href="/docs" className="hover:text-foreground">Architecture</Link></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">Connect</h4>
            <ul className="space-y-4 text-sm text-accents-5 font-bold italic">
               <li><a href="https://github.com/Sekhsujonhaque2005" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-2">GitHub <ArrowRight size={12} /></a></li>
               <li><a href="mailto:sksujonhaque@gmail.com" className="hover:text-foreground">Contact Support</a></li>
               <li><Link href="/docs" className="hover:text-foreground">Hardware Partners</Link></li>
               <li><Link href="/docs" className="hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1700px] mx-auto mt-20 pt-10 border-t border-accents-2 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-bold text-accents-4 uppercase tracking-[0.2em] italic">© 2026 NUMA Intelligence Platform. All Rights Reseved.</p>
        </div>
      </footer>
    </div>
  );
}
