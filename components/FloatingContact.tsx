import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const FloatingContact: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const phoneNumber = '+254795071901';
    const whatsAppNumber = '254795071901';

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={menuRef} id="floating-contact-widget" className="fixed bottom-12 right-8 z-[60]">
            <div id="floating-contact-inner-wrapper" className="relative flex items-center justify-center">
                {/* Contact Options */}
                <div 
                    id="floating-contact-actions-container"
                    className={`
                        absolute flex items-center gap-3 transition-all duration-300 ease-in-out
                        md:flex-col md:bottom-full md:mb-3
                        flex-row right-full mr-3
                        ${isOpen 
                            ? 'opacity-100 translate-x-0 md:translate-y-0' 
                            : 'opacity-0 pointer-events-none translate-x-4 md:translate-x-0 md:translate-y-4'
                        }`
                    }
                >
                    <a
                        href={`https://wa.me/${whatsAppNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Contact via WhatsApp"
                        className="flex items-center justify-center w-14 h-14 bg-brand-surface rounded-full shadow-lg border border-white/10 hover:bg-brand-primary/50 transition-all transform hover:scale-110"
                    >
                        <img src="https://res.cloudinary.com/dwwvh34yi/image/upload/v1753226530/whatsapp-svgrepo-com_tdqmtd.svg" alt="WhatsApp" className="w-7 h-7" />
                    </a>
                    <a
                        href={`tel:${phoneNumber}`}
                        aria-label="Call Us"
                        className="flex items-center justify-center w-14 h-14 bg-brand-surface rounded-full shadow-lg border border-white/10 hover:bg-brand-primary/50 transition-all transform hover:scale-110"
                    >
                        <img src="https://res.cloudinary.com/dwwvh34yi/image/upload/v1753226713/call_us_zp7jri.svg" alt="Call Us" className="w-[26px] h-[26px]" />
                    </a>
                </div>

                {/* Main Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
                    aria-expanded={isOpen}
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-secondary text-brand-dark-text shadow-2xl shadow-brand-secondary/30 hover:bg-yellow-500 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-brand-secondary/50"
                >
                    <div id="floating-contact-icon-wrapper" className="relative w-8 h-8">
                        <img 
                          src="https://res.cloudinary.com/dwwvh34yi/image/upload/v1753226313/contact_dqa3n1.svg" 
                          alt="Contact" 
                          className={`absolute inset-0 w-full h-full object-contain transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 rotate-45 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                        />
                        <X className={`absolute inset-0 w-full h-full text-brand-dark-text transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-50'}`} />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default FloatingContact;
