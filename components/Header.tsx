

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { icons, Search, X, ChevronDown, Sparkles } from 'lucide-react';
import { useSearchModal } from '../contexts/SearchModalContext';
import { useAdminPanel } from '../contexts/AdminPanelContext';
import { getSiteContent } from '../services/siteContent';
import { useAnnouncement } from '../contexts/AnnouncementContext';

const NavLink = ({ to, children, onClick, isButton = false, variant = 'pill' }: { to: string, children: React.ReactNode, onClick?: () => void, isButton?: boolean, variant?: 'pill' | 'list' }) => {
    const pillBaseClasses = "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300";
    const pillButtonClasses = `${pillBaseClasses} text-brand-dark-text bg-brand-secondary hover:bg-brand-primary hover:text-brand-light transform hover:scale-105`;
    const pillLinkClasses = `${pillBaseClasses} text-brand-gray hover:text-brand-secondary`;

    const listBaseClasses = "block w-full text-left px-4 py-3 rounded-lg text-base transition-colors duration-200";
    const listLinkClasses = `${listBaseClasses} text-brand-gray hover:bg-brand-secondary/20 hover:text-brand-secondary`;

    const finalClasses = variant === 'pill'
      ? (isButton ? pillButtonClasses : pillLinkClasses)
      : listLinkClasses;
    
    const handleRouterClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if(onClick) onClick();
    };

    return <Link to={to} onClick={handleRouterClick} className={finalClasses}>{children}</Link>
}


const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileContactRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const longPressTimer = useRef<number | null>(null);

  const { openModal: openSearchModal } = useSearchModal();
  const { openPanel: openAdminPanel } = useAdminPanel();
  const { showPopup } = useAnnouncement();

  const siteContent = getSiteContent();
  const { branding, header, popup } = siteContent;
  const { cyclingContent } = header;

  const phoneNumber = header.contact.phone;
  const whatsAppNumber = header.contact.whatsapp;

  const handlePressStart = () => {
    longPressTimer.current = window.setTimeout(() => {
      openAdminPanel();
    }, 5000); // 5 seconds
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const toggleMainMenu = () => {
    setIsMenuOpen(prev => !prev);
    setIsMobileContactOpen(false);
  };

  const toggleMobileContact = () => {
    setIsMobileContactOpen(prev => !prev);
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileContactOpen(false);
  };


  useEffect(() => {
    closeMenu();
  }, [location]);

  useEffect(() => {
    if (cyclingContent.length > 0) {
      const intervalId = window.setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cyclingContent.length);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [cyclingContent.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      if (
        mobileContactRef.current &&
        !mobileContactRef.current.contains(event.target as Node)
      ) {
        setIsMobileContactOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const currentCycleItem = cyclingContent[currentIndex];
  const IconComponent = currentCycleItem ? icons[currentCycleItem.icon as keyof typeof icons] : undefined;
  const CurrentIcon = IconComponent || Sparkles;

  const logoLinkProps = {
    onMouseDown: handlePressStart,
    onMouseUp: handlePressEnd,
    onTouchStart: handlePressStart,
    onTouchEnd: handlePressEnd,
    "aria-label": "Kaste Brands & Designs, long press to open admin panel"
  };

  return (
    <>
      {/* Mobile Header Pill */}
      <header id="header-mobile" className="md:hidden fixed top-4 left-4 right-4 z-50">
        <div id="header-mobile-pill" className="flex items-center justify-between bg-brand-surface/50 backdrop-blur-2xl rounded-full px-3 py-1.5 shadow-lg border border-white/10 animate-colorful-glow">
          <div id="header-mobile-logo-wrapper" className="flex-shrink-0">
            <Link to="/" onClick={closeMenu} className="flex items-center group" {...logoLinkProps}>
                <img src={branding.logoUrl} alt="Kaste Brands & Designs Logo" className="h-6 w-auto" />
            </Link>
          </div>

          <div id="header-mobile-actions-wrapper" className="flex-shrink-0 flex items-center gap-1">
            <button
                onClick={openSearchModal}
                aria-label="Open search"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-surface/50 text-brand-light hover:bg-white/10 transition-colors"
            >
                <Search className="h-4 w-4" />
            </button>
            <div id="header-mobile-contact-dropdown" ref={mobileContactRef} className="relative">
                <button
                    onClick={toggleMobileContact}
                    aria-label={isMobileContactOpen ? 'Close contact options' : 'Open contact options'}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-secondary text-brand-dark-text shadow-md transition-all duration-300"
                >
                    <div id="header-mobile-contact-icon-wrapper" className="relative w-5 h-5">
                        <img 
                          src="https://res.cloudinary.com/dwwvh34yi/image/upload/v1753226313/contact_dqa3n1.svg"
                          alt="Contact"
                          className={`absolute inset-0 w-full h-full object-contain transition-all duration-300 ease-in-out ${isMobileContactOpen ? 'opacity-0 rotate-45 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                        />
                        <X className={`absolute inset-0 w-full h-full transition-all duration-300 ease-in-out ${isMobileContactOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-50'}`} />
                    </div>
                </button>
                <div 
                    id="header-mobile-contact-menu"
                    className={`absolute top-full right-0 mt-2 w-48 bg-brand-surface rounded-xl shadow-2xl border border-white/10 p-2
                        transition-all duration-300 ease-in-out origin-top-right z-10
                        ${isMobileContactOpen
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                        }`}
                >
                    <a href={`https://wa.me/${whatsAppNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-brand-light">
                        <img src="https://res.cloudinary.com/dwwvh34yi/image/upload/v1753226530/whatsapp-svgrepo-com_tdqmtd.svg" alt="WhatsApp Us" className="w-[22px] h-[22px]"/>
                        <span>WhatsApp Us</span>
                    </a>
                    <a href={`tel:${phoneNumber}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-brand-light">
                        <img src="https://res.cloudinary.com/dwwvh34yi/image/upload/v1753226713/call_us_zp7jri.svg" alt="Call Us" className="w-[22px] h-[22px]"/>
                        <span>Call Us</span>
                    </a>
                </div>
            </div>
            <button 
              ref={buttonRef}
              onClick={toggleMainMenu} 
              aria-label="Toggle menu" 
              aria-expanded={isMenuOpen} 
              className="p-2 -mr-2"
            >
              <ChevronDown className={`h-5 w-5 text-brand-light transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Dropdown Menu */}
      <div
        id="header-mobile-main-menu"
        ref={menuRef}
        className={`md:hidden fixed top-20 right-4 w-64 bg-brand-surface/50 backdrop-blur-2xl rounded-xl shadow-2xl z-40 border border-white/10 overflow-hidden transition-all duration-300 ease-in-out animate-colorful-glow
          ${isMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`
        }
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <nav className="flex flex-col p-2" role="none">
          <div id={`header-mobile-menu-cycling-content-wrapper-${currentIndex}`} key={currentIndex} className="border-b border-brand-primary/20 mb-2 px-2 pb-3 pt-1 animate-fade-in">
            {currentCycleItem && (
                <div id="header-mobile-menu-cycling-content-inner" className="flex items-center text-brand-gray">
                    <CurrentIcon className="h-5 w-5 text-brand-secondary mr-2 flex-shrink-0" />
                    <p className="text-sm font-semibold">{currentCycleItem.text}</p>
                </div>
            )}
          </div>

          <NavLink to="/" onClick={closeMenu} variant="list">Home</NavLink>
          <NavLink to="/about" onClick={closeMenu} variant="list">About Us</NavLink>
          <NavLink to="/services" onClick={closeMenu} variant="list">Services</NavLink>
          
          <hr className="my-2 border-brand-primary/20" />
          
          <div id="header-mobile-main-menu-contact-button-wrapper" className="pt-1">
            <Link
              to="/contact"
              onClick={closeMenu}
              className="block w-full text-center px-5 py-3 rounded-lg text-sm font-bold text-brand-dark-text bg-brand-secondary hover:bg-brand-primary hover:text-brand-light focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition-all transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </nav>
      </div>

      {/* Desktop Header */}
      <div id="header-desktop" className="hidden md:flex fixed top-6 inset-x-0 items-center justify-between z-50 container mx-auto px-6 pointer-events-none">
        {/* Logo */}
        <div id="header-desktop-logo-wrapper" className="flex-1 flex justify-start pointer-events-auto">
            <Link to="/" className="flex items-center group bg-brand-surface/50 backdrop-blur-2xl rounded-full px-3 py-2 shadow-lg border border-white/10 animate-colorful-glow" {...logoLinkProps}>
                <img src={branding.logoUrl} alt="Kaste Brands & Designs Logo" className="h-9 w-auto" />
            </Link>
        </div>

        {/* Nav & Search */}
        <nav id="header-desktop-nav" className="flex-shrink-0 pointer-events-auto flex items-center gap-4">
            <div id="header-desktop-nav-pill" className="flex items-center space-x-2 bg-brand-surface/50 backdrop-blur-2xl rounded-full p-2 animate-colorful-glow border border-white/10">
                <NavLink to="/" onClick={closeMenu}>Home</NavLink>
                <NavLink to="/about" onClick={closeMenu}>About Us</NavLink>
                <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
                <NavLink to="/contact" isButton>Contact Us</NavLink>
                {popup.enabled && (
                    <button
                        id="announcement-nav-dot"
                        onClick={showPopup}
                        aria-label="Show announcement"
                        className="relative w-3 h-3 rounded-full bg-brand-secondary/80 animate-pulse transition-all hover:scale-125"
                    >
                      <span className="absolute -inset-1 rounded-full bg-brand-secondary/30"></span>
                    </button>
                )}
            </div>
             <button
                onClick={openSearchModal}
                aria-label="Open search"
                className="flex items-center justify-center w-11 h-11 bg-brand-surface/50 backdrop-blur-2xl rounded-full shadow-lg border border-white/10 hover:bg-white/20 transition-colors animate-colorful-glow"
            >
                <Search className="h-5 w-5 text-brand-light" />
            </button>
        </nav>
        
        {/* Right Side Group */}
        <div id="header-desktop-actions-wrapper" className="flex-1 flex justify-end items-center pointer-events-auto">
            <div id="header-desktop-cycling-content-wrapper" className="bg-brand-surface/50 backdrop-blur-2xl rounded-full px-4 py-2 shadow-lg border border-white/10 animate-colorful-glow">
                {currentCycleItem && (
                    <div id={`header-desktop-cycling-content-inner-${currentIndex}`} key={currentIndex} className="flex items-center animate-fade-in">
                        <CurrentIcon className="h-5 w-5 text-brand-secondary mr-2.5" />
                        <p className="text-sm font-semibold text-brand-gray">{currentCycleItem.text}</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default Header;