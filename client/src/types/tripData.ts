
export interface PointLocations {
  from: string | undefined
  to: string | undefined
}

export interface Seats {  
  busId: string;  
  seats: string[];  
}

export interface formData {
        passenger_index: number;
        first_name: string;
        middle_name?: string;
        last_name: string;
        phone_number: string;
        seat_label: string;
        age_group: string;
        nationality: string;
        idType?: string | undefined;  
        idNumber?: string | undefined;
        passenger_gender: string;
        email?: string;
        position_x?: string;
        position_y?: string;
        points?: PointLocations;
}
      

export interface TripData { 
        reservation_request_id: string; 
        journey_id?: string;  
        passengers: formData[];  
        phone_number?: string;  
        bording_point_name: string | undefined;  
        dropoff_point_name: string | undefined;  
        price?: string;  
        app_sms: string; 
        agent_name?: string; 
        booking_type: string 
      }



