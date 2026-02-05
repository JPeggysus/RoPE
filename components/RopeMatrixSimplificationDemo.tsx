
import React, { useState } from 'react';

const RopeMatrixSimplificationDemo: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showRealMatrix, setShowRealMatrix] = useState(false);
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  const m = "2";
  const n = "0";

  // Helper for matrix content
  const MatrixContent = () => {
     if (showRealMatrix) {
        return (
           <div className="grid grid-cols-8 grid-rows-8 gap-[1px] bg-ink/5 border border-ink/10 p-1 w-full h-full items-center justify-center">
             {Array.from({ length: 8 }).map((_, row) => (
               Array.from({ length: 8 }).map((_, col) => {
                 const blockIndex = Math.floor(row / 2);
                 const colBlockIndex = Math.floor(col / 2);
                 const isBlock = blockIndex === colBlockIndex;
                 
                 let content = <span className="text-ink/5 text-[6px]">0</span>;
                 
                 if (isBlock) {
                    const r = row % 2;
                    const c = col % 2;
                    const theta = `θ`;
                    const sub = <sub>{blockIndex}</sub>;
                    const a = `${m}·θ`;
                    const b = `${n}·θ`;
                    
                    if (isCollapsed) {
                        // Simplified
                        const diff = `${m}-${n}`;
                        // Logic matches the result of R_m^T * R_n
                        if (r===0 && c===0) {
                            content = (
                                <div className="flex flex-col items-center leading-none scale-[0.85] whitespace-nowrap">
                                    <span>cos({diff}·{theta}{sub})</span>
                                </div>
                            );
                        } else if (r===0 && c===1) {
                            content = (
                                <div className="flex flex-col items-center leading-none scale-[0.85] whitespace-nowrap">
                                    <span>sin({diff}·{theta}{sub})</span>
                                </div>
                            );
                        } else if (r===1 && c===0) {
                            content = (
                                <div className="flex flex-col items-center leading-none scale-[0.85] whitespace-nowrap">
                                    <span>-sin({diff}·{theta}{sub})</span>
                                </div>
                            );
                        } else {
                            content = (
                                <div className="flex flex-col items-center leading-none scale-[0.85] whitespace-nowrap">
                                    <span>cos({diff}·{theta}{sub})</span>
                                </div>
                            );
                        }
                    } else {
                        // Expanded - Vertically stacked for legibility
                         if (r===0 && c===0) {
                             content = (
                                <div className="flex flex-col items-center leading-none scale-[0.65] space-y-0.5 whitespace-nowrap">
                                    <span>cos({a}{sub})cos({b}{sub})</span>
                                    <span>+ sin({a}{sub})sin({b}{sub})</span>
                                </div>
                             )
                        } else if (r===0 && c===1) {
                             content = (
                                <div className="flex flex-col items-center leading-none scale-[0.65] space-y-0.5 whitespace-nowrap">
                                    <span>sin({a}{sub})cos({b}{sub})</span>
                                    <span>- cos({a}{sub})sin({b}{sub})</span>
                                </div>
                             )
                        } else if (r===1 && c===0) {
                             content = (
                                <div className="flex flex-col items-center leading-none scale-[0.65] space-y-0.5 whitespace-nowrap">
                                    <span>cos({a}{sub})sin({b}{sub})</span>
                                    <span>- sin({a}{sub})cos({b}{sub})</span>
                                </div>
                             )
                        } else {
                             content = (
                                <div className="flex flex-col items-center leading-none scale-[0.65] space-y-0.5 whitespace-nowrap">
                                    <span>sin({a}{sub})sin({b}{sub})</span>
                                    <span>+ cos({a}{sub})cos({b}{sub})</span>
                                </div>
                             )
                        }
                    }
                 }

                 return (
                   <div 
                      key={`${row}-${col}`} 
                      className={`
                        flex items-center justify-center text-[7px] md:text-[8px] font-mono w-full h-full overflow-hidden
                        ${isBlock ? 'bg-highlight text-ink font-bold' : ''}
                      `}
                   >
                     {content}
                   </div>
                 );
               })
             ))}
           </div>
        );
     }

     // Default Block View
     return (
        <div className="grid grid-cols-1 gap-1 p-2 h-full w-full">
            {[0, 1, 2, 3].map((i) => (
                <div 
                    key={i}
                    onMouseEnter={() => setHoveredBlock(i)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    className={`
                        relative border transition-all duration-500 flex flex-col justify-center items-center h-full w-full
                        ${hoveredBlock === i ? `bg-highlight border-forest scale-105 z-10 shadow-md ring-1 ring-forest` : 'bg-paper-dark/30 border-ink/20'}
                    `}
                >
                    <div className="absolute top-0 right-1 text-[8px] font-mono opacity-40">Blk {i}</div>
                    
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[9px] md:text-[10px] items-center justify-items-center w-full px-2">
                        {isCollapsed ? (
                            <>
                                <div className="animate-in fade-in zoom-in duration-500">cos(({m}-{n})·θ<sub>{i}</sub>)</div>
                                <div className="animate-in fade-in zoom-in duration-500">sin(({m}-{n})·θ<sub>{i}</sub>)</div>
                                <div className="animate-in fade-in zoom-in duration-500">-sin(({m}-{n})·θ<sub>{i}</sub>)</div>
                                <div className="animate-in fade-in zoom-in duration-500">cos(({m}-{n})·θ<sub>{i}</sub>)</div>
                            </>
                        ) : (
                            <>
                                <div className="whitespace-nowrap transition-opacity duration-300">cos({m}·θ<sub>{i}</sub>)cos({n}·θ<sub>{i}</sub>) + sin({m}·θ<sub>{i}</sub>)sin({n}·θ<sub>{i}</sub>)</div>
                                <div className="whitespace-nowrap transition-opacity duration-300">sin({m}·θ<sub>{i}</sub>)cos({n}·θ<sub>{i}</sub>) - cos({m}·θ<sub>{i}</sub>)sin({n}·θ<sub>{i}</sub>)</div>
                                <div className="whitespace-nowrap transition-opacity duration-300">cos({m}·θ<sub>{i}</sub>)sin({n}·θ<sub>{i}</sub>) - sin({m}·θ<sub>{i}</sub>)cos({n}·θ<sub>{i}</sub>)</div>
                                <div className="whitespace-nowrap transition-opacity duration-300">sin({m}·θ<sub>{i}</sub>)sin({n}·θ<sub>{i}</sub>) + cos({m}·θ<sub>{i}</sub>)cos({n}·θ<sub>{i}</sub>)</div>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
     );
  };

  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative overflow-hidden">
        <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 23: Applying the Identities
        </div>
        
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-paper-pattern" />

        <div className="mt-16 flex flex-col items-center relative z-10">
            <div className="relative flex flex-col h-[360px] w-full max-w-[600px] justify-center items-center">
                {/* Brackets */}
                <div className="absolute top-0 left-0 w-6 h-full border-l-4 border-t-4 border-b-4 border-ink transition-all duration-300"></div>
                <div className="absolute top-0 right-0 w-6 h-full border-r-4 border-t-4 border-b-4 border-ink transition-all duration-300"></div>

                <div className="w-full h-full p-4">
                    <MatrixContent />
                </div>

                {/* Hover Hint */}
                <div 
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-rust cursor-help underline decoration-dashed hover:text-ink transition-colors"
                    onMouseEnter={() => setShowRealMatrix(true)}
                    onMouseLeave={() => setShowRealMatrix(false)}
                >
                    (Hover to see full matrix)
                </div>
            </div>

            <div className="mt-8 flex gap-4">
                 <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`
                       px-8 py-3 font-mono font-bold text-sm border-2 shadow-sm transition-all duration-500
                       ${isCollapsed 
                          ? 'bg-paper text-rust border-rust' 
                          : 'bg-ink text-paper border-ink hover:bg-forest hover:border-forest'
                       }
                    `}
                 >
                    {isCollapsed ? "↺ Expand Terms" : "Apply Identities (Collapse)"}
                 </button>
            </div>
            
            <div className={`mt-6 text-center transition-opacity duration-500 ${isCollapsed ? 'opacity-100' : 'opacity-0'}`}>
                <p className="font-serif text-lg text-ink italic">
                    The absolute positions <span className="font-mono not-italic font-bold">{m}</span> and <span className="font-mono not-italic font-bold">{n}</span> have disappeared.
                    <br/>
                    They are replaced by the single relative term: <span className="font-mono not-italic font-bold bg-highlight px-1 border border-ink/20">{m} - {n}</span>.
                </p>
            </div>

        </div>
    </div>
  );
};

export default RopeMatrixSimplificationDemo;
