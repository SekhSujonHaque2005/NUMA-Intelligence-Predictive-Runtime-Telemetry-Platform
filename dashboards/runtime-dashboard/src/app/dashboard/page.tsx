"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
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
import Footer from "@/components/Footer";
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
  node_id: number;
  memory_mb: number;
  local_lat: number;
  remote_lat: number;
  timestamp: string;
}

const NumaHeatmap = ({ metrics }: { metrics: Metric[] }) => {
  // Group metrics by node_id
  const nodes = metrics.reduce((acc: Record<number, Metric[]>, m) => {
    if (!acc[m.node_id]) acc[m.node_id] = [];
    acc[m.node_id].push(m);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-12 bg-accents-1/10">
      {Object.entries(nodes).map(([nodeId, cpuMetrics]) => (
        <div key={nodeId} className="vercel-card border border-accents-2 p-6 bg-background">
          <div className="flex justify-between items-center mb-6 border-b border-accents-2 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accents-1 rounded">
                <Layout size={16} className="text-accents-5" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest italic">NUMA Node {nodeId}</h4>
            </div>
            <div className="text-[10px] font-bold text-accents-4 uppercase tracking-tighter">
              {cpuMetrics.length} Cores Managed
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {cpuMetrics.sort((a,b) => a.cpu_id - b.cpu_id).map(m => (
              <div 
                key={m.cpu_id}
                className="aspect-square rounded-sm border border-accents-2 flex items-center justify-center relative group overflow-hidden"
                title={`Core ${m.cpu_id}: ${m.cpu_usage.toFixed(1)}%`}
              >
                <div 
                  className={`absolute inset-0 transition-all duration-700 ${m.source === 'cpp' ? 'bg-[#0070f3]' : (m.source === 'rust' ? 'bg-[#f5a623]' : 'bg-accents-2')}`}
                  style={{ opacity: (m.cpu_usage / 100) * 0.8 + 0.1 }}
                />
                <span className="relative text-[8px] font-bold z-10 opacity-30 group-hover:opacity-100 transition-opacity">
                  {m.cpu_id}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-end">
            <div>
              <p className="text-[9px] font-bold text-accents-4 uppercase mb-1 tracking-widest">Memory Pressure</p>
              <p className="text-xl font-black italic tracking-tighter">
                {cpuMetrics[0].memory_mb.toFixed(1)} <span className="text-[10px] text-accents-3 uppercase not-italic">MB Used</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-accents-4 uppercase mb-1 tracking-widest">Local Latency</p>
              <p className="text-xl font-black italic tracking-tighter text-geist-success">
                {cpuMetrics[0].local_lat.toFixed(2)} <span className="text-[10px] text-accents-3 uppercase not-italic">ns</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const InstallModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [platform, setPlatform] = useState<"linux" | "windows" | "mac">("linux");
  const [copied, setCopied] = useState(false);
  const PRODUCTION_URL = "https://numa-intelligence-predictive-runtime.onrender.com";
  
  if (!isOpen) return null;

  const commands = {
    linux: `export GATEWAY_ADDR="${PRODUCTION_URL}" && curl -sSL https://raw.githubusercontent.com/SekhSujonHaque2005/NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform/main/scripts/install.sh | bash`,
    windows: `$env:GATEWAY_ADDR="${PRODUCTION_URL}"; iwr https://raw.githubusercontent.com/SekhSujonHaque2005/NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform/main/scripts/install.ps1 | iex`,
    mac: `export GATEWAY_ADDR="${PRODUCTION_URL}" && curl -sSL https://raw.githubusercontent.com/SekhSujonHaque2005/NUMA-Intelligence-Predictive-Runtime-Telemetry-Platform/main/scripts/install.sh | bash`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(commands[platform]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-6">
      <div className="vercel-card max-w-2xl w-full bg-background border border-accents-2 p-10 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-accents-4 hover:text-foreground">
          <Zap size={20} />
        </button>
        
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-geist-success/10 rounded">
                <Shield size={20} className="text-geist-success" />
             </div>
             <h3 className="text-3xl font-black italic tracking-tighter uppercase">Connect Hardware</h3>
          </div>
          <p className="text-sm text-accents-5 leading-loose italic">
            To see real-time NUMA telemetry from your machine, run the following command in your terminal. This will install and connect your local agent to this dashboard.
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          {(["linux", "windows", "mac"] as const).map(p => (
            <button 
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${platform === p ? 'bg-foreground text-background border-foreground' : 'border-accents-2 text-accents-4 hover:border-accents-3'}`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="bg-accents-1 p-6 border border-accents-2 rounded font-mono text-xs relative group">
           <code className="text-accents-5 break-all leading-relaxed">
             {commands[platform]}
           </code>
           <button 
             onClick={copyToClipboard}
             className="absolute top-4 right-4 p-2 bg-background border border-accents-2 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] text-accents-5 hover:text-foreground"
           >
             {copied ? <><Zap size={12} className="text-geist-success" /> Copied!</> : <><Monitor size={12} /> Copy</>}
           </button>
        </div>

        <div className="mt-8 flex items-center gap-4 p-4 bg-accents-1/50 border border-accents-2 rounded-sm">
           <Info size={16} className="text-[#0070f3]" />
           <p className="text-[10px] italic text-accents-5">
             <strong>Security Note:</strong> The agent only transmits performance metrics. No private files or personal data are ever accessed or sent.
           </p>
        </div>
      </div>
    </div>
  );
};

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
  const [browserInfo, setBrowserInfo] = useState({ cores: 0, ram: 0, os: "Unknown" });
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const { theme } = useTheme();

  // Detect Browser Hardware (Zero-Install)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cores = navigator.hardwareConcurrency || 4;
      const ram = (navigator as any).deviceMemory || 4;
      const ua = navigator.userAgent;
      let os = "Linux";
      if (ua.indexOf("Win") !== -1) os = "Windows";
      if (ua.indexOf("Mac") !== -1) os = "macOS";
      
      setBrowserInfo({ cores, ram, os });

      // Pre-fill local UI with "Standby" cores matching user's hardware
      const initialMetrics: Metric[] = Array.from({ length: cores }).map((_, i) => ({
        source: "local-browser",
        cpu_id: i,
        cpu_usage: 0,
        node_id: 0,
        memory_mb: 0,
        local_lat: 0,
        remote_lat: 0,
        timestamp: new Date().toLocaleTimeString()
      }));
      setMetrics(initialMetrics);
    }
  }, []);

  // Sync ref with state
  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      const PRODUCTION_URL = "https://numa-intelligence-predictive-runtime.onrender.com";
      const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || PRODUCTION_URL;
      const wsUrl = gatewayUrl.replace(/^http/, "ws");
      ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMetrics(prev => {
             if (Array.isArray(data)) {
                // Filter out browser placeholders once real data arrives
                const filtered = prev.filter(m => m.source !== "local-browser");
                const newMetrics = [...filtered];
                
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
        backgroundColor: theme === 'dark' ? '#fff' : '#000',
        titleColor: theme === 'dark' ? '#000' : '#fff',
        bodyColor: theme === 'dark' ? '#000' : '#fff',
        titleFont: { family: 'Times New Roman' },
        bodyFont: { family: 'Times New Roman' },
      },
    },
    scales: {
      x: { display: false },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: theme === 'dark' ? '#222' : '#eee' },
        ticks: { color: theme === 'dark' ? '#666' : '#999', font: { family: 'Times New Roman', size: 10 } }
      }
    },
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-accents-2 font-serif bg-background text-foreground">
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
                 <div className="mt-8 flex items-center gap-4">
                   <button 
                     onClick={() => setIsInstallModalOpen(true)}
                     className="px-8 py-3 bg-foreground text-background text-[11px] font-black uppercase tracking-widest hover:bg-accents-6 transition-all flex items-center gap-3"
                   >
                     <Zap size={14} fill="currentColor" /> Connect Agent
                   </button>
                   <div className="flex items-center gap-4 p-4 bg-accents-1 border border-accents-2 rounded-sm inline-flex">
                      <HelpCircle size={16} className="text-geist-success" />
                      <p className="text-xs italic text-accents-5">
                         <strong>Beginner Tip:</strong> If the graph pulses <strong>Blue</strong> or <strong>Orange</strong>, your processors are currently processing data!
                      </p>
                   </div>
                 </div>
              </div>

               <div className="flex flex-col items-end gap-3 text-[10px] font-bold text-accents-4 border border-accents-2 p-6 bg-background rounded">
                  <div className="flex items-center gap-2 mb-2">
                     <Monitor size={12} className="text-geist-success" /> 
                     <span className="uppercase tracking-widest text-geist-success">Detected Environment (Zero-Install)</span>
                  </div>
                  <div className="flex flex-col gap-1 w-full border-y border-accents-2 py-3 mb-2">
                     <span className="text-xl font-black italic tracking-tighter text-foreground flex justify-between">
                        <span>{browserInfo.os}</span>
                        <span className="text-accents-3 text-[10px] uppercase not-italic">OS</span>
                     </span>
                     <span className="text-xl font-black italic tracking-tighter text-foreground flex justify-between">
                        <span>{browserInfo.cores} Cores</span>
                        <span className="text-accents-3 text-[10px] uppercase not-italic">Detect</span>
                     </span>
                     <span className="text-xl font-black italic tracking-tighter text-foreground flex justify-between">
                        <span>{browserInfo.ram} GB+</span>
                        <span className="text-accents-3 text-[10px] uppercase not-italic">Memory</span>
                     </span>
                  </div>
                  <span className="uppercase tracking-[0.2em] opacity-50">Local Browser Session</span>
               </div>
           </div>
        </div>

        {/* Primary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-accents-2 border-b border-accents-2">
          <StatCard icon={Server} label="Computer Nodes" value={new Set(metrics.filter(m => m.source !== "local-browser").map(m => m.source)).size} subtext="Connected Devices" />
          <StatCard icon={ActivityIcon} label="Local Latency" value={`${(metrics.filter(m => m.source !== "local-browser").reduce((acc, curr) => acc + curr.local_lat, 0) / (metrics.filter(m => m.source !== "local-browser").length || 1)).toFixed(2)}ns`} subtext="Avg Memory Hops" color="text-geist-success" />
          <StatCard icon={Layout} label="Memory Pressure" value={`${(metrics.filter(m => m.source !== "local-browser").reduce((acc, curr) => acc + curr.memory_mb, 0) / (metrics.filter(m => m.source !== "local-browser").length || 1)).toFixed(0)}MB`} subtext="Total Node Cache" />
          <StatCard icon={Shield} label="System Security" value="SAFE" subtext="End-to-End Encryption" status="Good" />
        </div>

        {/* Heatmap Section */}
        <div className="border-b border-accents-2 bg-accents-1/30">
          <div className="p-10 flex items-center justify-between border-b border-accents-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Layout size={20} className="text-accents-5" />
                <h3 className="text-2xl font-black italic tracking-tighter uppercase">Hardware Affinity Heatmap</h3>
              </div>
              <p className="text-xs text-accents-4 italic underline decoration-accents-2 underline-offset-4 decoration-1">Grouping processor cores by their physical NUMA nodes for locality analysis.</p>
            </div>
          </div>
          <NumaHeatmap metrics={metrics} />
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
                  <th className="px-10 py-5 border-r border-accents-2">NUMA Node</th>
                  <th className="px-10 py-5 border-r border-accents-2">How Busy?</th>
                  <th className="px-10 py-5 border-r border-accents-2">Local Latency</th>
                  <th className="px-10 py-5">Unique Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accents-2">
                {metrics.map((m, idx) => (
                  <tr key={idx} className="group hover:bg-accents-1/50 transition-colors border-b border-accents-2 font-serif">
                    <td className="px-10 py-5 border-r border-accents-2">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${m.source === 'cpp' ? 'bg-[#0070f3]' : (m.source === 'rust' ? 'bg-[#f5a623]' : 'bg-accents-2')}`} />
                         <span className="text-sm font-bold text-foreground italic uppercase underline decoration-accents-2 underline-offset-4">{m.source} agent</span>
                      </div>
                    </td>
                    <td className="px-10 py-5 border-r border-accents-2 text-foreground font-bold italic text-sm">
                      Core_0{m.cpu_id}
                    </td>
                    <td className="px-10 py-5 border-r border-accents-2 text-accents-5 font-black italic text-xs uppercase">
                      NODE_{m.node_id}
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
                    <td className="px-10 py-5 border-r border-accents-2 text-geist-success font-black italic text-sm tabular-nums">
                      {m.local_lat.toFixed(2)}ns
                    </td>
                    <td className="px-10 py-5 text-accents-5 italic tracking-tighter text-xs font-bold">
                      DATA_PACKET_0x{idx.toString(16).toUpperCase().padStart(4, '0')}
                    </td>
                  </tr>
                ))}
                {metrics.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
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

      <Footer />
      <InstallModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
    </div>
  );
}
