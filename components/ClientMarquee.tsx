import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import { getSiteContent } from '../services/siteContent';

interface Client {
  id: string;
  name: string;
  logoUrl: string;
}

const ClientLogo: React.FC<{ client: Client; uniqueId: string }> = ({ client, uniqueId }) => (
  <div id={`client-logo-wrapper-${uniqueId}`} className="flex-shrink-0 w-32 sm:w-40 md:w-48 mx-2 sm:mx-4" title={client.name}>
    <div id={`client-logo-inner-${uniqueId}`} className="h-16 sm:h-20 flex items-center justify-center bg-brand-surface/50 rounded-lg border border-white/10 group-hover:border-brand-primary transition-all duration-300 p-4">
        <img 
            src={client.logoUrl} 
            alt={`${client.name} logo`} 
            className="h-full w-full object-contain opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300" 
        />
    </div>
  </div>
);

const ClientMarquee: React.FC = () => {
  const { homepage } = getSiteContent();
  const { clientMarquee } = homepage;
  const clients_row1 = clientMarquee.clients[0] || [];
  const clients_row2 = clientMarquee.clients[1] || [];

  return (
    <AnimateOnScroll as="section" className="py-12" delay={400}>
      <h2 className="text-center text-2xl font-bold font-heading text-brand-light mb-10">{clientMarquee.title}</h2>
      <div id="client-marquee-container" className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] group space-y-4">
        {clients_row1.length > 0 && (
            <div id="client-marquee-row-1" className="flex animate-marquee">
            {[...clients_row1, ...clients_row1].map((client, index) => (
                <ClientLogo key={`marquee1-${client.id}-${index}`} client={client} uniqueId={`marquee-r1-${client.id}-${index}`} />
            ))}
            </div>
        )}
        {clients_row2.length > 0 && (
            <div id="client-marquee-row-2" className="flex animate-marquee-reverse">
                {[...clients_row2, ...clients_row2].map((client, index) => (
                    <ClientLogo key={`marquee2-${client.id}-${index}`} client={client} uniqueId={`marquee-r2-${client.id}-${index}`} />
                ))}
            </div>
        )}
      </div>
    </AnimateOnScroll>
  );
};

export default ClientMarquee;