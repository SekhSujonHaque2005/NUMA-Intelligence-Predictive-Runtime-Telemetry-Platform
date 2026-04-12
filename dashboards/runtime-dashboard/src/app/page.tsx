"use client";

import {
  Activity,
  Cpu,
  Layout,
  Shield,
  Zap,
  ArrowRight,
  Monitor,
  Database,
  Globe,
  Lock,
  ChevronRight,
  Layers,
  BarChart3
} from "lucide-react";
import Link from "next/link";

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="vercel-card p-10 border border-accents-2 bg-background hover:bg-accents-1 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
      <Icon size={120} />
    </div>
    <div className="relative z-10">
      <div className="p-3 bg-accents-1 rounded-sm w-fit mb-8 group-hover:bg-accents-2 transition-colors">
        <Icon size={24} className="text-foreground" />
      </div>
      <h3 className="text-2xl font-black italic tracking-tighter mb-4">{title}</h3>
      <p className="text-sm text-accents-5 leading-relaxed font-bold italic opacity-80 group-hover:opacity-100 transition-opacity">{desc}</p>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-accents-2 font-serif bg-background text-foreground">
      <main className="flex-1 w-full border-x border-accents-2 mx-auto max-w-[1700px]">
        {/* Intense Hero Section */}
        <section className="relative pt-32 pb-44 px-10 border-b border-accents-2 overflow-hidden">
          {/* Professional Architectural Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-accents-2 bg-accents-1/50 text-[10px] font-black uppercase tracking-[0.4em] text-accents-6 mb-12 italic">
              <Zap size={12} className="text-[#0070f3]" /> Tomorrow's Infrastructure, Today
            </div>
            <h1 className="text-[140px] leading-[0.85] font-black tracking-tighter italic mb-12 drop-shadow-2xl">
              Predictive.<br />
              <span className="text-accents-3">NUMA-Aware.</span><br />
              Runtime.
            </h1>
            <p className="text-2xl text-accents-5 max-w-3xl mx-auto leading-relaxed mb-16 italic font-bold">
              The industry-standard observability platform for low-latency memory affinity and distributed telemetry.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <Link href="/dashboard" className="vercel-btn-primary text-base px-12 py-5 uppercase font-black tracking-[0.2em] rounded-sm shadow-[0_0_50px_rgba(0,112,243,0.3)] hover:scale-105 transition-all">
                Get Started Free
              </Link>
              <Link href="/docs" className="vercel-btn-secondary text-base px-12 py-5 uppercase font-black tracking-[0.2em] rounded-sm hover:bg-accents-1 transition-all border-2">
                Read Documentation
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-accents-2 divide-x divide-accents-2">
          <FeatureCard
            icon={Layers}
            title="Memory Locality"
            desc="Optimized memory allocation strategy that keeps your data close to the processor, reducing cross-node latency by up to 60%."
          />
          <FeatureCard
            icon={Monitor}
            title="Global Observability"
            desc="Unified dashboard monitoring thousands of heterogeneous nodes across multiple data centers with sub-millisecond precision."
          />
          <FeatureCard
            icon={Lock}
            title="Enterprise Security"
            desc="Hardware-level encryption and secure gRPC channels ensuring your telemetry remains private throughout the entire pipeline."
          />
        </section>

        {/* Technical Showcase */}
        <section className="p-24 border-b border-accents-2 bg-accents-1/20 flex flex-col items-center text-center">
          <div className="max-w-4xl">
            <h2 className="text-5xl font-black italic tracking-tighter mb-10">Built for the modern edge.</h2>
            <p className="text-xl text-accents-5 leading-loose mb-16 font-bold italic">
              NUMA Intelligence abstracts the complexity of modern hardware architecture, allowing your team to focus on performance instead of pointer placement.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { label: "C++ Engine", icon: Database },
                { label: "Rust Telemetry", icon: Zap },
                { label: "Next.js UI", icon: Layout },
                { label: "PostgreSQL", icon: Database }
              ].map(tech => (
                <div key={tech.label} className="flex flex-col items-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
                  <tech.icon size={32} className="text-accents-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{tech.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-44 px-10 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0070f3]/10 blur-[150px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-6xl font-black italic tracking-tighter mb-12">Ready to accelerate?</h2>
            <Link href="/dashboard" className="vercel-btn-primary text-lg px-20 py-6 uppercase font-black tracking-[0.3em] rounded-sm transform hover:scale-110 active:scale-95 transition-all shadow-2xl">
              Launch Platform Now
            </Link>
            <p className="mt-12 text-accents-4 text-xs font-bold uppercase tracking-widest italic flex items-center justify-center gap-3">
              <Shield size={14} /> Open Source. Enterprise Grade.
            </p>
          </div>
        </section>
      </main>

      {/* Professional Footer (Clean) */}
      <footer className="bg-background border-t border-accents-2 p-20 pt-32">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3 text-2xl font-black italic uppercase italic tracking-tighter">
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
          <p className="text-[10px] font-bold text-accents-4 uppercase tracking-[0.2em] italic">© 2026 NUMA Intelligence Platform. All Rights Reseved.</p>
        </div>
      </footer>
    </div>
  );
}
