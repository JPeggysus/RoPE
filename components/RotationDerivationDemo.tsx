
import React, { useState } from 'react';
import { formatFloat } from '../constants';

const RotationDerivationDemo: React.FC = () => {
  const [angle, setAngle] = useState(40);
  
  // Constants
  const vecX = 3;
  const vecY = 2;
  const scale = 30; // pixels per unit
  const origin = 150; // SVG center
  
  // Math Helpers
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const rad = toRad(angle);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // 1. Calculate Rotated Basis Vectors
  // i_prime lands at [cos(theta), sin(theta)]
  const iPrimeX = cos;
  const iPrimeY = sin;
  
  // j_prime lands at [-sin(theta), cos(theta)]
  const jPrimeX = -sin;
  const jPrimeY = cos;

  // 2. Calculate Scaled Components
  // scaled_i = x * i_prime
  const siX = vecX * iPrimeX;
  const siY = vecX * iPrimeY;

  // scaled_j = y * j_prime
  const sjX = vecY * jPrimeX;
  const sjY = vecY * jPrimeY;

  // 3. Final Vector
  const finalX = siX + sjX;
  const finalY = siY + sjY;

  // SVG Coordinate Mapper (Flip Y)
  const map = (x: number, y: number) => ({
    x: origin + x * scale,
    y: origin - y * scale
  });

  const o = map(0, 0);
  const tipI = map(iPrimeX, iPrimeY);
  const tipJ = map(jPrimeX, jPrimeY);
  const tipSI = map(siX, siY); // Tip of the scaled X component
  const tipFinal = map(finalX, finalY); // Final vector tip

  const formatVal = (n: number) => n.toFixed(2);

  return (
    <div className="bg-paper border border-ink p-4 md:p-8 relative overflow-hidden mb-8">
       <div className="absolute inset-0 pointer-events-none opacity-5 bg-paper-pattern" />
       
       <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 16: Basis Vector Rotation
       </div>
       
       <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10 mt-12">
          
          {/* Left: Visualization */}
          <div className="flex-1 flex flex-col items-center w-full mt-24">
            <div className="relative w-full max-w-[300px] aspect-square bg-white/60 border border-grid shadow-inner mb-6">
                <svg viewBox="0 0 300 300" className="absolute top-0 left-0 w-full h-full overflow-visible">
                    <defs>
                        <marker id="arrowRust" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                            <path d="M0,0 L10,5 L0,10 z" fill="#b85a3c" />
                        </marker>
                        <marker id="arrowForest" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                            <path d="M0,0 L10,5 L0,10 z" fill="#2d5a4a" />
                        </marker>
                        <marker id="arrowInk" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                            <path d="M0,0 L10,5 L0,10 z" fill="#2c2416" />
                        </marker>
                    </defs>

                    {/* Grid Lines (Static) */}
                    <line x1={origin} y1="0" x2={origin} y2="300" stroke="#c4b8a4" strokeWidth="1" opacity="0.3" />
                    <line x1="0" y1={origin} x2="300" y2={origin} stroke="#c4b8a4" strokeWidth="1" opacity="0.3" />

                    {/* Rotated Axis Lines (Infinite-ish) */}
                    <line 
                        x1={origin - 200*cos} y1={origin + 200*sin} 
                        x2={origin + 200*cos} y2={origin - 200*sin} 
                        stroke="#b85a3c" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" 
                    />
                    <line 
                        x1={origin - 200*(-sin)} y1={origin + 200*cos} 
                        x2={origin + 200*(-sin)} y2={origin - 200*cos} 
                        stroke="#2d5a4a" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" 
                    />

                    {/* Basis Vectors (Unit Length) */}
                    <line x1={o.x} y1={o.y} x2={tipI.x} y2={tipI.y} stroke="#b85a3c" strokeWidth="2" opacity="0.5" />
                    <text x={tipI.x + 5} y={tipI.y} fontSize="10" fill="#b85a3c" fontFamily="monospace">i'</text>
                    
                    <line x1={o.x} y1={o.y} x2={tipJ.x} y2={tipJ.y} stroke="#2d5a4a" strokeWidth="2" opacity="0.5" />
                    <text x={tipJ.x + 5} y={tipJ.y} fontSize="10" fill="#2d5a4a" fontFamily="monospace">j'</text>

                    {/* The Scaled Components (Walking the vector) */}
                    {/* 3 * i' */}
                    <line x1={o.x} y1={o.y} x2={tipSI.x} y2={tipSI.y} stroke="#b85a3c" strokeWidth="3" markerEnd="url(#arrowRust)" />
                    <text x={(o.x+tipSI.x)/2} y={(o.y+tipSI.y)/2 - 10} fontSize="12" fill="#b85a3c" fontWeight="bold" fontFamily="monospace">3i'</text>

                    {/* 2 * j' (Starting from tip of 3i') */}
                    <line x1={tipSI.x} y1={tipSI.y} x2={tipFinal.x} y2={tipFinal.y} stroke="#2d5a4a" strokeWidth="3" markerEnd="url(#arrowForest)" />
                    <text x={(tipSI.x+tipFinal.x)/2 + 10} y={(tipSI.y+tipFinal.y)/2} fontSize="12" fill="#2d5a4a" fontWeight="bold" fontFamily="monospace">2j'</text>

                    {/* The Final Result Vector */}
                    <line x1={o.x} y1={o.y} x2={tipFinal.x} y2={tipFinal.y} stroke="#2c2416" strokeWidth="2" strokeDasharray="2 2" />
                    <circle cx={tipFinal.x} cy={tipFinal.y} r="4" fill="#2c2416" />
                </svg>
                
                {/* Angle Arc Label */}
                <div className="absolute top-[45%] right-[45%] text-[10px] text-ink-light font-mono">θ</div>
            </div>

            <div className="w-full max-w-[300px]">
                <div className="flex justify-between items-center mb-2 font-mono text-sm text-ink">
                    <span>Rotate Axis (θ)</span>
                    <span className="font-bold">{angle}°</span>
                </div>
                <input 
                    type="range" min="0" max="360" value={angle} 
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full h-2 bg-grid rounded-lg appearance-none cursor-pointer accent-ink"
                />
            </div>
          </div>

          {/* Right: The Derivation */}
          <div className="flex-1 space-y-8 w-full">
             
             {/* Step 1: Logic */}
             <div className="bg-paper-dark p-6 border-l-4 border-ink">
                <p className="text-ink">
                    Our vector is <span className="font-mono bg-highlight px-1">v = [3, 2]</span>.
                    This really means:
                </p>
                <p className="font-mono font-bold text-lg mt-2 text-center">
                    v = <span className="text-rust">3 i</span> + <span className="text-forest">2 j</span>
                </p>
             </div>

             {/* Step 2: Finding i' */}
             <div className="flex items-center gap-8">
                <div className="w-8 h-8 rounded-full bg-rust text-paper flex items-center justify-center font-bold font-mono shrink-0">1</div>
                <div>
                    <p className="text-sm">The basis vector <span className="font-mono text-rust">i [1, 0]</span> rotates by {angle}°.</p>
                    <div className="font-mono bg-white/50 p-2 mt-1 border border-grid inline-block text-sm">
                        i' = [cos({angle}°), sin({angle}°)]
                    </div>
                </div>
             </div>

             {/* Step 3: Finding j' */}
             <div className="flex items-center gap-8">
                <div className="w-8 h-8 rounded-full bg-forest text-paper flex items-center justify-center font-bold font-mono shrink-0">2</div>
                <div>
                    <p className="text-sm">The basis vector <span className="font-mono text-forest">j [0, 1]</span> ends at 90°+{angle}°.</p>
                    <div className="font-mono bg-white/50 p-2 mt-1 border border-grid inline-block text-sm">
                        j' = [-sin({angle}°), cos({angle}°)]
                    </div>
                </div>
             </div>

             {/* Step 4: The Matrix */}
             <div className="bg-highlight/30 p-6 border border-ink/20 relative">
                <p className="text-sm mb-4 mt-2 text-center text-stone-600">Combine them: <span className="font-mono text-stone-900">v' = 3 i' + 2 j'</span></p>
                <div className="font-mono text-sm space-y-4 overflow-x-auto pb-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="w-6 font-bold text-right">x'</span>
                        <span>=</span>
                        <span className="text-rust">3·cos({angle}°)</span>
                        <span>-</span>
                        <span className="text-forest">2·sin({angle}°)</span>
                        <span className="mx-1">=</span>
                        <span className="bg-white border border-stone-800 px-2 py-0.5 font-bold shadow-sm">{formatVal(finalX)}</span>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="w-6 font-bold text-right">y'</span>
                        <span>=</span>
                        <span className="text-rust">3·sin({angle}°)</span>
                        <span>+</span>
                        <span className="text-forest">2·cos({angle}°)</span>
                        <span className="mx-1">=</span>
                        <span className="bg-white border border-stone-800 px-2 py-0.5 font-bold shadow-sm">{formatVal(finalY)}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-800/10 overflow-x-auto">
                    <p className="text-xs text-stone-500 font-sans uppercase tracking-widest mb-3">Matrix Form</p>
                    
                    <div className="flex items-center gap-2 font-mono text-xs md:text-sm whitespace-nowrap">
                        
                        {/* Matrix - 
                            FIX: grid-cols-[max-content_max-content] ensures columns are never squished.
                            FIX: gap-x-8 adds plenty of breathing room.
                         */}
                        <div className="relative px-4 py-2 border-l-2 border-r-2 border-stone-800 bg-white/50">
                            <div className="grid grid-cols-[max-content_max-content] gap-x-2 text-right">
                                <span>cos({angle}°)</span>
                                <span>-sin({angle}°)</span>
                                
                                <span>sin({angle}°)</span>
                                <span>cos({angle}°)</span>
                            </div>
                        </div>

                        {/* Vector */}
                        <span className="text-stone-400">×</span>
                        <div className="border-l-2 border-r-2 border-stone-800 px-3 py-2 flex flex-col items-center bg-white/50">
                            <span>3</span>
                            <span>2</span>
                        </div>

                         {/* Result */}
                         <span className="text-stone-400">=</span>
                         <div className="border-l-2 border-r-2 border-stone-800 px-3 py-2 flex flex-col items-center gap-0 bg-white/50 font-bold">
                            <span>{formatVal(finalX)}</span>
                            <span>{formatVal(finalY)}</span>
                        </div>
                    </div>
                </div>
             </div>

          </div>

       </div>
    </div>
  );
};

export default RotationDerivationDemo;
