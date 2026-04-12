"use client";

import { 
  Activity, 
  Cpu, 
  Shield, 
  Zap, 
  ArrowRight,
  Monitor,
  Database,
  Layers,
  BarChart3,
  Network,
  Cpu as CpuIcon,
  Globe,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PortalCard = ({ icon: Icon, title, desc, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`p-10 border transition-all cursor-pointer group relative overflow-hidden ${
      active ? 'bg-accents-1 border-foreground' : 'bg-background border-accents-2 hover:bg-accents-1/50'
    }`}
  >
     <div className="relative z-10">
        <div className={`p-3 rounded-sm w-fit mb-8 transition-colors ${active ? 'bg-foreground text-background' : 'bg-accents-1 group-hover:bg-accents-2'}`}>
           <Icon size={24} />
        </div>
        <h3 className="text-2xl font-black italic tracking-tighter mb-4">{title}</h3>
        <p className="text-sm text-accents-5 leading-relaxed font-bold italic opacity-80">{desc}</p>
     </div>
  </div>
);

export default function WhitepaperPortal() {
  const [activeSegment, setActiveSegment] = useState("foundations");

  return (
    <div className="min-h-screen bg-background text-foreground font-serif selection:bg-accents-2">
      <main className="max-w-[1700px] mx-auto border-x border-accents-2 min-h-[calc(100vh-80px)]">
        {/* Hero Segment */}
        <section className="p-24 border-b border-accents-2 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <div className="inline-flex items-center gap-3 px-6 py-2 border border-accents-2 bg-accents-1/30 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 italic text-accents-5">
              Engineering Publication Series
           </div>
           <h1 className="text-8xl font-black italic tracking-tighter mb-10 max-w-4xl mx-auto">
              Architectural <br/>
              <span className="text-accents-3 underline decoration-foreground underline-offset-16">Deep-Dives.</span>
           </h1>
           <p className="text-xl text-accents-5 max-w-2xl mx-auto leading-relaxed italic font-bold">
              Explore the theoretical foundations and engineering decisions behind the world's first predictive NUMA-aware telemetry engine.
           </p>
        </section>

        {/* Knowledge Segments */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-accents-2 border-b border-accents-2">
           <PortalCard 
              active={activeSegment === "foundations"}
              onClick={() => setActiveSegment("foundations")}
              icon={Layers} 
              title="Architectural Foundations" 
              desc="The core 'Push-Broadcast' design model and distributed telemetry pipeline."
           />
           <PortalCard 
              active={activeSegment === "theory"}
              onClick={() => setActiveSegment("theory")}
              icon={Network} 
              title="NUMA Theory" 
              desc="Why memory distance matters and the physics of cross-node CPU latency."
           />
           <PortalCard 
              active={activeSegment === "pipeline"}
              onClick={() => setActiveSegment("pipeline")}
              icon={Zap} 
              title="The Life of a Metric" 
              desc="Following a data packet from a CPU register to the React dashboard interface."
           />
           <PortalCard 
              active={activeSegment === "enterprise"}
              onClick={() => setActiveSegment("enterprise")}
              icon={Shield} 
              title="Enterprise Scaling" 
              desc="Hardware requirements and security protocols for 10,000+ nodes."
           />
        </section>

        {/* Dynamic Content Area */}
        <section className="p-24 bg-accents-1/10 min-h-[600px] relative">
           {activeSegment === 'foundations' && (
             <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-5xl font-black italic tracking-tighter mb-12 underline decoration-accents-2 underline-offset-12">01. Architectural Foundations</h2>
                <div className="space-y-12 text-xl text-accents-5 leading-loose font-bold italic">
                   <p>
                      NUMA Intelligence is built on a distributed micro-kernel philosophy. Instead of a monolithic observer, we deploy <b>Target-Specific Agents</b> written in languages native to the platform's constraints (C++ and Rust).
                   </p>
                   <div className="p-10 border border-accents-2 bg-background relative group">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><Database size={80} /></div>
                      <h4 className="text-base uppercase font-black tracking-widest text-foreground mb-4">The Gateway Layer</h4>
                      <p className="text-base">
                         Acting as a high-throughput multiplexer, the Gateway uses Node.js with non-blocking I/O to handle thousands of concurrent gRPC streams, while simultaneously broadcasting via WebSockets.
                      </p>
                   </div>
                   <p>
                      This separation ensures that a failure in the presentation layer (Dashboard) never impacts the reliability of the telemetry ingestion.
                   </p>
                </div>
             </div>
           )}

           {activeSegment === 'theory' && (
             <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-5xl font-black italic tracking-tighter mb-12 underline decoration-accents-2 underline-offset-12">02. NUMA Theory</h2>
                <div className="space-y-12 text-xl text-accents-5 leading-loose font-bold italic">
                   <p>
                      Non-Uniform Memory Access (NUMA) is the architecture where memory access time depends on the memory location relative to the processor.
                   </p>
                   <div className="grid grid-cols-2 gap-10 my-16">
                      <div className="p-8 border-l-4 border-foreground bg-background">
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#0070f3] mb-4 block">Local Node Access</span>
                         <span className="text-3xl font-black italic">~70ns</span>
                      </div>
                      <div className="p-8 border-l-4 border-accents-3 bg-background">
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#f5a623] mb-4 block">Cross Node Access</span>
                         <span className="text-3xl font-black italic">~140ns+</span>
                      </div>
                   </div>
                   <p>
                      Our agents implement <b>Architectural Affinity</b>. By pinning threads to the cores that own the local memory controller, we effectively double the memory bandwidth available to the application.
                   </p>
                </div>
             </div>
           )}

           {activeSegment === 'pipeline' && (
             <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-5xl font-black italic tracking-tighter mb-12 underline decoration-accents-2 underline-offset-12">03. The Life of a Metric</h2>
                <div className="relative border-l-2 border-accents-2 ml-4 pl-12 space-y-20">
                   {[
                     { step: "Collection", desc: "C++ agent polls /proc/stat and NUMA registers every 100ms.", icon: CpuIcon },
                     { step: "Transport", desc: "Data is serialized into Protobuf and pushed via gRPC.", icon: Zap },
                     { step: "Broadcasting", desc: "Gateway receives packet and emits to all WebSocket clients.", icon: Network },
                     { step: "Visualization", desc: "Next.js updates Chart.js state for a sub-millisecond refresh.", icon: BarChart3 }
                   ].map((item, i) => (
                     <div key={i} className="relative">
                        <div className="absolute -left-[61px] top-0 w-6 h-6 rounded-full bg-foreground border-4 border-background" />
                        <div className="flex items-center gap-6 mb-4">
                           <item.icon size={20} className="text-[#0070f3]" />
                           <h4 className="text-2xl font-black italic tracking-tight">{item.step}</h4>
                        </div>
                        <p className="text-base opacity-80">{item.desc}</p>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeSegment === 'enterprise' && (
             <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-5xl font-black italic tracking-tighter mb-12 underline decoration-accents-2 underline-offset-12">04. Enterprise Scaling</h2>
                <div className="space-y-12 text-xl text-accents-5 leading-loose font-bold italic">
                   <p>
                      Scaling to an enterprise level requires rigorous security and hardware stability. NUMA Intelligence implements:
                   </p>
                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 list-none p-0">
                      {[
                        "Hardware-Level Encryption (AES-NI)",
                        "Secure gRPC Subsystems",
                        "Role-Based Dashboard Access",
                        "Load-Balanced Gateway Clusters"
                      ].map(item => (
                        <li key={item} className="p-6 border border-accents-2 bg-background flex items-center gap-4">
                           <Shield size={16} className="text-geist-success" />
                           <span className="text-sm uppercase tracking-widest">{item}</span>
                        </li>
                      ))}
                   </ul>
                   <p>
                      The platform architecture is designed to handle up to <b>25,000 metrics per second</b> on a single gateway instance before requiring horizontal scaling.
                   </p>
                </div>
             </div>
           )}
        </section>

        {/* Final Whitepaper Footer */}
        <section className="p-24 border-t border-accents-2 text-center">
           <p className="text-base text-accents-4 mb-10 italic max-w-xl mx-auto">
              Ready to see this theory in action? Launch the platform to witness the telemetry stream live.
           </p>
           <Link href="/dashboard" className="vercel-btn-primary text-lg px-20 py-6 uppercase font-black tracking-[0.3em] rounded-sm transform hover:scale-110 active:scale-95 transition-all shadow-2xl">
              Enter The Platform
           </Link>
        </section>
      </main>

      {/* Professional Footer (Clean) */}
      <footer className="bg-background border-t border-accents-2 p-20 pt-32">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3 text-2xl font-black italic uppercase tracking-tighter">
              <Activity size={24} className="text-foreground" />
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
           <p className="text-[10px] font-bold text-accents-4 uppercase tracking-[0.2em] italic">© 2026 NUMA Intelligence Research. All Rights Reseved.</p>
        </div>
      </footer>
    </div>
  );
}
