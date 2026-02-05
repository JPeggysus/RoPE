
import React, { useState } from 'react';
import { TokenData } from '../types';
import { formatFloat } from '../constants';
import VectorColumn from './VectorColumn';

interface TokenizationDemoProps {
  tokens: TokenData[];
}

const TokenizationDemo: React.FC<TokenizationDemoProps> = ({ tokens }) => {
  const [hoveredTokenId, setHoveredTokenId] = useState<number | null>(null);

  // Identify duplicate words to highlight the "Lookup" nature
  const hoveredWord = hoveredTokenId !== null 
    ? tokens.find(t => t.id === hoveredTokenId)?.text 
    : null;

  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative pt-16">
        <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 1: Token to Vector Mapping
        </div>

      {/* Input Sequence */}
      <div className="mb-12 flex flex-col items-center">
        <h3 className="font-serif italic text-ink-light mb-4">Input Sequence</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {tokens.map((token) => {
             const isMatch = hoveredWord === token.text;
             const isHovered = hoveredTokenId === token.id;

             return (
                <div
                    key={token.id}
                    onMouseEnter={() => setHoveredTokenId(token.id)}
                    onMouseLeave={() => setHoveredTokenId(null)}
                    className={`
                    relative px-4 py-3 border-2 transition-all duration-300 cursor-pointer z-10
                    ${isMatch 
                        ? 'bg-highlight border-forest shadow-md -translate-y-1' 
                        : 'bg-paper-dark border-ink'
                    }
                    `}
                >
                    <span className={`font-mono text-lg ${isMatch ? 'text-forest font-bold' : 'text-ink'}`}>
                    "{token.text}"
                    </span>
                    
                    {/* Position Badge */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-ink text-paper text-[10px] font-mono px-2 py-[1px] z-20">
                    pos: {token.position}
                    </div>

                    {/* Connecting Line to Vector */}
                    <div className={`
                    absolute top-full left-1/2 w-[2px] h-10 -translate-x-1/2 transition-colors duration-300 -z-10
                    ${isMatch ? 'bg-forest' : 'bg-grid'}
                    `} />
                    <div className={`
                    absolute top-[calc(100%+2.5rem)] left-1/2 w-2 h-2 rounded-full -translate-x-1/2 transition-colors duration-300
                    ${isMatch ? 'bg-forest' : 'bg-grid'}
                    `} />
                </div>
            );
          })}
        </div>
      </div>

      {/* Embedding Vectors */}
      <div className="flex flex-col items-center">
        <h3 className="font-serif italic text-ink-light mb-6">Learned Semantic Embeddings (d=16)</h3>
        <div className="flex justify-center items-start gap-2 sm:gap-4 md:gap-8 overflow-x-auto w-full pb-4">
          {tokens.map((token, idx) => {
            const isMatch = hoveredWord === token.text;
            const isDuplicateOfPrev = idx > 0 && tokens[idx - 1].text === token.text;
            
            return (
              <div key={token.id} className="relative group">
                <VectorColumn 
                  values={token.vector} 
                  label={<span>x<sub>{token.position}</sub></span>}
                  highlight={isMatch}
                  isSameAsPrevious={false} // Handled visually by hover state logic mostly, but we can enable if needed
                />
                
                {/* Equality Indicator for duplicates */}
                {isDuplicateOfPrev && isMatch && (
                  <div className="absolute top-1/2 -left-4 sm:-left-6 md:-left-8 -translate-y-1/2 w-4 sm:w-6 md:w-8 border-t-2 border-dashed border-forest flex justify-center">
                    <span className="bg-paper px-1 text-forest font-bold">=</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-grid text-sm font-mono text-ink-light leading-relaxed">
        <p>
            <span className="font-bold text-forest">Note:</span> The vectors for <span className="font-mono bg-highlight/30 px-1 rounded">x<sub>0</sub></span> and <span className="font-mono bg-highlight/30 px-1 rounded">x<sub>1</sub></span> are identical despite their different positions. 
            The embedding layer is a static lookup table: <span className="font-mono bg-highlight/30 px-1 rounded">E("Twinkle") → ℝ<sup>16</sup></span>.
        </p>
      </div>

    </div>
  );
};

export default TokenizationDemo;
