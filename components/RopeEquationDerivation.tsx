
import React, { useState } from 'react';
import { LITTLE_Q, TWINKLE_K, formatFloat } from '../constants';

const RopeEquationDerivation: React.FC = () => {

  // --- Helper Components ---

  const Matrix8x8 = ({ pos, color, label }: { pos: number, color: string, label: string }) => {
    const [showRealMatrix, setShowRealMatrix] = useState(false);
    const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

    const borderColor = color === 'text-rust' ? 'border-rust' : 'border-forest';

    return (
      <div className="flex flex-col items-center relative pb-6"> {/* pb-6 reserves space for absolute disclaimer */}
        <div className="h-6 mb-1 text-xs font-mono font-bold text-ink flex items-end">{label}</div>
        
        {/* Matrix Container */}
        <div className="relative flex flex-col h-[280px] w-[200px] md:w-[220px] justify-center transition-all duration-300">
            {/* Brackets */}
            <div className="absolute top-0 left-0 w-4 h-full border-l-2 border-t-2 border-b-2 border-ink"></div>
            <div className="absolute top-0 right-0 w-4 h-full border-r-2 border-t-2 border-b-2 border-ink"></div>

            {showRealMatrix ? (
               <div className="grid grid-cols-8 gap-[1px] bg-ink/5 border border-ink/10 p-1 w-full h-full items-center justify-center">
                 {Array.from({ length: 8 }).map((_, row) => (
                   Array.from({ length: 8 }).map((_, col) => {
                     const blockIndex = Math.floor(row / 2);
                     const colBlockIndex = Math.floor(col / 2);
                     const isBlock = blockIndex === colBlockIndex;
                     
                     let content = <span className="text-ink/10">0</span>;
                     
                     if (isBlock) {
                        const r = row % 2;
                        const c = col % 2;
                        const type = (r === 0 && c === 0) ? 'cos' :
                                     (r === 0 && c === 1) ? '-sin' :
                                     (r === 1 && c === 0) ? 'sin' : 'cos';
                        
                        content = (
                          <div className="flex flex-col items-center leading-none scale-90">
                            <span>{type}</span>
                            <span className="opacity-70 text-[6px]">({pos}·θ<sub>{blockIndex}</sub>)</span>
                          </div>
                        );
                     }

                     return (
                       <div 
                          key={`${row}-${col}`} 
                          className={`
                            flex items-center justify-center text-[7px] font-mono w-full h-full
                            ${isBlock ? 'bg-highlight text-ink font-bold' : ''}
                          `}
                       >
                         {content}
                       </div>
                     );
                   })
                 ))}
               </div>
            ) : (
                <div className="grid grid-cols-1 gap-1 p-2 h-full">
                  {[0, 1, 2, 3].map((i) => (
                      <div 
                          key={i}
                          onMouseEnter={() => setHoveredBlock(i)}
                          onMouseLeave={() => setHoveredBlock(null)}
                          className={`
                              relative p-0.5 border transition-all duration-300 cursor-pointer flex flex-col justify-center
                              ${hoveredBlock === i ? `bg-highlight ${borderColor} scale-105 z-10 shadow-md ring-1` : 'bg-paper-dark/30 border-ink/20'}
                          `}
                      >
                          <div className="absolute top-0 right-1 text-[8px] font-mono opacity-40">Block {i}</div>
                          
                          <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 font-mono text-[9px] md:text-[10px] items-center justify-items-center">
                              <div>cos(<span className={color}>{pos}·θ<sub>{i}</sub></span>)</div>
                              <div>-sin(<span className={color}>{pos}·θ<sub>{i}</sub></span>)</div>
                              <div>sin(<span className={color}>{pos}·θ<sub>{i}</sub></span>)</div>
                              <div>cos(<span className={color}>{pos}·θ<sub>{i}</sub></span>)</div>
                          </div>
                      </div>
                  ))}
                </div>
            )}
        </div>

        {/* Disclaimer Toggle - Absolute to avoid height flow issues affecting alignment */}
        <div 
            className={`absolute -bottom-1 left-0 right-0 text-[10px] font-mono ${color} cursor-help underline decoration-dashed hover:text-ink transition-colors text-center`}
            onMouseEnter={() => setShowRealMatrix(true)}
            onMouseLeave={() => setShowRealMatrix(false)}
        >
            (Hover for full rotation matrix)
        </div>
      </div>
    );
  };

  const Vector8x1 = ({ values, label, sub, colorClass }: { values: number[], label: React.ReactNode, sub: string, colorClass: string }) => (
    <div className="flex flex-col items-center pb-6"> {/* Match padding of Matrix */}
        <div className={`h-6 mb-1 text-center leading-none flex flex-col justify-end ${colorClass}`}>
            <span className="text-base font-serif font-bold italic block">{label}</span>
            <span className="text-[8px] font-mono opacity-60 text-ink-light">{sub}</span>
        </div>

        <div className="relative flex flex-col h-[280px] w-[60px] md:w-[70px] justify-center">
            <div className="absolute top-0 left-0 w-3 h-full border-l-2 border-t-2 border-b-2 border-ink"></div>
            <div className="absolute top-0 right-0 w-3 h-full border-r-2 border-t-2 border-b-2 border-ink"></div>
            <div className="absolute bottom-0 left-0 w-3 h-full border-l-2 border-t-2 border-b-2 border-ink"></div>
            <div className="absolute bottom-0 right-0 w-3 h-full border-r-2 border-t-2 border-b-2 border-ink"></div>

            <div className="flex flex-col justify-around h-full py-2 px-1 gap-1">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col items-center justify-center h-full bg-paper/50 rounded border border-transparent">
                         <div className="text-center font-mono text-[9px] text-ink leading-tight">{formatFloat(values[2*i])}</div>
                         <div className="text-center font-mono text-center text-[9px] text-ink leading-tight">{formatFloat(values[2*i+1])}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  return (
    <div className="my-8 p-2 md:p-6 bg-paper border border-ink relative overflow-hidden">
        <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 19: The Matrix Expansion
        </div>
        
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-paper-pattern" />

        <div className="mt-16 flex flex-col gap-8 relative z-10">
            
            {/* The Interaction Formula */}
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 bg-white/40 px-8 py-4 border border-grid rounded-lg shadow-sm">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-rust font-mono text-2xl">q'<sup>T</sup></span>
                        <span className="text-[10px] font-mono text-ink-light opacity-70 mt-1">(Rotated & Transposed)</span>
                    </div>
                    <span className="text-2xl text-ink font-bold pb-4">·</span>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-forest font-mono text-2xl">k'</span>
                         <span className="text-[10px] font-mono text-ink-light opacity-70 mt-1">(Rotated)</span>
                    </div>
                </div>
            </div>

            {/* The Equation View */}
            <div className="w-full overflow-x-auto pt-10 pb-6 px-4">
                <div className="flex flex-row items-center justify-start xl:justify-center min-w-max gap-3 mx-auto">
                    
                    {/* Left Term Group: (R2 * q)^T */}
                    <div className="relative p-4 border-2 border-ink/20 rounded-xl bg-paper-dark/10 group hover:border-rust/30 transition-colors mt-2">
                        <div className="absolute top-0 -translate-y-1/2 left-4 bg-paper px-2 text-[10px] font-mono text-rust font-bold uppercase tracking-wider border border-ink/10">The Rotated Query</div>
                        
                        <div className="flex items-center gap-2">
                            <Matrix8x8 pos={2} label="R₂" color="text-rust" />
                            
                            {/* Multiplication Sign - Vertically Centered relative to box content */}
                            <div className="flex flex-col items-center pb-6">
                                <div className="h-6 mb-1"></div> {/* Spacer for header alignment */}
                                <div className="h-[280px] flex items-center">
                                    <span className="text-2xl text-ink/30 font-bold">×</span>
                                </div>
                            </div>
                            
                            <Vector8x1 
                                values={LITTLE_Q} 
                                label={<span>q<sub>2</sub></span>} 
                                sub="Little" 
                                colorClass="text-rust" 
                            />
                        </div>

                        {/* Transpose Symbol */}
                        <div className="absolute -right-3 -top-3 bg-paper border-2 border-ink w-8 h-8 flex items-center justify-center font-mono font-bold text-lg shadow-sm">T</div>
                    </div>

                    {/* Dot Product */}
                    <div className="text-5xl text-ink font-bold pb-8">·</div>

                    {/* Right Term Group: (R0 * k) */}
                    <div className="relative p-4 border-2 border-ink/20 rounded-xl bg-paper-dark/10 group hover:border-forest/30 transition-colors mt-2">
                        <div className="absolute top-0 -translate-y-1/2 left-4 bg-paper px-2 text-[10px] font-mono text-forest font-bold uppercase tracking-wider border border-ink/10">The Rotated Key</div>
                        
                        <div className="flex items-center gap-2">
                            <Matrix8x8 pos={0} label="R₀" color="text-forest" />
                            
                            <div className="flex flex-col items-center pb-6">
                                <div className="h-6 mb-1"></div>
                                <div className="h-[280px] flex items-center">
                                    <span className="text-2xl text-ink/30 font-bold">×</span>
                                </div>
                            </div>
                            
                            <Vector8x1 
                                values={TWINKLE_K} 
                                label={<span>k<sub>0</sub></span>} 
                                sub="Twinkle" 
                                colorClass="text-forest" 
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="bg-highlight/20 p-4 border-l-4 border-rust max-w-3xl mx-auto">
                <p className="font-serif text-base text-center text-ink">
                    This is the formal definition. We take the original semantic vector <span className="font-mono text-rust font-bold">q<sub>2</sub></span>, 
                    rotate it by matrix <span className="font-mono text-ink font-bold">R<sub>2</sub></span>, 
                    transpose it, and dot it with the vector <span className="font-mono text-forest font-bold">k<sub>0</sub></span> rotated by <span className="font-mono text-ink font-bold">R<sub>0</sub></span>.
                </p>
            </div>
        </div>
    </div>
  );
};

export default RopeEquationDerivation;
