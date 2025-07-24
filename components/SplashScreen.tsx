
import React, { useEffect, useState } from 'react';
import { getSiteContent } from '../services/siteContent';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [unmounting, setUnmounting] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const { branding } = getSiteContent();
  const { splashScreen, logoUrl } = branding;

  useEffect(() => {
    let percentageInterval: number | undefined;

    // The total time until the loading bar hits 100% and the fade-out starts
    const totalAnimationTime = 2800; // ms
    const startDelay = 800; // ms, to match fade-in of text elements
    const loadingDuration = totalAnimationTime - startDelay; // 2000ms for the bar to animate
    const intervalTime = loadingDuration / 100; // Time per 1% increment

    const timer = setTimeout(() => {
        percentageInterval = window.setInterval(() => {
            setPercentage(prev => {
                if (prev >= 99) {
                    clearInterval(percentageInterval);
                    
                    // Set to 100% and start exit sequence
                    setPercentage(100);
                    setTimeout(() => {
                      setUnmounting(true);
                      // Wait for fade-out animation to complete before calling onFinished
                      setTimeout(onFinished, 500);
                    }, 200); // Brief pause at 100%

                    return 100;
                }
                return prev + 1;
            });
        }, intervalTime);
    }, startDelay);

    return () => {
        clearTimeout(timer);
        if (percentageInterval) {
            clearInterval(percentageInterval);
        }
    };
  }, [onFinished]);


  return (
    <div
      id="splash-screen-container"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brand-bg"
    >
      <div
        id="dark-fade-transition"
        className={`w-full h-full flex flex-col items-center justify-center relative transition-opacity duration-500 ease-in-out ${unmounting ? 'opacity-0' : 'opacity-100'}`}
      >
        <div id="splash-content-wrapper" className="flex flex-col items-center justify-center text-center px-4">
          <img
            id="splash-logo"
            src={logoUrl}
            alt={`${splashScreen.brandName} Logo`}
            className="h-20 w-auto mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          />
          <h1
            id="splash-brand-name"
            className="text-3xl sm:text-4xl font-bold font-heading text-white opacity-0 animate-fade-in-up"
            style={{ animationDelay: '400ms' }}
          >
            {splashScreen.brandName}
          </h1>
          <p
            id="splash-brand-description"
            className="mt-2 text-white/80 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '600ms' }}
          >
            {splashScreen.description}
          </p>
        </div>

        <div id="splash-loader-wrapper" className="absolute bottom-10 md:bottom-20 w-full max-w-xs px-4">
          <div 
              id="splash-loader-percentage" 
              className="text-center text-sm font-semibold font-sans bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text mb-2 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '800ms' }}
          >
              Loading... {percentage}%
          </div>
          <div id="splash-loading-bar-container" className="w-full bg-brand-surface rounded-full h-1.5 opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <div
              id="splash-loading-bar-indicator"
              className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full h-1.5 transition-all duration-150 ease-linear"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
