import React, { createContext, useContext, ReactNode, useState } from 'react';  
import { Bus } from '@/types/busTypes';  
import { formData, PointLocations, TripData } from '@/types/tripData';  

// Define the Reservation interface  
interface Reservation {  
  status: string;  
  reservation_id: string;  
  payment_ref: string;  
  reservation_request_id: string | null;  
  reservation_url: string;  
  journey_id: string;  
  expires: string;  
  total_price: number;  
}  

interface TripContextType {  
  points: PointLocations | undefined;  
  setPoints: React.Dispatch<React.SetStateAction<PointLocations | undefined>>;  

  passengers: formData[] | null;  
  setPassengers: React.Dispatch<React.SetStateAction<formData[] | null>>;  

  busInfo: Bus | undefined;  
  setBusInfo: React.Dispatch<React.SetStateAction<Bus | undefined>>;  

  tripData: TripData | undefined;  
  setTripData: React.Dispatch<React.SetStateAction<TripData | undefined>>;  

  reservation: Reservation | undefined;  
  setReservation: React.Dispatch<React.SetStateAction<Reservation | undefined>>;  
}  

const TripContext = createContext<TripContextType | undefined>(undefined);  

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {  
  const [points, setPoints] = useState<PointLocations | undefined>(undefined);  
  const [passengers, setPassengers] = useState<formData[] | null>(null);  
  const [tripData, setTripData] = useState<TripData | undefined>(undefined);  
  const [busInfo, setBusInfo] = useState<Bus | undefined>(undefined);  
  const [reservation, setReservation] = useState<Reservation | undefined>(undefined);  

  return (  
    <TripContext.Provider  
      value={{  
        tripData,  
        setTripData,  
        busInfo,  
        setBusInfo,  
        points,  
        setPoints,  
        passengers,  
        setPassengers,  
        reservation,  
        setReservation,  
      }}  
    >  
      {children}  
    </TripContext.Provider>  
  );  
};  

export const useTripContext = () => {  
  const context = useContext(TripContext);  
  if (!context) {  
    throw new Error('useTripContext must be used within a TripProvider');  
  }  
  return context;  
};