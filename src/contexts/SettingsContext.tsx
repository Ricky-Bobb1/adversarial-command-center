
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  useRealApi: boolean;
  setUseRealApi: (value: boolean) => void;
  apiEndpoint: string;
  setApiEndpoint: (value: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [useRealApi, setUseRealApi] = useState(() => {
    const saved = localStorage.getItem('use-real-api');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [apiEndpoint, setApiEndpoint] = useState(() => {
    return localStorage.getItem('api-endpoint') || 'http://localhost:8000';
  });

  useEffect(() => {
    localStorage.setItem('use-real-api', JSON.stringify(useRealApi));
  }, [useRealApi]);

  useEffect(() => {
    localStorage.setItem('api-endpoint', apiEndpoint);
  }, [apiEndpoint]);

  return (
    <SettingsContext.Provider value={{
      useRealApi,
      setUseRealApi,
      apiEndpoint,
      setApiEndpoint
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
