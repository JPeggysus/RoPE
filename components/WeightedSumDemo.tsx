
import React from 'react';
import { 
  TWINKLE_Q, TWINKLE_K, TWINKLE_V, 
  LITTLE_K, LITTLE_V, 
  HEAD_DIM,
  formatFloat 
} from '../constants';
import VectorColumn from './VectorColumn';

const dot = (a: number[], b: number[]) => a.reduce((sum, val, i) => sum + val * b[i], 0);

const WeightedSumDemo: React.FC = () => {
  // Scenario: We are updating Token 1 ("Twinkle")
  // Query is Twinkle
  const Q = TWINKLE_Q;
  
  // Keys for the sequence: Twinkle, Twinkle, Little
  const inputs = [
    { id: 0, text: 'Twinkle', k: TWINKLE_K, v: TWINKLE_V },
    { id: 1, text: 'Twinkle', k: TWINKLE_K, v: TWINKLE_V },
    { id: 2, text: 'Little',  k: LITTLE_K,   v: LITTLE_V }
  ];

  // 1. Calculate Dot Products
  const dotProducts = inputs.map(input => dot(Q, input.k));

  // 2. Softmax
  // We perform the scaling behind the scenes for numerical stability/correctness
  const scale = Math.sqrt(HEAD_DIM);
  const scaledScores = dotProducts.map(s => s / scale);
  
  const expScores = scaledScores.map(s => Math.exp(s));
  const sumExp = expScores.reduce((a,b) => a+b, 0);
  const weights = expScores.map(e => e / sumExp);

  // 3. Weighted Values
  // We compute v * weight for each dimension
  const weightedVs = inputs.map((input, idx) => {
    const w = weights[idx];
    return input.v.map(val => val * w);
  });

  // 4. Summing them up
  const resultVector = weightedVs[0].map((_, dimIndex) => {
    return weightedVs.reduce((sum, vec) => sum + vec[dimIndex], 0);
  });

  return (
    <div className="my-16 bg-paper border border-ink relative">
        <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
            Figure 5: The Weighted Sum
        </div>

        <div className="p-4 md:p-8 pt-16">
            <br></br>
            <div className="mb-8 text-center">
                <h3 className="font-serif text-2xl text-ink font-bold mb-2">Calculating the Update for Token 1 ("Twinkle")</h3>
                <p className="text-ink-light italic">
                    How much information should we take from each word in the sequence?
                </p>
            </div>

            {/* The Calculation Flow */}
            <div className="flex flex-col gap-12">
                
                {/* Step 1: Scores & Weights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting lines background */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-grid -z-10" />

                    {inputs.map((input, idx) => {
                        const score = dotProducts[idx];
                        const percentage = (weights[idx] * 100).toFixed(1);
                        
                        return (
                            <div key={idx} className="flex flex-col items-center bg-paper border-2 border-ink p-4 relative z-10 shadow-sm">
                                <span className="absolute -top-3 bg-ink text-paper px-2 py-0.5 text-xs font-mono">
                                    "{input.text}" (pos {input.id})
                                </span>
                                
                                <div className="mt-2 text-center space-y-2">
                                    <div className="text-sm font-mono text-ink-light flex items-center gap-1 justify-center">
                                        <span className="text-rust">q<sub>1</sub></span> 
                                        <span>·</span> 
                                        <span className="text-forest">k<sub>{idx}</sub></span> 
                                        <span>=</span>
                                        <span className="font-bold text-ink">{score.toFixed(2)}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-rust">
                                        {percentage}%
                                    </div>
                                    <div className="text-xs text-ink-light font-serif italic">
                                        Attention Weight
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Arrow Down */}
                <div className="flex justify-center -my-6">
                    <span className="text-2xl text-grid">↓</span>
                </div>

                {/* Step 2: Value Mixing */}
                <div className="overflow-x-auto pb-6 -mx-4 md:mx-0 px-4">
                    <div className="flex flex-row items-center justify-start xl:justify-center min-w-max gap-1 mx-auto">
                        {inputs.map((input, idx) => {
                            const w = weights[idx];
                            return (
                                <div key={idx} className="flex items-center gap-2">
                                    <VectorColumn 
                                        values={input.v} 
                                        label={<span>v<sub>{idx}</sub></span>} 
                                    />
                                    
                                    <span className="font-mono text-rust font-bold text-xl">{w.toFixed(3)}</span>

                                    {idx < inputs.length - 1 && (
                                        <span className="text-2xl text-ink font-bold mx-2">+</span>
                                    )}
                                </div>
                            )
                        })}
                        
                        <div className="flex items-center ml-4 gap-2">
                            <span className="text-2xl text-ink font-bold">=</span>
                            <VectorColumn 
                                values={resultVector} 
                                label="Result" 
                                highlight={true} 
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Explanation Block */}
            <div className="mt-12 p-6 bg-paper-dark border-l-4 border-rust">
                <p className="mb-4 leading-relaxed">
                    The <span className="font-mono text-forest mx-1">Result</span> vector you see above is the head's recommendation for Token 1. It says: 
                </p>
                <p className="mb-4 leading-relaxed"> 
                    "Token 1's update should be
                    <span className="font-mono text-rust mx-1">{Math.round(weights[0]*1000)/10}%</span> of Token 0's value vector, 
                    <span className="font-mono text-rust mx-1">{Math.round(weights[1]*1000)/10}%</span> of Token 1's value vector, and 
                    <span className="font-mono text-rust mx-1">{Math.round(weights[2]*1000)/10}%</span> of Token 2's value vector."
                </p>
                <p className="leading-relaxed">
                    We combine all the suggestions from all heads together and pass them through a 
                    <strong> Linear Layer</strong> that spits out the exact changes we need to make to the tokens. 
                </p>
            </div>
        </div>
    </div>
  );
};

export default WeightedSumDemo;
