
import React from 'react';

const BagOfWordsDemo: React.FC = () => {
  return (
    <div className="my-12 bg-paper border border-ink relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-ink/5 rounded-full blur-2xl -z-10" />

        <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 7: The Bag of Words
        </div>

        <div className="p-4 md:p-8 pt-20">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                
                {/* Sentence A */}
                <div className="flex flex-col items-center opacity-70">
                    <div className="font-serif font-bold text-lg text-ink mb-2">"The light is orange"</div>
                    <div className="text-sm font-hand text-rust mb-2">(A description of color)</div>
                    <div className="flex gap-1 flex-wrap justify-center">
                        {['The', 'light', 'is', 'orange'].map(w => (
                            <span key={w} className="bg-paper-dark border border-grid px-2 py-1 text-xs font-mono">{w}</span>
                        ))}
                    </div>
                </div>

                {/* The Mixing Pot */}
                <div className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-ink bg-white/40 rounded-full w-48 h-48 mx-auto">
                    <div className="absolute -top-3 bg-paper px-2 font-mono text-xs font-bold text-ink">Model's Perspective</div>
                    
                    <div className="flex flex-wrap justify-center gap-2 animate-pulse">
                            {['is', 'The', 'orange', 'light'].map((w, i) => (
                            <span key={i} className="bg-ink text-paper px-2 py-1 text-xs font-mono transform rotate-3">{w}</span>
                        ))}
                    </div>
                    <div className="mt-4 text-center font-hand text-rust text-lg leading-none">
                        Indistinguishable without order
                    </div>

                    {/* Arrows */}
                    <div className="absolute top-1/2 left-0 -translate-x-full w-4 md:w-8 h-[2px] bg-ink" />
                    <div className="absolute top-1/2 right-0 translate-x-full w-4 md:w-8 h-[2px] bg-ink" />
                </div>

                {/* Sentence B */}
                <div className="flex flex-col items-center opacity-70">
                    <div className="font-serif font-bold text-lg text-ink mb-2">"The orange is light"</div>
                    <div className="text-sm font-hand text-forest mb-2">(A description of weight)</div>
                    <div className="flex gap-1 flex-wrap justify-center">
                        {['The', 'orange', 'is', 'light'].map(w => (
                            <span key={w} className="bg-paper-dark border border-grid px-2 py-1 text-xs font-mono">{w}</span>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default BagOfWordsDemo;
