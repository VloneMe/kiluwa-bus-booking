// BusContext.tsx  
import { Bus } from '@/types/busTypes';
import React, { createContext, useContext, useEffect, useState } from 'react';  

  

interface BusContextType {  
  buses: Bus[];  
  loading: boolean;  
  error: string | null;  
}  

const BusRoutesContext = createContext<BusContextType | undefined>(undefined);  

export const BusRoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
  const [buses, setBuses] = useState<Bus[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {  
    const fetchBuses = async () => {  
      try {  
        const response = await fetch(`${import.meta.env.VITE_API_KEY_BUSROUTES_TODAY}`);
        if (!response.ok) {  
          throw new Error('Network response was not ok');  
        }  
        const data = await response.json();  
        setBuses(data);  
      } catch (error: any) {  
        setError(error.message);  
      } finally {  
        setLoading(false);
      }  
    };

    fetchBuses();  
  }, []);  

  return (  
    <BusRoutesContext.Provider value={{ buses, loading, error }}>  
      {children}  
    </BusRoutesContext.Provider>  
  );  
};  

export const useBusRoutes = (): BusContextType => {  
  const context = useContext(BusRoutesContext);  
  if (!context) {  
    throw new Error('useBus must be used within a BusProvider');  
  }  
  return context;  
};