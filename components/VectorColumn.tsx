
import React from 'react';
import { formatFloat } from '../constants';

export type VectorColor = 'default' | 'rust' | 'forest' | 'ink';

interface VectorColumnProps {
  values: number[];
  label?: React.ReactNode;
  highlight?: boolean;
  color?: VectorColor;
  isSameAsPrevious?: boolean;
  isAbbreviated?: boolean;
}

const VectorColumn: React.FC<VectorColumnProps> = ({ 
  values, 
  label, 
  highlight, 
  color,
  isSameAsPrevious, 
  isAbbreviated 
}) => {
  
  let effectiveColor: VectorColor = 'default';
  if (color) {
    effectiveColor = color;
  } else if (highlight) {
    effectiveColor = 'forest';
  }

  const getTextClass = () => {
    switch (effectiveColor) {
      case 'rust': return 'text-rust font-bold';
      case 'forest': return 'text-forest font-bold';
      case 'ink': return 'text-ink font-bold';
      default: return 'text-ink-light';
    }
  };

  const getLabelClass = () => {
    switch (effectiveColor) {
        case 'rust': return 'bg-highlight border-rust text-rust font-bold';
        case 'forest': return 'bg-highlight border-forest text-forest font-bold';
        case 'ink': return 'bg-highlight border-ink text-ink font-bold';
        default: return 'bg-paper-dark border-ink text-ink-light';
    }
  };

  const getContainerClass = () => {
     if (effectiveColor !== 'default') return 'bg-highlight/30';
     return '';
  };
  
  const renderItem = (val: number, idx: number) => (
    <div 
      key={idx} 
      className={`px-1 rounded ${getTextClass()}`}
      title={`Dimension ${idx}: ${val}`}
    >
      {formatFloat(val)}
    </div>
  );

  return (
    <div className="flex flex-col items-center mx-1 sm:mx-2 transition-all duration-300">
      {label && (
        <span className={`
          mb-3 font-mono text-sm tracking-wide py-1 px-2 border
          ${getLabelClass()}
        `}>
          {label}
        </span>
      )}
      
      <div className={`
        relative overflow-hidden border-l-2 border-r-2 border-ink
        bg-white/50 backdrop-blur-sm py-2 px-1 sm:px-2 shadow-sm
        ${getContainerClass()}
      `}>
        {/* Matrix brackets top/bottom visual hack */}
        <div className="absolute top-0 left-0 w-2 h-[2px] bg-ink" />
        <div className="absolute top-0 right-0 w-2 h-[2px] bg-ink" />
        <div className="absolute bottom-0 left-0 w-2 h-[2px] bg-ink" />
        <div className="absolute bottom-0 right-0 w-2 h-[2px] bg-ink" />

        <div className="font-mono text-xs sm:text-sm leading-relaxed text-center space-y-[2px]">
          {isAbbreviated && values.length > 4 ? (
            <>
              {renderItem(values[0], 0)}
              {renderItem(values[1], 1)}
              {renderItem(values[2], 2)}
              <div className="text-ink-light opacity-50 text-[10px] py-[1px] leading-none text-center">⋮</div>
              {renderItem(values[values.length - 1], values.length - 1)}
            </>
          ) : (
             values.map((val, idx) => renderItem(val, idx))
          )}
        </div>
      </div>

      {isSameAsPrevious && (
         <div className="mt-4 text-center">
            <span className="font-hand text-rust text-lg">Identical!</span>
            <div className="w-full h-[1px] bg-rust mt-1"></div>
         </div>
      )}
    </div>
  );
};

export default VectorColumn;
