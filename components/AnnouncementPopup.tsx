
import React, { useState, useEffect, useRef } from 'react';
import { icons, X, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnnouncement } from '../contexts/AnnouncementContext';
import { useSiteContent } from '../contexts/SiteContentContext';

const CtaButton = ({ popup, onAfterClick }) => {
    if (!popup.ctaText || !popup.ctaLink) return null;

    const isExternalLink = popup.ctaLink?.startsWith('http');
    const commonClasses = "mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-bold rounded-lg text-brand-dark-text bg-brand-secondary hover:bg-yellow-500 transition-all transform hover:scale-105 shadow-lg shadow-brand-secondary/20";
    
    const content = (
        <>
            {popup.ctaText}
            <ArrowRight className="ml-2 h-4 w-4" />
        </>
    );

    if (isExternalLink) {
        return (
            <a href={popup.ctaLink} target="_blank" rel="noopener noreferrer" className={commonClasses} onClick={onAfterClick}>
                {content}
            </a>
        );
    }
    
    return (
        <Link to={popup.ctaLink} className={commonClasses} onClick={onAfterClick}>
            {content}
        </Link>
    );
};

const AnnouncementPopup: React.FC = () => {
    const { content } = useSiteContent();
    const { isPopupVisible, showPopup, dismissPopup, popupHasBeenSeen } = useAnnouncement();
    const [isClosing, setIsClosing] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    if (!content) return null;
    const { popup } = content;

    const handleClose = () => {
        if (!popupRef.current) return;
        setIsClosing(true);

        const targetNavDot = document.getElementById('announcement-nav-dot');
        const popupRect = popupRef.current.getBoundingClientRect();
        let targetX = window.innerWidth / 2;
        let targetY = 50;

        if (targetNavDot) {
            const targetRect = targetNavDot.getBoundingClientRect();
            targetX = targetRect.left + targetRect.width / 2;
            targetY = targetRect.top + targetRect.height / 2;
        }

        const deltaX = targetX - (popupRect.left + popupRect.width / 2);
        const deltaY = targetY - (popupRect.top + popupRect.height / 2);
        
        popupRef.current.style.setProperty('--fly-to-x', `${deltaX}px`);
        popupRef.current.style.setProperty('--fly-to-y', `${deltaY}px`);

        // Use a short timeout to allow animation to finish before unmounting
        setTimeout(() => {
            dismissPopup();
            setIsClosing(false); // Reset for next time
        }, 600); // Matches animation duration
    };
    
    // Auto-popup on first visit this session
    useEffect(() => {
        if (popup.enabled && !popupHasBeenSeen && !isPopupVisible) {
            const timer = setTimeout(() => {
                showPopup();
            }, 1500); // Delay before showing popup on page load
            return () => clearTimeout(timer);
        }
    }, [popup.enabled, popupHasBeenSeen, isPopupVisible, showPopup]);

    // Auto-dismiss after 30 seconds
    useEffect(() => {
        if (!isPopupVisible) return;

        const timer = setTimeout(() => {
            handleClose();
        }, 30000); // 30 seconds

        return () => clearTimeout(timer);
    }, [isPopupVisible]);
    
    if (!popup.enabled || !isPopupVisible) {
        return null;
    }

    const IconComponent = icons[popup.icon as keyof typeof icons] || HelpCircle;

    const renderAnnouncementPopup = () => (
        <div
            ref={popupRef}
            id="announcement-popup"
            className={`fixed bottom-5 right-5 z-[90] w-[calc(100%-40px)] max-w-sm bg-brand-surface rounded-2xl shadow-2xl border border-brand-primary/20 overflow-hidden
                ${isClosing ? 'animate-fly-to-nav' : 'animate-fade-in-up'}`
            }
            role="alert"
            aria-live="assertive"
        >
             <button
                onClick={handleClose}
                className="absolute top-2.5 right-2.5 z-20 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all"
                aria-label="Dismiss announcement"
            >
                <X size={20} />
            </button>

            {popup.imageUrl && (
                <div id="announcement-popup-image-wrapper" className="w-full h-32 bg-brand-bg">
                    <img src={popup.imageUrl} alt={popup.title} className="w-full h-full object-cover" />
                </div>
            )}
           
            <div id="announcement-popup-content-wrapper" className="p-4">
                <div id="announcement-popup-body" className="flex items-start gap-4">
                    <div id="announcement-popup-icon-wrapper" className="flex-shrink-0 mt-1 p-2 bg-brand-primary/20 rounded-full">
                        <IconComponent className="w-6 h-6 text-brand-secondary" />
                    </div>
                    <div id="announcement-popup-text-wrapper">
                        <h3 id="announcement-title" className="font-bold font-heading text-brand-light pr-6">{popup.title}</h3>
                        <p id="announcement-message" className="text-sm text-brand-gray/90 mt-1">{popup.message}</p>
                        <CtaButton popup={popup} onAfterClick={handleClose} />
                    </div>
                </div>
            </div>

            <div id="announcement-popup-progress-bar-wrapper" className="absolute bottom-0 left-0 w-full h-1 bg-brand-primary/20">
                <div
                    id="announcement-popup-progress-bar"
                    className="h-full bg-gradient-to-r from-brand-secondary to-yellow-500 animate-shrink-width"
                ></div>
            </div>
        </div>
    );

    const renderSpecialPopup = () => (
        <div 
            id="special-popup-backdrop"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-brand-bg/80 backdrop-blur-sm animate-fade-in"
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={popupRef}
                id="special-popup-container"
                className={`relative bg-brand-surface rounded-2xl shadow-2xl w-full max-w-lg m-4 border border-brand-primary/20 overflow-hidden
                    ${isClosing ? 'animate-fly-to-nav' : 'animate-fade-in-up'}`
                }
            >
                 <button
                    onClick={handleClose}
                    className="absolute top-2.5 right-2.5 z-20 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all"
                    aria-label="Dismiss announcement"
                >
                    <X size={20} />
                </button>
                 {popup.imageUrl && (
                    <div className="w-full h-48 bg-brand-bg">
                        <img src={popup.imageUrl} alt={popup.title} className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="p-6 sm:p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-brand-primary/20 rounded-full">
                            <IconComponent className="w-8 h-8 text-brand-secondary" />
                        </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-brand-light">{popup.title}</h3>
                    <p className="text-sm sm:text-base text-brand-gray/90 mt-2">{popup.message}</p>
                    <CtaButton popup={popup} onAfterClick={handleClose} />
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-brand-primary/20">
                    <div
                        className="h-full bg-gradient-to-r from-brand-secondary to-yellow-500 animate-shrink-width"
                    ></div>
                </div>
            </div>
        </div>
    );

    return popup.type === 'special' ? renderSpecialPopup() : renderAnnouncementPopup();
};

export default AnnouncementPopup;
