
import React from 'react';
import ServiceCard from './ServiceCard';
import AnimateOnScroll from './AnimateOnScroll';
import type { Service } from '../types';
import { useSiteContent } from '../contexts/SiteContentContext';

const ServicesPage: React.FC = () => {
  const { content } = useSiteContent();

  if (!content) return null;
  const services: Service[] = content.services;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-8 sm:pb-12">
        <div id="services-page-container" className="animate-fade-in-up">
        <header id="services-page-header" className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-brand-light">Our Digital Solutions</h1>
            <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-brand-gray/80">
            A complete suite of services designed to build, elevate, and scale your brand. We are your strategic partners in digital transformation, from concept to execution.
            </p>
        </header>
        
        <div id="services-page-grid" className="grid grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
            <AnimateOnScroll 
                key={service.id} 
                id={`services-page-grid-item-${service.id}`}
                delay={100 + index * 100}
                className="h-full"
            >
                <ServiceCard service={service} />
            </AnimateOnScroll>
            ))}
        </div>
        </div>
    </div>
  );
};

export default ServicesPage;
