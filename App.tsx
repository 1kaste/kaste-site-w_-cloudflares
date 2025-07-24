
import React, { useState } from 'react';
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
import SplashScreen from './components/SplashScreen';
import AnnouncementPopup from './components/AnnouncementPopup';
import { AnnouncementProvider } from './contexts/AnnouncementContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SiteContentProvider, useSiteContent } from './contexts/SiteContentContext';
import BrandingStyles from './components/BrandingStyles';

// This component contains the logic to show either the splash screen or the main app.
const AppBody: React.FC = () => {
    const { content, isLoading } = useSiteContent();
    const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);

    // Show splash screen if we are loading for the first time OR if the splash animation isn't done yet.
    if (isLoading || !isSplashAnimationComplete) {
        return <SplashScreen onFinished={() => setSplashAnimationComplete(true)} />;
    }
    
    // This is a safeguard. With the new context, content should not be null after loading.
    if (!content) {
        return <div className="bg-brand-bg text-brand-light text-center p-8">Fatal Error: Content could not be loaded. Please refresh the page.</div>;
    }

    // Now render the full app
    return (
      <AdminPanelProvider>
        <ContactModalProvider>
          <SearchModalProvider>
            <AnnouncementProvider>
              <NotificationProvider>
                <HashRouter>
                  <BrandingStyles />
                  <div id="app-wrapper" className="flex flex-col min-h-screen animate-fade-in bg-brand-bg">
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
    );
};


// The main App component just sets up the top-level provider.
const App: React.FC = () => {
  return (
    <SiteContentProvider>
        <AppBody />
    </SiteContentProvider>
  );
};

export default App;
