
import React from 'react';
import { LITTLE_Q, TWINKLE_K, formatFloat } from '../constants';

const RopeDotProductIntro: React.FC = () => {
  // We use LITTLE_Q (Pos 2) and TWINKLE_K (Pos 0)
  // q = [-0.33, 0.88, ...]
  // k = [-0.55, 0.12, ...]

  const renderAlgebraicRow = (
    val1: number, 
    val2: number, 
    pos: number, 
    pairIdx: number, 
    isSineRow: boolean
  ) => {
    // Formatting: val1 * cos(m·theta) - val2 * sin(m·theta)
    // Row 1 (Even index): x*cos - y*sin
    // Row 2 (Odd index):  x*sin + y*cos
    
    return (
      <div className="flex items-center whitespace-nowrap text-[10px] md:text-xs font-mono py-1">
        <span className="font-bold text-ink">{formatFloat(val1)}</span>
        <span className="text-ink-light mx-1">·</span>
        <span>{isSineRow ? 'sin' : 'cos'}(<span className="text-rust font-bold">{pos}·θ<sub>{pairIdx}</sub></span>)</span>
        
        <span className="mx-2 font-bold text-ink-light">{isSineRow ? '+' : '-'}</span>
        
        <span className="font-bold text-ink">{formatFloat(val2)}</span>
        <span className="text-ink-light mx-1">·</span>
        <span>{isSineRow ? 'cos' : 'sin'}(<span className="text-rust font-bold">{pos}·θ<sub>{pairIdx}</sub></span>)</span>
      </div>
    );
  };

  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative overflow-hidden">
      <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
        Figure 18: Setting the Stage for Interaction
      </div>

      <div className="mt-16 flex flex-col gap-10">
        
        {/* Intro / Setup */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-serif text-lg leading-relaxed mb-6">
            We have applied the rotation to our vectors. 
            We must determine how much "Little" (at Position 2) attends to "Twinkle" (at Position 0).
          </p>
          <div className="flex justify-center gap-8 mb-4 font-mono text-sm">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-rust"></div>
                <span>Query (Pos 2)</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-forest"></div>
                <span>Key (Pos 0)</span>
            </div>
          </div>
        </div>

        {/* 1. The Vertical Vectors */}
        <div className="flex justify-center gap-4 md:gap-10 items-start overflow-x-auto pb-4">
            
            {/* Vector Q (Vertical) */}
            <div className="flex flex-col items-center min-w-[260px]">
                <div className="font-bold text-rust font-serif text-lg mb-2">q' (Rotated)</div>
                <div className="text-xs font-mono text-ink-light mb-2">8 × 1 Vector</div>
                
                <div className="relative border-l-2 border-r-2 border-ink px-2 py-1 bg-white/40">
                    {/* Top/Bottom brackets */}
                    <div className="absolute top-0 left-0 w-2 h-[2px] bg-ink"></div>
                    <div className="absolute top-0 right-0 w-2 h-[2px] bg-ink"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-[2px] bg-ink"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-[2px] bg-ink"></div>

                    <div className="flex flex-col gap-4 py-2">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col bg-rust/5 p-1 border border-rust/10">
                                {renderAlgebraicRow(LITTLE_Q[2*i], LITTLE_Q[2*i+1], 2, i, false)}
                                {renderAlgebraicRow(LITTLE_Q[2*i], LITTLE_Q[2*i+1], 2, i, true)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="self-center font-bold text-2xl text-ink/30 hidden md:block">vs</div>

            {/* Vector K (Vertical) */}
            <div className="flex flex-col items-center min-w-[260px]">
                <div className="font-bold text-forest font-serif text-lg mb-2">k' (Rotated)</div>
                <div className="text-xs font-mono text-ink-light mb-2">8 × 1 Vector</div>

                <div className="relative border-l-2 border-r-2 border-ink px-2 py-1 bg-white/40">
                    {/* Top/Bottom brackets */}
                    <div className="absolute top-0 left-0 w-2 h-[2px] bg-ink"></div>
                    <div className="absolute top-0 right-0 w-2 h-[2px] bg-ink"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-[2px] bg-ink"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-[2px] bg-ink"></div>

                    <div className="flex flex-col gap-4 py-2">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col bg-forest/5 p-1 border border-forest/10">
                                {renderAlgebraicRow(TWINKLE_K[2*i], TWINKLE_K[2*i+1], 0, i, false)}
                                {renderAlgebraicRow(TWINKLE_K[2*i], TWINKLE_K[2*i+1], 0, i, true)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>

        {/* 2. The Transpose Operation */}
        <div className="bg-paper-dark border-t border-b border-ink p-8">
            <h4 className="font-serif font-bold text-xl text-ink mb-4">The Transpose Requirement</h4>
            <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="prose text-ink-light">
                    <p>
                        To find the dot product between these two vectors, we must multiply these two vectors and get a single number (a scalar) returned. 
                        Standard matrix multiplication rules state that to multiply two vectors, the inner dimensions must match.
                    </p>
                    <div className="flex items-center gap-4 my-4 font-mono text-sm bg-white/50 p-2 border border-grid w-fit">
                        <span className="text-rust">[8 × 1]</span>
                        <span>·</span>
                        <span className="text-forest">[8 × 1]</span>
                        <span className="text-red-600 font-bold">≠</span>
                        <span>Scalar</span>
                    </div>
                    <p>
                        Therefore, we must <strong>transpose</strong> the Query vector, turning it from a column into a row.
                    </p>
                    <div className="flex items-center gap-4 my-4 font-mono text-sm bg-highlight p-2 border border-rust w-fit shadow-sm">
                        <span className="text-rust font-bold">[1 × 8]</span>
                        <span>·</span>
                        <span className="text-forest">[8 × 1]</span>
                        <span className="text-forest font-bold">=</span>
                        <span className="font-bold underline">Scalar [1 × 1]</span>
                    </div>
                </div>
                
                {/* Visual arrow */}
                <div className="hidden md:flex flex-col items-center opacity-50">
                    <div className="w-1 h-12 bg-ink"></div>
                    <div className="w-12 h-1 bg-ink"></div>
                    <div className="font-hand text-ink mt-2">Rotate 90°</div>
                </div>
            </div>
        </div>

        {/* 3. The Transposed Vector */}
        <div className="flex flex-col">
            <h5 className="font-bold text-rust font-serif text-lg mb-2 px-4">q' Transposed (Row Vector)</h5>
            
            <div className="relative w-full overflow-x-auto pb-6 custom-scrollbar px-4 bg-paper shadow-inner border-y border-grid">
                <div className="flex items-center py-6 min-w-max">
                    {/* Left Bracket */}
                    <div className="w-2 self-stretch border-l-2 border-t-2 border-b-2 border-ink mr-2"></div>
                    
                    <div className="flex gap-2">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3 bg-rust/5 p-2 border border-rust/10 border-dashed">
                                {/* Element 2*i */}
                                <div className="flex flex-col justify-center">
                                    <div className="text-[9px] font-mono text-rust opacity-50 mb-1 text-center">Index {2*i}</div>
                                    {renderAlgebraicRow(LITTLE_Q[2*i], LITTLE_Q[2*i+1], 2, i, false)}
                                </div>
                                {/* Vertical separator within pair */}
                                <div className="w-[1px] bg-rust/20"></div>
                                {/* Element 2*i + 1 */}
                                <div className="flex flex-col justify-center">
                                    <div className="text-[9px] font-mono text-rust opacity-50 mb-1 text-center">Index {2*i+1}</div>
                                    {renderAlgebraicRow(LITTLE_Q[2*i], LITTLE_Q[2*i+1], 2, i, true)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Bracket */}
                    <div className="w-2 self-stretch border-r-2 border-t-2 border-b-2 border-ink ml-2"></div>
                </div>
                
                {/* Scroll hint */}
                <div className="absolute bottom-2 right-4 text-[10px] font-mono text-rust animate-pulse">
                    → Scroll to see full vector
                </div>
            </div>
            
            <div className="text-center font-mono text-xs text-ink-light mt-2">
                This is now a <span className="font-bold text-rust">1 × 8</span> vector ready to multiply with our <span className="font-bold text-forest">8 × 1</span> Key vector.
            </div>
        </div>

      </div>
    </div>
  );
};

export default RopeDotProductIntro;
