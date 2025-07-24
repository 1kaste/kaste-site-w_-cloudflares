
import React, { createContext, useContext, ReactNode, useCallback } from 'react';

// Define a default no-op function to satisfy the type.
const noOp = async () => { console.warn("AppContext.refreshApp was called without a provider."); };

interface AppContextType {
  refreshApp: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({ refreshApp: noOp });

export const AppContextProvider = AppContext.Provider;

export const useAppContext = (): AppContextType => {
  return useContext(AppContext);
};
