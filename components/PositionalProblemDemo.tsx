
import React from 'react';
import { 
  TWINKLE_Q, TWINKLE_K, TWINKLE_V, 
  LITTLE_Q, LITTLE_K, LITTLE_V
} from '../constants';
import VectorColumn from './VectorColumn';

const PositionalProblemDemo: React.FC = () => {
  const data = [
    { id: 0, text: 'Twinkle', q: TWINKLE_Q, k: TWINKLE_K, v: TWINKLE_V },
    { id: 1, text: 'Twinkle', q: TWINKLE_Q, k: TWINKLE_K, v: TWINKLE_V },
    { id: 2, text: 'Little',  q: LITTLE_Q,  k: LITTLE_K,  v: LITTLE_V },
  ];

  return (
    <div className="my-16 bg-paper border border-ink relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rust/5 rounded-full blur-3xl -z-10" />

        <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 6: The Symmetry Problem
        </div>

        <div className="p-4 md:p-8 pt-16">
            
            {/* PART 1: The Identical Vectors */}
            <div className="mb-4">
                <br></br>
                <br></br>
                <h4 className="font-serif italic text-ink-light mb-6 text-center">
                    Reviewing Projections for: <span className="font-mono not-italic text-ink">"Twinkle, Twinkle, Little"</span>
                </h4>
                
                <div className="flex justify-center gap-10 md:gap-16 overflow-x-auto pb-4">
                    {data.map((item, idx) => {
                        return (
                            <div key={idx} className={`
                                flex flex-col items-center p-4 border-2 transition-all relative
                                ${item.text === 'Twinkle' ? 'bg-highlight/20 border-rust/30' : 'bg-paper border-grid'}
                            `}>
                                {/* Equality Connector for P0 and P1 */}
                                {idx === 1 && (
                                    <div className="absolute top-1/2 -left-10 md:-left-16 -translate-y-1/2 w-10 md:w-16 flex justify-center items-center z-10 pointer-events-none">
                                        <div className="absolute w-full h-[2px] bg-rust/40"></div>
                                        <div className="relative bg-paper border border-rust text-rust rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-sm">
                                            =
                                        </div>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="mb-4 text-center">
                                    <div className="bg-ink text-paper text-xs font-mono px-2 py-0.5 inline-block mb-1">
                                        Position {item.id}
                                    </div>
                                    <div className="font-bold text-lg text-ink">"{item.text}"</div>
                                </div>

                                {/* Vectors */}
                                <div className="space-y-4 relative">
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 font-mono text-xs font-bold text-rust">Q</span>
                                        <VectorColumn values={item.q} label="" isAbbreviated /> 
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 font-mono text-xs font-bold text-forest">K</span>
                                        <VectorColumn values={item.k} label="" isAbbreviated />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 font-mono text-xs font-bold text-ink">V</span>
                                        <VectorColumn values={item.v} label="" isAbbreviated />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p className="text-center text-xs font-mono text-ink-light mt-2">
                    (Vectors abbreviated for clarity)
                </p>
            </div>
        </div>
    </div>
  );
};

export default PositionalProblemDemo;
