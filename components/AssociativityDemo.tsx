
import React, { useState } from 'react';

// Visual block for a matrix/vector
const Block = ({ label, dim, color, widthClass, heightClass }: { label: React.ReactNode, dim: string, color: string, widthClass: string, heightClass: string }) => (
  <div className="flex flex-col items-center">
     <div className={`
        flex items-center justify-center border-2 font-mono font-bold shadow-sm relative z-10 bg-paper
        ${color} ${widthClass} ${heightClass}
     `}>
        {label}
     </div>
     <div className="mt-2 font-mono text-[10px] text-ink-light opacity-70">{dim}</div>
  </div>
);

const Dot = () => <div className="text-xl text-ink font-bold mx-1">·</div>;

const Group = ({ children, label, color = "border-ink" }: { children?: React.ReactNode, label: string, color?: string }) => (
  <div className="relative px-3 py-4 mx-1">
      {/* Brackets */}
      <div className={`absolute top-0 bottom-0 left-0 w-3 border-l-2 border-t-2 border-b-2 ${color} rounded-l-xl`}></div>
      <div className={`absolute top-0 bottom-0 right-0 w-3 border-r-2 border-t-2 border-b-2 ${color} rounded-r-xl`}></div>
      
      {/* Label */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-paper px-2 font-mono text-[10px] font-bold text-ink whitespace-nowrap z-20">
          {label}
      </div>
      
      <div className="flex items-center gap-1">
          {children}
      </div>
  </div>
);

const AssociativityDemo: React.FC = () => {
  const [isGrouped, setIsGrouped] = useState(false);

  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative overflow-hidden transition-all">
        <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 21: The Chain of Alignment
        </div>
        
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-paper-pattern" />

        <div className="mt-16 flex flex-col items-center relative z-10">
            
            {/* Toggle Control */}
             <div className="mb-12 flex flex-wrap justify-center gap-4 bg-paper-dark p-1 rounded-lg border border-ink/20">
                <button 
                  onClick={() => setIsGrouped(false)}
                  className={`px-4 py-1 font-mono text-sm rounded transition-colors ${!isGrouped ? 'bg-ink text-paper shadow' : 'text-ink-light hover:bg-ink/5'}`}
                >
                  Before
                </button>
                <button 
                  onClick={() => setIsGrouped(true)}
                  className={`px-4 py-1 font-mono text-sm rounded transition-colors ${isGrouped ? 'bg-rust text-paper shadow' : 'text-ink-light hover:bg-rust/10'}`}
                >
                  After
                </button>
             </div>


            {/* The Equation Visual */}
            <div className="flex flex-wrap items-center justify-center gap-2 xl:gap-1 p-8 bg-white/40 border border-ink/10 rounded-xl min-h-[220px]">
                
                {!isGrouped ? (
                    // STEP 1 LAYOUT: (qT · R2) · (R0 · k)
                    <>
                        <Group label="Rotated Query" color="border-rust">
                            <Block 
                                label={<span>q<sup>T</sup></span>} 
                                dim="1 × 8" 
                                color="bg-rust/10 border-rust text-rust" 
                                widthClass="w-32" heightClass="h-10"
                            />
                            <Dot />
                            <Block 
                                label={<span>R<sub>2</sub><sup>T</sup></span>} 
                                dim="8 × 8" 
                                color="bg-ink/5 border-ink text-ink"
                                widthClass="w-24" heightClass="h-24" 
                            />
                        </Group>

                        <div className="mb-4"><Dot /></div>

                        <Group label="Rotated Key" color="border-forest">
                            <Block 
                                label={<span>R<sub>0</sub></span>} 
                                dim="8 × 8" 
                                color="bg-ink/5 border-ink text-ink" 
                                widthClass="w-24" heightClass="h-24"
                            />
                            <Dot />
                            <Block 
                                label="k" 
                                dim="8 × 1" 
                                color="bg-forest/10 border-forest text-forest" 
                                widthClass="w-10" heightClass="h-32"
                            />
                        </Group>
                    </>
                ) : (
                    // STEP 2 LAYOUT: qT · (R2 · R0) · k
                    <>
                         <Block 
                            label={<span>q<sup>T</sup></span>} 
                            dim="1 × 8" 
                            color="bg-rust/10 border-rust text-rust" 
                            widthClass="w-32" heightClass="h-10"
                        />
                        <Dot />
                        <Group label="Relative Rotation" color="border-ink">
                             <Block 
                                label={<span>R<sub>2</sub><sup>T</sup></span>} 
                                dim="8 × 8" 
                                color="bg-ink/5 border-ink text-ink"
                                widthClass="w-24" heightClass="h-24" 
                            />
                            <Dot />
                            <Block 
                                label={<span>R<sub>0</sub></span>} 
                                dim="8 × 8" 
                                color="bg-ink/5 border-ink text-ink" 
                                widthClass="w-24" heightClass="h-24"
                            />
                        </Group>
                        <Dot />
                        <Block 
                            label="k" 
                            dim="8 × 1" 
                            color="bg-forest/10 border-forest text-forest" 
                            widthClass="w-10" heightClass="h-32"
                        />
                    </>
                )}

            </div>
            
            {/* Dimensions Check */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-ink-light opacity-80">
                 <span>[1×8]</span> · <span>[8×8]</span> · <span>[8×8]</span> · <span>[8×1]</span>
                 <span className="ml-2 font-bold text-ink">= Scalar</span>
            </div>
             
             {/* Result Narrative */}
             <div className={`mt-8 max-w-xl text-center transition-all duration-500 p-4 border-l-4 ${isGrouped ? 'border-rust bg-highlight/20' : 'border-grid bg-paper-dark/20'}`}>
                {isGrouped ? (
                   <p className="font-serif text-lg text-ink">
                      By prioritizing the middle multiplication <span className="font-mono bg-paper px-1 border border-ink/20 font-bold">(R<sub>2</sub><sup>T</sup> · R<sub>0</sub>)</span>, 
                      we combine the two position matrices into a single interaction before they ever touch the query or key vectors.
                   </p>
                ) : (
                   <p className="font-serif text-lg text-ink-light italic">
                      Originally, we rotate the Query (left group) and the Key (right group) then compare them.
                      <br/>
                      <span className="text-sm not-italic mt-2 block font-mono">
                        ( q<sup>T</sup> · R<sub>2</sub><sup>T</sup> ) · ( R<sub>0</sub> · k )
                      </span>
                   </p>
                )}
             </div>

        </div>
    </div>
  );
};

export default AssociativityDemo;
