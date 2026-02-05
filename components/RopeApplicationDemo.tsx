
import React, { useState } from 'react';
import { 
  TWINKLE_Q, TWINKLE_K, 
  LITTLE_Q, LITTLE_K,
  formatFloat 
} from '../constants';

// --- Math Helpers ---

const DIM = 8;

// Calculate rotation angle for a specific pair index
const getTheta = (pairIndex: number, base: number) => {
  return Math.pow(base, -(2 * pairIndex) / DIM);
};

// Rotate a 2D vector [x, y] by angle theta (radians)
const rotateVector = (x: number, y: number, angle: number): [number, number] => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    x * cos - y * sin,
    x * sin + y * cos
  ];
};

// Chunk a full 8d vector into 4 pairs
const getPairs = (vec: number[]): number[][] => {
  const pairs: number[][] = [];
  for (let i = 0; i < vec.length; i += 2) {
    pairs.push([vec[i], vec[i+1]]);
  }
  return pairs;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Sub-Components ---

interface ArrowGraphProps {
  basePair: number[];
  angle: number;
  color: string;
}

const ArrowGraph: React.FC<ArrowGraphProps> = ({ basePair, angle, color }) => {
  const [x, y] = basePair;
  const center = 50;
  const scale = 35; 
  
  // Flip Y for SVG (SVG Y is down, Math Y is up)
  const x2 = center + x * scale;
  const y2 = center - y * scale; 

  // Convert Math Angle (CCW) to CSS Angle (CW visual for SVG coords)
  const deg = -(angle * 180 / Math.PI);

  return (
    <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] relative shrink-0 overflow-hidden">
      <svg viewBox="0 0 100 100" className="w-full h-full absolute top-0 left-0">
         <line x1="50" y1="0" x2="50" y2="100" stroke="#c4b8a4" strokeWidth="3" opacity="0.3" />
         <line x1="0" y1="50" x2="100" y2="50" stroke="#c4b8a4" strokeWidth="3" opacity="0.3" />
         
         {/* Ghost of Original Position */}
         <line 
           x1="50" y1="50" 
           x2={x2} y2={y2} 
           stroke={color} 
           strokeWidth="6" 
           strokeLinecap="round"
           opacity="0.15"
         />

         {/* Rotating Active Line */}
         <line 
           x1="50" y1="50" 
           x2={x2} y2={y2} 
           stroke={color} 
           strokeWidth="6" 
           strokeLinecap="round"
           style={{
             transformOrigin: '50px 50px',
             transform: `rotate(${deg}deg)`,
             transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
           }}
         />
      </svg>
    </div>
  );
};

interface PairBlockProps {
  basePair: number[];
  currentPair: number[];
  angle: number;
  hexColor: string;
  isActive: boolean;
}

const PairBlock: React.FC<PairBlockProps> = ({ basePair, currentPair, angle, hexColor, isActive }) => (
  <div className={`
    flex items-center gap-1 md:gap-2 mb-2 md:mb-3 p-1 rounded transition-all duration-300
    ${isActive ? 'bg-highlight shadow-sm scale-105 ring-1 ring-forest' : ''}
  `}>
     {/* Number Box with Matrix Brackets - Shows Current Values */}
     <div className={`
        relative border-l-2 border-r-2 
        bg-white/50 w-[40px] h-[40px] md:w-[50px] md:h-[50px]
        flex flex-col items-center justify-center shadow-sm
        transition-colors duration-300
        ${isActive ? 'border-forest' : 'border-ink'}
     `}>
        <div className={`absolute top-0 left-0 w-1.5 h-[1px] ${isActive ? 'bg-forest' : 'bg-ink'}`} />
        <div className={`absolute top-0 right-0 w-1.5 h-[1px] ${isActive ? 'bg-forest' : 'bg-ink'}`} />
        <div className={`absolute bottom-0 left-0 w-1.5 h-[1px] ${isActive ? 'bg-forest' : 'bg-ink'}`} />
        <div className={`absolute bottom-0 right-0 w-1.5 h-[1px] ${isActive ? 'bg-forest' : 'bg-ink'}`} />

        <div className="font-mono text-[8px] md:text-[9px] text-ink-light leading-relaxed">{formatFloat(currentPair[0])}</div>
        <div className="font-mono text-[8px] md:text-[9px] text-ink-light leading-relaxed">{formatFloat(currentPair[1])}</div>
     </div>

     {/* Graph - Animates Rotation from Base */}
     <ArrowGraph basePair={basePair} angle={angle} color={hexColor} />
  </div>
);

interface InteractiveColumnProps {
  label: string;
  pos: number;
  initialQ: number[];
  initialK: number[];
  baseFrequency: number;
}

const InteractiveColumn: React.FC<InteractiveColumnProps> = ({ label, pos, initialQ, initialK, baseFrequency }) => {
  const [isDone, setIsDone] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activePairIndex, setActivePairIndex] = useState<number | null>(null);
  
  // Track the current multiplier 'm' for 'm * theta' for each pair [0, 1, 2, 3]
  // Initialize at 0 rotation
  const [multipliers, setMultipliers] = useState<number[]>([0, 0, 0, 0]);

  const runAnimation = async () => {
    if (isAnimating || isDone) return;
    setIsAnimating(true);

    if (pos === 0) {
        // Instant finish for pos 0
        await sleep(200);
        setIsDone(true);
        setIsAnimating(false);
        return;
    }

    // Iterate through each dimension pair (0, 1, 2, 3)
    for (let i = 0; i < 4; i++) {
        setActivePairIndex(i);
        
        // Highlight Phase
        await sleep(400); 

        // Apply rotations based on position
        // For Pos 1, we loop once. For Pos 2, we loop twice (to show accumulation).
        for (let step = 0; step < pos; step++) {
            setMultipliers(prev => {
                const next = [...prev];
                next[i] += 1; // Increment rotation by 1 theta step
                return next;
            });
            // Wait for visual transition + pacing
            await sleep(800); 
        }

        // Small pause before moving to next pair
        await sleep(200);
    }

    setActivePairIndex(null);
    setIsAnimating(false);
    setIsDone(true);
  };

  const baseQPairs = getPairs(initialQ);
  const baseKPairs = getPairs(initialK);

  return (
    <div className="flex flex-col items-center min-w-[200px] md:min-w-[260px] px-2 md:px-4">
       {/* Header */}
       <div className={`
         border px-3 py-2 font-serif font-bold mb-5 text-sm md:text-base text-center shadow-sm w-32 md:w-40 transition-colors duration-500
         ${isDone ? 'bg-highlight border-forest text-ink' : 'bg-paper-dark border-ink text-ink'}
       `}>
          "{label}"
          <span className="block text-[10px] md:text-xs font-mono font-normal opacity-70 mt-1">Pos {pos}</span>
       </div>

       {/* Vector Grid */}
       <div className="flex gap-2 md:gap-2 mb-6">
         {/* Q Column */}
         <div className="flex flex-col items-center">
            <span className="font-mono text-[10px] md:text-xs font-bold text-rust mb-2">Q</span>
            {baseQPairs.map((baseP, i) => {
               const theta = getTheta(i, baseFrequency);
               const angle = multipliers[i] * theta;
               const currentP = rotateVector(baseP[0], baseP[1], angle);
               return (
                 <PairBlock 
                   key={i} 
                   basePair={baseP} 
                   currentPair={currentP} 
                   angle={angle}
                   hexColor="#b85a3c" 
                   isActive={activePairIndex === i}
                 />
               );
            })}
         </div>

         {/* K Column */}
         <div className="flex flex-col items-center">
            <span className="font-mono text-[10px] md:text-xs font-bold text-forest mb-2">K</span>
            {baseKPairs.map((baseP, i) => {
               const theta = getTheta(i, baseFrequency);
               const angle = multipliers[i] * theta;
               const currentP = rotateVector(baseP[0], baseP[1], angle);
               return (
                 <PairBlock 
                   key={i} 
                   basePair={baseP} 
                   currentPair={currentP} 
                   angle={angle}
                   hexColor="#2d5a4a" 
                   isActive={activePairIndex === i}
                 />
               );
            })}
         </div>
       </div>

       {/* Controls Area */}
       <div className="w-full flex flex-col justify-end items-center h-28">
          {/* Status Message */}
          <div className={`
             mb-3 text-[9px] md:text-[10px] font-mono text-center px-1 py-1 transition-all duration-300 min-h-[40px] flex items-center justify-center max-w-[180px]
             ${isDone ? 'text-forest font-bold bg-forest/5 rounded' : 'text-ink-light italic'}
             ${activePairIndex !== null ? 'text-rust font-bold' : ''}
          `}>
             {!isAnimating && !isDone && pos === 0 && "Identity: No rotation needed."}
             {!isAnimating && !isDone && pos > 0 && "Waiting to apply rotation..."}
             
             {activePairIndex !== null && `Rotating Pair ${activePairIndex} (Frequency: ${getTheta(activePairIndex, baseFrequency).toFixed(2)})...`}
             
             {isDone && pos === 0 && "Unchanged (Pos 0)"}
             {isDone && pos > 0 && "Rotation Complete"}
          </div>

          <button 
             onClick={runAnimation}
             disabled={isDone || isAnimating}
             className={`
                px-4 py-2 font-mono text-xs border-2 shadow-sm transition-all duration-200 w-28 md:w-36
                ${isDone 
                  ? 'bg-grid/20 border-grid text-ink-light cursor-default opacity-50' 
                  : isAnimating
                    ? 'bg-paper-dark border-ink text-ink cursor-wait'
                    : 'bg-ink text-paper border-ink hover:bg-forest hover:border-forest hover:-translate-y-1 active:translate-y-0'}
             `}
          >
             {isDone ? "Applied" : isAnimating ? "Rotating..." : "Apply RoPE"}
          </button>
       </div>
    </div>
  );
};

interface RopeApplicationDemoProps {
    baseFrequency: number;
}

const RopeApplicationDemo: React.FC<RopeApplicationDemoProps> = ({ baseFrequency }) => {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="my-16 p-4 md:p-8 bg-paper border border-ink relative overflow-hidden">
      <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
        Figure 14: Applying the Rotation
      </div>

      <button 
        onClick={() => setResetKey(k => k + 1)}
        className="absolute top-4 right-4 z-20 bg-paper border border-ink px-3 py-1 font-mono text-xs hover:bg-highlight active:translate-y-0.5 transition-all shadow-sm cursor-pointer"
      >
        Reset Demo
      </button>

      <div className="mt-16 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex justify-center items-stretch gap-0 px-2 min-w-max md:min-w-0">
           {/* 
              KEY TRICK: Including baseFrequency in the key forces a full remount 
              of the column when the slider in Figure 12 changes.
           */}
           
           {/* Token 0 */}
           <InteractiveColumn 
             key={`t0-${baseFrequency}-${resetKey}`}
             label="Twinkle" 
             pos={0} 
             initialQ={TWINKLE_Q} 
             initialK={TWINKLE_K} 
             baseFrequency={baseFrequency}
           />
           
           {/* Vertical Separator */}
           <div className="w-[1px] bg-ink/20 mx-0 self-stretch" />

           {/* Token 1 */}
           <InteractiveColumn 
             key={`t1-${baseFrequency}-${resetKey}`}
             label="Twinkle" 
             pos={1} 
             initialQ={TWINKLE_Q} 
             initialK={TWINKLE_K} 
             baseFrequency={baseFrequency}
           />
           
           {/* Vertical Separator */}
           <div className="w-[1px] bg-ink/20 mx-0 self-stretch" />

           {/* Token 2 */}
           <InteractiveColumn 
             key={`t2-${baseFrequency}-${resetKey}`}
             label="Little" 
             pos={2} 
             initialQ={LITTLE_Q} 
             initialK={LITTLE_K} 
             baseFrequency={baseFrequency}
           />
        </div>
      </div>
      
      <div className="text-center mt-6 text-sm font-serif italic text-ink-light border-t border-grid pt-4 space-y-2">
         <p>Click the buttons to apply the rotation <span className="font-mono not-italic text-xs bg-paper-dark px-1">m·θ</span> pair-by-pair. Notice how identical words ("Twinkle") diverge.</p>
         <p className="text-xs text-rust font-mono">
            Note: Rotations are precise calculations based on the frequency formula shown in Figure 12 <br></br>(θ = {baseFrequency.toLocaleString()}<sup>-2i/d</sup>).
         </p>
      </div>
    </div>
  );
};

export default RopeApplicationDemo;
