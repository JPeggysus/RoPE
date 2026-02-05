
import React from 'react';
import { TokenData } from '../types';

interface MultiHeadOverviewProps {
  tokens: TokenData[];
}

const MultiHeadOverview: React.FC<MultiHeadOverviewProps> = ({ tokens }) => {
  // Colors from palette
  const INK = '#2c2416';
  const RUST = '#b85a3c';
  const FOREST = '#2d5a4a';

  return (
    <div className="my-16 pt-12 pb-10 px-2 md:px-8 bg-paper border border-ink relative overflow-hidden">
      {/* Label */}
      <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
        Figure 2: The Council of Heads
      </div>

      {/* Grid Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2c2416 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto">
        
        {/* 1. INPUT SEQUENCE (3 Columns) */}
        <div className="w-full">
            <div className="text-center font-serif italic text-ink-light mb-2">1. Input Context Window</div>
            <div className="grid grid-cols-3 gap-4 border-2 border-dashed border-ink/40 bg-paper-dark/10 p-4 rounded-lg relative z-10">
                {tokens.map((t, idx) => (
                <div key={`${t.id}-${idx}`} className="flex flex-col items-center bg-paper border border-ink shadow-sm py-2 mx-auto w-full max-w-[120px]">
                    <div className="font-mono text-sm font-bold text-ink">{t.text}</div>
                    <div className="text-[10px] font-mono text-ink-light mt-1">x<sub>{t.position}</sub></div>
                </div>
                ))}
            </div>
        </div>

        {/* CONNECTION 1: Single Input -> Heads (4) */}
        <div className="w-full h-16 relative">
            <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                    <marker id="arrowHeadInk" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 Z" fill={INK} />
                    </marker>
                </defs>
                
                {/* Single line dropping from center of Input Container */}
                <line x1="50" y1="0" x2="50" y2="15" stroke={INK} strokeWidth="1" />

                {/* The Bus Bar */}
                <line x1="12.5" y1="15" x2="87.5" y2="15" stroke={INK} strokeWidth="1" />

                {/* 4 Heads dropping down (Centers at 12.5, 37.5, 62.5, 87.5) */}
                {[12.5, 37.5, 62.5, 87.5].map((x, i) => (
                     <line key={i} x1={x} y1="15" x2={x} y2="40" stroke={INK} strokeWidth="0.5" markerEnd="url(#arrowHeadInk)" />
                ))}
            </svg>
        </div>

        {/* 2. THE HEADS (4 Columns) */}
        <div className="w-full grid grid-cols-4 gap-2 md:gap-4 relative z-10">
            {[0, 1, 2, 3].map((headId) => (
                <div key={headId} className="flex flex-col items-center">
                    <div className={`
                        w-full py-3 border-2 bg-paper relative flex flex-col items-center shadow-sm min-h-[60px] justify-center
                        ${headId === 0 ? 'border-forest bg-highlight/10' : 'border-ink/60'}
                    `}>
                        <div className="text-center font-mono text-xs font-bold text-ink">Head {headId}</div>
                    </div>
                </div>
            ))}
        </div>

        {/* CONNECTION 2: Heads (4) -> Projection (1) */}
        <div className="w-full h-16 relative">
             <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                {/* 4 Heads dropping down */}
                <line x1="12.5" y1="0" x2="12.5" y2="15" stroke={INK} strokeWidth="0.5" />
                <line x1="37.5" y1="0" x2="37.5" y2="15" stroke={INK} strokeWidth="0.5" />
                <line x1="62.5" y1="0" x2="62.5" y2="15" stroke={INK} strokeWidth="0.5" />
                <line x1="87.5" y1="0" x2="87.5" y2="15" stroke={INK} strokeWidth="0.5" />

                {/* The Bus Bar */}
                <line x1="12.5" y1="15" x2="87.5" y2="15" stroke={INK} strokeWidth="1" />

                {/* Funnel to center */}
                <line x1="50" y1="15" x2="50" y2="40" stroke={INK} strokeWidth="1" markerEnd="url(#arrowHeadInk)" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper px-2 py-0.5 text-[9px] font-mono text-ink border border-ink whitespace-nowrap">
                Combine suggestions
            </div>
        </div>

        {/* 3. PROJECTION MATRIX */}
        <div className="relative z-10 w-48 md:w-64 border-2 border-rust bg-highlight shadow-sm p-3 flex flex-col items-center mx-auto">
            <div className="font-bold text-rust font-mono text-base md:text-lg">Linear Projection</div>
            <div className="text-[10px] font-mono text-rust/80 mt-1 uppercase tracking-wide text-center">turns suggestions into updates</div>
        </div>

        {/* CONNECTION 3: Projection (1) -> Outputs (3) */}
        <div className="w-full h-16 relative">
             <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                    <marker id="arrowHeadRust" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 Z" fill={RUST} />
                    </marker>
                </defs>

                {/* Center dropping down */}
                <line x1="50" y1="0" x2="50" y2="20" stroke={RUST} strokeWidth="1" />
                
                {/* The Bus Bar */}
                <line x1="16.66" y1="20" x2="83.33" y2="20" stroke={RUST} strokeWidth="1" />

                {/* 3 Outputs dropping down */}
                <line x1="16.66" y1="20" x2="16.66" y2="40" stroke={RUST} strokeWidth="0.5" markerEnd="url(#arrowHeadRust)" />
                <line x1="50"    y1="20" x2="50"    y2="40" stroke={RUST} strokeWidth="0.5" markerEnd="url(#arrowHeadRust)" />
                <line x1="83.33" y1="20" x2="83.33" y2="40" stroke={RUST} strokeWidth="0.5" markerEnd="url(#arrowHeadRust)" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper px-2 py-0.5 text-[9px] font-mono text-rust border border-rust whitespace-nowrap">
                Apply updates
            </div>
        </div>

        {/* 4. OUTPUTS (3 Columns) */}
        <div className="w-full grid grid-cols-3 gap-4">
            {tokens.map((t, idx) => (
                <div key={`out-${t.id}-${idx}`} className="flex flex-col items-center group w-full">
                    {/* The Residual Math Visual */}
                    <div className="flex items-center gap-1 mb-2 bg-paper-dark/30 px-2 py-1 rounded border border-ink/10">
                    <div className="w-4 h-4 md:w-5 md:h-5 border border-ink bg-ink text-paper flex items-center justify-center text-[7px] md:text-[8px] font-mono">x<sub>{idx}</sub></div>
                    <span className="text-[10px] text-ink">+</span>
                    <div className="w-4 h-4 md:w-5 md:h-5 border border-rust bg-rust text-paper flex items-center justify-center text-[7px] md:text-[8px] font-mono">Δ</div>
                    </div>
                    
                    <div className="bg-paper border-2 border-forest px-2 py-2 font-mono text-xs md:text-sm shadow-[0_4px_0_rgba(45,90,74,0.2)] w-full max-w-[120px] text-center">
                    {t.text}
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default MultiHeadOverview;
