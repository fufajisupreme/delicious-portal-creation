
import React, { createContext, useContext, useState, useEffect } from 'react';

type CityContextType = {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  availableCities: string[];
};

const defaultCities = [
  "New York",
  "Los Angeles", 
  "Chicago", 
  "Houston", 
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "Austin"
];

const CityContext = createContext<CityContextType>({
  selectedCity: "New York",
  setSelectedCity: () => {},
  availableCities: defaultCities,
});

export const useCity = () => useContext(CityContext);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get saved city from localStorage, default to "New York"
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCity');
    return saved || "New York";
  });
  
  // Save to localStorage when city changes
  useEffect(() => {
    localStorage.setItem('selectedCity', selectedCity);
  }, [selectedCity]);

  return (
    <CityContext.Provider value={{
      selectedCity,
      setSelectedCity,
      availableCities: defaultCities,
    }}>
      {children}
    </CityContext.Provider>
  );
};
