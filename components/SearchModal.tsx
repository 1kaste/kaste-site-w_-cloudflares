

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchModal } from '../contexts/SearchModalContext';
import { getSiteContent } from '../services/siteContent';
import { X, Search, ArrowRight, BookUser, Layers, Mail, Phone, ExternalLink, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchResult {
  type: 'service' | 'page' | 'project' | 'contact';
  title: string;
  description: string;
  url?: string;
  href?: string;
  icon: React.ElementType;
  searchableContent: string;
}

const pages = [
  { title: 'Home', description: 'The main landing page for Kaste Brands & Designs.', url: '/' },
  { title: 'About Us', description: 'Learn more about our company, mission, and team.', url: '/about' },
  { title: 'Services', description: 'Explore all the digital solutions and services we offer.', url: '/services' },
  { title: 'Contact Us', description: 'Get in touch with us for a project or inquiry.', url: '/contact' },
];

const SearchModal: React.FC = () => {
  const { isOpen, closeModal } = useSearchModal();
  const [query, setQuery] = useState('');
  
  const siteContent = useMemo(() => getSiteContent(), [isOpen]);

  const searchIndex = useMemo<SearchResult[]>(() => {
    if (!isOpen) return []; // Don't build index if not open

    const { contact, footer, services, projects } = siteContent;
    const servicesMap = new Map(services.map(s => [s.id, s.title]));

    const contactAndSocials = [
      { title: 'Email Us', description: contact.details.email, href: `mailto:${contact.details.email}`, icon: Mail },
      { title: 'Call Us', description: contact.details.phone, href: `tel:${contact.details.phone}`, icon: Phone },
      ...footer.socialLinks.map(link => ({
        title: link.label,
        description: link.url.replace(/https?:\/\//, ''),
        href: link.url,
        icon: ExternalLink
      })),
    ];

    const serviceResults: SearchResult[] = services.map(service => ({
      type: 'service',
      title: service.title,
      description: service.description,
      url: `/service/${service.id}`,
      icon: Layers,
      searchableContent: `${service.title} ${service.description} ${service.longDescription}`
    }));

    const projectResults: SearchResult[] = projects.map(project => ({
      type: 'project',
      title: project.title,
      description: `Project in ${servicesMap.get(project.serviceId) || 'Uncategorized'}`,
      url: `/service/${project.serviceId}`,
      icon: Briefcase,
      searchableContent: `${project.title} ${project.description} ${servicesMap.get(project.serviceId)}`
    }));


    const pageResults: SearchResult[] = pages.map(page => ({
      type: 'page',
      title: page.title,
      description: page.description,
      url: page.url,
      icon: BookUser,
      searchableContent: `${page.title} ${page.description}`
    }));

    const contactResults: SearchResult[] = contactAndSocials.map(item => ({
      type: 'contact',
      title: item.title,
      description: item.description,
      href: item.href,
      icon: item.icon,
      searchableContent: `${item.title} ${item.description}`
    }));

    return [...pageResults, ...serviceResults, ...projectResults, ...contactResults];
  }, [isOpen, siteContent]);

  const filteredResults = useMemo(() => {
    if (query.trim().length < 2) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    return searchIndex.filter(item =>
      item.searchableContent.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query, searchIndex]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setQuery(''), 300);
    } else {
      const input = document.getElementById('global-search-input');
      // Timeout to ensure focus works after modal animation
      setTimeout(() => input?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLinkClick = () => closeModal();
  const handleRouterLinkClick = () => {
    closeModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-brand-bg/80 backdrop-blur-sm animate-fade-in pt-20 sm:pt-32"
      onClick={closeModal}
      aria-modal="true"
      role="dialog"
    >
      <div
        id="search-modal-container"
        className="bg-brand-surface rounded-2xl shadow-2xl w-full max-w-2xl m-4 border border-brand-primary/20 relative animate-fade-in-up flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div id="search-modal-input-wrapper" className="relative flex-shrink-0">
          <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-brand-gray/50 w-5 h-5 pointer-events-none" />
          <input
            id="global-search-input"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search services, pages, contact info..."
            className="w-full bg-transparent text-brand-light text-lg px-12 py-5 border-b border-brand-primary/20 focus:outline-none"
            aria-label="Search input"
          />
          <button
            onClick={closeModal}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-gray/60 hover:text-brand-light transition-colors"
            aria-label="Close search"
          >
            <X size={24} />
          </button>
        </div>

        <div id="search-modal-results-wrapper" className="p-2 max-h-[60vh] overflow-y-auto">
          {query.length > 1 && filteredResults.length === 0 ? (
            <div id="search-modal-no-results" className="p-8 text-center text-brand-gray/70">
              <p className="font-semibold">No results found for "{query}"</p>
              <p className="text-sm">Try searching for something else.</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <ul className="divide-y divide-brand-primary/10">
              {filteredResults.map((result, index) => {
                const Icon = result.icon;
                const content = (
                  <div id={`search-modal-result-item-content-${index}`} className="flex items-center justify-between">
                    <div id={`search-modal-result-item-details-${index}`} className="flex items-center min-w-0">
                      <div id={`search-modal-result-item-icon-${index}`} className="mr-3 p-1.5 bg-brand-bg rounded-md flex-shrink-0">
                        <Icon className="w-4 h-4 text-brand-secondary" />
                      </div>
                      <div id={`search-modal-result-item-text-${index}`} className="flex-1 min-w-0">
                        <h3 className="font-semibold text-brand-light group-hover:text-brand-secondary transition-colors truncate">{result.title}</h3>
                        <p className="text-sm text-brand-gray/70 truncate">{result.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-brand-gray/50 group-hover:text-brand-light transition-transform group-hover:translate-x-1 ml-4 flex-shrink-0" />
                  </div>
                );
                return (
                  <li key={`${result.title}-${index}`}>
                    {result.href ? (
                      <a
                        href={result.href}
                        target={result.href.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className="block p-4 hover:bg-brand-primary/10 rounded-lg group transition-colors"
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        to={result.url!}
                        onClick={handleRouterLinkClick}
                        className="block p-4 hover:bg-brand-primary/10 rounded-lg group transition-colors"
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div id="search-modal-initial-prompt" className="p-8 text-center text-brand-gray/70">
              <p className="font-semibold">Start typing to search</p>
              <p className="text-sm">Find services, projects, contact info, or pages like "About".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
