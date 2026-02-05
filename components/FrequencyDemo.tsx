
import React from 'react';
import { formatFloat } from '../constants';

interface FrequencyDemoProps {
  base: number;
  onBaseChange: (value: number) => void;
}

const FrequencyDemo: React.FC<FrequencyDemoProps> = ({ base, onBaseChange }) => {
  const dim = 8; // Head dimension from previous sections

  // Colors for the 4 pairs
  const pairColors = [
    { name: 'Pair 0', color: 'text-rust', border: 'border-rust', fill: '#b85a3c' },
    { name: 'Pair 1', color: 'text-forest', border: 'border-forest', fill: '#2d5a4a' },
    { name: 'Pair 2', color: 'text-ink', border: 'border-ink', fill: '#2c2416' },
    { name: 'Pair 3', color: 'text-ink-light', border: 'border-ink-light', fill: '#5c4f3a' },
  ];

  const calculateTheta = (index: number) => {
    // Formula: theta = base ^ (-2(index) / d)
    // index is the pair index (0, 1, 2, 3), which maps to vector indices 0, 2, 4, 6
    // The exponent is -2 * i / d.
    // For i=0: 0. For i=1: -2/8 = -0.25.
    const exponent = -(2 * index) / dim;
    return Math.pow(base, exponent);
  };

  const ThetaVisualizer: React.FC<{ theta: number; color: string; label: string }> = ({ theta, color, label }) => {
    // Determine angle in degrees for visualization
    // 1 radian approx 57.29 degrees
    const degrees = theta * (180 / Math.PI);
    
    // SVG arc drawing logic
    // We clamp visualization to max 360 to prevent drawing issues, 
    // though conceptually it wraps.
    const visDegrees = Math.min(degrees, 359.9);
    
    const startX = 50 + 40; // radius 40
    const startY = 50;
    
    const endRad = (visDegrees * Math.PI) / 180;
    // Note: SVG y is down, so we subtract y component for counter-clockwise visual
    const endX = 50 + 40 * Math.cos(endRad); 
    const endY = 50 - 40 * Math.sin(endRad);

    const largeArc = visDegrees > 180 ? 1 : 0;

    return (
      <div className="flex items-center gap-4 md:gap-8 p-4 border-b border-grid/50 last:border-0 group hover:bg-white/40 transition-colors">
        {/* Label Column */}
        <div className={`w-24 shrink-0 font-mono font-bold ${color}`}>
          {label}
        </div>

        {/* Math Column */}
        <div className="flex-1 font-mono text-xs md:text-sm text-ink-light">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-paper-dark border border-grid px-1 rounded">{base}</span>
            <sup className="-ml-1">(-2 × {label.split(' ')[1]}) / {dim}</sup>
            <span>=</span>
            <span className={`font-bold ${color} text-base`}>{theta.toFixed(4)}</span>
            <span className="text-[10px] opacity-60 ml-1">rad/token</span>
          </div>
          <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] italic">
             {(theta * (180/Math.PI)).toFixed(2)}° rotation per position step
          </div>
        </div>

        {/* Visual Column */}
        <div className="w-16 h-16 relative shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e8e0d0" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="50" y1="50" x2="90" y2="50" stroke="#c4b8a4" strokeWidth="1" />
            
            {/* The Angle Wedge */}
            <path 
              d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 0 ${endX} ${endY} Z`}
              fill={pairColors.find(p => p.color === color)?.fill}
              opacity="0.2"
            />
            
            {/* The Vector Line */}
            <line 
              x1="50" y1="50" 
              x2={endX} y2={endY} 
              stroke={pairColors.find(p => p.color === color)?.fill} 
              strokeWidth="2" 
            />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="my-12 bg-paper border border-ink relative overflow-hidden">
      <div className="absolute top-0 left-0 bg-paper-dark border-b border-r border-ink px-4 py-2 font-hand text-xl text-forest z-20 shadow-sm">
        Figure 12: The Frequency Formula
      </div>

      <div className="p-4 md:p-8 pt-20">
        
        {/* Controls */}
        <div className="flex flex-col items-center mb-8 bg-paper-dark/50 p-6 border border-grid/50 rounded-lg">
           <label className="font-serif font-bold text-ink mb-2">Adjust Base Value</label>
           <div className="flex items-center gap-4 w-full max-w-md">
             <span className="font-mono text-sm text-ink-light">10k</span>
             <input 
               type="range" 
               min="10000" 
               max="500000" 
               step="10000" 
               value={base} 
               onChange={(e) => onBaseChange(Number(e.target.value))}
               className="w-full h-2 bg-grid rounded-lg appearance-none cursor-pointer accent-rust"
             />
             <span className="font-mono text-sm text-ink-light">500k</span>
           </div>
           <div className="mt-2 font-mono text-rust text-xl font-bold">
             Base = {base.toLocaleString()}
           </div>
           <p className="text-xs text-ink-light mt-2 max-w-sm text-center">
             Increasing the base decreases the frequencies, allowing the model to handle longer sequences at the expense of positional precision.
           </p>
        </div>

        {/* The Table */}
        <div className="border-2 border-ink bg-paper">
           {/* Header */}
           <div className="flex gap-4 md:gap-8 p-3 bg-ink text-paper text-xs font-mono uppercase tracking-wider border-b border-ink">
              <div className="w-24">Pair Index</div>
              <div className="flex-1">Frequency Calculation (θ)</div>
              <div className="w-16 text-center">Angle</div>
           </div>

           {/* Rows */}
           {[0, 1, 2, 3].map((i) => (
             <ThetaVisualizer 
                key={i} 
                label={pairColors[i].name} 
                color={pairColors[i].color} 
                theta={calculateTheta(i)} 
             />
           ))}
        </div>
        
        <div className="mt-6 flex gap-4 text-sm leading-relaxed text-ink-light italic border-l-4 border-grid pl-4">
           <div>
             <strong className="text-rust block not-italic font-mono mb-1">Low Index (Pair 0)</strong>
             High Frequency. Rotates rapidly. Captures immediate context (e.g., "New" next to "York").
           </div>
           <div>
             <strong className="text-ink-light block not-italic font-mono mb-1">High Index (Pair 3)</strong>
             Low Frequency. Rotates slowly. Captures document-level context (e.g., matching a subject at start to a verb at end).
           </div>
        </div>

      </div>
    </div>
  );
};

export default FrequencyDemo;
