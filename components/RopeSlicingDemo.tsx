
import React, { useState, useEffect } from 'react';
import { 
  TWINKLE_Q, TWINKLE_K, 
  LITTLE_Q, LITTLE_K,
  formatFloat 
} from '../constants';

const RopeSlicingDemo: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation state briefly when step changes
  useEffect(() => {
    if (step > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
  };

  const handleReset = () => {
    setStep(0);
  };

  // Helper to chunk vector based on current step
  const getChunks = (vector: number[]) => {
    const chunks = [];
    
    if (step === 0) {
      // Step 0: Monolithic block (Indices 0-7)
      chunks.push(vector.slice(0, 8));
      return chunks;
    }

    // For Step > 0, the first pair is always separated
    chunks.push(vector.slice(0, 2));

    // Based on cuts, how do we group the rest?
    if (step === 1) {
      // Cut 1 (Left to Right): [0,1] separate from [2..7]
      chunks.push(vector.slice(2, 8));
    } else if (step === 2) {
      // Cut 2 (Right to Left): Separates [2,3] from [4..7]
      chunks.push(vector.slice(2, 4));
      chunks.push(vector.slice(4, 8));
    } else {
      // Cut 3: Fully sliced
      chunks.push(vector.slice(2, 4));
      chunks.push(vector.slice(4, 6));
      chunks.push(vector.slice(6, 8));
    }
    return chunks;
  };

  const VectorStrip = ({ vec, label, colorClass }: { vec: number[], label: string, colorClass: string }) => {
    const chunks = getChunks(vec);
    
    return (
      <div className="flex flex-col items-center">
         <span className={`font-mono text-[10px] font-bold mb-1 ${colorClass}`}>{label}</span>
         
         <div className="flex flex-col items-center w-full transition-all duration-500">
            {chunks.map((chunk, chunkIdx) => (
                <div key={chunkIdx} className={`
                    relative border-l-2 border-r-2 border-ink
                    bg-white/50 backdrop-blur-sm py-1 shadow-sm
                    transition-all duration-500
                    flex flex-col items-center w-14
                    ${chunkIdx < chunks.length - 1 ? 'mb-4' : ''}
                `}>
                    {/* Matrix brackets top/bottom visual hack */}
                    <div className="absolute top-0 left-0 w-1.5 h-[2px] bg-ink" />
                    <div className="absolute top-0 right-0 w-1.5 h-[2px] bg-ink" />
                    <div className="absolute bottom-0 left-0 w-1.5 h-[2px] bg-ink" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-[2px] bg-ink" />

                   {chunk.map((val, i) => (
                       <div key={i} className="font-mono text-[10px] text-ink-light leading-none h-4 flex items-center justify-center w-full">
                           {formatFloat(val)}
                       </div>
                   ))}
                </div>
            ))}
         </div>
      </div>
    );
  };

  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-paper-pattern" />

      <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
        Figure 10: Vector Ninja
      </div>

      <div className="flex flex-col items-center mt-12 relative z-10">
         
         {/* Title / Status */}
         <div className="text-center mb-8 min-h-[4rem]">
            <h4 className="font-serif font-bold text-xl text-ink">
                {step === 0 && "We Start with 8-Dimensional Vectors"}
                {step === 1 && "Slice 1"}
                {step === 2 && "Slice 2"}
                {step === 3 && "Slice 3"}
            </h4>
            <p className="text-sm font-mono text-ink-light">
                {step === 0 && "Monolithic"}
                {step === 1 && "Breaks off indices [0,1]..."}
                {step === 2 && "Breaks off indices [2,3]..."}
                {step === 3 && "Leaves us with 4 independent 2D Vectors"}
            </p>
         </div>

         {/* The Grid of Vectors */}
         <div className="relative flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-12 mb-8">
            
            {/* The Blade Overlay (Desktop Only) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible hidden md:block">
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                {/* 
                   Coordinates approximation:
                   The gap between index 1 and 2 is approx 25% down the vector height.
                   The gap between index 3 and 4 is approx 50%.
                   The gap between index 5 and 6 is approx 75%.
                   We assume the vector block height is roughly 160px.
                */}
                
                {/* Slice 1: Left to Right (Top) */}
                {isAnimating && step === 1 && (
                    <path d="M -50,55 L 800,55" stroke="var(--rust)" strokeWidth="4" strokeLinecap="round" filter="url(#glow)">
                        <animate attributeName="stroke-opacity" values="1;0" dur="0.6s" fill="freeze" />
                        <animate attributeName="d" values="M -50,55 L -50,55; M -50,55 L 800,55" dur="0.3s" fill="freeze" />
                    </path>
                )}

                {/* Slice 2: Right to Left (Middle) */}
                {isAnimating && step === 2 && (
                    <path d="M 800,100 L -50,100" stroke="var(--rust)" strokeWidth="4" strokeLinecap="round" filter="url(#glow)">
                        <animate attributeName="stroke-opacity" values="1;0" dur="0.6s" fill="freeze" />
                        <animate attributeName="d" values="M 800,100 L 800,100; M 800,100 L -50,100" dur="0.3s" fill="freeze" />
                    </path>
                )}

                {/* Slice 3: Left to Right (Bottom) */}
                {isAnimating && step === 3 && (
                    <path d="M -50,145 L 800,145" stroke="var(--rust)" strokeWidth="4" strokeLinecap="round" filter="url(#glow)">
                        <animate attributeName="stroke-opacity" values="1;0" dur="0.6s" fill="freeze" />
                        <animate attributeName="d" values="M -50,145 L -50,145; M -50,145 L 800,145" dur="0.3s" fill="freeze" />
                    </path>
                )}
            </svg>

            {[
                { label: 'Twinkle', pos: 0, q: TWINKLE_Q, k: TWINKLE_K },
                { label: 'Twinkle', pos: 1, q: TWINKLE_Q, k: TWINKLE_K },
                { label: 'Little',  pos: 2, q: LITTLE_Q,  k: LITTLE_K },
            ].map((token) => (
                <div key={token.pos} className="flex flex-col items-center">
                    <div className="bg-paper-dark border border-ink px-2 py-1 font-serif font-bold text-ink mb-2 text-sm md:text-base w-36 text-center">
                        "{token.label}"
                        <span className="block text-[10px] font-mono text-center font-normal opacity-70">Pos {token.pos}</span>
                    </div>
                    
                    <div className="flex gap-2">
                        <VectorStrip vec={token.q} label="Q" colorClass="text-rust" />
                        <VectorStrip vec={token.k} label="K" colorClass="text-forest" />
                    </div>
                </div>
            ))}
         </div>

         {/* Controls */}
         <div className="flex gap-4">
            <button 
                onClick={handleReset}
                disabled={step === 0}
                className="px-4 py-2 font-mono text-sm border border-ink text-ink bg-paper hover:bg-paper-dark disabled:opacity-30 transition-colors"
            >
                Reset
            </button>
            <button 
                onClick={handleNext}
                disabled={step === 3}
                className="px-6 py-2 font-mono text-sm border-2 border-rust bg-rust text-paper hover:bg-ink hover:border-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
                {step === 3 ? "Decomposition Complete" : "Slice!"}
            </button>
         </div>

      </div>
    </div>
  );
};

export default RopeSlicingDemo;
