
import React from 'react';
import { TWINKLE_VECTOR, POS_VECTOR_0, POS_VECTOR_1, formatFloat } from '../constants';
import VectorColumn from './VectorColumn';

// Helper to add vectors
const addVectors = (v1: number[], v2: number[]) => v1.map((val, i) => val + v2[i]);

const AbsolutePositionalDemo: React.FC = () => {
  const result0 = addVectors(TWINKLE_VECTOR, POS_VECTOR_0);
  const result1 = addVectors(TWINKLE_VECTOR, POS_VECTOR_1);

  // Find a dimension where interference is high for demonstration
  // Index 0: Twinkle (0.12) + Pos0 (0.80) = 0.92
  // Index 0: Twinkle (0.12) + Pos1 (-0.80) = -0.68
  const demoIdx = 0;

  return (
    <div className="my-12 bg-paper border border-ink relative">
      
      {/* Label */}
      <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
        Figure 8: The Additive Approach
      </div>

      <div className="p-4 md:p-8 pt-16">

        {/* Comparison Grid */}
        <div className="flex flex-col gap-12">
            <br></br>
            {/* Row 1: Position 0 */}
            <div className="overflow-x-auto pb-4 -mx-4 md:mx-0 px-4">
                <div className="flex flex-row items-center justify-start lg:justify-center min-w-max gap-4 relative group mx-auto">
                    {/* Equation Label */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-ink text-paper text-xs font-mono px-2 py-0.5 rounded-full z-10">
                        Position 0
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="font-mono text-ink text-xs mb-1">"Twinkle"</span>
                        <VectorColumn values={TWINKLE_VECTOR} label={<span>x<sub>0</sub> (Original)</span>} isAbbreviated />
                    </div>
                    
                    <div className="text-2xl font-bold text-ink">+</div>
                    
                    <div className="flex flex-col items-center">
                        <span className="font-mono text-rust text-xs mb-1">Pos 0</span>
                        <VectorColumn values={POS_VECTOR_0} label={<span>p<sub>0</sub> (Position)</span>} highlight isAbbreviated />
                    </div>

                    <div className="text-2xl font-bold text-ink">=</div>

                    <div className="flex flex-col items-center p-2 bg-highlight/20 border border-dashed border-ink rounded">
                        <span className="font-mono text-forest text-xs mb-1">Input 0</span>
                        <VectorColumn values={result0} label={<span>x'<sub>0</sub></span>} isAbbreviated />
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-grid relative">
                <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-paper px-2 text-ink-light font-hand text-lg">vs</div>
            </div>

            {/* Row 2: Position 1 */}
            <div className="overflow-x-auto pb-4 -mx-4 md:mx-0 px-4">
                <div className="flex flex-row items-center justify-start lg:justify-center min-w-max gap-4 relative group mx-auto">
                    {/* Equation Label */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-ink text-paper text-xs font-mono px-2 py-0.5 rounded-full z-10">
                        Position 1
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="font-mono text-ink text-xs mb-1">"Twinkle"</span>
                        <VectorColumn values={TWINKLE_VECTOR} label={<span>x<sub>1</sub> (Original)</span>} isAbbreviated />
                    </div>
                    
                    <div className="text-2xl font-bold text-ink">+</div>
                    
                    <div className="flex flex-col items-center">
                        <span className="font-mono text-rust text-xs mb-1">Pos 1</span>
                        <VectorColumn values={POS_VECTOR_1} label={<span>p<sub>1</sub> (Position)</span>} highlight isAbbreviated />
                    </div>

                    <div className="text-2xl font-bold text-ink">=</div>

                    <div className="flex flex-col items-center p-2 bg-highlight/20 border border-dashed border-ink rounded">
                        <span className="font-mono text-forest text-xs mb-1">Input 1</span>
                        <VectorColumn values={result1} label={<span>x'<sub>1</sub></span>} isAbbreviated />
                    </div>
                </div>
            </div>

        </div>

        {/* The Pitfall Analysis */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-paper-dark p-6 border-l-4 border-rust">
            <div>
                <h5 className="font-bold text-ink font-serif text-lg mb-2">Pitfall: Semantic Distortion</h5>
                <p className="text-sm text-ink-light leading-relaxed">
                    Look at what happened to the first value in our embeddings. The word "Twinkle" starts with a value of 
                    <span className="font-mono text-ink font-bold mx-1">{formatFloat(TWINKLE_VECTOR[demoIdx])}</span>.
                </p>
                <ul className="mt-2 space-y-1 text-sm font-mono">
                    <li className="flex justify-between border-b border-grid/50 pb-1">
                        <span>At Pos 0:</span>
                        <span>{formatFloat(TWINKLE_VECTOR[demoIdx])} + {formatFloat(POS_VECTOR_0[demoIdx])} = <span className="text-forest font-bold">{formatFloat(result0[demoIdx])}</span></span>
                    </li>
                    <li className="flex justify-between pt-1">
                        <span>At Pos 1:</span>
                        <span>{formatFloat(TWINKLE_VECTOR[demoIdx])} + ({formatFloat(POS_VECTOR_1[demoIdx])}) = <span className="text-rust font-bold">{formatFloat(result1[demoIdx])}</span></span>
                    </li>
                </ul>
            </div>
            <div className="text-sm italic font-serif text-ink border-l border-ink/20 pl-4">
                The two "Twinkle" embeddingss are distinct, but we created a new problem. The vector's semantic meaning has been fundamentally altered. The original values are completely overpowered by the positional signal.
            </div>
        </div>

      </div>
    </div>
  );
};

export default AbsolutePositionalDemo;
