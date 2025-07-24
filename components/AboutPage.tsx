
import React from 'react';
import { icons, HelpCircle } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';
import { useContactModal } from '../contexts/ContactModalContext';
import { getSiteContent } from '../services/siteContent';

const AboutPage: React.FC = () => {
  const { openModal } = useContactModal();
  const { about } = getSiteContent();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-8 sm:pb-12">
        <div id="about-page-container" className="animate-fade-in-up space-y-24 sm:space-y-32">
        {/* --- Hero Section for About Page --- */}
        <header id="about-page-header" className="text-center">
            <AnimateOnScroll delay={100}>
            <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-brand-light">
                {about.hero.title}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary via-brand-light to-brand-primary">
                {about.hero.highlightedText}
                </span>
            </h1>
            </AnimateOnScroll>
            <AnimateOnScroll delay={300}>
            <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-brand-gray/80 leading-relaxed">
                {about.hero.subtitle}
            </p>
            </AnimateOnScroll>
        </header>

        {/* --- Our Story/Mission Section --- */}
        <AnimateOnScroll as="section" id="about-mission-section">
            <div id="about-mission-section-grid" className="grid md:grid-cols-2 gap-12 items-center">
            <div id="about-mission-text-wrapper" className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold font-heading text-brand-light">
                {about.mission.title}
                </h2>
                <p className="text-base sm:text-lg text-brand-gray/90 leading-relaxed">
                {about.mission.body}
                </p>
                <div id="about-mission-points-wrapper" className="space-y-4 pt-4">
                {about.mission.points.map((point) => {
                    const Icon = icons[point.icon as keyof typeof icons] || HelpCircle;
                    return (
                        <div key={point.id} id={`about-mission-point-${point.id}`} className="flex items-start">
                            <div id={`about-mission-point-icon-${point.id}`} className="p-2 bg-brand-primary/20 rounded-full mr-4">
                            <Icon className="w-6 h-6 text-brand-secondary" />
                            </div>
                            <div id={`about-mission-point-text-${point.id}`}>
                            <h3 className="font-bold font-heading text-brand-light">{point.title}</h3>
                            <p className="text-sm sm:text-base text-brand-gray/80">{point.text}</p>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
            <div id="about-mission-image-wrapper" className="relative h-full min-h-[400px]">
                <div id="about-mission-image-glow" className="absolute inset-0 bg-brand-surface rounded-2xl animate-colorful-glow" style={{animationDuration: '10s'}}></div>
                <img 
                src={about.mission.imageUrl}
                alt="Collaborative team working"
                className="absolute inset-2.5 w-[calc(100%-20px)] h-[calc(100%-20px)] object-cover rounded-xl"
                />
            </div>
            </div>
        </AnimateOnScroll>
        
        {/* --- Our Philosophy Section --- */}
        <section id="about-principles-section" className="text-center">
            <AnimateOnScroll id="about-principles-header" delay={200}>
                <h2 className="text-3xl sm:text-4xl font-bold font-heading text-brand-light">{about.principles.title}</h2>
                <p className="mt-2 max-w-2xl mx-auto text-brand-gray/80">{about.principles.subtitle}</p>
            </AnimateOnScroll>
            <div id="about-principles-grid" className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {about.principles.items.map((item, index) => {
                    const Icon = icons[item.icon as keyof typeof icons] || HelpCircle;
                    return (
                        <AnimateOnScroll key={item.id} id={`about-principles-item-${item.id}`} className="bg-brand-surface/50 p-8 rounded-xl border border-white/10 h-full" delay={300 + index * 100}>
                            <Icon className="mx-auto h-10 w-10 text-brand-secondary mb-4" />
                            <h3 className="text-xl font-bold font-heading text-brand-light">{item.title}</h3>
                            <p className="text-brand-gray/70 mt-2">{item.text}</p>
                        </AnimateOnScroll>
                    )
                })}
            </div>
        </section>

        {/* --- CTA Section --- */}
        <AnimateOnScroll as="section" id="about-cta-section" className="bg-brand-surface/50 rounded-2xl p-10 sm:p-16 text-center border border-brand-primary/20">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-brand-light">{about.cta.title}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-brand-gray/80">
            {about.cta.subtitle}
            </p>
            <div id="about-cta-button-wrapper" className="mt-8">
                <button 
                    onClick={() => openModal({ subject: 'Strategy Call Request' })} 
                    className="inline-block px-10 py-4 font-bold rounded-full text-brand-dark-text bg-brand-secondary hover:bg-brand-primary hover:text-brand-secondary transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-secondary/20"
                >
                    {about.cta.buttonText}
                </button>
            </div>
        </AnimateOnScroll>
        </div>
    </div>
  );
};

export default AboutPage;
