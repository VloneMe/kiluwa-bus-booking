import { useState } from "react";  
import { z } from "zod";  

export const useSeatSelection = (_initialSeats: string[]) => {  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);  
  const [seatInfo, setSeatInfo] = useState<{ [key: string]: any }>({});  
  const [error, setError] = useState<string | null>(null);  
  const [dialogOpen, setDialogOpen] = useState(false);  
  const [loading, setLoading] = useState(false);  

  const toggleSeat = (label: string) => {  
    setSelectedSeats((prev) =>  
      prev.includes(label) ? prev.filter((seat) => seat !== label) : [...prev, label]  
    );  
  };  

  const validateSeatData = (data: any) => {  
    const schema = z.object({  
      firstName: z.string().nonempty(),  
      lastName: z.string().nonempty(),  
      mobileNumber: z.string().nonempty(),  
      gender: z.enum(["male", "female"]),  
      type: z.enum(["adult", "child"]),  
      email: z.string().email(),  
      idType: z.string().nonempty(),  
      idNumber: z.string().nonempty(),  
    });  

    return schema.safeParse(data).success;  
  };  

  const getMissingFields = (data: any) => {  
    const requiredFields = [  
      "firstName",  
      "lastName",  
      "mobileNumber",  
      "gender",  
      "type",  
      "email",  
      "idType",  
      "idNumber",  
    ];  

    return requiredFields.filter(  
      (field) => !data || (typeof data[field] === "undefined" || data[field] === "")  
    );  
  };  

  const handleSeatDataReady = (seat: string, data: any) => {  
    setSeatInfo((prev) => ({  
      ...prev,  
      [seat]: data,  
    }));  
  };  

  const handleConfirmBooking = async () => {  
    if (selectedSeats.length === 0) {  
      setError("Please select at least one seat.");  
      setDialogOpen(true);  
      return;  
    }  

    let validationErrors: string[] = [];  
    for (const seat of selectedSeats) {  
      const seatData = seatInfo[seat];  
      const missingFields = getMissingFields(seatData);  
      if (missingFields.length > 0) {  
        validationErrors.push(  
          `Seat ${seat}: Please fill in the following fields: ${missingFields.join(", ")}.`  
        );  
      }  
    }  

    if (validationErrors.length > 0) {  
      setError(validationErrors.join(" "));  
      setDialogOpen(true);  
      return;  
    }  

    setError(null);  
    setLoading(true); // Set loading state to true  

    // Prepare data for the POST request  
    const bookingData = selectedSeats.map(seat => ({  
      seat,  
      ...seatInfo[seat],  
    }));  

    try {  
      const response = await fetch('/api/bookings', { // Update with your actual API endpoint  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({ bookings: bookingData }),  
      });  

      if (!response.ok) {  
        const errorData = await response.json();  
        setError(`Error: ${errorData.message || 'Failed to book seats.'}`);  
        setDialogOpen(true);  
      } else {  
        // Handle successful booking  
        alert('Booking confirmed!');  
      }  
    } catch (error: any) {  
      setError(`Unexpected error: ${error.message}`);  
      setDialogOpen(true);  
    } finally {  
      setLoading(false); // Reset loading state  
    }  
  };  

  const handleCancel = (seat: string) => {  
    setSelectedSeats((prev) => prev.filter((selectedSeat) => selectedSeat !== seat));  
    setSeatInfo((prev) => {  
      const newSeatInfo = { ...prev };  
      delete newSeatInfo[seat];  
      return newSeatInfo;  
    });  
  };  

  return {  
    selectedSeats,
    setSelectedSeats, 
    seatInfo,  
    error,  
    dialogOpen,  
    loading,  
    setDialogOpen,  
    toggleSeat,  
    handleSeatDataReady,  
    handleConfirmBooking,  
    handleCancel,  
  };  
};