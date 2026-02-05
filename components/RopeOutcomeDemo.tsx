import React from 'react';
import { TWINKLE_Q, TWINKLE_K, formatFloat } from '../constants';
import VectorColumn from './VectorColumn';

// Basic rotation logic to generate the specific numbers for Pos 1
const getRotatedVector = (vec: number[], pos: number, base: number = 10000) => {
  const result = [...vec];
  const dim = vec.length;
  
  for (let i = 0; i < dim / 2; i++) {
    const theta = Math.pow(base, -(2 * i) / dim);
    const angle = pos * theta;
    
    const x = vec[2 * i];
    const y = vec[2 * i + 1];
    
    result[2 * i] = x * Math.cos(angle) - y * Math.sin(angle);
    result[2 * i + 1] = x * Math.sin(angle) + y * Math.cos(angle);
  }
  return result;
};

const RopeOutcomeDemo: React.FC = () => {
  const q0 = TWINKLE_Q; 
  const k0 = TWINKLE_K;

  const q1 = getRotatedVector(TWINKLE_Q, 1);
  const k1 = getRotatedVector(TWINKLE_K, 1);

  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative">
       <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
         Figure 15: The Result
      </div>

      <div className="mt-12 flex flex-col items-center">
        <h3 className="font-serif text-2xl text-ink font-bold mb-8 text-center">
            Different Positions = Different Numbers
        </h3>

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-2">
            
            {/* Position 0 */}
            <div className="flex flex-col items-center bg-white/40 p-6 border-2 border-grid">
                <div className="font-serif font-bold text-lg text-ink mb-1">"Twinkle"</div>
                <div className="font-mono text-xs bg-ink text-paper px-2 py-1 mb-4">Position 0</div>
                
                <div className="flex gap-4">
                    {/* Used \u00A0 (non-breaking space) to prevent label wrapping */}
                    <VectorColumn values={q0} label={"Q\u00A0(Pos\u00A00)"} />
                    <VectorColumn values={k0} label={"K\u00A0(Pos\u00A00)"} />
                </div>
            </div>

            {/* The Difference Symbol - Centered Text */}
            <div className="flex flex-col items-center gap-2">
                <div className="text-6xl font-bold text-rust font-serif">≠</div>
                {/* Removed rotation to ensure the text is perfectly centered */}
                <div className="font-hand text-ink-light text-xl text-center">Mathematically Distinct!</div>
            </div>

            {/* Position 1 */}
            <div className="flex flex-col items-center bg-highlight/30 p-6 border-2 border-rust/30 relative">
                <div className="font-serif font-bold text-lg text-ink mb-1">"Twinkle"</div>
                <div className="font-mono text-xs bg-rust text-paper px-2 py-1 mb-4">Position 1</div>
                
                <div className="flex gap-4">
                    {/* Used \u00A0 (non-breaking space) to prevent label wrapping */}
                    <VectorColumn values={q1} label={"Q\u00A0(Pos\u00A01)"} highlight />
                    <VectorColumn values={k1} label={"K\u00A0(Pos\u00A01)"} highlight />
                </div>
            </div>

        </div>

        <div className="mt-10 max-w-2xl text-center border-t border-grid pt-6">
            <p className="font-serif text-ink italic text-lg leading-relaxed">
                The vectors used for the dot product <span className="font-mono text-sm bg-paper-dark px-1 not-italic">q · k</span> are now fundamentally different. 
                The model can now easily distinguish the first "Twinkle" from the second.
            </p>
        </div>
      </div>
    </div>
  );
};

export default RopeOutcomeDemo;