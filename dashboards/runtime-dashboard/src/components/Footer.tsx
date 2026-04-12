"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Globe, 
  Lock, 
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-accents-2 p-20 pt-32">
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="col-span-1 md:col-span-2 space-y-8">
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
  );
}
