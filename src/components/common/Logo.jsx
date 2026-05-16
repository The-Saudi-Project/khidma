import React from 'react';

const Logo = ({ className = "w-10 h-10", showText = true, textColor = "text-white" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/10 shadow-lg shadow-brand-500/20">
        <img 
          src="/logo.png" 
          alt="Khidma Logo" 
          className="w-full h-full object-cover transform scale-110"
          onError={(e) => {
            // Fallback to K if logo.png is missing
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <span style={{ display: 'none' }} className="text-[#0B1120] font-black text-xl tracking-tight">K</span>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-extrabold text-xl tracking-tight leading-none ${textColor}`}>Khidma</span>
          <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mt-0.5">Elite Saudi</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
