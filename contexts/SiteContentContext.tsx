
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { fetchAndCacheSiteContent, defaultSiteContent } from '../services/siteContent';
import type { SiteContent } from '../types';

// Helper functions that were in App.tsx
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

const applyBrandingStyles = (content: SiteContent | null) => {
    if (!content) return;
    
    const branding = content.branding;
    const styleElement = document.getElementById('branding-styles');
    if (styleElement && branding) {
      const primaryRgb = hexToRgb(branding.colors.primary);
      const secondaryRgb = hexToRgb(branding.colors.secondary);
      
      styleElement.innerHTML = `
        :root {
          --color-brand-primary: ${branding.colors.primary};
          --color-brand-secondary: ${branding.colors.secondary};
          --color-brand-bg: ${branding.colors.background};
          --color-brand-surface: ${branding.colors.surface};
          --color-brand-light: ${branding.colors.lightText};
          --color-brand-gray: ${branding.colors.grayText};
          --color-brand-dark-text: ${branding.colors.darkText};
          --color-brand-primary-glow: rgba(${primaryRgb}, 0.7);
          --color-brand-secondary-glow: rgba(${secondaryRgb}, 0.7);
          --color-brand-secondary-rgb: ${secondaryRgb};
        }
      `;
    }
}


// Context Definition
interface SiteContentContextType {
  content: SiteContent | null;
  refreshContent: () => Promise<void>;
  isLoading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

// Provider Component
export const SiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent | null>(() => {
    applyBrandingStyles(defaultSiteContent); // Apply default styles on initial render
    return defaultSiteContent;
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshContent = useCallback(async () => {
    try {
      const freshContent = await fetchAndCacheSiteContent();
      setContent(freshContent);
    } catch (err) {
      console.error("Failed to refresh site content:", err);
      // Fallback to default if all else fails
      setContent(defaultSiteContent);
    }
  }, []);

  // Initial load effect
  useEffect(() => {
    setIsLoading(true);
    refreshContent().finally(() => setIsLoading(false));
  }, [refreshContent]);

  // Apply branding whenever content changes
  useEffect(() => {
    applyBrandingStyles(content);
  }, [content]);

  return (
    <SiteContentContext.Provider value={{ content, refreshContent, isLoading }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = (): SiteContentContextType => {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
