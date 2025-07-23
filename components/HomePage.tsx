
import React from 'react';
import HeroSection from './HeroSection';
import FeaturedServices from './FeaturedServices';
import ClientMarquee from './ClientMarquee';
import StatsSection from './StatsSection';
import TabsSection from './TabsSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <div id="homepage-content-wrapper" className="relative bg-brand-bg">
        <div id="homepage-sections-wrapper" className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32 md:space-y-40 py-24 sm:py-32">
            <FeaturedServices />
            <ClientMarquee />
            <TabsSection />
            <StatsSection />
        </div>
      </div>
    </>
  );
};

export default HomePage;