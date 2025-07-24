
import React from 'react';
import { icons, HelpCircle } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';
import { useSiteContent } from '../contexts/SiteContentContext';

const StatsSection: React.FC = () => {
  const { content } = useSiteContent();
  
  if (!content) return null;
  const { homepage } = content;
  const { stats } = homepage;

  return (
    <AnimateOnScroll as="section" delay={600}>
       <div id="stats-section-header" className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-brand-light">{stats.title}</h2>
        <p className="mt-2 text-brand-gray/80">{stats.subtitle}</p>
      </div>
      <div id="stats-section-grid" className="max-w-4xl mx-auto grid grid-cols-2 gap-8 text-center">
        {stats.items.map((stat, index) => {
          const Icon = icons[stat.icon as keyof typeof icons] || HelpCircle;
          return (
            <AnimateOnScroll key={stat.id} delay={600 + (index + 1) * 150}>
              <div id={`stats-section-item-${stat.id}`} className="bg-brand-surface/50 p-8 rounded-xl border border-white/10 h-full">
                <Icon className="mx-auto h-10 w-10 text-brand-secondary mb-4" />
                <p className="text-3xl sm:text-4xl font-extrabold font-heading text-brand-light">{stat.value}</p>
                <p className="text-sm text-brand-gray/70 mt-1">{stat.label}</p>
              </div>
            </AnimateOnScroll>
          );
        })}
      </div>
    </AnimateOnScroll>
  );
};

export default StatsSection;
