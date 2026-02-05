
import React, { useState } from 'react';

const RopeMatrixStructureDemo: React.FC = () => {
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);
  const [showRealMatrix, setShowRealMatrix] = useState(false);
  
  const position = 2; // Token "Little"

  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative overflow-hidden">
        <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 17: The RoPE Matrix Structure
        </div>

        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-paper-pattern" />

        <div className="mt-12 flex flex-col gap-12 relative z-10">
            
            {/* Header Info */}
            <div className="text-center">
                <div className="inline-block bg-paper-dark border border-ink px-6 py-3 shadow-sm">
                    <span className="font-mono font-bold text-ink">Rotating the Query Vector in Position 2</span>

                </div>
                <p className="mt-4 text-sm text-ink-light max-w-2xl mx-auto">
                    To apply a rotation to our 8D vectors, we use a <strong>Block Diagonal Rotation Matrix</strong>. 
                    This allows us to calculate our rotated vector while preserving the independence of our 2D pairs.
                </p>
            </div>

            {/* The Matrix Equation - Scrollable Container */}
            <div className="overflow-x-auto pb-8 pt-4 -mx-4 md:mx-0 px-4">
                <div className="flex flex-row items-center justify-start xl:justify-center min-w-max gap-4 mx-auto">
                
                    {/* 1. The Matrix R */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="font-mono text-xs text-ink-light font-bold whitespace-nowrap">
                            R (Rotation Matrix)
                        </div>
                        
                        {/* Matrix Container */}
                        <div className="relative flex flex-col justify-center w-[220px] h-[360px] md:w-[240px] md:h-[400px]">
                            {/* Brackets */}
                            <div className="absolute top-0 left-0 w-4 h-full border-l-2 border-t-2 border-b-2 border-ink"></div>
                            <div className="absolute top-0 right-0 w-4 h-full border-r-2 border-t-2 border-b-2 border-ink"></div>

                            <div className="w-full h-full p-2">
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
                                            // 0,0 -> cos
                                            // 0,1 -> -sin
                                            // 1,0 -> sin
                                            // 1,1 -> cos
                                            const type = (r === 0 && c === 0) ? 'cos' :
                                                        (r === 0 && c === 1) ? '-sin' :
                                                        (r === 1 && c === 0) ? 'sin' : 'cos';
                                            
                                            content = (
                                            <div className="flex flex-col items-center leading-none">
                                                <span>{type}</span>
                                                <span className="scale-75 opacity-70">(2θ<sub>{blockIndex}</sub>)</span>
                                            </div>
                                            );
                                        }

                                        return (
                                        <div 
                                            key={`${row}-${col}`} 
                                            className={`
                                                flex items-center justify-center text-[7px] md:text-[8px] font-mono w-full h-full
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
                                <div className="grid grid-cols-1 gap-2 h-full">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div 
                                            key={i}
                                            onMouseEnter={() => setHoveredBlock(i)}
                                            onMouseLeave={() => setHoveredBlock(null)}
                                            className={`
                                                relative p-3 border transition-all duration-300 cursor-pointer flex flex-col justify-center items-center
                                                ${hoveredBlock === i ? 'bg-highlight border-forest scale-105 z-10 shadow-md ring-1 ring-forest' : 'bg-paper-dark/30 border-ink/20'}
                                            `}
                                        >
                                            <div className="absolute top-1 right-2 text-[9px] font-mono opacity-40">Block {i}</div>
                                            
                                            {/* 2x2 Matrix Math */}
                                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-xs md:text-sm items-center justify-items-center">
                                                <div>cos(<span className="text-rust">{position}·θ<sub>{i}</sub></span>)</div>
                                                <div>-sin(<span className="text-rust">{position}·θ<sub>{i}</sub></span>)</div>
                                                <div>sin(<span className="text-rust">{position}·θ<sub>{i}</sub></span>)</div>
                                                <div>cos(<span className="text-rust">{position}·θ<sub>{i}</sub></span>)</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                )}
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div 
                            className="text-[10px] md:text-xs font-mono text-rust cursor-help underline decoration-dashed decoration-rust/50 hover:text-ink hover:decoration-solid transition-colors text-center max-w-[200px] h-6"
                            onMouseEnter={() => setShowRealMatrix(true)}
                            onMouseLeave={() => setShowRealMatrix(false)}
                        >
                            (Simplified for clarity. Hover to full rotation matrix)
                        </div>
                    </div>

                    {/* Multiply Symbol */}
                    <div className="text-3xl font-mono text-ink/50 self-center px-2">×</div>

                    {/* 2. The Vector x */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="font-mono text-xs text-ink-light font-bold whitespace-nowrap">x (Vector)</div>
                        
                        {/* Vector Container */}
                        <div className="relative flex flex-col justify-center w-[60px] md:w-[80px] h-[360px] md:h-[400px]">
                            <div className="absolute top-0 left-0 w-3 h-full border-l-2 border-t-2 border-b-2 border-ink"></div>
                            <div className="absolute top-0 right-0 w-3 h-full border-r-2 border-t-2 border-b-2 border-ink"></div>

                            <div className="w-full h-full p-2 flex flex-col gap-2">
                                {[0, 1, 2, 3].map(i => (
                                    <div 
                                        key={i} 
                                        className={`
                                            flex flex-col items-center justify-center flex-1 w-full border transition-all duration-300 rounded-sm
                                            ${hoveredBlock === i ? 'bg-highlight border-forest shadow-sm' : 'bg-paper border-transparent'}
                                        `}
                                    >
                                        <span className="font-mono text-xs md:text-sm">x<sub>{2*i}</sub></span>
                                        <span className="font-mono text-xs md:text-sm">x<sub>{2*i+1}</sub></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-6"></div> {/* Spacer to align with matrix column's label space */}
                    </div>

                    {/* Equals Symbol */}
                    <div className="text-3xl font-mono text-ink/50 self-center px-2">=</div>

                    {/* 3. The Result x' */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="font-mono text-xs text-ink-light font-bold whitespace-nowrap">
                            x' (Rotated Vector)
                        </div>

                        {/* Result Container */}
                        <div className="relative flex flex-col justify-center w-[240px] h-[360px] md:w-[260px] md:h-[400px]">
                            <div className="absolute top-0 left-0 w-3 h-full border-l-2 border-t-2 border-b-2 border-ink"></div>
                            <div className="absolute top-0 right-0 w-3 h-full border-r-2 border-t-2 border-b-2 border-ink"></div>

                            <div className="w-full h-full p-2 flex flex-col gap-2">
                                {[0, 1, 2, 3].map(i => (
                                    <div 
                                        key={i} 
                                        className={`
                                            flex flex-col items-center justify-center flex-1 w-full border transition-all duration-300 px-1 rounded-sm
                                            ${hoveredBlock === i ? 'bg-highlight border-forest shadow-sm' : 'bg-paper border-transparent'}
                                        `}
                                    >
                                        <div className="text-[9px] md:text-[10px] font-mono text-center leading-tight whitespace-nowrap">
                                            x<sub>{2*i}</sub>cos(<span className="text-rust">2·θ<sub>{i}</sub></span>) - x<sub>{2*i+1}</sub>sin(<span className="text-rust">2·θ<sub>{i}</sub></span>)
                                        </div>
                                        <div className="w-full h-px bg-ink/10 my-1"></div>
                                        <div className="text-[9px] md:text-[10px] font-mono text-center leading-tight whitespace-nowrap">
                                            x<sub>{2*i}</sub>sin(<span className="text-rust">2·θ<sub>{i}</sub></span>) + x<sub>{2*i+1}</sub>cos(<span className="text-rust">2·θ<sub>{i}</sub></span>)
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-6"></div> {/* Spacer to align */}
                    </div>

                </div>
            </div>

            {/* Insight Box */}
            <div className="bg-paper-dark border-l-4 border-rust p-6 mt-4">
                <h5 className="font-serif font-bold text-ink mb-2">The Scale-Up</h5>
                <p className="text-sm text-ink-light leading-relaxed">
                    Notice how the position index <span className="font-mono font-bold text-rust">m=2</span> is distributed into every single block. 
                    However, because each block has a unique frequency <span className="font-mono font-bold">θ<sub>i</sub></span>, 
                    the actual rotation angle <span className="font-mono font-bold bg-white/50 px-1 rounded">2·θ<sub>i</sub></span> will be vastly different for Block 0 versus Block 3.
                </p>
            </div>

        </div>
    </div>
  );
};

export default RopeMatrixStructureDemo;
