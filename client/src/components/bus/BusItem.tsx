import React, { useRef, useState } from 'react';
import { AccordionContent, AccordionItem } from '../ui/accordion';
import BusInfo from './BookingDetails';
import BusTiming from './BusTiming';
import { BusSeatInfo } from './BusSeatsInfo';
import BusSeats from './BusSeats';
import BusPickupDropoffPoint from './PickupDropoff';
import { BusSeatsForm } from './BusSeatsForm';
import { Button } from '../ui/button';
import { Bus } from '@/types/busTypes';
import { formData } from '@/types/tripData';

export interface BusItemProps {
  idx: string;
  bus: Bus;
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
  selectedSeats: string[];
  toggleSeat: (seat: string) => void;
  busPickupDropoffRef: React.RefObject<HTMLFormElement>;
  formRefs: React.MutableRefObject<Record<string, HTMLFormElement | null>>;
  searchValues: { from: string | undefined; to: string | undefined };
  handleLocations: (data: any) => void;
  handleErrors: (errors: string[]) => void;
  profile: any;
  mapProfileToFormData: (profile: any, seat: string, idx: number) => any;
  handlePassengerSubmit: (data: any, seat: string) => void;
  handleCancelPassenger: (seat: string) => void;
  passengers: formData[] | null;
  handleBooking: () => Promise<void>;
  loading?: boolean;
  error: string[];
  onBusSelect?: (bus: Bus) => void;
}

export const BusItem: React.FC<BusItemProps> = ({
  idx,
  bus,
  activeItem,
  setActiveItem,
  selectedSeats,
  toggleSeat,
  busPickupDropoffRef,
  formRefs,
  searchValues,
  handleLocations,
  handleErrors,
  profile,
  mapProfileToFormData,
  handlePassengerSubmit,
  handleCancelPassenger,
  passengers,
  handleBooking,
  loading,
  error,
  onBusSelect,
}) => {
  const accordionRef = useRef<HTMLDivElement>(null);
  const [shadow, setShadow] = useState<boolean>(false);

  const handleAccordionClick = () => {
    const newActiveItem = activeItem === `item-${idx}` ? null : `item-${idx}`;
    setActiveItem(newActiveItem);
    if (newActiveItem && onBusSelect) {
      onBusSelect(bus);
    }
  };

  // Handle button click: toggle shadow and scroll into view
  const handleButtonClick = () => {
    setShadow((prev) => !prev); // Toggle the shadow state
    if (accordionRef.current) {
      accordionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll into view
    }
  };

  return (
    <AccordionItem
      id={idx}
      value={`item-${bus.journey_id}`}
      className="bus-item-surface group mb-6 h-full overflow-hidden border-b-0 p-3 ring-1 ring-black/[0.04] last:mb-0 data-[state=open]:ring-2 data-[state=open]:ring-primary/25"
      onClick={handleAccordionClick}
      aria-expanded={activeItem === `item-${idx}`}
      ref={accordionRef} // Apply the ref here
    >
      <div
        className={`grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6 ${shadow ? "border-b border-dashed border-primary/40 pb-6" : ""}`}
      >
        <BusInfo
          company={bus.company}
          tripName={bus.trip_name}
          busPlateNumber={bus.bus_plate_number}
          busClass={bus.class}
          brandName={bus.brand_name}
          origin={bus.origin}
          destination={bus.destination}
          amenities={bus.amenities}
        />

        <BusTiming
          departure={bus.departure ?? ""}
          arrival={bus.arrival}
        />

        <BusSeatInfo
          busId={idx}
          price={bus.price}
          seats={bus.seats}
          shadow={shadow}
          setShadow={handleButtonClick} // Pass the combined handler here
        />
      </div>

      <AccordionContent className="grid h-full w-full grid-cols-1 gap-8 border-t border-primary/10 pt-6 md:gap-6 md:pt-5 lg:grid-cols-3 lg:gap-10 lg:pt-6 [&[data-state=open]]:animate-in">
        <div className="w-full min-w-0">
          <BusSeats
            selectedSeats={selectedSeats}
            toggleSeat={toggleSeat}
            seats={bus.seats}
          />
        </div>

        <div className="bus-passenger-panel relative flex w-full min-w-0 flex-col space-y-5 shadow-inner lg:col-span-2 md:p-5">
          <BusPickupDropoffPoint
            ref={busPickupDropoffRef}
            kupandia={searchValues.from}
            kushukia={searchValues.to}
            PickUpPoints={bus.pickup_up_points}
            DropOffPoints={bus.drop_off_points}
            onSubmit={handleLocations}
            onError={handleErrors}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-primary/15 px-3 py-3 tracking-wide md:px-4 md:text-lg">
            <h3 className="font-semibold text-foreground">Maelezo ya Kiti</h3>
            <p className="font-medium text-primary">
              {new Intl.NumberFormat().format(Number(bus.price))}.00 Tshs / Kiti
            </p>
          </div>

          {selectedSeats.length > 0 &&
            selectedSeats.map((seat: string, idx: number) => (
              <BusSeatsForm
                key={seat}
                ref={(el) => {
                  formRefs.current[seat] = el as HTMLFormElement | null;
                }}
                seat_label={seat}
                existingPassenger={
                  idx === 0 && profile ? mapProfileToFormData(profile, seat, idx) : undefined
                }
                onDataReady={async (data: any) => await handlePassengerSubmit(data, seat)}
                onError={handleErrors}
                onCancel={() => handleCancelPassenger(seat)}
                passengers={passengers}
              />
            ))}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-primary/25 px-3 py-4 text-base font-bold tracking-wide text-foreground md:text-xl">
            <p>
              Jumla:{" "}
              <span className="font-semibold text-primary">
                {selectedSeats.length} viti
              </span>
            </p>
            <p className="tabular-nums">
              {selectedSeats.length > 0
                ? (Number(bus.price) * selectedSeats.length).toFixed(2)
                : "0.00"}{" "}
              Tshs
            </p>
          </div>

          <Button
            type="button"
            onClick={handleBooking}
            className="mt-2 w-full rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:w-auto sm:min-w-[12rem] sm:px-10"
            disabled={loading && !error}
          >
            {loading && !error ? "Inashughulikia..." : "Endelea"}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};