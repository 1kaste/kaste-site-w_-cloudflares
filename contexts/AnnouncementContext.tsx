import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface AnnouncementContextType {
  isPopupVisible: boolean;
  showPopup: () => void;
  dismissPopup: () => void;
  popupHasBeenSeen: boolean;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const AnnouncementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  // This state tracks if the user has manually interacted (closed) the popup in this session.
  const [popupHasBeenSeen, setPopupHasBeenSeen] = useState(() => {
    try {
        return sessionStorage.getItem('popupDismissed') === 'true';
    } catch (e) {
        return false;
    }
  });

  const showPopup = useCallback(() => {
    setIsPopupVisible(true);
  }, []);

  const dismissPopup = useCallback(() => {
    setIsPopupVisible(false);
    if (!popupHasBeenSeen) {
      try {
        sessionStorage.setItem('popupDismissed', 'true');
        setPopupHasBeenSeen(true);
      } catch (e) {
          console.error("Could not set session storage for popup:", e);
      }
    }
  }, [popupHasBeenSeen]);

  return (
    <AnnouncementContext.Provider value={{ isPopupVisible, showPopup, dismissPopup, popupHasBeenSeen }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncement = (): AnnouncementContextType => {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncement must be used within an AnnouncementProvider');
  }
  return context;
};
