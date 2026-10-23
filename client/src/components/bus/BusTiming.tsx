import React from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusTimingProps {
  departure: string;
  arrival: string;
}

function getSwahiliTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  let timeOfDay = "";
  if (hours >= 5 && hours < 12) {
    timeOfDay = "asubuhi";
  } else if (hours >= 12 && hours < 14) {
    timeOfDay = "mchana";
  } else if (hours >= 14 && hours < 19) {
    timeOfDay = "jioni";
  } else {
    timeOfDay = "usiku";
  }

  const swahiliHours = hours % 12 || 12;
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${swahiliHours}:${minutes.toString().padStart(2, "0")} ${amPm}`;

  return { time: formattedTime, timeOfDay };
}

function formatDurationMinutes(totalMin: number): string {
  if (totalMin <= 0) return "Dakika chache";
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0 && m > 0) return `${h} saa na ${m} dakika`;
  if (h > 0) return `${h} saa`;
  return `${m} dakika`;
}

const BusTiming: React.FC<BusTimingProps> = ({ departure, arrival }) => {
  const dateObjDeparture = new Date(departure);
  const dateObjArrival = new Date(arrival);

  const depValid = !Number.isNaN(dateObjDeparture.getTime());
  const arrValid = !Number.isNaN(dateObjArrival.getTime());

  const departureTime = depValid ? getSwahiliTime(dateObjDeparture) : null;
  const arrivalTime = arrValid ? getSwahiliTime(dateObjArrival) : null;

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = depValid
    ? dateObjDeparture.toLocaleString("sw-TZ", dateOptions)
    : "Tarehe haipatikani";

  const durationInMs = dateObjArrival.getTime() - dateObjDeparture.getTime();
  const durationValid =
    depValid && arrValid && Number.isFinite(durationInMs) && durationInMs >= 0;
  const durationString = durationValid
    ? formatDurationMinutes(Math.floor(durationInMs / 60000))
    : "—";

  const invalid = !depValid && !arrValid;

  return (
    <section
      className={cn("bus-timing", invalid && "bus-timing--invalid")}
      aria-label="Muda wa kuondoka na kufika"
    >
      <div className="bus-timing__grid">
        <div className="bus-timing__point bus-timing__point--depart">
          <p className="bus-timing__point-label">Kuondoka</p>
          <div className="bus-timing__time-wrap">
            {depValid && departureTime ? (
              <time
                className="bus-timing__time"
                dateTime={departure}
              >
                {departureTime.time}
              </time>
            ) : (
              <span className="bus-timing__time">—</span>
            )}
            {departureTime ? (
              <span className="bus-timing__period">
                ({departureTime.timeOfDay})
              </span>
            ) : null}
          </div>
        </div>

        <div className="bus-timing__bridge">
          <div className="bus-timing__track" aria-hidden>
            <span className="bus-timing__dot" />
            <span className="bus-timing__arrow">
              <ArrowRight aria-hidden />
            </span>
            <span className="bus-timing__pin">
              <MapPin aria-hidden />
            </span>
          </div>
          <p className="bus-timing__duration">
            {durationValid ? (
              <>
                <span className="sr-only">Muda wa safari: </span>
                {durationString}
              </>
            ) : (
              "Muda haujulikani"
            )}
          </p>
        </div>

        <div className="bus-timing__point bus-timing__point--arrive">
          <p className="bus-timing__point-label">Kufika</p>
          <div className="bus-timing__time-wrap">
            {arrValid && arrivalTime ? (
              <time className="bus-timing__time" dateTime={arrival}>
                {arrivalTime.time}
              </time>
            ) : (
              <span className="bus-timing__time">—</span>
            )}
            {arrivalTime ? (
              <span className="bus-timing__period">
                ({arrivalTime.timeOfDay})
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <p className="bus-timing__date-row">
        <span className="sr-only">Siku ya safari: </span>
        {formattedDate}
      </p>
    </section>
  );
};

export default BusTiming;
