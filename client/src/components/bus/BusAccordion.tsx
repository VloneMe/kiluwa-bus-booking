import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, BusFront, ChevronRight, Info, Loader2 } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Modal } from "../common/Modal";
import { useTripContext } from "@/context/TripContext";
import { formData, PointLocations, TripData } from "@/types/tripData";
import { Bus, BusAccordionProps } from "@/types/busTypes";
import TripDetails from "./TripDetails";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "../ui/separator";
import { useLocation } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import useUserProfile from "@/hooks/userDataHook";
import { useAuth } from "@/context/AuthProvider";
import { UserProfile } from "@/types/UserTypes";
import { BusItem } from "./BusItem";

const mapProfileToFormData = (profile: UserProfile, seat_label: string, index: number): formData => ({
    passenger_index: index,
    first_name: profile.first_name,
    middle_name: profile.middle_name ?? "",
    last_name: profile.last_name,
    phone_number: profile.mobile_number,
    passenger_gender: profile.gender,
    age_group: profile.age,
    nationality: profile.nationality,
    email: profile.email ?? "",
    idType: profile.identity_type ?? "",
    idNumber: profile.identity_number ?? "",
    seat_label: seat_label,
});

interface Seats {
    busId: string;
    seats: string[];
}

const BOOKING_STEPS: { title: string; hint: string }[] = [
    { title: "Chagua basi", hint: "Fungua kadi ya safari unayopenda." },
    { title: "Chagua kiti", hint: "Bofya kiti tupu kwenye ramani." },
    { title: "Sehemu & abiria", hint: "Thibitisha kupanda/kushuka na maelezo." },
    { title: "Thibitisha", hint: "Bofya Endelea kuona muhtasari." },
];

const BusAccordion: React.FC<BusAccordionProps> = ({ Bus, loading }) => {
    const [selectedSeats, setSelectedSeats] = useState<Seats[]>([]);
    const { user } = useAuth();
    const { profile } = useUserProfile(user);
    const [show, setShow] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [locations, setLocations] = useState<PointLocations | undefined>(undefined);
    const [bookingInProgress, setBookingInProgress] = useState<boolean>(false);
    const [activeItem, setActiveItem] = useState<string | null>(null);

    const {
        tripData, setTripData, busInfo,
        setBusInfo, passengers,
        setPassengers, points
    } = useTripContext();

    const busPickupDropoffRef = useRef<HTMLFormElement | null>(null);
    const formRefs = useRef<Record<string, HTMLFormElement | null>>({});
    const { searchValues, setSearchValues } = useSearch();
    const location = useLocation();

    const hasResults = Boolean(Bus?.length);
    const totalSelected = selectedSeats.reduce((n, b) => n + b.seats.length, 0);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const qFrom = queryParams.get("from");
        const qTo = queryParams.get("to");
        const qDate = queryParams.get("date");

        if (qFrom || qTo || qDate) {
            setSearchValues((prev) => ({
                ...prev,
                ...(qFrom ? { from: qFrom } : {}),
                ...(qTo ? { to: qTo } : {}),
                ...(qDate ? { date: qDate } : {}),
            }));
        }
    }, [location.search, setSearchValues]);

    const toggleSeat = (busId: string, seat: string) => {
        setSelectedSeats((prev) => {
            const totalSelectedSeats = prev.reduce((total, busSeats) => total + busSeats.seats.length, 0);
            const existingBusSeats = prev.find(s => s.busId === busId);

            if (existingBusSeats) {
                const isSeatSelected = existingBusSeats.seats.includes(seat);

                if (isSeatSelected) {
                    handleCancelPassenger(seat);
                    const updatedSeats = existingBusSeats.seats.filter(s => s !== seat);

                    if (updatedSeats.length === 0) {
                        return prev.filter(s => s.busId !== busId);
                    }

                    return prev.map(s =>
                        s.busId === busId
                            ? { ...s, seats: updatedSeats }
                            : s
                    );
                }

                if (totalSelectedSeats >= 1) {
                    handleErrors(["Lipia kiti kimoja kimoja kwa sasa!."]);
                    return prev;
                }

                return prev.map(s =>
                    s.busId === busId
                        ? { ...s, seats: [...s.seats, seat] }
                        : s
                );
            }

            if (totalSelectedSeats >= 1) {
                handleErrors(["Lipia kiti kimoja kimoja kwa sasa!."]);
                return prev;
            }

            return [...prev, { busId, seats: [seat] }];
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

    const handlePassengerSubmit = async (data: any) => {
        try {
            setBookingInProgress(true);

            const currentBusSeats = selectedSeats.find(s => s.busId === busInfo?.journey_id);

            if (!currentBusSeats) {
                handleErrors(["Chagua kiti ili kuendelea!."]);
                return;
            }

            const boardingPoint = locations?.from || points?.from;
            const dropoffPoint = locations?.to || points?.to;

            const filteredPassengers = data.filter((passenger: any) =>
                currentBusSeats.seats.includes(passenger.seat_label)
            );

            if (filteredPassengers.length === 0) {
                handleErrors(["No valid passengers found for the current bus."]);
                return;
            }

            setPassengers(null);
            setPassengers(filteredPassengers);

            const trip: TripData = {
                reservation_request_id: uuidv4(),
                journey_id: busInfo?.journey_id,
                passengers: filteredPassengers,
                phone_number: filteredPassengers[0].phone_number,
                bording_point_name: boardingPoint,
                dropoff_point_name: dropoffPoint,
                price: (Number(busInfo?.price) * currentBusSeats.seats.length).toString(),
                app_sms: "1",
                agent_name: "ONLINE",
                booking_type: "PENDING"
            };

            setTripData(trip);
        } catch {
            handleErrors(["An error occurred while processing your request."]);
        } finally {
            setBookingInProgress(false);
        }
    };

    const handleCancelPassenger = (seat_label: string) => {
        setPassengers(prevPassengers => {
            if (prevPassengers) {
                return prevPassengers.filter(passenger => passenger.seat_label !== seat_label);
            }
            return null;
        });

        setSelectedSeats(prev => prev.map(seat => ({
            busId: seat.busId,
            seats: seat.seats.filter(s => s !== seat_label)
        })));
    };

    const handleBookingProcess = async () => {
        for (const { seats } of selectedSeats) {
            for (const seat of seats) {
                const formRef = formRefs.current[seat];
                if (formRef) {
                    await new Promise<void>((resolve) => {
                        formRef.submit();
                        resolve();
                    });
                }
            }
        }

        if (bookingInProgress) {
            setShow(true);
            setBookingInProgress(false);
        }
    };

    const handleBusSelection = (bus: Bus) => {
        setBusInfo(bus);
    };

    const handleBooking = async () => {
        const hasSelectedSeats = selectedSeats.some(bus => bus.seats.length > 0);

        if (!hasSelectedSeats) {
            handleErrors(["Lazima uchague angalau kiti kimoja ili kuendelea."]);
            return;
        }

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

    const accordionStackClass =
        "space-y-4 rounded-xl border border-border/55 bg-[color-mix(in_oklch,var(--background)_92%,var(--muted))] ";

    const resultsSurfaceClass =
        "rounded-lg border border-primary/10 bg-linear-to-br from-primary/[0.06] via-card via-45% to-primary/[0.04] px-4 py-4 shadow-sm sm:px-5 sm:py-5";

    return (
        <div className="w-full space-y-5 rounded-xl">
            {hasResults && !loading ? (
                <div className={accordionStackClass}>
                    <section
                        className={resultsSurfaceClass}
                        aria-label="Muhtasari wa matokeo"
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 gap-3 sm:gap-4">
                                <span
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15"
                                    aria-hidden
                                >
                                    <BusFront className="h-5 w-5" strokeWidth={2} />
                                </span>
                                <div className="min-w-0 space-y-1">
                                    <p className="text-sm font-semibold tracking-tight text-foreground max-md:text-[0.95rem]">
                                        Matokeo ya utafutaji
                                    </p>
                                    <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm max-md:text-[0.85rem]">
                                        {Bus!.length === 1
                                            ? "Basi moja limepatikana. Fungua kadi kuona muda, bei na viti."
                                            : `Basi ${Bus!.length} zimepatikana. Chagua safari na jaza taarifa za abiria.`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/15 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
                                    <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                    Kiti kimoja kwa safari moja
                                </span>
                                {totalSelected > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                                        <ChevronRight
                                            className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                                            aria-hidden
                                        />
                                        Viti: {totalSelected}
                                    </span>
                                )}
                            </div>
                        </div>
                    </section>

                    <div>
                        <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground max-md:text-[0.72rem]">
                            Hatua za uhifadhi
                        </p>
                        <ol
                            className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4"
                            aria-label="Hatua za kuweka nafasi"
                        >
                            {BOOKING_STEPS.map((step, i) => (
                                <li
                                    key={step.title}
                                    className="rounded-md border border-primary/15 bg-card p-[0.55rem_0.65rem_0.6rem] text-xs leading-snug text-muted-foreground shadow-xs max-md:p-[0.65rem_0.75rem_0.7rem] max-md:text-[0.82rem]"
                                >
                                    <span className="mb-[0.3rem] inline-flex h-[1.4rem] w-[1.4rem] items-center justify-center rounded-full bg-primary/15 text-[0.65rem] font-bold text-primary max-md:h-[1.55rem] max-md:w-[1.55rem] max-md:text-[0.72rem]">
                                        {i + 1}
                                    </span>
                                    <p className="font-medium text-foreground max-md:text-[0.88rem]">
                                        {step.title}
                                    </p>
                                    <p className="mt-0.5 text-[0.65rem] leading-snug opacity-90 max-md:text-[0.72rem]">
                                        {step.hint}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <Accordion
                        type="single"
                        collapsible
                        onValueChange={setActiveItem}
                        className="w-full space-y-5"
                    >
                        {Bus!.map((bus) => (
                            <BusItem
                                idx={bus.journey_id}
                                key={bus.journey_id}
                                bus={bus}
                                activeItem={activeItem}
                                setActiveItem={setActiveItem}
                                selectedSeats={selectedSeats.find(s => s.busId === bus.journey_id)?.seats || []}
                                toggleSeat={(seat) => toggleSeat(bus.journey_id, seat)}
                                busPickupDropoffRef={busPickupDropoffRef}
                                formRefs={formRefs}
                                searchValues={searchValues}
                                handleLocations={handleLocations}
                                handleErrors={handleErrors}
                                profile={profile}
                                mapProfileToFormData={mapProfileToFormData}
                                handleCancelPassenger={handleCancelPassenger}
                                passengers={passengers}
                                handleBooking={handleBooking}
                                handlePassengerSubmit={handlePassengerSubmit}
                                loading={loading || bookingInProgress}
                                error={errorMessages}
                                onBusSelect={handleBusSelection}
                            />
                        ))}
                    </Accordion>
                </div>
            ) : (
                <Accordion
                    type="single"
                    collapsible
                    onValueChange={setActiveItem}
                    className="w-full space-y-5"
                >
                    {loading ? (
                        <div
                            className="flex flex-col items-center justify-center gap-5 rounded-xl border border-primary/15 bg-[color-mix(in_oklch,var(--card)_88%,var(--muted))] px-6 py-14 shadow-[inset_0_1px_0_color-mix(in_oklch,var(--foreground)_6%,transparent)] sm:py-16"
                            role="status"
                            aria-live="polite"
                            aria-busy="true"
                        >
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
                            </span>
                            <div className="w-full max-w-xs space-y-3">
                                <div className="space-y-1 text-center">
                                    <p className="text-sm font-semibold text-foreground max-md:text-[0.95rem]">
                                        Inatafuta basi…
                                    </p>
                                    <p className="text-xs text-muted-foreground sm:text-sm max-md:text-[0.85rem]">
                                        Tafadhali subiri kidogo tunapopakia matokeo.
                                    </p>
                                </div>
                                <div className="space-y-2.5 pt-1" aria-hidden>
                                    <div className="h-[0.55rem] w-[92%] animate-pulse rounded-full bg-muted/80" />
                                    <div className="h-[0.55rem] w-[76%] animate-pulse rounded-full bg-muted/80" />
                                    <div className="h-[0.55rem] w-[84%] animate-pulse rounded-full bg-muted/80" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-primary/30 bg-muted/55 px-5 py-12 text-center text-muted-foreground sm:px-8 sm:py-14"
                            role="status"
                        >
                            <span
                                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-border"
                                aria-hidden
                            >
                                <BusFront className="h-7 w-7 opacity-70" strokeWidth={1.75} />
                            </span>
                            <div className="max-w-md space-y-2">
                                <p className="text-sm font-semibold text-foreground max-md:text-[0.95rem]">
                                    Hakuna basi lililoonekana
                                </p>
                                <p className="text-xs leading-relaxed sm:text-sm max-md:text-[0.85rem]">
                                    Jaribu kubadilisha tarehe, sehemu ya kuanzia au sehemu ya kuishia, kisha tafuta
                                    tena kutoka sehemu ya juu ya ukurasa.
                                </p>
                            </div>
                        </div>
                    )}
                </Accordion>
            )}

            {show && !errorMessages.length && !dialogOpen && (
                <Modal
                    open={show}
                    onOpenChange={setShow}
                    className="transition-all duration-300 ease-in-out w-full lg:w-9/12 sm:mx-auto mx-auto h-fit overflow-hidden rounded-xl"
                >
                    <TripDetails tripData={tripData} busInfo={busInfo} />
                </Modal>
            )}

            <Modal
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                className="w-[min(100%,32rem)] sm:mx-auto h-fit overflow-hidden rounded-xl"
            >
                <DialogHeader className="flex flex-col gap-4 p-6 text-left sm:p-7">
                    <div className="flex gap-4">
                        <span
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/12 text-destructive ring-1 ring-destructive/20"
                            aria-hidden
                        >
                            <AlertTriangle className="h-5 w-5" strokeWidth={2} />
                        </span>
                        <div className="min-w-0 space-y-1">
                            <DialogTitle className="text-lg font-semibold leading-snug tracking-tight">
                                Taarifa au hitilafu
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground">
                                Rekebisha kisha jaribu tena.
                            </p>
                        </div>
                    </div>
                    <Separator />
                    <DialogDescription asChild>
                        <ul className="m-0 list-none space-y-2.5 p-0">
                            {errorMessages.map((msg, index) => (
                                <li
                                    key={index}
                                    className="rounded-md border border-destructive/45 bg-destructive/10 px-4 py-3 text-sm font-medium leading-snug text-destructive"
                                >
                                    {msg}
                                </li>
                            ))}
                        </ul>
                    </DialogDescription>
                </DialogHeader>
            </Modal>
        </div>
    );
};

export default BusAccordion;
