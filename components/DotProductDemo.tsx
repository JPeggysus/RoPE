
import React, { useState } from 'react';
import { formatFloat } from '../constants';

const DotProductDemo: React.FC = () => {
  const [angleQ, setAngleQ] = useState(45);
  const [angleK, setAngleK] = useState(15);

  // Vector logic (simplified to 2D for visualization)
  const radius = 80;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  // Calculate coordinates
  // Math: 0 deg is Right (East), 90 deg is Up (North)
  const qx = Math.cos(toRad(angleQ));
  const qy = Math.sin(toRad(angleQ)); 
  
  const kx = Math.cos(toRad(angleK));
  const ky = Math.sin(toRad(angleK));

  // The Dot Product Calculation
  const dotProduct = (qx * kx) + (qy * ky);
  
  // SVG helpers
  const center = 150;
  
  // We need two sets of coordinates:
  // 1. The tip of the vector (for labels)
  // 2. The end of the line (shortened so the arrowhead sits on top, not inside)
  const arrowLen = 12; 
  
  const getSvgCoord = (x: number, y: number, r: number) => ({
    x: center + x * r,
    y: center - y * r // Flip Y because SVG Y increases downwards
  });

  const qEnd = getSvgCoord(qx, qy, radius);
  const kEnd = getSvgCoord(kx, ky, radius);
  
  const qLineEnd = getSvgCoord(qx, qy, radius - arrowLen);
  const kLineEnd = getSvgCoord(kx, ky, radius - arrowLen);

  // Interpretation Logic
  let interpretationTitle = "";
  
  if (dotProduct > 0.6) {
      interpretationTitle = "Strong Alignment";
  } else if (dotProduct > 0.2) {
      interpretationTitle = "Weak Alignment";
  } else if (dotProduct > -0.2) {
      interpretationTitle = "Orthogonal (Neutral)";
  } else if (dotProduct > -0.6) {
      interpretationTitle = "Weak Opposition";
  } else {
      interpretationTitle = "Direct Opposition";
  }

  const getDynamicDescription = (val: number) => {
    if (val > 0.6) return "The vectors point in the same direction. The model identifies a strong match and prioritizes this token's information.";
    if (val > 0.2) return "The vectors point in a similar direction. The model identifies a partial match and includes some of this token's information.";
    if (val > -0.2) return "The vectors are perpendicular (90° apart). The model identifies no relationship here and effectively ignores this token.";
    if (val > -0.6) return "The vectors point in different directions. The model identifies a mismatch and filters out this token's information.";
    return "The vectors point in opposite directions. The model identifies a conflict and completely blocks this token's information.";
  };

  // 1.0 (Black/Ink) -> -1.0 (White/Paper)
  // Map [-1, 1] to [100%, 0%] lightness roughly
  // 1 -> 0% L
  // -1 -> 100% L
  // formula: (1 - dotProduct) / 2 * 100
  // dot=1 => (0)/2 * 100 = 0%
  // dot=-1 => (2)/2 * 100 = 100%
  const lightness = Math.round(((1 - dotProduct) / 2) * 100);
  const scoreBgColor = `hsl(0, 0%, ${lightness}%)`;
  
  // Hardcoded colors for SVG
  const HEX_RUST = '#b85a3c';
  const HEX_FOREST = '#2d5a4a';
  const HEX_GRID = '#c4b8a4';

  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative overflow-hidden">
        {/* Background Grid for Math Context */}
        <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
            backgroundImage: `linear-gradient(var(--grid) 1px, transparent 1px),
                linear-gradient(90deg, var(--grid) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
            }}
        />

        <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 4: Geometric Similarity
        </div>

        <div className="flex flex-col lg:flex-row gap-12 mt-12 relative z-10">
            
            {/* LEFT: Visualizer */}
            <div className="flex-1 flex flex-col items-center">
                <div className="relative w-full max-w-[300px] aspect-square bg-white/50 border-2 border-grid rounded-full shadow-inner">
                    <svg viewBox="0 0 300 300" className="w-full h-full absolute top-0 left-0 overflow-visible">
                        {/* Axes */}
                        <line x1="150" y1="20" x2="150" y2="280" stroke={HEX_GRID} strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="20" y1="150" x2="280" y2="150" stroke={HEX_GRID} strokeWidth="1" strokeDasharray="4 4" />

                        {/* Definitions */}
                        <defs>
                            {/* refX="0" means the marker starts exactly where the line ends. This prevents overlap/extension issues. */}
                            <marker id="arrowheadQ" markerWidth="10" markerHeight="10" refX="0" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                                <path d="M0,0 L10,5 L0,10 z" fill={HEX_RUST} />
                            </marker>
                            <marker id="arrowheadK" markerWidth="10" markerHeight="10" refX="0" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                                <path d="M0,0 L10,5 L0,10 z" fill={HEX_FOREST} />
                            </marker>
                        </defs>

                        {/* Vector K (Key) - Forest */}
                        <line 
                            x1={center} y1={center} 
                            x2={kLineEnd.x} y2={kLineEnd.y} 
                            stroke={HEX_FOREST} 
                            strokeWidth="4" 
                            markerEnd="url(#arrowheadK)" 
                        />
                        
                        {/* Vector Q (Query) - Rust */}
                        <line 
                            x1={center} y1={center} 
                            x2={qLineEnd.x} y2={qLineEnd.y} 
                            stroke={HEX_RUST} 
                            strokeWidth="4" 
                            markerEnd="url(#arrowheadQ)" 
                        />
                    </svg>

                    {/* Labels */}
                    <div 
                        className="absolute text-rust font-bold font-mono text-sm bg-paper/80 px-1 rounded border border-rust/20" 
                        style={{ left: `${(qEnd.x / 300) * 100}%`, top: `${(qEnd.y / 300) * 100}%`, transform: 'translate(10px, -10px)' }}
                    >
                        q
                    </div>
                    <div 
                        className="absolute text-forest font-bold font-mono text-sm bg-paper/80 px-1 rounded border border-forest/20" 
                        style={{ left: `${(kEnd.x / 300) * 100}%`, top: `${(kEnd.y / 300) * 100}%`, transform: 'translate(10px, -10px)' }}
                    >
                        k
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-8 w-full max-w-[340px]">
                    <div className="flex-1 bg-paper-dark p-3 rounded border border-ink/10">
                        <div className="flex justify-between mb-2">
                            <label className="text-rust font-bold font-mono text-xs">Rotate Q</label>
                            <span className="font-mono text-xs text-ink">{angleQ}°</span>
                        </div>
                        <input 
                            type="range" min="0" max="360" value={angleQ} 
                            onChange={(e) => setAngleQ(Number(e.target.value))}
                            className="w-full h-2 bg-grid rounded-lg appearance-none cursor-pointer accent-rust"
                        />
                    </div>
                    <div className="flex-1 bg-paper-dark p-3 rounded border border-ink/10">
                        <div className="flex justify-between mb-2">
                            <label className="text-forest font-bold font-mono text-xs">Rotate K</label>
                            <span className="font-mono text-xs text-ink">{angleK}°</span>
                        </div>
                        <input 
                            type="range" min="0" max="360" value={angleK} 
                            onChange={(e) => setAngleK(Number(e.target.value))}
                            className="w-full h-2 bg-grid rounded-lg appearance-none cursor-pointer accent-forest"
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT: The Math */}
            <div className="flex-1 flex flex-col justify-center">
                <h4 className="font-serif text-2xl mb-6 text-ink">The Dot Product</h4>
                
                <div className="bg-paper p-6 border border-ink space-y-6 font-mono text-sm shadow-sm">
                    {/* Component Breakdown */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between pb-4 border-b border-grid/30">
                        <div className="flex items-center gap-2">
                            <span className="text-rust font-bold text-lg">q</span> 
                            <span className="text-ink-light">[{formatFloat(qx)}, {formatFloat(qy)}]</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-forest font-bold text-lg">k</span> 
                            <span className="text-ink-light">[{formatFloat(kx)}, {formatFloat(ky)}]</span>
                        </div>
                    </div>

                    {/* The Formula - Single Line */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2 leading-loose">
                            <span className="text-ink font-bold">q · k</span>
                            <span>=</span>
                            <span className="bg-paper-dark px-2 py-1 rounded inline-flex items-center border border-ink/10">
                                <span className="text-rust">{formatFloat(qx)}</span> 
                                <span className="mx-1 text-ink-light">×</span> 
                                <span className="text-forest">{formatFloat(kx)}</span>
                            </span>
                            <span>+</span>
                            <span className="bg-paper-dark px-2 py-1 rounded inline-flex items-center border border-ink/10">
                                <span className="text-rust">{formatFloat(qy)}</span> 
                                <span className="mx-1 text-ink-light">×</span> 
                                <span className="text-forest">{formatFloat(ky)}</span>
                            </span>
                        </div>
                    </div>

                    {/* The Result */}
                    <div className="pt-2 flex items-center gap-4">
                        <span className="text-2xl text-ink">=</span>
                        <div 
                            className="px-6 py-3 text-3xl font-bold border-2 border-ink rounded shadow-lg min-w-[120px] text-center"
                            style={{ 
                                backgroundColor: scoreBgColor,
                                color: HEX_RUST
                            }}
                        >
                            {formatFloat(dotProduct)}
                        </div>
                    </div>
                </div>

                <div className="mt-8 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-ink"></div>
                    <div className="pl-6 py-2">
                        <div className="font-hand text-xl mb-1 text-ink">Interpretation:</div>
                        <div className="font-serif text-xl italic text-ink mb-2">
                            "{interpretationTitle}"
                        </div>
                        <p className="text-sm text-ink-light leading-relaxed animate-in fade-in duration-300" key={interpretationTitle}>
                            {getDynamicDescription(dotProduct)}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default DotProductDemo;
