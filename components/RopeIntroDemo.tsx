import React, { useState } from 'react';

const RopeIntroDemo: React.FC = () => {
  const [position, setPosition] = useState(0);
  const rotationRate = 30; // Degrees per position index

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  // Layout Constants
  const radius = 80;
  const center = 150;
  
  // Style Constants
  const RUST = '#b85a3c';
  const FOREST = '#2d5a4a';
  const GRID = '#c4b8a4';
  const PAPER_DARK = '#e8e0d0';
  
  // Original Vector (Fixed at 0 degrees / X-axis)
  const originalAngle = 0;
  const semX = Math.cos(toRad(originalAngle));
  const semY = Math.sin(toRad(originalAngle));
  
  // Rotated Vector (The Position Encoding)
  const totalRotation = position * rotationRate;
  const rotX = Math.cos(toRad(totalRotation));
  const rotY = Math.sin(toRad(totalRotation));

  const getCoord = (x: number, y: number) => ({
    x: center + x * radius,
    y: center - y * radius // Flip Y for SVG coordinate space
  });

  const semEnd = getCoord(semX, semY);
  const rotEnd = getCoord(rotX, rotY);

  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative overflow-hidden">
      {/* Background Grid Decoration */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(var(--grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
        Figure 9: Encoding Position via Rotation
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mt-12 relative z-10">
        
        {/* LEFT: Visualization */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-full max-w-[300px] aspect-square bg-white/50 border-2 border-grid rounded-full shadow-inner">
             <svg viewBox="0 0 300 300" className="absolute top-0 left-0 w-full h-full">
                {/* Reference Circle and Axes */}
                <circle cx="150" cy="150" r={radius} stroke={PAPER_DARK} strokeWidth="2" fill="none" strokeDasharray="4 4" />
                <line x1="150" y1="20" x2="150" y2="280" stroke={GRID} strokeWidth="1" />
                <line x1="20" y1="150" x2="280" y2="150" stroke={GRID} strokeWidth="1" />

                <defs>
                    <marker id="arrowHeadGhost" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 z" fill={GRID} />
                    </marker>
                    <marker id="arrowHeadSolid" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 z" fill={RUST} />
                    </marker>
                </defs>

                {/* Arc showing the travel from 0 to current rotation */}
                {position > 0 && (
                   <path 
                     d={`M ${semEnd.x} ${semEnd.y} A ${radius} ${radius} 0 ${totalRotation > 180 ? 1 : 0} 0 ${rotEnd.x} ${rotEnd.y}`}
                     fill="none"
                     stroke={FOREST}
                     strokeWidth="2"
                     strokeDasharray="4 4"
                     opacity="0.5"
                   />
                )}

                {/* Original Vector (Ghost) */}
                <line 
                  x1={center} y1={center} x2={semEnd.x} y2={semEnd.y} 
                  stroke={GRID} strokeWidth="2" strokeDasharray="5 5"
                  markerEnd="url(#arrowHeadGhost)" 
                />

                {/* Rotated Vector */}
                <line 
                  x1={center} y1={center} x2={rotEnd.x} y2={rotEnd.y} 
                  stroke={RUST} strokeWidth="3" 
                  markerEnd="url(#arrowHeadSolid)" 
                />
             </svg>
             
             {/* Labels */}
             <div 
               className="absolute font-mono text-xs text-ink-light bg-paper/80 px-1"
               style={{ left: `${(semEnd.x / 300) * 100}%`, top: `${(semEnd.y / 300) * 100}%`, transform: 'translate(5px, 10px)' }}
             >
               Pos 0
             </div>

             <div 
               className="absolute font-mono text-sm font-bold text-rust bg-paper/80 px-1 border border-rust"
               style={{ left: `${(rotEnd.x / 300) * 100}%`, top: `${(rotEnd.y / 300) * 100}%`, transform: 'translate(5px, -20px)' }}
             >
               Pos {position}
             </div>
          </div>

          {/* Slider Control */}
          <div className="mt-6 w-full max-w-[300px]">
            <div className="flex justify-between items-baseline mb-2">
                <label className="font-mono text-sm font-bold text-ink">Sequence Position (m)</label>
                <span className="font-mono text-rust text-xl">{position}</span>
            </div>
            <input 
              type="range" min="0" max="12" step="1" 
              value={position} 
              onChange={(e) => setPosition(Number(e.target.value))}
              className="w-full h-2 bg-grid rounded-lg appearance-none cursor-pointer accent-rust"
            />
            <div className="flex justify-between text-[10px] text-ink-light font-mono mt-1 px-1">
                <span>Start</span>
                <span>Relative Offset</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Explanation */}
        <div className="flex-1 flex flex-col justify-center">
           {/* New Theta Note */}
           <p className="text-[10px] font-mono text-ink-light mb-2 italic">
             * For this example, θ is set to {rotationRate}°.
           </p>

           <div className="bg-paper-dark p-6 border-l-4 border-forest shadow-sm space-y-6">
              <p className="text-sm font-mono text-ink-light mb-4">
                  Total Rotation = Position × {rotationRate}°
              </p>
              <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-grid/50 pb-1">
                    <span>Current Position:</span>
                    <span>{position}</span>
                  </div>
                  <div className="flex justify-between border-b border-grid/50 pb-1">
                    <span>Rotation Rate:</span>
                    <span>{rotationRate}° / step</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Applied Angle:</span>
                    <span className="text-rust font-bold">{totalRotation}°</span>
                  </div>
              </div>
           </div>

           <div className="p-4 bg-highlight/30 border border-rust/30 rounded mt-6">
              <h4 className="font-hand text-xl text-rust mb-2">Key Observation:</h4>
              <p className="font-serif text-ink italic leading-relaxed">
                  Notice the <strong>length</strong> of the arrow never changes. 
              </p>
              <p className="mt-2 text-sm text-ink-light">
                  Unlike additive embeddings that stretch and distort the vector, RoPE is <strong>norm-preserving</strong>. By keeping the magnitude constant, the dot product between two rotated vectors becomes a function of the original vectors and the <strong>relative distance</strong> between them.
              </p>
              <p className="mt-3 text-sm text-ink-light border-t border-rust/20 pt-3">
                  In Attention, this means the similarity score depends on the <strong>relative distance</strong> between tokens, not their absolute position in the text.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default RopeIntroDemo;