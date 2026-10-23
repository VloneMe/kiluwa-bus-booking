import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, BusFront, Loader2 } from "lucide-react";
import { PiSeatFill } from "react-icons/pi";

import { Container } from "../Container";
import { useBusRoutes } from "@/context/BusRoutesContext";
import { useSearch } from "@/context/SearchContext";
import type { Bus } from "@/types/busTypes";

function getSwahiliTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  let timeOfDay = "";
  if (hours >= 5 && hours < 12) timeOfDay = "asubuhi";
  else if (hours >= 12 && hours < 14) timeOfDay = "mchana";
  else if (hours >= 14 && hours < 19) timeOfDay = "jioni";
  else timeOfDay = "usiku";

  const swahiliHours = hours % 12 || 12;
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${swahiliHours}:${minutes.toString().padStart(2, "0")} ${amPm}`;

  return { time: formattedTime, timeOfDay };
}

function countAvailableSeats(bus: Bus) {
  return bus.seats.filter((seat) => seat.available && seat.label !== "").length;
}

function RoutesHero({ subtitle }: { subtitle?: string }) {
  return (
    <header className="bus-routes-hero">
      <p className="bus-routes-hero-badge">
        <BusFront className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Safari za leo
      </p>
      <h2 className="bus-routes-hero-title">Mabasi ya leo</h2>
      <div className="bus-routes-hero-lines" aria-hidden>
        <span className="bus-routes-hero-line" />
        <span className="bus-routes-hero-line" />
      </div>
      {subtitle ? <p className="bus-routes-hero-sub">{subtitle}</p> : null}
    </header>
  );
}

export const BusRoutes: React.FC = () => {
  const { buses, loading, error } = useBusRoutes();
  const { setSearchValues } = useSearch();

  if (loading) {
    return (
      <Container className="bus-routes-page px-3 md:px-4">
        <RoutesHero subtitle="Inapakia orodha ya safari zinazoendesha leo…" />
        <div
          className="bus-routes-state bus-routes-state--loading mx-auto max-w-md"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
          </span>
          <p className="text-sm font-semibold text-foreground">Inapakia mabasi…</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tafadhali subiri kidogo.
          </p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="bus-routes-page px-3 md:px-4">
        <RoutesHero />
        <div
          className="bus-routes-state bus-routes-state--error mx-auto max-w-md"
          role="alert"
        >
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/12 text-destructive">
            <AlertCircle className="h-6 w-6" aria-hidden />
          </span>
          <p className="text-sm font-semibold text-foreground">Imeshindwa kupakia mabasi</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {error}. Jaribu kuonyesha upya ukurasa baada ya muda mfupi.
          </p>
        </div>
      </Container>
    );
  }

  if (buses.length === 0) {
    return (
      <Container className="bus-routes-page px-3 md:px-4">
        <RoutesHero subtitle="Hakuna safari zilizopangwa kuonekana kwa sasa." />
        <div className="bus-routes-state bus-routes-state--empty mx-auto max-w-md" role="status">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-border">
            <BusFront className="h-6 w-6 opacity-80" strokeWidth={1.75} aria-hidden />
          </span>
          <p className="text-sm font-semibold text-foreground">Hakuna basi kwa sasa</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Rudi baadaye au tumia fomu ya utafutaji juu kuangalia tarehe nyingine.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="bus-routes-page px-3 md:px-4">
      <RoutesHero
        subtitle={`Orodha ya safari zinazoendesha leo — jumla ya ${buses.length}.`}
      />

      <div className="bus-routes-grid">
        {buses.map((route) => {
          const dateObjDeparture = new Date(route.departure);
          const dateObjArrival = new Date(route.arrival);
          const departureTime = getSwahiliTime(dateObjDeparture);
          const arrivalTime = getSwahiliTime(dateObjArrival);
          const available = countAvailableSeats(route);
          const tripDate = new Date(route.departure).toISOString().split("T")[0];
          const displayDate = dateObjDeparture.toLocaleDateString("en-GB").replace(/\//g, "-");

          return (
            <article key={route.journey_id} className="bus-routes-card">
              <div className="bus-routes-card-body">
                <div className="bus-routes-trip-row">
                  <div className="bus-routes-endpoint bus-routes-endpoint--from">
                    <span className="bus-routes-endpoint-label">Kutoka</span>
                    <span className="bus-routes-endpoint-name">{route.origin}</span>
                    <p className="bus-routes-endpoint-time">
                      {departureTime.time}
                      <span className="text-primary/80"> · {departureTime.timeOfDay}</span>
                    </p>
                  </div>

                  <div className="bus-routes-seats">
                    <div className="bus-routes-seats-pill" title="Viti vinavyopatikana">
                      <span>{available}</span>
                      <PiSeatFill className="h-4 w-4 shrink-0" aria-hidden />
                    </div>
                    <span className="bus-routes-seats-caption">Viti vilivyopo</span>
                  </div>

                  <div className="bus-routes-endpoint bus-routes-endpoint--to">
                    <span className="bus-routes-endpoint-label">Kwenda</span>
                    <span className="bus-routes-endpoint-name">{route.destination}</span>
                    <p className="bus-routes-endpoint-time">
                      {arrivalTime.time}
                      <span className="text-primary/80"> · {arrivalTime.timeOfDay}</span>
                    </p>
                  </div>
                </div>

                <p className="bus-routes-meta border-2 border-dashed border-primary/20 rounded-lg p-2">
                  <span>{displayDate}</span>
                  <span className="bus-routes-meta-sep">|</span>
                  <span>{route.class}</span>
                  <span className="bus-routes-meta-sep">|</span>
                  <span className="font-mono normal-case tracking-normal">{route.bus_plate_number}</span>
                </p>
              </div>

              <div className="bus-routes-card-footer">
                <div>
                  <span className="bus-routes-price-label">Bei</span>
                  <p className="bus-routes-price">
                    {new Intl.NumberFormat().format(Number(route.price))}.00{" "}
                    <span className="text-xs font-bold text-muted-foreground">Tshs</span>
                  </p>
                </div>
                <Link
                  to={`/booking/${route.journey_id}#buses`}
                  className="bus-routes-cta"
                  onClick={() =>
                    setSearchValues({
                      from: route.origin,
                      to: route.destination,
                      date: tripDate,
                    })
                  }
                >
                  Nunua tiketi
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </Container>
  );
};
