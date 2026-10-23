import { LucideArmchair } from "lucide-react";
import { FaDoorOpen } from "react-icons/fa";
import { PiSteeringWheelFill } from "react-icons/pi";
import { cn } from "@/lib/utils";

interface Seat {
  label: string;
  available: boolean;
  position_x: string;
  position_y: number;
}

interface BusSeatsProps {
  selectedSeats: string[];
  toggleSeat: (label: string) => void;
  seats: Seat[];
}

const BusSeats = ({ selectedSeats, toggleSeat, seats }: BusSeatsProps) => {
  const layout = seats.some((s) => s.position_x === "6")
    ? 6
    : seats.some((s) => s.position_x === "5")
      ? 5
      : 4;

  const rowsCount = seats.length === 0 ? 0 : Math.ceil(seats.length / layout);

  const seatState = (seat: Seat | undefined) => {
    if (!seat || seat.label === "") return "empty" as const;
    const selected = selectedSeats.includes(seat.label);
    if (!seat.available) return "taken" as const;
    if (selected) return "selected" as const;
    return "available" as const;
  };

  const ariaLabelFor = (seat: Seat, state: ReturnType<typeof seatState>) => {
    if (state === "empty") return undefined;
    if (state === "taken") return `Kiti ${seat.label}, kimechukuliwa`;
    if (state === "selected") return `Kiti ${seat.label}, umechagua. Bofya tena kuondoa`;
    return `Kiti ${seat.label}, kinapatikana. Bofya kuchagua`;
  };

  return (
    <section className="bus-seats-shell" aria-label="Ramani ya viti vya basi">
      <div className="bus-seats-card">
        <h3 className="bus-seats-heading">Chagua kiti</h3>

        <div className="bus-seats-legend" aria-hidden>
          <div className="bus-seats-legend-item">
            <span className="bus-seats-legend-swatch bus-seats-legend-swatch--available">
              <LucideArmchair className="h-4 w-4" strokeWidth={2} aria-hidden />
            </span>
            <span>Kinapatikana</span>
          </div>
          <div className="bus-seats-legend-item">
            <span className="bus-seats-legend-swatch bus-seats-legend-swatch--selected border-green-400 bg-green-200">
              <LucideArmchair className="h-4 w-4 text-green-700" strokeWidth={2} aria-hidden />
            </span>
            <span>Umechagua</span>
          </div>
          <div className="bus-seats-legend-item">
            <span className="bus-seats-legend-swatch bus-seats-legend-swatch--taken">
              <LucideArmchair className="h-4 w-4" strokeWidth={2} aria-hidden />
            </span>
            <span>Kimechukuliwa</span>
          </div>
        </div>

        <div className="bus-seats-front">
          <div className="bus-seats-front-badge">
            <FaDoorOpen className="text-lg text-primary" aria-hidden />
            <span>Mlango</span>
          </div>
          <div className="bus-seats-driver" title="Dereva">
            <PiSteeringWheelFill className="text-2xl" aria-hidden />
          </div>
        </div>

        <div className="bus-seats-rows">
          {Array.from({ length: rowsCount }).map((_, rowIndex) => (
            <div key={rowIndex} className="bus-seats-row" role="group" aria-label={`Safu ${rowIndex + 1}`}>
              {Array.from({ length: layout }).map((_, seatIndex) => {
                const seat = seats[rowIndex * layout + seatIndex];
                const state = seatState(seat);

                if (state === "empty") {
                  return (
                    <div
                      key={`empty-${rowIndex}-${seatIndex}`}
                      className="bus-seat bus-seat--empty"
                      aria-hidden
                    />
                  );
                }

                const label = seat!.label;
                const commonIcon = (
                  <LucideArmchair
                    className={cn(
                      "bus-seat__icon rotate-180",
                      state === "taken" && "opacity-80"
                    )}
                    strokeWidth={2}
                    aria-hidden
                  />
                );

                if (state === "taken") {
                  return (
                    <button
                      key={label}
                      type="button"
                      disabled
                      className="bus-seat bus-seat--taken"
                      aria-label={ariaLabelFor(seat!, state)}
                    >
                      {commonIcon}
                      <span className="bus-seat__label extra-bold text-[0.8em]">{label}</span>
                    </button>
                  );
                }

                const isSelected = state === "selected";
                return (
                  <button
                    key={label}
                    type="button"
                    className={cn("bus-seat", isSelected ? "bus-seat--selected border-green-400 bg-green-200 text-green-600" : "bus-seat--available")}
                    aria-pressed={isSelected}
                    aria-label={ariaLabelFor(seat!, state)}
                    onClick={() => toggleSeat(label)}
                  >
                    {commonIcon}
                    <span className="bus-seat__label extra-bold text-[0.8em] text-green-900">{label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusSeats;
