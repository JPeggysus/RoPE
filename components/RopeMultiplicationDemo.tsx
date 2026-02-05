
import React, { useState } from 'react';

const RopeMultiplicationDemo: React.FC = () => {
  const [showResult, setShowResult] = useState(false);
  const [showRealMatrix, setShowRealMatrix] = useState(false);
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  // Constants to simulate variables m and n
  const m = "2";
  const n = "0";

  // Helper for the block diagonal rendering
  const MatrixBlockGrid = ({ 
    type, 
    pos, 
    isTransposed 
  }: { 
    type: 'input' | 'result', 
    pos?: string, // e.g., 'm' or 'n' or '2' or '0'
    isTransposed?: boolean 
  }) => {
    
    return (
      <div className="relative flex flex-col h-full w-full justify-center">
        {/* Brackets */}
        <div className="absolute top-0 left-0 w-4 h-full border-l-2 border-t-2 border-b-2 border-ink transition-all duration-300"></div>
        <div className="absolute top-0 right-0 w-4 h-full border-r-2 border-t-2 border-b-2 border-ink transition-all duration-300"></div>

        {showRealMatrix ? (
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
                    
                    if (type === 'input') {
                        // MATCH FIGURE 19 STYLE
                        let typeStr = '';
                        if (isTransposed) {
                             // Transposed:
                             // c   s
                             // -s  c
                             if (r===0 && c===0) typeStr = 'cos';
                             else if (r===0 && c===1) typeStr = 'sin';
                             else if (r===1 && c===0) typeStr = '-sin';
                             else typeStr = 'cos';
                        } else {
                             // Normal:
                             // c   -s
                             // s    c
                             if (r===0 && c===0) typeStr = 'cos';
                             else if (r===0 && c===1) typeStr = '-sin';
                             else if (r===1 && c===0) typeStr = 'sin';
                             else typeStr = 'cos';
                        }
                        
                        content = (
                          <div className="flex flex-col items-center leading-none scale-90">
                            <span>{typeStr}</span>
                            <span className="opacity-70 text-[6px]">({pos}·θ<sub>{blockIndex}</sub>)</span>
                          </div>
                        );
                    } else {
                        // RESULT MATRIX
                        // Needs to be legible. Stack terms vertically.
                        const a = `${m}·θ`;
                        const b = `${n}·θ`;
                        const sub = <sub>{blockIndex}</sub>;
                        
                        if (r===0 && c===0) {
                             content = (
                                <div className="flex flex-col items-center leading-none scale-[0.7] space-y-0.5 whitespace-nowrap">
                                    <span>cos({a}{sub})cos({b}{sub})</span>
                                    <span>+ sin({a}{sub})sin({b}{sub})</span>
                                </div>
                             )
                        } else if (r===0 && c===1) {
                             content = (
                                <div className="flex flex-col items-center leading-none scale-[0.7] space-y-0.5 whitespace-nowrap">
                                    <span>sin({a}{sub})cos({b}{sub})</span>
                                    <span>- cos({a}{sub})sin({b}{sub})</span>
                                </div>
                             )
                        } else if (r===1 && c===0) {
                             content = (
                                <div className="flex flex-col items-center leading-none scale-[0.7] space-y-0.5 whitespace-nowrap">
                                    <span>cos({a}{sub})sin({b}{sub})</span>
                                    <span>- sin({a}{sub})cos({b}{sub})</span>
                                </div>
                             )
                        } else {
                             content = (
                                <div className="flex flex-col items-center leading-none scale-[0.7] space-y-0.5 whitespace-nowrap">
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
        ) : (
            <div className="grid grid-cols-1 gap-1 p-2 h-full w-full">
              {[0, 1, 2, 3].map((i) => (
                  <div 
                      key={i}
                      onMouseEnter={() => setHoveredBlock(i)}
                      onMouseLeave={() => setHoveredBlock(null)}
                      className={`
                          relative border transition-all duration-300 flex flex-col justify-center items-center h-full w-full
                          ${hoveredBlock === i ? `bg-highlight border-forest scale-105 z-10 shadow-md ring-1 ring-forest` : 'bg-paper-dark/30 border-ink/20'}
                      `}
                  >
                      {/* Block Index Label */}
                      <div className="absolute top-0 right-1 text-[8px] font-mono opacity-40">Blk {i}</div>
                      
                      {/* Matrix Math */}
                      {type === 'input' ? (
                          <div className="grid grid-cols-2 gap-x-2 font-mono text-[9px] sm:text-[10px] items-center justify-items-center w-full">
                              {isTransposed ? (
                                  <>
                                      <div>cos({pos}·θ<sub>{i}</sub>)</div>
                                      <div>sin({pos}·θ<sub>{i}</sub>)</div>
                                      <div>-sin({pos}·θ<sub>{i}</sub>)</div>
                                      <div>cos({pos}·θ<sub>{i}</sub>)</div>
                                  </>
                              ) : (
                                  <>
                                      <div>cos({pos}·θ<sub>{i}</sub>)</div>
                                      <div>-sin({pos}·θ<sub>{i}</sub>)</div>
                                      <div>sin({pos}·θ<sub>{i}</sub>)</div>
                                      <div>cos({pos}·θ<sub>{i}</sub>)</div>
                                  </>
                              )}
                          </div>
                      ) : (
                          // Result Matrix (Full Expansion)
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[8px] sm:text-[9px] items-center justify-items-center w-full px-2">
                              <div className="whitespace-nowrap">cos({m}·θ<sub>{i}</sub>)cos({n}·θ<sub>{i}</sub>) + sin({m}·θ<sub>{i}</sub>)sin({n}·θ<sub>{i}</sub>)</div>
                              <div className="whitespace-nowrap">sin({m}·θ<sub>{i}</sub>)cos({n}·θ<sub>{i}</sub>) - cos({m}·θ<sub>{i}</sub>)sin({n}·θ<sub>{i}</sub>)</div>
                              <div className="whitespace-nowrap">cos({m}·θ<sub>{i}</sub>)sin({n}·θ<sub>{i}</sub>) - sin({m}·θ<sub>{i}</sub>)cos({n}·θ<sub>{i}</sub>)</div>
                              <div className="whitespace-nowrap">sin({m}·θ<sub>{i}</sub>)sin({n}·θ<sub>{i}</sub>) + cos({m}·θ<sub>{i}</sub>)cos({n}·θ<sub>{i}</sub>)</div>
                          </div>
                      )}
                  </div>
              ))}
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative overflow-hidden">
        <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 22: The Relative Interaction Matrix
        </div>

        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-paper-pattern" />

        <div className="mt-16 flex flex-col items-center relative z-10">
            
            {/* Header / Intro */}
            <div className="text-center mb-8 max-w-2xl">
                 <p className="font-serif italic text-ink-light">
                     We are isolating the product: <span className="font-mono font-bold text-ink not-italic bg-highlight px-1">R<sub>{m}</sub><sup>T</sup> · R<sub>{n}</sub></span>
                 </p>
                 <p className="text-xs text-ink-light font-mono mt-2">
                    Left: Query Rotation (m={m}). Right: Key Rotation (n={n}).
                 </p>
            </div>

            <div className="flex flex-col items-center w-full">
                
                {/* The Visualization Area */}
                <div className="relative min-h-[360px] flex items-center justify-center p-8 bg-white/40 border border-ink/10 rounded-xl w-full overflow-x-auto">
                    
                    {!showResult ? (
                        <div className="flex gap-4 md:gap-8 items-center">
                            {/* Matrix Rm Transposed */}
                            <div className="flex flex-col items-center">
                                <span className="font-bold font-mono text-rust mb-2">R<sub>{m}</sub><sup>T</sup></span>
                                <div className="w-[180px] h-[280px] md:w-[220px] md:h-[320px]">
                                    <MatrixBlockGrid type="input" pos={m} isTransposed={true} />
                                </div>
                            </div>

                            {/* Dot */}
                            <div className="text-3xl font-bold text-ink/30">·</div>

                            {/* Matrix Rn */}
                            <div className="flex flex-col items-center">
                                <span className="font-bold font-mono text-forest mb-2">R<sub>{n}</sub></span>
                                <div className="w-[180px] h-[280px] md:w-[220px] md:h-[320px]">
                                    <MatrixBlockGrid type="input" pos={n} isTransposed={false} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full">
                             <span className="font-bold font-mono text-ink mb-2">Product Matrix</span>
                             <div className="w-full max-w-[600px] h-[320px]">
                                <MatrixBlockGrid type="result" />
                             </div>
                        </div>
                    )}

                    {/* Disclaimer Overlay for both states */}
                    <div 
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-rust cursor-help underline decoration-dashed hover:text-ink transition-colors"
                        onMouseEnter={() => setShowRealMatrix(true)}
                        onMouseLeave={() => setShowRealMatrix(false)}
                    >
                        (Hover for full rotation matrix)
                    </div>
                </div>

                {/* Interaction Button */}
                <div className="mt-8">
                    <button 
                        onClick={() => setShowResult(!showResult)}
                        className={`
                           px-10 py-3 font-mono border-4 shadow-sm transition-all duration-300
                           ${showResult 
                             ? 'bg-paper text-ink border-grid hover:bg-paper-dark' 
                             : 'bg-ink text-paper border-ink hover:bg-forest hover:border-forest hover:-translate-y-1'
                           }
                        `}
                    >
                        {showResult ? "← Show Original Matrices" : "Multiply Matrices →"}
                    </button>
                </div>

            </div>
        </div>
    </div>
  );
};

export default RopeMultiplicationDemo;
