
import React from 'react';
import { 
  TWINKLE_Q, TWINKLE_K, 
  LITTLE_Q, LITTLE_K,
  formatFloat 
} from '../constants';

// Helper to chunk vector
const getPairs = (vec: number[]): number[][] => {
  const pairs: number[][] = [];
  for (let i = 0; i < vec.length; i += 2) {
    pairs.push([vec[i], vec[i+1]]);
  }
  return pairs;
};

interface ArrowGraphProps {
  pair: number[];
  color: string;
}

const ArrowGraph: React.FC<ArrowGraphProps> = ({ pair, color }) => {
  const [x, y] = pair;
  // Use abstract coordinate system 0-100 for perfect centering
  const center = 50;
  // Map value range [-1, 1] to roughly [15, 85] (padding 15)
  const scale = 35; 
  
  // Flip Y for SVG (y increases downwards)
  const x2 = center + x * scale;
  const y2 = center - y * scale; 

  return (
    <div className="w-[50px] h-[50px] bg-white/50 border border-grid relative shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full absolute top-0 left-0">
         {/* Axes */}
         <line x1="50" y1="0" x2="50" y2="100" stroke="#c4b8a4" strokeWidth="3" opacity="0.5" />
         <line x1="0" y1="50" x2="100" y2="50" stroke="#c4b8a4" strokeWidth="3" opacity="0.5" />
         
         {/* Vector - No endpoint circle */}
         <line 
           x1="50" y1="50" 
           x2={x2} y2={y2} 
           stroke={color} 
           strokeWidth="6" 
           strokeLinecap="round"
         />
      </svg>
    </div>
  );
};

interface PairBlockProps {
  val: number[];
  colorClass: string;
  hexColor: string;
}

const PairBlock: React.FC<PairBlockProps> = ({ val, colorClass, hexColor }) => (
  <div className="flex items-center gap-0 mb-3">
     {/* Number Box */}
     <div className={`
        relative border-l-2 border-r-2 border-ink
        bg-white/50 w-[50px] h-[50px]
        flex flex-col items-center justify-center shadow-sm
     `}>
        {/* Matrix brackets styling */}
        <div className="absolute top-0 left-0 w-1.5 h-[1px] bg-ink" />
        <div className="absolute top-0 right-0 w-1.5 h-[1px] bg-ink" />
        <div className="absolute bottom-0 left-0 w-1.5 h-[1px] bg-ink" />
        <div className="absolute bottom-0 right-0 w-1.5 h-[1px] bg-ink" />

        <div className="font-mono text-[9px] text-ink-light leading-relaxed">{formatFloat(val[0])}</div>
        <div className="font-mono text-[9px] text-ink-light leading-relaxed">{formatFloat(val[1])}</div>
     </div>

     {/* Graph */}
     <ArrowGraph pair={val} color={hexColor} />
  </div>
);

interface TokenColumnProps {
  label: string;
  pos: number;
  q: number[];
  k: number[];
}

const TokenColumn: React.FC<TokenColumnProps> = ({ label, pos, q, k }) => {
   const qPairs = getPairs(q);
   const kPairs = getPairs(k);

   return (
     <div className="flex flex-col items-center">
        <div className="bg-paper-dark border border-ink px-3 py-2 font-serif font-bold text-ink mb-5 text-base text-center shadow-sm w-36">
           "{label}"
           <span className="block text-xs font-mono font-normal opacity-70 mt-1">Pos {pos}</span>
        </div>

        <div className="flex gap-3">
           {/* Q Column */}
           <div className="flex flex-col items-center">
              <span className="font-mono text-xs font-bold text-rust mb-2">Q</span>
              {qPairs.map((p, i) => (
                 <PairBlock key={i} val={p} colorClass="text-rust" hexColor="#b85a3c" />
              ))}
           </div>

           {/* K Column */}
           <div className="flex flex-col items-center">
              <span className="font-mono text-xs font-bold text-forest mb-2">K</span>
              {kPairs.map((p, i) => (
                 <PairBlock key={i} val={p} colorClass="text-forest" hexColor="#2d5a4a" />
              ))}
           </div>
        </div>
     </div>
   );
};

const VectorArrowVis: React.FC = () => {
  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative overflow-hidden">
      <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
        Figure 11: The Geometric Subspaces
      </div>

      <div className="mt-16 overflow-x-auto pb-8 custom-scrollbar">
        <div className="flex justify-center items-stretch gap-4 px-2 min-w-max md:min-w-0">
            <TokenColumn label="Twinkle" pos={0} q={TWINKLE_Q} k={TWINKLE_K} />
            
            {/* Divider 1 */}
            <div className="w-[1px] bg-ink/20 mx-2 self-stretch" />
            
            <TokenColumn label="Twinkle" pos={1} q={TWINKLE_Q} k={TWINKLE_K} />
            
            {/* Divider 2 */}
            <div className="w-[1px] bg-ink/20 mx-2 self-stretch" />
            
            <TokenColumn label="Little"  pos={2} q={LITTLE_Q}  k={LITTLE_K} />
        </div>
      </div>
      
      <div className="text-center mt-6 text-sm font-serif italic text-ink-light border-t border-grid pt-4">
         Each 8-dimensional vector is now treated as four independent 2D arrows. We can rotate each arrow individually based on its position.
      </div>
    </div>
  );
};

export default VectorArrowVis;
