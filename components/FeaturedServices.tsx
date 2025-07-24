
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Service } from '../types';
import ServiceCard from './ServiceCard';
import AnimateOnScroll from './AnimateOnScroll';
import { useSiteContent } from '../contexts/SiteContentContext';

const FeaturedServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const { content } = useSiteContent();
  
  if (!content) return null;
  const { homepage } = content;
  const { featuredServices } = homepage;

  useEffect(() => {
    if (content) {
      const allServices = content.services;
      const featured = allServices.filter(s => featuredServices.serviceIds.includes(s.id));
      // Ensure the order is correct
      const sortedFeatured = featuredServices.serviceIds.map(id => featured.find(s => s.id === id)).filter(Boolean) as Service[];
      setServices(sortedFeatured);
    }
  }, [content, featuredServices.serviceIds]);

  return (
    <AnimateOnScroll as="section" id="services" delay={200}>
      <div id="featured-services-header" className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-brand-light">{featuredServices.title}</h2>
        <p className="mt-2 text-base sm:text-lg text-brand-gray/80">{featuredServices.subtitle}</p>
      </div>
      <div id="featured-services-grid" className="grid grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <AnimateOnScroll 
              key={service.id} 
              delay={200 + index * 100}
              className="h-full"
          >
              <ServiceCard service={service} />
          </AnimateOnScroll>
        ))}
      </div>
      <div id="featured-services-view-all-button" className="text-center mt-16">
        <Link
          to="/services"
          className="inline-block px-10 py-4 font-bold rounded-full text-brand-dark-text bg-brand-secondary hover:bg-brand-primary hover:text-brand-light transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-secondary/20"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          View All Services
        </Link>
      </div>
    </AnimateOnScroll>
  );
};

export default FeaturedServices;
