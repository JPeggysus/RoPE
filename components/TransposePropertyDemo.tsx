
import React from 'react';

const TransposePropertyDemo: React.FC = () => {
  // Simple data for proof
  // A = [[1, 2], [3, 4]]
  // B = [[5], [6]]
  // AB = [1*5 + 2*6, 3*5 + 4*6] = [17, 39]
  // (AB)^T = [17, 39] row

  // B^T = [5, 6]
  // A^T = [[1, 3], [2, 4]]
  // B^T * A^T = [5*1 + 6*2, 5*3 + 6*4] = [17, 39]

  const A = [[1, 2], [3, 4]];
  const B = [5, 6];
  
  const AB = [
    A[0][0]*B[0] + A[0][1]*B[1], // 1*5 + 2*6 = 17
    A[1][0]*B[0] + A[1][1]*B[1]  // 3*5 + 4*6 = 39
  ];

  // Helper for matrix visualization
  const SmallMatrix = ({ data, label }: { data: number[][], label: string }) => (
    <div className="flex flex-col items-center mx-1 md:mx-2">
      <div className="mb-1 font-mono text-[10px] md:text-xs font-bold text-ink-light min-h-[1rem] flex items-end justify-center">{label}</div>
      <div className="relative border-l-2 border-r-2 border-ink px-1 py-1 bg-white/50">
        <div className="absolute top-0 left-0 w-1.5 h-[1px] bg-ink"></div>
        <div className="absolute top-0 right-0 w-1.5 h-[1px] bg-ink"></div>
        <div className="absolute bottom-0 left-0 w-1.5 h-[1px] bg-ink"></div>
        <div className="absolute bottom-0 right-0 w-1.5 h-[1px] bg-ink"></div>
        <div className="grid grid-rows-2 gap-1">
          {data.map((row, r) => (
             <div key={r} className="flex gap-2 justify-center">
               {row.map((val, c) => (
                 <span key={c} className="font-mono text-sm w-4 text-center">{val}</span>
               ))}
             </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SmallVector = ({ data, label, isRow = false }: { data: number[], label?: string, isRow?: boolean }) => (
    <div className="flex flex-col items-center mx-1 md:mx-2">
      <div className="mb-1 font-mono text-[10px] md:text-xs font-bold text-ink-light min-h-[1rem] flex items-end justify-center">{label}</div>
      <div className="relative border-l-2 border-r-2 border-ink px-1 py-1 bg-white/50">
        <div className="absolute top-0 left-0 w-1.5 h-[1px] bg-ink"></div>
        <div className="absolute top-0 right-0 w-1.5 h-[1px] bg-ink"></div>
        <div className="absolute bottom-0 left-0 w-1.5 h-[1px] bg-ink"></div>
        <div className="absolute bottom-0 right-0 w-1.5 h-[1px] bg-ink"></div>
        <div className={`flex ${isRow ? 'flex-row gap-2' : 'flex-col gap-1'}`}>
           {data.map((val, i) => (
             <span key={i} className="font-mono text-sm w-4 text-center">{val}</span>
           ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="my-12 p-4 md:p-8 bg-paper border border-ink relative overflow-hidden">
      <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
        Figure 20: The Reversal Rule
      </div>

      <div className="mt-12 flex flex-col gap-16">
        
        {/* Part 1: The Proof */}
        <div className="flex flex-col items-center">
             <h4 className="font-serif italic text-ink mb-6 text-center">
                Property: <span className="font-mono not-italic font-bold bg-highlight px-2 mx-2">(A · B)<sup>T</sup> = B<sup>T</sup> · A<sup>T</sup></span>
             </h4>

             <div className="flex flex-col xl:flex-row gap-8 xl:gap-16 items-center bg-paper-dark/20 p-6 rounded-lg border border-ink/10">
                
                {/* Method 1: Multiply then Transpose */}
                <div className="flex flex-col items-center">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-rust mb-4">(A · B)ᵀ</div>
                    <div className="flex items-center gap-1 md:gap-2">
                         <span className="text-2xl text-ink/30">(</span>
                         <SmallMatrix data={A} label="A" />
                         <span className="text-xl text-ink">·</span>
                         <SmallVector data={B} label="B" />
                         <span className="text-2xl text-ink/30">)</span>
                         <sup className="text-lg font-bold -ml-1">T</sup>
                         
                         <span className="text-xl text-ink mx-1 md:mx-2">=</span>
                         
                         <SmallVector data={AB} />
                         <sup className="text-lg font-bold -ml-1">T</sup>
                         
                         <span className="text-xl text-ink mx-1 md:mx-2">=</span>
                         
                         <SmallVector data={AB} label="Result" isRow={true} />
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px xl:w-px xl:h-24 bg-ink/20"></div>

                {/* Method 2: Flip then Multiply */}
                <div className="flex flex-col items-center">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-forest mb-4">Bᵀ · Aᵀ</div>
                    <div className="flex items-center gap-1 md:gap-2">
                         <SmallVector data={B} label="Bᵀ" isRow={true} />
                         <span className="text-xl text-ink">·</span>
                         {/* A Transposed: Rows become cols */}
                         <SmallMatrix data={[[1, 3], [2, 4]]} label="Aᵀ" />
                         
                         <span className="text-xl text-ink mx-1 md:mx-2">=</span>
                         
                         {/* [5, 6] . [[1,3],[2,4]] = [5*1+6*2, 5*3+6*4] = [17, 39] */}
                         <SmallVector data={AB} label="Result" isRow={true} />
                    </div>
                </div>
             </div>
             
             <div className="mt-4 font-hand text-rust text-lg">They yield the exact same result</div>
        </div>

        {/* Part 2: Application to RoPE */}
        <div className="border-t border-grid pt-12">
            <h4 className="font-serif italic text-ink mb-8 text-center">
                Applying to our Attention Equation
            </h4>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                 {/* Original Left Term */}
                 <div className="p-4 border-2 border-dashed border-ink/30 bg-paper rounded flex items-center opacity-50">
                    <span className="text-2xl text-ink/50 mr-2">(</span>
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-16 border-2 border-ink flex items-center justify-center bg-rust/10 font-mono font-bold text-rust">R</div>
                        <div className="text-[10px] mt-1">Matrix</div>
                    </div>
                    <span className="mx-2 text-xl text-ink">·</span>
                    <div className="flex flex-col items-center">
                        <div className="w-6 h-16 border-2 border-ink flex items-center justify-center bg-ink/10 font-mono font-bold text-ink">q</div>
                        <div className="text-[10px] mt-1">Col</div>
                    </div>
                    <span className="text-2xl text-ink/50 ml-2">)</span>
                    <sup className="text-xl font-bold -ml-1">T</sup>
                 </div>

                 <div className="text-3xl text-rust font-bold">→</div>

                 {/* Transformed Term */}
                 <div className="p-4 border-2 border-forest bg-highlight/20 rounded flex items-center shadow-lg transform md:scale-110">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-6 border-2 border-ink flex items-center justify-center bg-ink/10 font-mono font-bold text-ink">q</div>
                        <div className="text-[10px] mt-1 font-bold text-ink">Row (qᵀ)</div>
                    </div>
                    <span className="mx-2 text-xl text-ink">·</span>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-12 border-2 border-ink flex items-center justify-center bg-rust/10 font-mono font-bold text-rust">R</div>
                        <div className="text-[10px] mt-1 font-bold text-rust">Matrix (Rᵀ)</div>
                    </div>
                 </div>
            </div>

            <div className="mt-12 text-center">
                <p className="font-serif text-lg mb-2">Our equation updates:</p>
                <div className="inline-block bg-paper-dark px-6 py-4 border border-ink shadow-sm">
                    <span className="font-mono text-ink-light opacity-50 line-through mr-4 text-xs md:text-sm">Score = (R<sub>2</sub> · q)<sup>T</sup> · (R<sub>0</sub> · k)</span>
                    <span className="font-mono text-sm md:text-xl font-bold text-ink ml-4">
                        Score = <span className="text-rust">(q<sup>T</sup> · R<sub>2</sub><sup>T</sup>)</span> · (R<sub>0</sub> · k)
                    </span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default TransposePropertyDemo;
