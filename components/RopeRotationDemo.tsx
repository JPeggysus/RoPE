
import React, { useState, useEffect, useRef, useMemo } from 'react';

const DIM = 8;
const MAX_POSITION = 2048;

interface PairData {
  id: number;
  theta: number;
  color: string;
  name: string;
  role: string;
}

const Dial: React.FC<{ pair: PairData; position: number }> = ({ pair, position }) => {
    // Calculate rotation
    // Angle = position * theta
    const totalRad = position * pair.theta;
    // Modulo 2PI for visualization, but math preserves full rotation
    const visRad = totalRad % (2 * Math.PI);
    
    // Coordinates
    const cx = 60;
    const cy = 60;
    const r = 40;
    
    // End point of rotated vector
    const ex = cx + r * Math.cos(visRad);
    const ey = cy - r * Math.sin(visRad); // SVG Y is down

    // Start point (Ghost vector at pos 0, pointing East)
    const sx = cx + r;
    const sy = cy;

    return (
      <div className="flex flex-col items-center bg-paper-dark/30 border border-ink/20 p-4 rounded-sm relative overflow-hidden group">
        <div className="flex justify-between w-full mb-2 items-baseline px-1">
            <span className={`font-mono font-bold text-xs uppercase ${pair.id === 0 ? 'text-rust' : pair.id === 1 ? 'text-forest' : 'text-ink'}`}>
                {pair.name}
            </span>
            <span className="font-hand text-xs text-ink-light opacity-70">{pair.role}</span>
        </div>

        <div className="relative w-[120px] h-[120px]">
             <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* Clock Face */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#c4b8a4" strokeWidth="1" />
                <circle cx={cx} cy={cy} r="2" fill="#2c2416" />
                
                {/* Ticks */}
                {[0, 90, 180, 270].map(d => (
                    <line 
                        key={d}
                        x1={cx + (r-4) * Math.cos(d*Math.PI/180)}
                        y1={cy - (r-4) * Math.sin(d*Math.PI/180)}
                        x2={cx + r * Math.cos(d*Math.PI/180)}
                        y2={cy - r * Math.sin(d*Math.PI/180)}
                        stroke="#c4b8a4"
                        strokeWidth="2"
                    />
                ))}

                {/* Ghost Vector (0 deg) */}
                <line 
                    x1={cx} y1={cy} x2={sx} y2={sy} 
                    stroke="#c4b8a4" strokeWidth="2" strokeDasharray="4 2" 
                />

                {/* Active Vector */}
                <line 
                    x1={cx} y1={cy} x2={ex} y2={ey} 
                    stroke={pair.color} strokeWidth="3" strokeLinecap="round"
                />
                <circle cx={ex} cy={ey} r="3" fill={pair.color} />

                {/* Winding Trace (Subtle spiral effect for fast movers) */}
                {pair.id === 0 && position > 0 && (
                     <path 
                        d={`M ${sx} ${sy} A ${r} ${r} 0 0 0 ${cx + r*Math.cos(-0.5)} ${cy - r*Math.sin(-0.5)}`}
                        fill="none" stroke={pair.color} strokeWidth="1" opacity="0.1"
                     />
                )}
             </svg>
             
             {/* Rotation Counter Overlay */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] bg-paper/90 px-1 rounded border border-grid opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {(totalRad / (2*Math.PI)).toFixed(2)} revs
             </div>
        </div>

        {/* Data Panel */}
        <div className="w-full mt-3 pt-3 border-t border-grid/30 text-[10px] font-mono space-y-1">
            <div className="flex justify-between">
                <span className="text-ink-light">Freq (θ):</span>
                <span>{pair.theta.toFixed(4)}</span>
            </div>
            <div className="flex justify-between font-bold">
                <span className="text-ink-light">Rot (m·θ):</span>
                <span style={{ color: pair.color }}>{totalRad.toFixed(2)} rad</span>
            </div>
        </div>
      </div>
    );
};

interface RopeRotationDemoProps {
    baseFrequency: number;
}

const RopeRotationDemo: React.FC<RopeRotationDemoProps> = ({ baseFrequency }) => {
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>(0);

  // Reset if the base frequency changes
  useEffect(() => {
    setPosition(0);
    setIsPlaying(false);
  }, [baseFrequency]);
  
  // Calculate frequencies (thetas) based on the prop
  // theta_i = base^(-2i/d)
  const pairs: PairData[] = useMemo(() => [0, 1, 2, 3].map(i => {
    const theta = Math.pow(baseFrequency, -(2 * i) / DIM);
    return {
      id: i,
      theta: theta,
      // Colors matching FrequencyDemo
      color: i === 0 ? '#b85a3c' : i === 1 ? '#2d5a4a' : i === 2 ? '#2c2416' : '#5c4f3a',
      name: i === 0 ? 'Pair 0' : i === 1 ? 'Pair 1' : i === 2 ? 'Pair 2' : 'Pair 3',
      role: i === 0 ? 'Short-term' : i === 3 ? 'Long-term' : 'Mid-term'
    };
  }), [baseFrequency]);

  // Animation Loop
  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now();
      const startPos = position;
      
      const animate = () => {
        const now = Date.now();
        // Speed: 100 positions per second
        const newPos = startPos + (now - startTime) / 10;
        
        if (newPos >= MAX_POSITION) {
          setPosition(MAX_POSITION);
          setIsPlaying(false);
        } else {
          setPosition(Math.floor(newPos));
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying]);

  const togglePlay = () => {
    if (position >= MAX_POSITION) setPosition(0);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="my-12 bg-paper border border-ink relative">
      <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
        Figure 13: Rotation = Position x Frequency
      </div>

      <div className="p-4 md:p-8 pt-20">
        
        {/* Master Controls */}
        <div className="mb-10 bg-paper-dark p-6 border-l-4 border-ink flex flex-col gap-6">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-sm text-ink-light font-mono mt-1">
                        Current Sequence Position: <span className="text-lg font-bold text-ink">{position}</span> / {MAX_POSITION}
                    </p>
                    <p className="text-[10px] text-rust font-bold mt-1 uppercase tracking-wide">
                        Linked to Figure 12 (Base: {baseFrequency.toLocaleString()})
                    </p>
                </div>
                
                <button 
                    onClick={togglePlay}
                    className={`
                        px-6 py-2 font-mono font-bold text-sm transition-all shadow-sm border-2
                        ${isPlaying 
                            ? 'bg-paper text-rust border-rust' 
                            : 'bg-ink text-paper border-ink hover:bg-forest hover:border-forest'
                        }
                    `}
                >
                    {isPlaying ? 'PAUSE' : '▶ PLAY SEQUENCE'}
                </button>
            </div>

            <div className="relative w-full h-12 flex items-center">
                <input 
                    type="range" 
                    min="0" 
                    max={MAX_POSITION} 
                    value={position} 
                    onChange={(e) => setPosition(Number(e.target.value))}
                    className="w-full h-2 bg-grid rounded-lg appearance-none cursor-pointer accent-ink"
                />
            </div>
        </div>

        {/* The Dials */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pairs.map(pair => <Dial key={pair.id} pair={pair} position={position} />)}
        </div>

        {/* Commentary */}
        <div className="mt-8 flex flex-col md:flex-row gap-8 text-sm leading-relaxed text-ink-light border-t border-grid pt-6">
            <div className="flex-1">
                <strong className="text-rust block font-mono mb-2 uppercase tracking-wide">High Speed (Pair 0)</strong>
                <p>
                    Rotates ~{pairs[0].theta.toFixed(4)} radian per position.
                    Because it rotates fast, it repeats its orientation frequently. 
                    This makes it excellent for measuring <em>small</em> relative distances (e.g., "is the word 'not' right before 'bad'?").
                </p>
            </div>
            <div className="flex-1">
                <strong className="text-ink block font-mono mb-2 uppercase tracking-wide">Low Speed (Pair 3)</strong>
                <p>
                    Rotates ~{pairs[3].theta.toFixed(4)} radians per position. It barely moves even after 2000 tokens. 
                    This slow drift allows the model to uniquely distinguish positions that are very far apart, 
                    preserving the "global structure" of the input.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default RopeRotationDemo;
