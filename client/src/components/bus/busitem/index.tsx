import React, { useState } from 'react';
import { Bus } from '@/types/busTypes';
import { formData } from '@/types/tripData';
import { AccordionItem } from '@/components/ui/accordion';
import BusInfo from '../BookingDetails';
import BusTiming from '../BusTiming';
import { BusSeatInfo } from '../BusSeatsInfo';
import { AccordionContent } from '@radix-ui/react-accordion';
import BusSeats from '../BusSeats';
import BusPickupDropoffPoint from '../PickupDropoff';
import { Modal } from '@/components/common/Modal';
import { BusSeatsForm } from '../BusSeatsForm';
import { Button } from 'react-day-picker';

export interface BusItemProps {
  idx: string;
  bus: Bus;
  item: number;
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
  shadow: boolean;
  setShadow: (shadow: boolean) => void;
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
  onBusSelect?: (bus: Bus) => void;
}

export const BusItem: React.FC<BusItemProps> = ({
  idx,
  bus,
  item,
  activeItem,
  setActiveItem,
  shadow,
  setShadow,
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
  onBusSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAccordionClick = () => {
    const newActiveItem = activeItem === `item-${item + 1}` ? null : `item-${item + 1}`;
    setActiveItem(newActiveItem);
    if (newActiveItem && onBusSelect) {
      onBusSelect(bus);
      setIsModalOpen(true); // Open the modal when the accordion is expanded
    }
  };

  return (
    <>
      <AccordionItem
        id={idx}
        value={bus.journey_id}
        className="border-2 border-primary/25 bg-gradient-to-r from-white to-primary/5 mb-8 h-full p-4 rounded-lg"
        onClick={handleAccordionClick}
      >
        <div className={`grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 ${shadow && "border-b border-primary border-dashed pb-5"}`}>
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
          <BusTiming departure={bus.departure ?? ""} arrival={bus.arrival} />
          <BusSeatInfo
            busId={idx}
            price={bus.price}
            seats={bus.seats}
            shadow={shadow}
            onClick={() => setShadow(!shadow)}
          />
        </div>

        <AccordionContent className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-16 md:gap-5 md:p-2 w-full h-full md:justify-between">
          <div className="w-full">
            <BusSeats
              selectedSeats={selectedSeats}
              toggleSeat={toggleSeat}
              seats={bus.seats}
            />
          </div>

          <div className="border rounded-xl lg:col-span-2 md:p-4 flex flex-col space-y-5 w-full relative">
            <BusPickupDropoffPoint
              ref={busPickupDropoffRef}
              kupandia={searchValues.from}
              kushukia={searchValues.to}
              PickUpPoints={bus.pickup_up_points}
              DropOffPoints={bus.drop_off_points}
              onSubmit={handleLocations}
              onError={handleErrors}
            />

            <div className="flex items-center md:p-4 p-2 justify-between bg-primary/20 tracking-wider md:text-lg rounded-xl">
              <h3 className="font-semibold">Maelezo ya Kiti</h3>
              <p>{new Intl.NumberFormat().format(Number(bus.price))}.00 Tshs / Kiti</p>
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

            <div className="flex md:p-4 p-2 items-center justify-between md:text-xl font-bold bg-primary/35 rounded-lg tracking-wider text-gray-900">
              <p>
                Jumla: <span className="text-gray-700">{selectedSeats.length} viti</span>
              </p>
              <p>
                {selectedSeats.length > 0
                  ? (Number(bus.price) * selectedSeats.length).toFixed(2)
                  : '0.00'}{' '}
                Tshs
              </p>
            </div>

            <Button
              type="button"
              onClick={handleBooking}
              className="bg-primary hover:bg-primary/80 text-white p-2 rounded mt-4"
              disabled={loading}
            >
              {loading ? 'Inashughulikia...' : 'Endelea'}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Move the Modal outside the AccordionItem */}
      <Modal  open={isModalOpen} 
              onOpenChange={setIsModalOpen}
              className='w-full p-10 pb-20 gap-0 grid lg:grid-cols-6 grid-cols-1 transition-all ease-in-out duration-300 lg:w-10/12 sm:mx-auto mx-auto h-fit'
      >
        <div className="w-fit col-span-2">
          <BusSeats
            selectedSeats={selectedSeats}
            toggleSeat={toggleSeat}
            seats={bus.seats}
          />
        </div>

        <div className="border rounded-xl lg:col-span-4 md:p-4 flex flex-col space-y-5 w-full relative col-span-4">
          <BusPickupDropoffPoint
            ref={busPickupDropoffRef}
            kupandia={searchValues.from}
            kushukia={searchValues.to}
            PickUpPoints={bus.pickup_up_points}
            DropOffPoints={bus.drop_off_points}
            onSubmit={handleLocations}
            onError={handleErrors}
          />

          <div className="flex items-center md:p-4 p-2 justify-between bg-primary/20 tracking-wider md:text-lg rounded-xl">
            <h3 className="font-semibold">Maelezo ya Kiti</h3>
            <p>{new Intl.NumberFormat().format(Number(bus.price))}.00 Tshs / Kiti</p>
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

          <div className="flex md:p-4 p-2 items-center justify-between md:text-xl font-bold bg-primary/35 rounded-lg tracking-wider text-gray-900">
            <p>
              Jumla: <span className="text-gray-700">{selectedSeats.length} viti</span>
            </p>
            <p>
              {selectedSeats.length > 0
                ? (Number(bus.price) * selectedSeats.length).toFixed(2)
                : '0.00'}{' '}
              Tshs
            </p>
          </div>

          <Button
            type="button"
            onClick={handleBooking}
            className="bg-primary hover:bg-primary/80 text-white p-2 rounded mt-4"
            disabled={loading}
          >
            {loading ? 'Inashughulikia...' : 'Endelea'}
          </Button>
        </div>
      </Modal>
    </>
  );
};