
import React, { useState } from 'react';

const TrigIdentityVisualizer: React.FC = () => {
  const [isSimplified, setIsSimplified] = useState(false);

  return (
    <div className="my-12 relative">
      {/* Decoration: A pinned note look */}
      <div className="bg-[#f0e4c8] border-l-4 border-rust p-6 md:p-8 shadow-sm relative overflow-hidden group">
        
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-paper-pattern pointer-events-none" />

        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* Identity 1: Cosine */}
             <div className="flex flex-col gap-4">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-rust">The Cosine Identity</div>
                <div className="bg-white/60 border border-ink/20 p-4 rounded min-h-[100px] flex items-center justify-center transition-all duration-500 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-highlight/20 transition-opacity duration-500 ${isSimplified ? 'opacity-100' : 'opacity-0'}`} />
                    {isSimplified ? (
                        <div className="relative text-xl md:text-2xl font-mono text-ink animate-in fade-in zoom-in-95 duration-500">
                           cos(<span className="text-rust">mθ</span> - <span className="text-forest">nθ</span>)
                        </div>
                    ) : (
                        <div className="relative text-sm md:text-base font-mono text-ink text-center leading-loose">
                           cos(<span className="text-rust">mθ</span>)cos(<span className="text-forest">nθ</span>) 
                           <span className="font-bold mx-2 text-rust">+</span> 
                           sin(<span className="text-rust">mθ</span>)sin(<span className="text-forest">nθ</span>)
                        </div>
                    )}
                </div>
             </div>

             {/* Identity 2: Sine */}
             <div className="flex flex-col gap-4">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-forest">The Sine Identity</div>
                <div className="bg-white/60 border border-ink/20 p-4 rounded min-h-[100px] flex items-center justify-center transition-all duration-500 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-highlight/20 transition-opacity duration-500 ${isSimplified ? 'opacity-100' : 'opacity-0'}`} />
                    {isSimplified ? (
                        <div className="relative text-xl md:text-2xl font-mono text-ink animate-in fade-in zoom-in-95 duration-500">
                           sin(<span className="text-rust">mθ</span> - <span className="text-forest">nθ</span>)
                        </div>
                    ) : (
                        <div className="relative text-sm md:text-base font-mono text-ink text-center leading-loose">
                           sin(<span className="text-rust">mθ</span>)cos(<span className="text-forest">nθ</span>) 
                           <span className="font-bold mx-2 text-forest">-</span> 
                           cos(<span className="text-rust">mθ</span>)sin(<span className="text-forest">nθ</span>)
                        </div>
                    )}
                </div>
             </div>

          </div>

          <div className="mt-8 flex justify-center">
             <button
                onClick={() => setIsSimplified(!isSimplified)}
                className={`
                   px-8 py-3 font-mono font-bold text-sm border-2 shadow-sm transition-all duration-300
                   ${isSimplified 
                      ? 'bg-ink text-paper border-ink hover:bg-ink-light' 
                      : 'bg-paper text-rust border-rust hover:bg-rust/10'
                   }
                `}
             >
                {isSimplified ? "↺ Show Expanded Form" : "Simplify Expressions →"}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrigIdentityVisualizer;
