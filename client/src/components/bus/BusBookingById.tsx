import React, { useEffect, useState } from 'react';  
import BusAccordion from './BusAccordion';  
// import ResponseError from '../error/ResponseError';  
import { TripProvider } from '@/context/TripContext';
import { useParams } from 'react-router-dom';
import { Bus } from '@/types/busTypes';
import LoadingRing from '../common/LoadingRing';

const BusBookingById: React.FC = () => {   
  const { id } = useParams();  

  const [bus, setBus] = useState<Bus | undefined>();  // Updated to a single bus object
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState<string | null>(null);


  // console.log("my bus: ", [bus]);

  useEffect(() => {  
    const fetchBuses = async () => {  
      try {  
        const response = await fetch(`${import.meta.env.VITE_API_KEY_BUSBYID}${id}`);
        if (!response.ok) {  
          throw new Error('Network response was not ok');  
        }  
        const data = await response.json();  
        setBus(data);  
      } catch (error: any) {  
        setError(error.message);  
      } finally {  
        setLoading(false);  
      }  
    };

    if (id) {  // Added a check to ensure id exists before making the API request
      fetchBuses();  
    }
  }, [id]);  // Added id to the dependency array to refetch data when id changes

  if (loading) {  
    return (  
      <div className="flex justify-center items-center">  
        <LoadingRing size={'lg'} /> 
      </div>  
    );  
  }  

  // if (error) {  
  //   return <ResponseError message={error}/>;  
  // }  

  return (  
    <TripProvider>
      <div className="relative py-7">  
        {bus ? (   
          <BusAccordion Bus={[bus]} loading={loading} />  
        ) : (  
          <p className='min-h-[20rem] w-full justify-center font-bold flex items-center'>
            Hakuna basi lililo patikanna kwa sasa! Jaribu Tena Baadae.
          </p>  
        )}
      </div>  
    </TripProvider>
  );  
};  

export default BusBookingById;
