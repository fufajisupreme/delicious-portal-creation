
import React, { createContext, useState, useContext, useEffect } from 'react';

type CityContextType = {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
};

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    // Try to get the saved city from localStorage
    const saved = localStorage.getItem('selectedCity');
    return saved || 'All Cities';
  });

  // Save the selected city to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedCity', selectedCity);
  }, [selectedCity]);

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = (): CityContextType => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
