import { useState } from 'react';  
import { Bus } from '@/types/busTypes';  
import { formData, TripData } from '@/types/tripData';  

const useTrip = () => {  
    const [points, setPoints] = useState<{ from: string; to: string; }>({ from: '', to: '' });  
    const [passengers, setPassengers] = useState<formData[]>([]);  
    const [tripData, setTripData] = useState<TripData | undefined | null>(undefined);  
    const [busInfo, setBusInfo] = useState<Bus | undefined>(undefined);  
 

    return {  
        points,  
        setPoints,  
        passengers,  
        setPassengers,  
        busInfo,  
        setBusInfo,  
        tripData,  
        setTripData,  
    };  
};  

export default useTrip;