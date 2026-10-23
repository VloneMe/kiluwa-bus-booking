import React, { createContext, useContext, useEffect, useState } from 'react';  
import { useSearch } from './SearchContext';  

interface Bus {  
  trip_name: string;  
  bus_plate_number: string;  
  class: string;  
  brand_name: string;  
  departure: string;  
  arrival: string;  
  id: string;  
  company: string;  
  tripName: string;  
  busPlateNumber: string;  
  busClass: string;  
  brandName: string;  
  pickup_up_points: { name: string }[];  
  drop_off_points: { name: string }[];  
  via: string;  
  price: string;  
  seats: { label: string; position_x: string; position_y: number; available: boolean }[];  
  amenities: string[];  
  origin: string;  
  destination: string;  
}  

interface BusContextType {  
  buses: Bus[];  
  loading: boolean;  
  error: string | null;  
}  

const BusContext = createContext<BusContextType | undefined>(undefined);  

export const BusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
  const [buses, setBuses] = useState<Bus[]>([]);  
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string | null>(null);  
  const { searchValues } = useSearch();   

  const searchAPI = import.meta.env.BUSES_SEARCH_API; // Ensure this is a valid URL  

  useEffect(() => {  
    const fetchBuses = async () => {  
      const { from, to, date } = searchValues;   

      // Set initial loading and clear previous data  
      setBuses([]);  
      setError(null);  
    
      try {  
        // Validate and format date if provided  
        const formattedDate = date ? new Date(date).toISOString().split('T')[0] : ''; // Keep only the date part  

        // Construct query parameters for the API request  
        const queryParams = new URLSearchParams();  
        if (from) queryParams.append('origin', from);  
        if (to) queryParams.append('destination', to);  
        if (formattedDate) queryParams.append('departure', formattedDate);  // Only add the date if it's valid  

        // Make the API call with the constructed query parameters  
        const response = await fetch(`${searchAPI}?${queryParams.toString()}`);  
        
        if (!response.ok) {  
          throw new Error('Network response was not ok');  
        }  

        const data = await response.json();  
        
        // Optionally handle no data scenario  
        if (!data || data.length === 0) {  
          setError('No buses found for the selected criteria.');  
        } else {  
          setBuses(data);  
        }  
      } catch (error: any) {  
        setError(error.message);  
      } finally {  
        setLoading(false);  
      }  
    };  

    // Check if search values are valid before fetching  
    if (searchValues.from && searchValues.to && searchValues.date) { // Ensure date exists  
      fetchBuses();  
    }  
  }, [searchValues]); // Refetch when searchValues change  

  return (  
    <BusContext.Provider value={{ buses, loading, error }}>  
      {children}  
    </BusContext.Provider>  
  );  
};  

export const useBus = (): BusContextType => {  
  const context = useContext(BusContext);  
  if (!context) {  
    throw new Error('useBus must be used within a BusProvider');  
  }  
  return context;  
};