"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { 
  Activity as ActivityIcon, 
  Sun, 
  Moon, 
  ArrowRight,
  Monitor,
  Layout,
  HelpCircle,
} from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="h-[80px] border-b border-accents-2 flex items-center justify-between px-10 sticky top-0 bg-background/90 backdrop-blur-xl z-50">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-10 h-10 overflow-hidden rounded bg-foreground flex items-center justify-center p-1">
            <Image 
              src="/logo.png" 
              alt="NUMA Intelligence Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="font-black tracking-tighter text-xl uppercase italic leading-none">NUMA</span>
            <span className="font-bold tracking-widest text-[10px] uppercase text-accents-5 leading-none">Intelligence</span>
          </div>
        </Link>
        <div className="h-6 w-[1px] bg-accents-2" />
        <nav className="hidden md:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-accents-5">
           <Link href="/dashboard" className="hover:text-foreground transition-all">Platform</Link>
           <Link href="/simulator" className="hover:text-foreground transition-all">Simulation</Link>
           <Link href="/docs" className="hover:text-foreground transition-all">Documentation</Link>
        </nav>
      </div>
      <div className="flex items-center gap-6">
         <button 
           onClick={toggleTheme}
           className="w-10 h-10 flex items-center justify-center rounded-full border border-accents-2 bg-accents-1 hover:bg-accents-2 transition-all group"
           title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
         >
           {theme === 'light' ? (
             <Moon size={16} className="text-accents-5 group-hover:rotate-12 transition-transform" />
           ) : (
             <Sun size={16} className="text-accents-5 group-hover:rotate-90 transition-transform" />
           )}
         </button>
         <Link href="/dashboard" className="vercel-btn-primary px-8 py-2.5 text-[11px] uppercase font-black tracking-widest flex items-center gap-3 hidden lg:flex">
           Launch Platform <ArrowRight size={14} />
         </Link>
      </div>
    </nav>
  );
}
