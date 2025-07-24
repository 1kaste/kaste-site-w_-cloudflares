import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  addNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// This is the public provider that will wrap the application.
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };
  
  const addNotification = useCallback((message: string, type: NotificationType) => {
    const id = new Date().getTime();
    setNotifications((prevNotifications) => [...prevNotifications, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);


  const icons: Record<NotificationType, React.ElementType> = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
  };
  
  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div aria-live="assertive" className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[200] gap-3">
        {notifications.map((notification) => {
          const Icon = icons[notification.type];
          return (
            <div
              key={notification.id}
              className="max-w-md w-full bg-brand-surface shadow-2xl rounded-lg pointer-events-auto ring-1 ring-white/10 overflow-hidden animate-toast-in-right border border-brand-primary/20"
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <Icon className={`h-6 w-6 ${notification.type === 'success' ? 'text-green-400' : notification.type === 'error' ? 'text-red-400' : 'text-blue-400'}`} aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-base font-medium text-brand-light">{notification.message}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                        type="button"
                        className="rounded-md inline-flex text-brand-gray hover:text-brand-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-secondary"
                        onClick={() => removeNotification(notification.id)}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
