
import React, { useState, useEffect } from 'react';
import { getSiteContent } from '../services/siteContent';

const HeroSection: React.FC = () => {
  const { homepage } = getSiteContent();
  const { hero } = homepage;
  const [offsetY, setOffsetY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleScroll = () => {
    setOffsetY(window.pageYOffset);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Calculate mouse position from -0.5 to 0.5
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderTitleWithBreaks = (title: string) => {
    return title.split('<br />').map((text, index, arr) => (
        <React.Fragment key={index}>
            {text}
            {index < arr.length - 1 && <br />}
        </React.Fragment>
    ));
  };

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const moveFactor = 30; // Total pixels of movement
  const mouseTranslateX = mousePos.x * moveFactor;
  const mouseTranslateY = mousePos.y * moveFactor;
  const scrollTranslateY = offsetY * 0.4;
  const bgTranslateX = mouseTranslateX;
  const bgTranslateY = mouseTranslateY + scrollTranslateY;


  return (
    <section 
      id="home" 
      className="relative h-screen w-full flex items-center text-white overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background and overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-200 ease-out"
        style={{
            backgroundImage: hero.backgroundImageUrl ? `url(${hero.backgroundImageUrl})` : 'none',
            transform: `translate(${bgTranslateX}px, ${bgTranslateY}px) scale(1.15)`,
            willChange: 'transform',
        }}
      />
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* FloatingIcons from App.tsx are at z-20 */}
      
      <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center pt-24 md:pt-0">
            <div className="text-left">
                <h1 
                    className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-transparent bg-clip-text bg-wipe-gradient bg-[200%_auto] animate-wipe-effect tracking-tight leading-tight animate-fade-in"
                    style={{ animationDelay: '100ms' }}
                >
                    {renderTitleWithBreaks(hero.title)}
                </h1>
                <p 
                    className="mt-6 max-w-xl text-base sm:text-lg lg:text-xl text-brand-light font-medium animate-fade-in"
                    style={{ animationDelay: '300ms' }}
                >
                    {hero.subtitle}
                </p>
            </div>
            {/* Empty right column to let dynamic background show through */}
            <div className="hidden md:block"></div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <a 
        href="#services" 
        aria-label="Scroll to next section" 
        onClick={handleScrollClick}
        className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 z-30 animate-fade-in"
        style={{ animationDelay: '800ms' }}
      >
        <div className="w-6 h-10 border-2 border-brand-gray/50 rounded-full flex justify-center items-start p-1 animate-scroll-indicator-bounce">
          <div className="w-1 h-2 rounded-full bg-brand-secondary"></div>
        </div>
      </a>
    </section>
  );
};

export default HeroSection;
