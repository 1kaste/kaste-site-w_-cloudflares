
import React, { useState } from 'react';
import { icons, HelpCircle } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';
import type { IconSource } from '../types';
import { useSiteContent } from '../contexts/SiteContentContext';

// --- Custom SVG Icon Components with Brand Colors ---

const GeminiIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="50%" stopColor="#9B72F4" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
    </defs>
    <path fill="url(#gemini-gradient)" d="M12 2a10 10 0 100 20 10 10 0 000-20zm-5.6 5.2l1.4 1.4-1.4 1.4L5 8.6l1.4-1.4zM12 4.1l1.4 1.4L12 7 10.6 5.5 12 4.1zm5.6 1.1l-1.4 1.4 1.4 1.4L19 8.6l-1.4-1.4zM8.4 18.8l1.4-1.4-1.4-1.4L7 15.4l1.4 1.4zm7.2 0l-1.4-1.4 1.4-1.4L17 15.4l-1.4 1.4zm-3.6-2.7c-2.3 0-4.1-1.8-4.1-4.1s1.8-4.1 4.1-4.1 4.1 1.8 4.1 4.1-1.8 4.1-4.1 4.1z" />
  </svg>
);

const TensorFlowIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F78100">
    <path d="M12 2L3 7.5V16.5L12 22L21 16.5V7.5L12 2ZM11 10H5V8H11V5H13V8H19V10H13V18H11V10Z"/>
  </svg>
);

const PyTorchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#EE4C2C">
      <path d="M7.1,16.2c1.2-1.2,2.3-3.6,2.3-3.6s-3-0.9-3-3s3-3,3-3s-1.7,4-3,5.2c-1.2,1.2-3.4,2.3-3.4,2.3S5.9,17.4,7.1,16.2z"/>
      <path d="M16.9,7.8c-1.2,1.2-2.3,3.6-2.3,3.6s3,0.9,3,3s-3,3-3,3s1.7-4,3-5.2c1.2,1.2,3.4-2.3,3.4-2.3S18.1,6.6,16.9,7.8z"/>
      <circle cx="12" cy="3.5" r="1.5"/>
  </svg>
);

const LangChainIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5">
    <path d="M9 17a5 5 0 0 1-5-5 5 5 0 0 1 5-5m6 0a5 5 0 0 1 5 5 5 5 0 0 1-5 5M8 12h8"/>
  </svg>
);

const ReactIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="-11.5 -10.23" width="23" height="20.46" xmlns="http://www.w3.org/2000/svg">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB"></circle>
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2"></ellipse>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"></ellipse>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"></ellipse>
    </g>
  </svg>
);

const TypeScriptIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" fill="#3178C6" rx="20"></rect>
    <path fill="white" d="M52.368 44.845h21.492v7.87H63.93v38.076h-9.25V52.715H43.118v-7.87zm24.89 0h20.67v7.87H87.328v13.524c0 8.44-4.84 12.894-14.4 12.894-8.89 0-13.91-4.22-13.91-12.534 0-8.205 5.09-12.446 13.91-12.446a12.84 12.84 0 018.98 3.55zm-10.45 38.38c5.44 0 8.8-2.58 8.8-7.96V64.09c-2.75-2.22-5.93-3.32-9.62-3.32-5.44 0-8.8 3.1-8.8 7.69s3.36 7.87 9.62 7.87z" />
  </svg>
);

const TailwindIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.5 22.5c-3-3-7.5-3-11-3m11 0c-4-4.5-4-10.5-1-15-2.5 4.5-2.5 9.5 0 14" stroke="#38BDF8" />
  </svg>
);

const NodeJSIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6DA55F">
    <path d="M21.3,8.2l-9-5.2c-0.4-0.2-0.8-0.2-1.2,0l-9,5.2C1.7,8.4,1.5,8.9,1.5,9.3v10.4c0,0.5,0.2,0.9,0.6,1.2l9,5.2 c0.2,0.1,0.4,0.2,0.6,0.2s0.4-0.1,0.6-0.2l9-5.2c0.4-0.2,0.6-0.7,0.6-1.2V9.3C22.5,8.9,22.3,8.4,21.3,8.2z"/>
  </svg>
);

const PythonIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="#3776AB" d="M12 23c-3.3 0-6-2.7-6-6v-1c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2.2V17c0 3.3-2.7 6-6 6z" />
    <path fill="#FFD43B" d="M12 1c-3.3 0-6 2.7-6 7v1c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2.2V7c0-3.3-2.7-6-6-6z" />
  </svg>
);

const PostgreSQLIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#336791">
    <path d="M12.2,14.2h-2V12h2.2c0.9,0,1.5-0.7,1.5-1.5S13.3,9,12.4,9h-4C7.6,9,7,9.6,7,10.4V19c0,0.4,0.4,1,1,1h1.5v-5.8h2.2 c0.9,0,1.5,0.7,1.5,1.5s-0.7,1.5-1.5,1.5H10v2h2.5c2.1,0,3.8-1.7,3.8-3.8S14.3,14.2,12.2,14.2z M17,4c-1.3,0-2,1-2,2v1h-2V6 c0-2.2,1.8-4,4-4s4,1.8,4,4v11c0,1.1-0.9,2-2,2h-1c-1.1,0-2-0.9-2-2v-1h2v1c0,0.6,0.4,1,1,1s1-0.4,1-1V4z" />
  </svg>
);

const MongoDBIcon = ({ className }: { className?: string }) => (
   <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="#4DB33D" d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.5,0,10-4.5,10-10C22,6.5,17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8 c1.9,0,3.7,0.7,5.1,1.8C13.9,7.6,12,10.3,12,12.5C12,16.5,15.1,20,17.8,20C16,20,14,20,12,20z"/>
   </svg>
);

const customIcons = {
  GeminiIcon, TensorFlowIcon, PyTorchIcon, LangChainIcon, ReactIcon, TypeScriptIcon,
  TailwindIcon, NodeJSIcon, PythonIcon, PostgreSQLIcon, MongoDBIcon,
};

const TabIcon: React.FC<{ icon: IconSource; className?: string; alt: string }> = ({ icon, className, alt }) => {
  const { type, value } = icon;
  const finalClassName = `w-7 h-7 ${className || ''}`;

  switch (type) {
    case 'custom': {
      const IconComponent = customIcons[value as keyof typeof customIcons];
      return IconComponent ? <IconComponent className={finalClassName} /> : <HelpCircle className={finalClassName} />;
    }
    case 'lucide': {
      const IconComponent = icons[value as keyof typeof icons] || HelpCircle;
      return <IconComponent className={finalClassName} />;
    }
    case 'url':
      return <img src={value} alt={alt} className="w-7 h-7 object-contain" />;
    default:
      return <HelpCircle className={finalClassName} />;
  }
};

type TabId = 'ai' | 'stack' | 'projects';

const TabsSection: React.FC = () => {
  const { content } = useSiteContent();

  if (!content) return null;

  const { homepage } = content;
  const { tabsSection } = homepage;
  const [activeTab, setActiveTab] = useState<TabId>(tabsSection.tabs[0]?.id || 'ai');
  
  const currentTab = tabsSection.tabs.find(t => t.id === activeTab);
  const currentContent = currentTab?.items || [];

  return (
    <AnimateOnScroll as="section" className="max-w-5xl mx-auto" delay={800}>
      <div id="tabs-section-header" className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-brand-light">{tabsSection.title}</h2>
        <p className="mt-2 text-base sm:text-lg text-brand-gray/80">{tabsSection.subtitle}</p>
      </div>

      <div id="tabs-section-buttons-wrapper" className="flex justify-center mb-8 bg-brand-surface/50 p-2 rounded-full border border-white/10">
        {tabsSection.tabs.map(tab => {
          const Icon = icons[tab.icon as keyof typeof icons] || HelpCircle;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-initial flex items-center justify-center px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-brand-primary text-brand-light' 
                  : 'text-brand-gray hover:bg-white/5'
                }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div id="tabs-section-content-wrapper" className="bg-brand-surface/50 p-8 rounded-2xl border border-white/10 min-h-[20rem]">
        <ul className="space-y-6">
          {currentContent.map((item, index) => (
              <AnimateOnScroll as="li" id={`tabs-section-content-item-${activeTab}-${item.id}`} key={item.id} className="flex items-start" delay={index * 100} animationClass="animate-fade-in">
                <div id={`tabs-section-content-item-icon-${activeTab}-${item.id}`} className="flex-shrink-0 mt-1 flex items-center justify-center w-8 h-8">
                  <TabIcon icon={item.icon} className={item.iconClassName} alt={item.title} />
                </div>
                <div id={`tabs-section-content-item-text-${activeTab}-${item.id}`} className="ml-4">
                  <h4 className="font-bold font-heading text-base sm:text-lg text-brand-light">{item.title}</h4>
                  <p className="text-brand-gray/80">{item.description}</p>
                </div>
              </AnimateOnScroll>
            )
          )}
        </ul>
      </div>
    </AnimateOnScroll>
  );
};

export default TabsSection;
