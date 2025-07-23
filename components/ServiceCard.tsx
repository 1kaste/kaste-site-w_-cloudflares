import React from 'react';
import { Link } from 'react-router-dom';
import type { Service } from '../types';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

// Define which services are launching soon
const comingSoonServiceIds = ['mobile-apps', 'software-development'];

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const isComingSoon = comingSoonServiceIds.includes(service.id);

  return (
    <Link 
      to={`/service/${service.id}`}
      className="block h-full bg-brand-surface rounded-xl overflow-hidden shadow-lg hover:shadow-brand-primary/20 border border-transparent hover:border-brand-secondary transition-all duration-300 transform hover:-translate-y-2 group"
    >
      <div id={`service-card-image-wrapper-${service.id}`} className="relative">
        <img className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" src={service.imageUrl} alt={service.title} />
        {isComingSoon && (
          <div id={`service-card-coming-soon-badge-${service.id}`} className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
            Coming Soon
          </div>
        )}
        <div id={`service-card-image-overlay-${service.id}`} className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div id={`service-card-image-title-wrapper-${service.id}`} className="absolute bottom-0 left-0 p-4 sm:p-6">
            <h3 className="text-xl font-bold font-heading text-brand-light">{service.title}</h3>
        </div>
      </div>
      <div id={`service-card-content-wrapper-${service.id}`} className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
        <div id={`service-card-description-wrapper-${service.id}`}>
          <p className="text-brand-gray/90 text-sm mb-4 h-12 hidden sm:block">{service.description}</p>
        </div>
        <div id={`service-card-link-wrapper-${service.id}`} className="flex items-center text-brand-secondary font-semibold group-hover:underline mt-4 sm:mt-auto">
          Discover More
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
