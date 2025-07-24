
import React from 'react';
import HeroSection from './HeroSection';
import FeaturedServices from './FeaturedServices';
import ClientMarquee from './ClientMarquee';
import StatsSection from './StatsSection';
import TabsSection from './TabsSection';
import { useSiteContent } from '../contexts/SiteContentContext';

const HomePage: React.FC = () => {
  const { content } = useSiteContent();

  // The key prop on HeroSection is crucial. It tells React to create a new
  // component instance whenever the background image URL changes. This is a robust
  // way to ensure the new background is applied, bypassing any potential state
  // or rendering subtleties.
  const heroKey = content ? content.homepage.hero.backgroundImageUrl : 'loading';

  return (
    <>
      <HeroSection key={heroKey} />
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
