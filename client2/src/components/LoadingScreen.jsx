import React, { useEffect, useState } from 'react';

function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-3xl scale-150 animate-pulse"></div>
        
        {/* Main text */}
        <h1 className="text-blue-500 text-6xl font-bold tracking-wider relative z-10 animate-pulse drop-shadow-lg">
          NAVIL SPINNINGS
        </h1>

        {/* Loading line */}
        <div className="mt-12 flex justify-center">
          <div className="h-2 w-32 bg-gray-500/50 relative overflow-hidden rounded-full">
            <div className="h-full w-8 bg-blue-500 absolute left-0 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;