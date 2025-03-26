import React from 'react';
import { Award } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 flex items-center justify-center font-poppins overflow-hidden">
      <div className="relative text-center">
        {/* Animated rings */}
        <div className="absolute inset-0 animate-pulse-ring rounded-full border-4 border-yellow-400/30"></div>
        <div className="absolute inset-0 animate-pulse-ring delay-300 rounded-full border-4 border-yellow-400/20"></div>
        
        {/* Main content */}
        <div className="relative z-10 transform animate-float">
          <Award className="w-24 h-24 text-yellow-400 mb-6 animate-spin-slow mx-auto" />
          <h1 className="text-6xl font-extrabold text-white tracking-wider mb-4 drop-shadow-lg">
            Navil Spinnings
          </h1>
          <p className="text-xl text-white/90 font-light tracking-wide">
            Crafting Excellence
          </p>
          
          {/* Loading indicator */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;