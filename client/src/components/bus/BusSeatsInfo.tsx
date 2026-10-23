import { PiSeatFill } from "react-icons/pi";
import { AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface Seat {
  label?: string;
  available: boolean;
}

interface BusSeatInfoProps {
  busId?: string;
  seats: Seat[];
  price: string;
  shadow: boolean;
  setShadow?: () => void;
  onClick?: () => void;
}

export function BusSeatInfo({
  seats,
  price,
  shadow,
  setShadow,
  onClick,
  busId,
}: BusSeatInfoProps) {
  const availableSeatsCount = seats.filter(
    (seat) => seat.available && seat.label !== ""
  ).length;

  const numericPrice = Number(price);
  const formattedPrice = Number.isFinite(numericPrice)
    ? new Intl.NumberFormat("sw-TZ").format(numericPrice)
    : price;

  const isFull = availableSeatsCount === 0;
  const isScarce = availableSeatsCount > 0 && availableSeatsCount <= 3;

  const hint = isFull
    ? "Viti vyote vimechukuliwa — bado unaweza kuona ramani ya basi."
    : isScarce
      ? "Viti vichache vimesalia — chagua haraka."
      : "Bei kwa kiti kimoja. Bofya ili kuona na kuchagua viti.";

  return (
    <div
      className={cn(
        "bus-seat-info",
        isScarce && "bus-seat-info--scarce",
        isFull && "bus-seat-info--full"
      )}
      aria-label="Bei na viti vilivyobakia"
    >
      <div className="bus-seat-info__row block">
        <div
          className="bus-seat-info__badge"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="bus-seat-info__count">
            <span>{availableSeatsCount}</span>
            <PiSeatFill aria-hidden="true" />
          </span>
          <p className="bus-seat-info__stat-label">Viti vilivyobakia</p>
        </div>
        <p className="bus-seat-info__hint border-l-2 border-primary/90 pl-2">{hint}</p>
      </div>

      <div className="bus-seat-info__actions">
        <div className="bus-seat-info__price-wrap">
          <span className="bus-seat-info__price-label">Bei kwa kiti</span>
          <span className="bus-seat-info__price">
            {formattedPrice}
            <span className="bus-seat-info__price-unit">TSh</span>
          </span>
        </div>

        <AccordionTrigger
          hidearrow
          data-bus-id={busId}
          className={cn(
            "bus-seat-info__cta",
            "no-underline py-2! justify-center md:w-auto! md:max-w-none md:flex-none",
            "[&[data-state=open]>svg]:hidden"
          )}
          onClick={() => {
            setShadow?.();
            onClick?.();
          }}
        >
          {shadow ? "Funga ramani" : "Tazama viti"}
        </AccordionTrigger>
      </div>
    </div>
  );
}
