import { useState, useRef, useEffect } from 'react';
import { useTripContext } from '@/context/TripContext';
import { useAuth } from '@/context/AuthProvider';
import useUserProfile from '@/hooks/userDataHook';
import { UserProfile } from '@/types/UserTypes';
import { formData, PointLocations, TripData } from '@/types/tripData';
import { v4 as uuidv4 } from 'uuid';
import { Bus } from '@/types/busTypes';

export const mapProfileToFormData = (profile: UserProfile, seat_label: string, index: number): formData => {
    return {
        passenger_index: index,
        first_name: profile.first_name,
        middle_name: profile.middle_name ?? '',
        last_name: profile.last_name,
        phone_number: profile.mobile_number,
        passenger_gender: profile.gender,
        age_group: profile.age,
        nationality: profile.nationality,
        email: profile.email ?? '',
        idType: profile.identity_type ?? '',
        idNumber: profile.identity_number ?? '',
        seat_label: seat_label,
    };
};

const useBusBooking = (bus?: Bus) => {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [loading] = useState<boolean>(false);
    const [shadow, setShadow] = useState<boolean>(false);
    const [locations, setLocations] = useState<PointLocations | undefined>(undefined);
    const [bookingInProgress, setBookingInProgress] = useState<boolean>(false);

    const { user } = useAuth();
    const { profile } = useUserProfile(user);
    const { tripData, setTripData, busInfo, setBusInfo, passengers, setPassengers, points } = useTripContext();

    const busPickupDropoffRef = useRef<HTMLFormElement | null>(null);
    const formRefs = useRef<Record<string, HTMLFormElement | null>>({});

    const toggleSeat = (seat: string) => {
        setSelectedSeats((prev) => {
            if (prev.includes(seat)) {
                return prev.filter((s) => s !== seat);
            } else if (prev.length < 1) {
                return [...prev, seat];
            } else {
                handleErrors(['Lipia kiti kimoja kimoja kwa sasa!']);
                return prev;
            }
        });
    };

    const handleErrors = (errors: string[]) => {
        setErrorMessages(errors);
        setShow(false);
        setDialogOpen(true);
    };

    const clearErrors = () => {
        setErrorMessages([]);
        setDialogOpen(false);
    };

    const handleLocations = (data: PointLocations | undefined) => {
        setLocations(data);
    };

    const handlePassengerSubmit = (data: any) => {
        const boardingPoint = locations?.from || points?.from;
        const dropoffPoint = locations?.to || points?.to;

        setPassengers(data);

        const trip: TripData = {
            reservation_request_id: uuidv4(),
            journey_id: bus?.journey_id,
            passengers: data,
            phone_number: data[0].phone_number,
            bording_point_name: boardingPoint,
            dropoff_point_name: dropoffPoint,
            price: (Number(bus?.price) * selectedSeats.length).toString(),
            app_sms: "1",
            agent_name: "ONLINE",
            booking_type: "PENDING"
        };

        setTripData(undefined);
        setTripData(trip);
    };

    const handleCancelPassenger = (seat_label: string) => {
        setPassengers(prevPassengers =>
            prevPassengers.filter(passenger => passenger.seat_label !== seat_label)
        );
        setSelectedSeats(prev => prev.filter(seat => seat !== seat_label));
    };

    const handleBookingProcess = async () => {
        for (const seat of selectedSeats) {
            const formRef = formRefs.current[seat];
            if (formRef) {
                await new Promise<void>((resolve) => {
                    formRef.submit();
                    resolve();
                });
            }
        }

        if (bookingInProgress) {
            setShow(true);
            setBookingInProgress(false);
        }
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            handleErrors(['Lazima uchague angalau kiti kimoja ili kuendelea.']);
            return;
        }

        setBusInfo(bus);
        setBookingInProgress(true);

        if (busPickupDropoffRef.current) {
            busPickupDropoffRef.current.submit();
        }
    };

    useEffect(() => {
        if (locations && bookingInProgress) {
            handleBookingProcess();
        }
    }, [locations, bookingInProgress]);

    useEffect(() => {
        if (!dialogOpen) {
            clearErrors();
        }
    }, [dialogOpen]);

    return {
        profile,
        tripData,
        busInfo,
        passengers,
        selectedSeats,
        show,
        dialogOpen,
        errorMessages,
        loading,
        shadow,
        locations,
        bookingInProgress,
        busPickupDropoffRef,
        formRefs,
        toggleSeat,
        handleErrors,
        clearErrors,
        handleLocations,
        handlePassengerSubmit,
        handleCancelPassenger,
        handleBookingProcess,
        handleBooking,
        setShadow,
        setShow,
        setDialogOpen,
    };
};

export default useBusBooking;