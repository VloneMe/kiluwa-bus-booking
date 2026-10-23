// Define your interfaces  
export interface UserProfileResponse {  
        success: boolean;  
        user_profile: UserProfile;  
}  

export interface UserProfile {  
        user_id: string;  
        first_name: string;  
        middle_name: string | null;  
        last_name: string;  
        nationality: string;  
        gender: string;  
        age: string;  
        identity_type: string;  
        identity_number: string;  
        mobile_number: string;  
        email: string;  
        tickets: TicketType[];  
}  

export interface TicketType {  
        Ticket_id: string;  
        name: string;  
        pickup_trip_location: string;  
        drop_trip_location: string;  
        reg_no: string;  
        price: number;  
        seat_numbers: string;  
        date: string;  
} 