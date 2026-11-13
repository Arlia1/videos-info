import React from 'react';
import { Building2, ShieldCheck, Calculator, Compass } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="border-b border-zinc-800/80 bg-[#0A0C10]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('catalog')}>
          <div className="w-10 h-10 border border-[#C8A97E] flex items-center justify-center bg-[#C8A97E]/10">
            <Building2 className="w-5 h-5 text-[#C8A97E]" />
          </div>
          <div>
            <span className="font-serif text-2xl tracking-wider text-white block leading-none">
              ARLIA <span className="text-[#C8A97E] font-normal italic">Boutique</span>
            </span>
            <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-400 uppercase">
              CPMCAL Mat. 4108 • Zona Sur
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-2 md:gap-6">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-2 text-xs uppercase tracking-widest transition flex items-center gap-1.5 ${
              activeTab === 'catalog' ? 'text-[#C8A97E] border-b border-[#C8A97E]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Colección
          </button>
          <button
            onClick={() => setActiveTab('mortgage')}
            className={`px-3 py-2 text-xs uppercase tracking-widest transition flex items-center gap-1.5 ${
              activeTab === 'mortgage' ? 'text-[#C8A97E] border-b border-[#C8A97E]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> Simulador UVA/USD
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border transition flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-[#C8A97E] text-black border-[#C8A97E] font-semibold'
                : 'border-zinc-700 text-zinc-300 hover:border-[#C8A97E]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> /admin
          </button>
        </nav>
      </div>
    </header>
  );
}
