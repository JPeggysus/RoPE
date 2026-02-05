
import React, { useState } from 'react';
import { formatFloat } from '../constants';

// Color constants for SVG use
const COLORS = {
    paper: '#f7f3eb',
    paperDark: '#e8e0d0',
    ink: '#2c2416',
    inkLight: '#5c4f3a',
    rust: '#b85a3c',
    forest: '#2d5a4a',
    grid: '#c4b8a4',
    highlight: '#f0e4c8',
};

const MathIntroSection: React.FC = () => {
  const [angle, setAngle] = useState(30);

  // Convert to radians for math
  const rad = (angle * Math.PI) / 180;
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);

  // Unit circle config
  const radius = 110;
  const center = 150;
  const endX = center + radius * cosVal;
  const endY = center - radius * sinVal; // SVG Y is down

  return (
    <div className="space-y-24">
      {/* 1. The "Why" - High Level Intuition */}
      <section>
        <div className="bg-paper-dark p-6 md:p-8 border-l-4 border-rust shadow-sm mb-12">
          <h3 className="font-serif font-bold text-xl text-ink mb-4">Read This If You Don't Care About The Math</h3>
          <p className="text-lg leading-relaxed mb-4">
            We are now going to dive into the linear algebra that makes RoPE effective. 
            If you are not interested, here is the most important takeaway:
          </p>
          <div className="bg-paper border border-ink p-4 mb-4">
            <p className="font-serif italic text-ink-light text-center text-lg">
              RoPE allows the dot product between a query and key to 
              be dependent <strong>only</strong> on their original values and the relative distance between their tokens.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Trig Review */}
      <section className="relative group">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-baseline gap-4 text-ink">
            <span className="font-mono text-base text-ink-light">Review I</span>
            Trigonometry & The Unit Circle
        </h3>
        <p className="mb-8 max-w-prose">
            To understand how we rotate these embeddings, we must revisit the definition of sine and cosine. 
            On a circle with radius 1 (the Unit Circle), any point on the edge can be defined by an angle <span className="font-mono text-rust">θ</span>.
        </p>

        <div className="flex flex-col md:flex-row gap-12 items-center justify-center bg-paper border border-ink p-8 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-paper-pattern" />

            {/* Interactive Circle */}
            <div className="flex flex-col items-center w-full md:w-auto">
                <div className="relative w-full max-w-[400px] aspect-square bg-white/50 border-2 border-grid rounded-full shadow-inner mb-6">
                    <svg viewBox="0 0 300 300" className="absolute top-0 left-0 w-full h-full overflow-visible">
                        {/* Axes */}
                        <line x1="150" y1="20" x2="150" y2="280" stroke={COLORS.grid} strokeWidth="1" />
                        <line x1="20" y1="150" x2="280" y2="150" stroke={COLORS.grid} strokeWidth="1" />
                        
                        {/* The Angle Arc */}
                        <path 
                            d={`M 150 150 L ${150 + 45} 150 A 45 45 0 ${angle > 180 ? 1 : 0} 0 ${150 + 45*Math.cos(-rad)} ${150 + 45*Math.sin(-rad)}`}
                            fill={COLORS.highlight} stroke="none" opacity="0.5"
                        />

                        {/* The Triangle components */}
                        {/* Cosine Line (Horizontal) */}
                        <line 
                            x1="150" y1="150" x2={endX} y2="150" 
                            stroke={COLORS.rust} strokeWidth="4" 
                        />
                        {/* Sine Line (Vertical) */}
                        <line 
                            x1={endX} y1="150" x2={endX} y2={endY} 
                            stroke={COLORS.forest} strokeWidth="4" 
                        />
                        
                        {/* Hypotenuse (Radius) */}
                        <line 
                            x1="150" y1="150" x2={endX} y2={endY} 
                            stroke={COLORS.ink} strokeWidth="2" 
                        />
                        <circle cx={endX} cy={endY} r="4" fill={COLORS.ink} />
                    </svg>

                    {/* Labels */}
                    <div className="absolute text-rust font-bold font-mono text-xs" style={{ top: '53%', left: `${(150 + (endX-150)/2) / 3}%` }}>
                        cos(θ)
                    </div>
                    <div className="absolute text-forest font-bold font-mono text-xs" style={{ left: `${(endX + 5) / 3}%`, top: `${(150 + (endY-150)/2) / 3}%` }}>
                        sin(θ)
                    </div>
                </div>

                <input 
                    type="range" min="0" max="360" value={angle} 
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full max-w-[360px] h-2 bg-grid rounded-lg appearance-none cursor-pointer accent-ink"
                />
                <div className="font-mono text-ink mt-2">θ = {angle}°</div>
            </div>

            {/* The Definition Box */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
                <div className="bg-paper-dark border border-rust p-4 w-full md:w-64">
                    <div className="text-rust font-bold font-mono mb-1">Horizontal (X)</div>
                    <div className="text-xl font-mono">x = cos(θ)</div>
                    <div className="font-mono text-sm mt-2 text-ink-light">{formatFloat(cosVal)}</div>
                </div>
                <div className="bg-paper-dark border border-forest p-4 w-full md:w-64">
                    <div className="text-forest font-bold font-mono mb-1">Vertical (Y)</div>
                    <div className="text-xl font-mono">y = sin(θ)</div>
                    <div className="font-mono text-sm mt-2 text-ink-light">{formatFloat(sinVal)}</div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. Basis Vectors */}
      <section className="relative group">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-baseline gap-4 text-ink">
            <span className="font-mono text-base text-ink-light">Review II</span>
            Basis Vectors
        </h3>
        <p className="mb-8 max-w-prose">
            Any 2D vector can be broken down into "steps". If we define two standard steps: 
            <span className="text-rust font-bold mx-1">i (East)</span> and 
            <span className="text-forest font-bold mx-1">j (North)</span>, 
            we can build any vector by combining them.
        </p>

        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center bg-paper border border-ink p-8">
            <div className="relative w-full max-w-[300px] aspect-square border border-grid/30 bg-white/50">
                 {/* Grid */}
                 <svg viewBox="0 0 300 300" className="w-full h-full">
                    <defs>
                        <pattern id="smallGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={COLORS.paperDark} strokeWidth="1" />
                        </pattern>
                        {/* Markers */}
                        <marker id="arrowRust" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                            <path d="M0,0 L10,5 L0,10 z" fill={COLORS.rust} />
                        </marker>
                        <marker id="arrowForest" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                            <path d="M0,0 L10,5 L0,10 z" fill={COLORS.forest} />
                        </marker>
                         <marker id="arrowInk" markerWidth="12" markerHeight="12" refX="11" refY="6" orient="auto" markerUnits="userSpaceOnUse">
                            <path d="M0,0 L12,6 L0,12 z" fill={COLORS.ink} />
                        </marker>
                    </defs>
                    
                    <rect width="300" height="300" fill="url(#smallGrid)" />
                    
                    {/* Origin at 40, 260 */}
                    
                    {/* Axes */}
                    <line x1="40" y1="20" x2="40" y2="280" stroke={COLORS.ink} strokeWidth="2" />
                    <line x1="20" y1="260" x2="280" y2="260" stroke={COLORS.ink} strokeWidth="2" />
                    
                    {/* Ticks */}
                    {[80, 120, 160, 200, 240].map(x => (
                        <line key={`x-${x}`} x1={x} y1="255" x2={x} y2="265" stroke={COLORS.ink} strokeWidth="2" />
                    ))}
                     {[220, 180, 140, 100, 60].map(y => (
                        <line key={`y-${y}`} x1="35" y1={y} x2="45" y2={y} stroke={COLORS.ink} strokeWidth="2" />
                    ))}
                    
                    {/* Result Vector to (160, 180) -> [3, 2] */}
                    
                    {/* Dotted Lines to represent coordinates */}
                    <line x1="160" y1="260" x2="160" y2="180" stroke={COLORS.ink} strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="40" y1="180" x2="160" y2="180" stroke={COLORS.ink} strokeWidth="1" strokeDasharray="4 4" />
                    
                    {/* The Steps (Components) */}
                    {/* X steps */}
                    <line x1="40" y1="260" x2="80" y2="260" stroke={COLORS.rust} strokeWidth="4" markerEnd="url(#arrowRust)" />
                    <line x1="80" y1="260" x2="120" y2="260" stroke={COLORS.rust} strokeWidth="4" markerEnd="url(#arrowRust)" />
                    <line x1="120" y1="260" x2="160" y2="260" stroke={COLORS.rust} strokeWidth="4" markerEnd="url(#arrowRust)" />
                    
                    {/* Y steps (drawn from tip of X) */}
                    <line x1="160" y1="260" x2="160" y2="220" stroke={COLORS.forest} strokeWidth="4" markerEnd="url(#arrowForest)" />
                    <line x1="160" y1="220" x2="160" y2="180" stroke={COLORS.forest} strokeWidth="4" markerEnd="url(#arrowForest)" />

                    {/* Result Vector Arrow */}
                    <line x1="40" y1="260" x2="160" y2="180" stroke={COLORS.ink} strokeWidth="3" markerEnd="url(#arrowInk)" />
                    
                    {/* Labels */}
                    <text x="100" y="285" fill={COLORS.rust} fontSize="12" fontFamily="monospace" textAnchor="middle">3 · i</text>
                    <text x="175" y="225" fill={COLORS.forest} fontSize="12" fontFamily="monospace" textAnchor="start">2 · j</text>
                    <text x="165" y="170" fill={COLORS.ink} fontSize="16" fontWeight="bold" fontFamily="serif" textAnchor="start">v = [3, 2]</text>
                 </svg>
            </div>

            <div className="flex flex-col justify-center">
                 <div className="bg-paper-dark p-6 border-l-4 border-ink shadow-sm">
                    <h4 className="font-serif font-bold text-ink mb-2">Linear Combination</h4>
                    <p className="font-mono text-sm mb-4">
                        To get to coordinate <span className="bg-highlight px-1">[3, 2]</span>:
                    </p>
                    <div className="font-mono text-lg">
                        <span className="font-bold text-ink">v</span> = 
                        <span className="text-rust font-bold mx-2">3 · [1, 0]</span> + 
                        <span className="text-forest font-bold mx-2">2 · [0, 1]</span>
                    </div>
                    <p className="mt-4 text-ink-light italic font-serif text-sm">
                        "Walk 3 steps East, then 2 steps North."
                    </p>
                 </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default MathIntroSection;
