import React from 'react';
import { Link } from 'react-router-dom';
import { getSiteContent } from '../services/siteContent';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const { branding, footer } = getSiteContent();

  return (
    <footer id="contact" className="bg-brand-surface/50 border-t border-brand-primary/20 mt-20">
      <div id="footer-container" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div id="footer-grid" className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div id="footer-branding" className="md:col-span-1 space-y-4">
            <img src={branding.logoUrl} alt="Kaste Brands & Designs Logo" className="h-8 w-auto" />
            <p className="text-sm text-brand-gray/70">
              {footer.tagline}
            </p>
          </div>
          
          <div id="footer-nav">
            <h3 className="font-bold text-brand-light font-heading tracking-wider mb-4">Navigate</h3>
            <ul className="space-y-2">
              {footer.navLinks.map(link => (
                  <li key={link.id}><Link to={link.url} className="text-brand-gray/80 hover:text-brand-secondary transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          
          <div id="footer-contact">
            <h3 className="font-bold text-brand-light font-heading tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><a href={`mailto:${footer.contact.email}`} className="text-brand-gray/80 hover:text-brand-secondary transition-colors">{footer.contact.email}</a></li>
              <li className="text-brand-gray/80">{footer.contact.location}</li>
            </ul>
          </div>

          <div id="footer-social">
            <h3 className="font-bold text-brand-light font-heading tracking-wider mb-4">Follow Us</h3>
            <div id="footer-social-links-container" className="flex flex-wrap gap-x-6 gap-y-4">
              {footer.socialLinks.map(({ url, label, iconUrl, id }) => (
                  <a 
                      key={id}
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label={label} 
                      className="transition-all duration-200"
                  >
                      {iconUrl ? (
                        <img src={iconUrl} alt={label} className="h-5 w-5 object-contain transition-transform hover:scale-110" />
                      ) : (
                        <span className="text-brand-gray/80 hover:text-brand-secondary">{label}</span>
                      )}
                  </a>
              ))}
            </div>
          </div>

        </div>

        <div id="footer-copyright" className="mt-12 border-t border-brand-primary/10 pt-8 text-center text-brand-gray/60 text-sm">
            &copy; {year} Kaste Brands & Designs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;