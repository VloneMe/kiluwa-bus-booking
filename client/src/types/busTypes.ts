export interface Seat { 
        label: string; 
        position_x: string, 
        position_y: number, 
        available: boolean 
}

export interface Bus {
        toLowerCase(): unknown;
        trip_name: string;
        bus_plate_number: string;
        class: string;
        brand_name: string;
        departure: string;
        arrival: string;  
        journey_id: string;  
        company: string;  
        tripName: string;  
        busPlateNumber: string;  
        busClass: string;  
        brandName: string; 
        orirgin_search_tokens: string;  
        destination_search_tokens: string; 
        pickup_up_points: { name: string }[];  
        drop_off_points: { name: string }[];
        via: string;  
        price: string;  
        seats: Seat[];
        amenities: string[];  
        origin: string;  
        destination: string;  
}  

export interface BusAccordionProps {  
        Bus: Bus[];
        loading?: boolean;
}

export interface TicketData {
        pickup_trip_location: string;
        drop_trip_location: string;
        passenger_name: string;
        tkt_passenger_id_no: string;
        trip_id_no: string;
        id_no: string;
        booking_date: string;
        booking_time: string;
        trip_route_id: string;
        trip_route_name: string;
        request_facilities: string;
        fleet_id: string;
        price: number;
        LATRA_levy: string;
        total_seat: string;
        discount: string;
        seat_numbers: string;
        agent_id: string | null;
        assign_date: string;
        date: string | null;
        adult: string;
        child: string;
        special: string;
        booking_type: string;
        tra_vfd: string | null;
        owner: string;
        reg_no: string;
        phone: string;
        company_no: string;
        qr_image_link: string;
      }
      