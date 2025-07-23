import React, { useState, useEffect, useLayoutEffect } from 'react';

const iconsConfig = [
  {
    src: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753215892/joomla-svgrepo-com_gsf0v9.svg',
    initialStyle: { top: '10vh', left: '0px' }, // Specifies which margin to start on
    scrollRates: { x: 0.1, y: 0.15 },
    sizeClass: 'w-12 h-12 sm:w-16 sm:h-16',
    pxSize: 64,
  },
  {
    src: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753216182/bydesign-svgrepo-com_oqslfl.svg',
    initialStyle: { top: '45vh', right: '0px' }, // Specifies which margin to start on
    scrollRates: { x: -0.08, y: -0.2 },
    sizeClass: 'w-16 h-16 sm:w-20 sm:h-20',
    pxSize: 80,
  },
  {
    src: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753215892/ai-hub-svgrepo-com_pmesdi.svg',
    initialStyle: { top: '80vh', left: '0px' }, // Specifies which margin to start on
    scrollRates: { x: 0.12, y: -0.25 },
    sizeClass: 'w-10 h-10 sm:w-14 sm:h-14',
    pxSize: 56,
  },
];

const FloatingIcon = ({ icon, scrollY, viewport, id }) => {
  const { initialStyle, scrollRates, pxSize, src, sizeClass } = icon;

  if (viewport.width === 0) {
    return null; // Don't render until we have viewport dimensions
  }

  // 1. Determine the icon's starting position (at scrollY = 0) based on initialStyle.
  // This is the position of the icon's top-left corner.
  const startX = 'left' in initialStyle
    ? 0 // Positioned on the left margin.
    : viewport.width - pxSize; // Positioned on the right margin.
  const startY = (parseFloat(initialStyle.top) / 100) * viewport.height;

  // 2. Calculate the total "un-looped" travel distance from the starting point.
  const travelX = scrollY * scrollRates.x;
  const travelY = scrollY * scrollRates.y;

  // 3. The current desired position is the start position plus the travel distance.
  const currentX = startX + travelX;
  const currentY = startY + travelY;
  
  // 4. Apply looping logic to wrap the icon around the screen.
  const loopWidth = viewport.width + pxSize;
  const loopHeight = viewport.height + pxSize;
  
  // We want the output range to be [-pxSize, viewport.width-1]. The total range is loopWidth.
  // The expression `(a % n + n) % n` maps `a` to `[0, n-1]`.
  // We then shift this range by -pxSize to get `[-pxSize, n-1-pxSize]`, which is `[-pxSize, viewport.width-1]`.
  const finalX = ((currentX + pxSize) % loopWidth + loopWidth) % loopWidth - pxSize;
  const finalY = ((currentY + pxSize) % loopHeight + loopHeight) % loopHeight - pxSize;


  return (
    <div
      id={`floating-icon-wrapper-${id}`}
      className={`absolute transition-transform duration-100 ease-out ${sizeClass}`}
      style={{
        transform: `translate(${finalX}px, ${finalY}px)`,
        willChange: 'transform',
      }}
    >
      <div
        id={`floating-icon-inner-${id}`}
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(to bottom right, #F5B841, #0A777B)',
          maskImage: `url(${src})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: `url(${src})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
        }}
      />
    </div>
  );
};


const FloatingIcons: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="floating-icons-container" className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      {iconsConfig.map((icon, index) => (
        <FloatingIcon key={index} icon={icon} scrollY={scrollY} viewport={viewport} id={index} />
      ))}
    </div>
  );
};

export default FloatingIcons;
