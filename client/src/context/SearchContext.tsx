import { Bus } from '@/types/busTypes';  
import React, { createContext, useContext, useEffect, useState } from 'react';  

// Define the context type  
interface SearchContextType {  
  searchValues: {  
    from: string | undefined;  
    to: string | undefined;  
    date: string | undefined;  
  };  
  setSearchValues: React.Dispatch<React.SetStateAction<{ from: string | undefined; to: string | undefined; date: string | undefined }>>;  
  loading: boolean;  
  error: string | null;  
  buses: Bus[];  
}  

// Create context  
const SearchContext = createContext<SearchContextType | undefined>(undefined);  

// Provider for the context  
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
  // State to hold search values  
  const [searchValues, setSearchValues] = useState<{ from: string | undefined; to: string | undefined; date: string | undefined }>({  
    from: undefined,  
    to: undefined,  
    date: undefined,  
  });  

  // State to hold searched buses  
  const [buses, setBuses] = useState<Bus[]>([]);  
  const [loading, setLoading] = useState<boolean>(false);  
  const [error, setError] = useState<string | null>(null);  
  
  useEffect(() => {  
    const fetchBuses = async () => {  
      const { from, to, date } = searchValues;   
      
      console.log(`From context: ${from}, To: ${to}, Date: ${date}`)  

      if (!from || !to || !date) return; // Exit if search values are not valid  

      setLoading(true);  
      setError(null); // Clear previous errors  
      setBuses([]); // Reset buses state  

      try {  

        if (!from || !to || !date) {
          console.warn("Missing parameters: ", { from, to, date });
          return;
        }

        // Make the API call  
        const response = await fetch(`${import.meta.env.VITE_API_KEY_BUSES_SEARCHED}&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&departure=${encodeURIComponent(date)}`);

        // console.log([encodeURIComponent(from), encodeURIComponent(to), encodeURIComponent(date)])
  

        if (!response.ok) {  
          throw new Error('Network response was not ok');  
        }  

        const data: Bus[] = await response.json(); // Assuming the response is an array of Bus objects  
        
        // console.log("Buses: ", data)  

        // Handle no data scenario  
        if (!data || data.length === 0) {  
          setError('Hakuna Basi lililo patikana kwa sasa, Jaribu tena badae');  
        } else {
          setBuses(data);
        }
      } catch (error: unknown) {  
        // Enhance error handling to check for specific errors  
        if (error instanceof Error) {  
          setError(error.message);  
        } else {  
          setError('An unexpected error occurred.');  
        }  
      } finally {  
        setLoading(false);  
      }  
    };  

    fetchBuses();  
  }, [searchValues]);  

  return (  
    <SearchContext.Provider value={{ searchValues, setSearchValues, loading, error, buses }}>  
      {children}  
    </SearchContext.Provider>  
  );  
};  

// Custom hook to use the SearchContext  
export const useSearch = (): SearchContextType => {  
  const context = useContext(SearchContext);  
  if (!context) {  
    throw new Error('useSearch must be used within a SearchProvider');  
  }  
  return context;  
};