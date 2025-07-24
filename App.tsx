



import React, { useEffect, useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ServiceDetail from './components/ServiceDetail';
import ServicesPage from './components/ServicesPage';
import FloatingIcons from './components/FloatingIcons';
import AboutPage from './components/AboutPage';
import { ContactModalProvider } from './contexts/ContactModalContext';
import ContactModal from './components/ContactModal';
import { SearchModalProvider } from './contexts/SearchModalContext';
import SearchModal from './components/SearchModal';
import FloatingContact from './components/FloatingContact';
import ContactPage from './components/ContactPage';
import { AdminPanelProvider } from './contexts/AdminPanelContext';
import AdminPanel from './components/AdminPanel';
import { fetchAndCacheSiteContent, getCachedSiteContent } from './services/siteContent';
import SplashScreen from './components/SplashScreen';
import AnnouncementPopup from './components/AnnouncementPopup';
import { AnnouncementProvider } from './contexts/AnnouncementContext';
import { AppContextProvider } from './contexts/AppContext';
import { NotificationProvider } from './contexts/NotificationContext';

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

const applyBrandingStyles = () => {
    const content = getCachedSiteContent();
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

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contentVersion, setContentVersion] = useState(0);

  const refreshApp = useCallback(async () => {
    try {
      await fetchAndCacheSiteContent();
      applyBrandingStyles();
      setContentVersion(v => v + 1); // Force re-render with fetched content
    } catch (err) {
      console.error("Failed to refresh site content:", err);
    }
  }, []);

  useEffect(() => {
    // Fetch initial content on first load.
    fetchAndCacheSiteContent().then(() => {
        applyBrandingStyles();
        setContentVersion(v => v + 1);
    }).catch(err => {
        console.error("Failed to load initial site content:", err);
        // Use fallback styles if fetch fails
        applyBrandingStyles();
        setContentVersion(v => v + 1);
    });
  }, []);

  if (isLoading) {
    return <SplashScreen onFinished={() => setIsLoading(false)} />;
  }

  return (
    <AppContextProvider value={{ refreshApp }}>
      <AdminPanelProvider>
        <ContactModalProvider>
          <SearchModalProvider>
            <AnnouncementProvider>
              <NotificationProvider>
                <HashRouter>
                  <div id="app-wrapper" className="flex flex-col min-h-screen animate-fade-in bg-brand-bg" key={contentVersion}>
                    <Header />
                    <FloatingIcons />
                    <div id="floating-contact-container" className="hidden lg:block">
                      <FloatingContact />
                    </div>
                    <main id="main-content-container" className="flex-grow relative">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/service/:id" element={<ServiceDetail />} />
                        <Route path="/contact" element={<ContactPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                  <ContactModal />
                  <SearchModal />
                  <AdminPanel />
                  <AnnouncementPopup />
                </HashRouter>
              </NotificationProvider>
            </AnnouncementProvider>
          </SearchModalProvider>
        </ContactModalProvider>
      </AdminPanelProvider>
    </AppContextProvider>
  );
};

export default App;