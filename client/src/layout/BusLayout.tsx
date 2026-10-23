import { BusSearchForm } from "@/components/bus/BusSearchForm";
import { Container } from "@/components/Container";
import { useSearch } from "@/context/SearchContext";
import {
  bookingTripFromPathname,
  weekdayNameSwFromIso,
} from "@/lib/date";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";

export const BusLayout = () => {
  const { searchValues, setSearchValues } = useSearch();
  const location = useLocation();
  const { date: paramDate } = useParams<{ date?: string }>();

  const tripFromUrl = useMemo(
    () => bookingTripFromPathname(location.pathname),
    [location.pathname],
  );

  const headerDate = useMemo(() => {
    const qDate = new URLSearchParams(location.search).get("date");
    return (
      tripFromUrl.date ?? paramDate ?? qDate ?? searchValues.date ?? ""
    );
  }, [
    tripFromUrl.date,
    location.search,
    paramDate,
    searchValues.date,
  ]);

  const displayFrom = tripFromUrl.from ?? searchValues.from ?? "";
  const displayTo = tripFromUrl.to ?? searchValues.to ?? "";
  const weekdayLabel = headerDate ? weekdayNameSwFromIso(headerDate) : "";
  const hasRoute = Boolean(displayFrom && displayTo);
  const hasDate = Boolean(headerDate);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const section = document.querySelector(hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

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

  return (
    <Container className="bus-booking-flow bus-booking-flow--mobile-comfort pt-36">
      <BusSearchForm />

      <section
        id="buses"
        className="bus-booking-trip-summary-wrap mt-6 md:mt-8"
        aria-label="Muhtasari wa utafutaji wa safari"
      >
        <div className="bus-booking-trip-summary overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-white via-white to-primary/[0.06] shadow-lg shadow-primary/10 ring-1 ring-black/[0.03]">
          <div className="border-b border-primary/10 bg-primary/[0.07] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-primary">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              <span>Maelezo ya safari yako</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              Angalia haraka sehemu unayosafiri, siku, na tarehe kabla ya kuchagua kiti.
            </p>
          </div>

          <div className="grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-primary/10">
            {/* Route */}
            <div className="flex flex-col gap-3 p-4 sm:p-5">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Njia / Safari
              </span>
              {hasRoute ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-base font-semibold leading-snug text-foreground sm:text-lg">
                    <span className="max-w-[min(100%,14rem)] truncate rounded-lg bg-primary/8 px-2.5 py-1 text-primary">
                      {displayFrom}
                    </span>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-secondary"
                      strokeWidth={2.25}
                      aria-hidden
                    />
                    <span className="max-w-[min(100%,14rem)] truncate rounded-lg bg-secondary/10 px-2.5 py-1 text-secondary">
                      {displayTo}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  Chagua mahali pa kupanda na kushuka kwenye fomu hapo juu.
                </p>
              )}
            </div>

            {/* Weekday */}
            <div className="flex flex-col gap-2 border-t border-primary/10 p-4 sm:border-t-0 sm:p-5">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Siku
              </span>
              {hasDate && weekdayLabel ? (
                <p className="text-xl font-bold capitalize tracking-tight text-primary sm:text-2xl">
                  {weekdayLabel}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>

            {/* ISO date */}
            <div className="flex flex-col gap-2 border-t border-primary/10 p-4 sm:border-t-0 sm:p-5">
              <span className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                Tarehe
              </span>
              {hasDate ? (
                <time
                  dateTime={headerDate}
                  className="font-mono text-base font-semibold tabular-nums tracking-wide text-foreground sm:text-lg"
                >
                  {headerDate}
                </time>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mt-6 w-full min-w-0 md:mt-8">
        <Outlet />
      </main>
    </Container>
  );
};
