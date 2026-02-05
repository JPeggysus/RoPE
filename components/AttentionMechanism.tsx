
import React, { useState } from 'react';
import { TokenData } from '../types';
import { 
  TWINKLE_Q, TWINKLE_K, TWINKLE_V, 
  LITTLE_Q, LITTLE_K, LITTLE_V
} from '../constants';
import VectorColumn from './VectorColumn';

interface AttentionMechanismProps {
  tokens: TokenData[];
}

// Interactive Arrow Component
const ConnectorArrow = ({ 
  colorClass, 
  isActive, 
  isDimmed 
}: { 
  colorClass: string; 
  isActive: boolean; 
  isDimmed: boolean; 
}) => (
  <div className={`
      flex items-center justify-center w-8 md:w-16 transition-all duration-300 shrink-0
      ${colorClass}
      ${isDimmed ? 'opacity-10' : isActive ? 'opacity-100 scale-105' : 'opacity-40'}
  `}>
    <svg width="100%" height="24" viewBox="0 0 64 24" overflow="visible">
      <line 
        x1="0" y1="12" 
        x2="56" y2="12" 
        stroke="currentColor" 
        strokeWidth={isActive ? 2.5 : 1.5} 
      />
      {/* Solid Arrowhead */}
      <path 
        d="M 56 12 L 48 7 L 48 17 Z" 
        fill="currentColor" 
      />
    </svg>
  </div>
);

const AttentionMechanism: React.FC<AttentionMechanismProps> = ({ tokens }) => {
  const [selectedTokenId, setSelectedTokenId] = useState<number>(0);
  const [hoveredMatrix, setHoveredMatrix] = useState<string | null>(null);

  const selectedToken = tokens.find(t => t.id === selectedTokenId) || tokens[0];
  const isTwinkle = selectedToken.text === 'Twinkle';
  
  // Select appropriate fake projection vectors based on word
  const qVector = isTwinkle ? TWINKLE_Q : LITTLE_Q;
  const kVector = isTwinkle ? TWINKLE_K : LITTLE_K;
  const vVector = isTwinkle ? TWINKLE_V : LITTLE_V;

  return (
    <div className="my-16">
      
      {/* SELECTION CONTROLS */}
      <div className="flex flex-col items-center mb-8">
        <h4 className="font-serif italic text-ink-light mb-4 text-xl">Select Input Token</h4>
        <div className="flex flex-wrap justify-center gap-4">
            {tokens.map((token) => (
              <button
                key={token.id}
                onClick={() => setSelectedTokenId(token.id)}
                className={`
                  flex flex-col items-center px-6 py-2 border-2 font-mono transition-all min-w-[140px]
                  ${selectedTokenId === token.id 
                    ? 'bg-ink text-paper border-ink shadow-md -translate-y-1' 
                    : 'bg-paper hover:bg-highlight border-grid text-ink'}
                `}
              >
                <span className="text-[10px] opacity-70 uppercase tracking-widest mb-1">pos: {token.position}</span>
                <span className="text-xl font-bold">"{token.text}"</span>
              </button>
            ))}
        </div>
      </div>

      <div className="bg-paper border border-ink relative pt-12">
        <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 3: The Projection Layer (Head 0)
        </div>

        {/* Scrollable Container */}
        <div className="overflow-x-auto pb-4">
            <div className="p-4 md:p-8 flex flex-row items-center justify-start xl:justify-center min-w-max gap-8 md:gap-12 mx-auto">
            
                {/* LEFT: Input Vector */}
                <div className="flex flex-col items-center justify-center border-r border-grid/30 pr-8">
                <div className="mb-4 text-center">
                    <span className="font-mono text-sm text-ink-light block">x<sub>{selectedToken.position}</sub></span>
                    <span className="font-serif text-lg font-bold text-ink">Input Embedding</span>
                </div>
                <VectorColumn values={selectedToken.vector} label="16d" />
                </div>

                {/* MIDDLE: Projection Matrices & Connectors */}
                <div className="flex flex-col justify-center gap-8 py-8">
                
                {['Query', 'Key', 'Value'].map((type) => {
                    // Determine colors based on type
                    let colorClass = 'text-ink';
                    let borderClass = 'border-ink';
                    let bgClass = 'bg-paper-dark';
                    
                    if (type === 'Query') {
                        colorClass = 'text-rust';
                        borderClass = 'border-rust';
                        bgClass = 'bg-rust/5';
                    } else if (type === 'Key') {
                        colorClass = 'text-forest';
                        borderClass = 'border-forest';
                        bgClass = 'bg-forest/5';
                    }

                    const isHovered = hoveredMatrix === type;
                    const isAnyHovered = hoveredMatrix !== null;

                    return (
                    <div 
                        key={type} 
                        className="flex items-center gap-2 group"
                        onMouseEnter={() => setHoveredMatrix(type)}
                        onMouseLeave={() => setHoveredMatrix(null)}
                    >
                        {/* Left Arrow: Input -> Matrix */}
                        <ConnectorArrow 
                            colorClass="text-ink"
                            isActive={isHovered}
                            isDimmed={isAnyHovered && !isHovered}
                        />

                        {/* Matrix Box */}
                        <div className={`
                            w-32 md:w-40 flex-col items-center justify-center
                            ${bgClass} border ${borderClass} p-3 relative transition-all duration-300 
                            ${isHovered ? 'shadow-md scale-[1.02] bg-highlight' : ''}
                        `}>
                            <div className={`font-mono text-center font-bold ${colorClass}`}>
                            W<sub>{type.charAt(0)}</sub>
                            </div>
                            <div className="text-center text-xs font-mono text-ink-light mt-1">
                            16 × 8 Matrix
                            </div>
                            
                            {/* Tooltip for Matrix */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-ink text-paper text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                            Learned weights that transform the input into {type.toLowerCase()} space.
                            </div>
                        </div>

                        {/* Right Arrow: Matrix -> Output */}
                        <ConnectorArrow 
                            colorClass={colorClass}
                            isActive={isHovered}
                            isDimmed={isAnyHovered && !isHovered}
                        />
                    </div>
                    );
                })}
                </div>

                {/* RIGHT: Output Vectors (QKV) */}
                <div className="flex flex-col justify-center gap-6 border-l border-grid/30 pl-8">
                
                {/* Query Row */}
                <div className={`flex items-center gap-4 transition-opacity duration-300 ${hoveredMatrix && hoveredMatrix !== 'Query' ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="flex-1 flex flex-col items-center">
                        <div className="mb-2 text-center">
                            <span className="font-bold text-rust font-hand text-xl block">The Needs</span>
                            <span className="text-[10px] text-ink-light uppercase tracking-wider">(Consumer)</span>
                        </div>
                        <VectorColumn values={qVector} label="q (Query)" color="rust" highlight={hoveredMatrix === 'Query'} />
                    </div>
                </div>

                {/* Key Row */}
                <div className={`flex items-center gap-4 transition-opacity duration-300 ${hoveredMatrix && hoveredMatrix !== 'Key' ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="flex-1 flex flex-col items-center">
                        <div className="mb-2 text-center">
                            <span className="font-bold text-forest font-hand text-xl block">The Ad</span>
                            <span className="text-[10px] text-ink-light uppercase tracking-wider">(Advertisement)</span>
                        </div>
                        <VectorColumn values={kVector} label="k (Key)" color="forest" highlight={hoveredMatrix === 'Key'} />
                    </div>
                </div>

                {/* Value Row */}
                <div className={`flex items-center gap-4 transition-opacity duration-300 ${hoveredMatrix && hoveredMatrix !== 'Value' ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="flex-1 flex flex-col items-center">
                        <div className="mb-2 text-center">
                            <span className="font-bold text-ink font-hand text-xl block">The Goods</span>
                            <span className="text-[10px] text-ink-light uppercase tracking-wider">(Product)</span>
                        </div>
                        <VectorColumn values={vVector} label="v (Value)" color="ink" highlight={hoveredMatrix === 'Value'} />
                    </div>
                </div>

                </div>

            </div>
        </div>
      
        <div className="p-4 bg-paper-dark border-t border-ink text-sm font-serif italic text-center">
            Mathematical Operation: Input (1 × 16) · Weight (16 × 8) = Output (1 × 8)
        </div>
      </div>
    </div>
  );
};

export default AttentionMechanism;
