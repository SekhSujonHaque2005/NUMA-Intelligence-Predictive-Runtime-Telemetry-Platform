"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Activity as ActivityIcon, 
  Cpu, 
  Layout, 
  Shield, 
  Zap, 
  Info,
  Server,
  Heart,
  Settings,
  HelpCircle,
  Globe,
  Lock,
  ArrowRight,
  Monitor
} from "lucide-react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Simple Definitions ---
const DEFINITIONS = {
  telemetry: "Total activity of nodes (think of it like a heart rate monitor for computers).",
  numa: "How computers share memory efficiently between different processors.",
  latency: "The delay or 'lag' experienced when moving information."
};

interface Metric {
  source: string;
  cpu_id: number;
  cpu_usage: number;
  timestamp: string;
}

const StatCard = ({ icon: Icon, label, value, subtext, color = "text-foreground", status = "Good" }: any) => (
  <div className="vercel-card p-8 border border-accents-2 relative group overflow-hidden transition-all hover:bg-accents-1/50">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-accents-1 rounded-sm group-hover:bg-accents-2 transition-colors">
        <Icon size={24} className="text-accents-5" />
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-accents-2 ${status === 'Good' ? 'text-geist-success' : 'text-geist-error'}`}>
        {status}
      </span>
    </div>
    <div>
      <p className="text-accents-4 text-xs font-bold uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className={`text-4xl font-black italic tracking-tighter ${color}`}>{value}</p>
        <p className="text-[10px] font-bold text-accents-3 uppercase">{subtext}</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const metricsRef = useRef<Metric[]>([]);
  const [history, setHistory] = useState<{labels: string[], cpp: number[], rust: number[]}>({labels: [], cpp: [], rust: []});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Sync ref with state
  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3001";
      const wsUrl = gatewayUrl.replace(/^http/, "ws");
      ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMetrics(prev => {
             if (Array.isArray(data)) {
                const newMetrics = [...prev];
                data.forEach(m => {
                   const idx = newMetrics.findIndex(nm => nm.source === m.source && nm.cpu_id === m.cpu_id);
                   if (idx > -1) newMetrics[idx] = m;
                   else newMetrics.push(m);
                });
                return newMetrics;
             }
             return prev;
          });
          setLastUpdated(new Date().toLocaleTimeString());
        } catch (e) {
          console.error("WS Parse Error", e);
        }
      };

      ws.onclose = () => {
        reconnectTimer = setTimeout(connect, 2000);
      };

      ws.onerror = () => ws.close();
    };

    connect();
    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimer);
    };
  }, []);

  // Use a stable interval to push data to the graph history
  useEffect(() => {
    const chartInterval = setInterval(() => {
      setHistory(prev => {
        const currentMetrics = metricsRef.current;
        const cppNodes = currentMetrics.filter(m => m.source === 'cpp');
        const rustNodes = currentMetrics.filter(m => m.source === 'rust');
        
        const cppAvg = cppNodes.length > 0 
          ? cppNodes.reduce((acc, curr) => acc + curr.cpu_usage, 0) / cppNodes.length 
          : (prev.cpp[prev.cpp.length - 1] || 0);

        const rustAvg = rustNodes.length > 0 
          ? rustNodes.reduce((acc, curr) => acc + curr.cpu_usage, 0) / rustNodes.length 
          : (prev.rust[prev.rust.length - 1] || 0);

        const newLabels = [...prev.labels, new Date().toLocaleTimeString()].slice(-30);
        
        return {
          labels: newLabels,
          cpp: [...prev.cpp, cppAvg].slice(-30),
          rust: [...prev.rust, rustAvg].slice(-30)
        };
      });
    }, 1000); 

    return () => clearInterval(chartInterval);
  }, []); // Run once on mount

  const chartData = {
    labels: history.labels,
    datasets: [
      {
        label: 'C++ Device activity',
        data: history.cpp,
        borderColor: '#0070f3',
        backgroundColor: 'rgba(0, 112, 243, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Rust Device activity',
        data: history.rust,
        borderColor: '#f5a623',
        backgroundColor: 'rgba(245, 166, 35, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#000',
        titleFont: { family: 'Times New Roman' },
        bodyFont: { family: 'Times New Roman' },
      },
    },
    scales: {
      x: { display: false },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: '#222' },
        ticks: { color: '#666', font: { family: 'Times New Roman', size: 10 } }
      }
    },
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-accents-2 font-serif bg-background text-foreground">
      {/* Navigation Header */}
      <nav className="h-[80px] border-b border-accents-2 flex items-center justify-between px-10 sticky top-0 bg-background/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
              <ActivityIcon size={16} className="text-background" strokeWidth={3} />
            </div>
            <span className="font-bold tracking-tighter text-2xl uppercase italic">NUMA Intelligence</span>
          </Link>
          <div className="h-6 w-[1px] bg-accents-2" />
          <nav className="hidden md:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-accents-5">
             <Link href="/dashboard" className="text-foreground transition-all underline underline-offset-8 decoration-geist-success">Platform</Link>
             <Link href="/simulator" className="hover:text-foreground transition-all">Simulation</Link>
             <Link href="/docs" className="hover:text-foreground transition-all">Documentation</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3 px-4 py-2 bg-geist-success/10 border border-geist-success/30 rounded-full text-[10px] font-black italic text-geist-success">
              <div className="w-2 h-2 rounded-full bg-geist-success animate-pulse" />
              SYSTEM_READY
           </div>
        </div>
      </nav>

      <main className="flex-1 w-full mx-auto max-w-[1700px] border-x border-accents-2">
        {/* Intro Section */}
        <div className="p-12 lg:p-16 border-b border-accents-2 bg-gradient-to-br from-background to-accents-1">
           <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
              <div className="max-w-3xl">
                 <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accents-5 flex items-center gap-2">
                       <Monitor size={12} /> Live Monitoring
                    </span>
                 </div>
                 <h2 className="text-7xl font-black tracking-tighter italic mb-8">System Heartbeat.</h2>
                 <p className="text-lg text-accents-4 leading-relaxed max-w-2xl">
                    Welcome to the simplified view of your machine. This page shows you how hard your computer nodes (C++ and Rust) are working in real-time.
                 </p>
                 <div className="mt-8 flex items-center gap-4 p-4 bg-accents-1 border border-accents-2 rounded-sm inline-flex">
                    <HelpCircle size={16} className="text-geist-success" />
                    <p className="text-xs italic text-accents-5">
                       <strong>Beginner Tip:</strong> If the graph pulses <strong>Blue</strong> or <strong>Orange</strong>, your processors are currently processing data!
                    </p>
                 </div>
              </div>
              <div className="flex flex-col items-end gap-3 text-[10px] font-bold text-accents-4 border border-accents-2 p-6 bg-background rounded">
                 <div className="flex items-center gap-2 mb-2">
                    <Heart size={12} className="text-geist-error" /> 
                    <span className="uppercase tracking-widest">Live Sync Status</span>
                 </div>
                 <span className="text-2xl font-black italic tracking-tighter text-foreground py-2 border-y border-accents-2 w-full text-center">
                    {lastUpdated || 'SEARCHING...'}
                 </span>
                 <span className="uppercase tracking-[0.2em] opacity-50">Global Cluster 01</span>
              </div>
           </div>
        </div>

        {/* Primary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-accents-2 border-b border-accents-2">
          <StatCard icon={Server} label="Computer Nodes" value={new Set(metrics.map(m => m.source)).size} subtext="Connected Devices" />
          <StatCard icon={Cpu} label="Processor Cores" value={metrics.length} subtext="Active Channels" />
          <StatCard icon={Heart} label="Average Workload" value={`${(metrics.reduce((acc, curr) => acc + curr.cpu_usage, 0) / (metrics.length || 1)).toFixed(1)}%`} subtext="Total System Strain" color="text-geist-success" />
          <StatCard icon={Shield} label="System Security" value="SAFE" subtext="End-to-End Encryption" status="Good" />
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 divide-x divide-accents-2">
          <div className="lg:col-span-3 p-12">
            <div className="flex justify-between items-center mb-10">
               <div className="space-y-2">
                  <div className="flex items-center gap-3">
                     <span className="w-3 h-3 rounded-full bg-geist-success animate-pulse" />
                     <h3 className="text-2xl font-black italic tracking-tight uppercase">System Activity Graph</h3>
                  </div>
                  <p className="text-xs text-accents-4 italic">Visualizing the heart rate of your connected machine agents.</p>
               </div>
               <div className="flex gap-6 border border-accents-2 p-3 bg-accents-1 rounded">
                  <div className="flex items-center gap-2 px-3 py-1 border-r border-accents-2">
                    <div className="w-2 h-2 rounded-full bg-[#0070f3]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accents-5">C++ Node</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1">
                    <div className="w-2 h-2 rounded-full bg-[#f5a623]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accents-5">Rust Node</span>
                  </div>
               </div>
            </div>
            <div className="h-[450px] relative">
               <Line data={chartData} options={chartOptions} />
            </div>
          </div>
          <div className="p-12 space-y-10 bg-accents-1/20 overflow-y-auto">
             <div className="space-y-4 border-b border-accents-2 pb-8">
                <h4 className="text-sm font-black uppercase tracking-widest italic underline decoration-accents-2 underline-offset-4 mb-4">Activity Summary</h4>
                {metrics.slice(0, 5).map(m => (
                  <div key={`${m.source}-${m.cpu_id}`} className="space-y-2">
                     <div className="flex justify-between text-[11px] font-bold text-accents-5">
                         <span className="uppercase tracking-widest">Device {m.source}</span>
                         <span className={m.cpu_usage > 70 ? "text-geist-error" : "text-foreground"}>{Math.round(m.cpu_usage)}% Busy</span>
                     </div>
                     <div className="h-1 w-full bg-accents-2 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${m.cpu_usage > 70 ? 'bg-geist-error' : 'bg-geist-success'}`} style={{ width: `${m.cpu_usage}%` }} />
                     </div>
                  </div>
                ))}
             </div>
             <div className="p-6 border border-accents-2 bg-background relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05]"><Zap size={60} /></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-accents-4 mb-3">What is this?</h4>
                <p className="text-xs text-accents-5 leading-loose italic">
                   "This dashboard monitors <b>NUMA Intelligence</b>—how your computer manages memory. If the usage bars are low, your computer is resting. High bars mean it's performing a heavy task."
                </p>
             </div>
          </div>
        </div>

        {/* Simplified Table Section */}
        <div className="border-t border-accents-2">
          <div className="p-10 flex items-center justify-between border-b border-accents-2 bg-accents-1/30">
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <Layout size={20} className="text-accents-5" />
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase">Processor Activity Log</h3>
               </div>
               <p className="text-xs text-accents-4 italic underline decoration-accents-2 underline-offset-4 decoration-1">Detailed list of every processor core active in the system.</p>
            </div>
            <div className="flex items-center gap-3 px-5 py-2 border border-accents-2 bg-background rounded-full text-[10px] font-bold text-accents-5 italic shadow-sm">
               <div className="w-1.5 h-1.5 rounded-full bg-[#0070f3]" />
               Syncing {metrics.length} Processors Live
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-base border-collapse border-spacing-0">
              <thead>
                <tr className="bg-background text-foreground text-left uppercase text-[10px] tracking-widest font-black border-b border-accents-2">
                  <th className="px-10 py-5 border-r border-accents-2">Device Name</th>
                  <th className="px-10 py-5 border-r border-accents-2">Processor ID</th>
                  <th className="px-10 py-5 border-r border-accents-2">How Busy?</th>
                  <th className="px-10 py-5 border-r border-accents-2">Usage Visual</th>
                  <th className="px-10 py-5">Unique Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accents-2">
                {metrics.map((m, idx) => (
                  <tr key={idx} className="group hover:bg-accents-1/50 transition-colors border-b border-accents-2 font-serif">
                    <td className="px-10 py-5 border-r border-accents-2">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${m.source === 'cpp' ? 'bg-[#0070f3]' : 'bg-[#f5a623]'}`} />
                         <span className="text-sm font-bold text-foreground italic uppercase underline decoration-accents-2 underline-offset-4">{m.source} agent</span>
                      </div>
                    </td>
                    <td className="px-10 py-5 border-r border-accents-2 text-foreground font-bold italic text-sm">
                      Core_0{m.cpu_id}
                    </td>
                    <td className="px-10 py-5 border-r border-accents-2">
                       <div className="flex items-center gap-3">
                          <span className={`text-sm font-black italic tabular-nums ${m.cpu_usage > 70 ? 'text-geist-error' : 'text-foreground'}`}>
                             {m.cpu_usage.toFixed(2)}%
                          </span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${m.cpu_usage > 70 ? 'border-geist-error/30 text-geist-error bg-geist-error/5' : 'border-geist-success/30 text-geist-success bg-geist-success/5'}`}>
                             {m.cpu_usage > 70 ? 'Heavy' : m.cpu_usage > 30 ? 'Normal' : 'Light'}
                          </span>
                       </div>
                    </td>
                    <td className="px-10 py-5 border-r border-accents-2 min-w-[200px]">
                      <div className="h-1.5 w-full bg-accents-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-700 ${m.cpu_usage > 70 ? 'bg-geist-error' : 'bg-geist-success'}`} 
                          style={{ width: `${m.cpu_usage}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-10 py-5 text-accents-5 italic tracking-tighter text-xs font-bold">
                      DATA_PACKET_0x{idx.toString(16).toUpperCase().padStart(4, '0')}
                    </td>
                  </tr>
                ))}
                {metrics.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                       <div className="flex flex-col items-center gap-4 text-accents-3">
                          <Zap size={30} className="animate-pulse" />
                          <p className="text-xl italic font-black uppercase tracking-[0.2em] opacity-30">Awaiting System Data Stream...</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
