import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalOptions {
  serviceId?: string;
  subject?: string;
}

interface ContactModalContextType {
  openModal: (options?: ModalOptions) => void;
  closeModal: () => void;
  isOpen: boolean;
  options: ModalOptions;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export const ContactModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ModalOptions>({});

  const openModal = (opts: ModalOptions = {}) => {
    setOptions(opts);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    // Delay resetting options to avoid content flash during closing animation
    setTimeout(() => {
        setOptions({});
    }, 300);
    document.body.style.overflow = 'auto';
  };

  return (
    <ContactModalContext.Provider value={{ isOpen, options, openModal, closeModal }}>
      {children}
    </ContactModalContext.Provider>
  );
};

export const useContactModal = (): ContactModalContextType => {
  const context = useContext(ContactModalContext);
  if (context === undefined) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return context;
};
