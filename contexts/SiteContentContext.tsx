
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { fetchAndCacheSiteContent, defaultSiteContent } from '../services/siteContent';
import type { SiteContent } from '../types';

// Context Definition
interface SiteContentContextType {
  content: SiteContent | null;
  refreshContent: () => Promise<void>;
  isLoading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

// Provider Component
export const SiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshContent = useCallback(async () => {
    // No need to set loading true on every refresh, only initial.
    // This provides a smoother experience in the admin panel.
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

  // Provide default content if the real content is null (during initial load).
  // The `isLoading` flag will ensure the splash screen is shown instead of
  // the app with default content, but this prevents crashes in components
  // that might render during the loading phase (like SplashScreen itself).
  const providerValue = {
    content: content ?? defaultSiteContent,
    refreshContent,
    isLoading,
  };

  return (
    <SiteContentContext.Provider value={providerValue}>
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
