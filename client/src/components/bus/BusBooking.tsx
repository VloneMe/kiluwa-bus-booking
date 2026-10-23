import React, { useEffect, useState } from "react";
import BusAccordion from "./BusAccordion";
import { useSearch } from "@/context/SearchContext";
import { useParams } from "react-router-dom";
import LoadingRing from "../common/LoadingRing";
import { TripProvider } from "@/context/TripContext";
import type { Bus } from "@/types/busTypes";
import { AlertCircle, BusFront, Search } from "lucide-react";

type RouteParams = {
  from?: string;
  to?: string;
  date?: string;
};

const BusBooking: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { setSearchValues, searchValues } = useSearch();
  const { from, to, date } = useParams<RouteParams>();

  useEffect(() => {
    if (from && to && date) {
      setSearchValues({ from, to, date });
    }
  }, [from, to, date, setSearchValues]);

  const searchReady = Boolean(
    searchValues.from && searchValues.to && searchValues.date,
  );

  useEffect(() => {
    if (!searchReady) {
      setLoading(false);
      setBuses([]);
      setFetchError(null);
      return;
    }

    let cancelled = false;

    const fetchBuses = async () => {
      setLoading(true);
      setFetchError(null);
      setBuses([]);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_KEY_BUSES_SEARCHED}&origin=${encodeURIComponent(searchValues.from ?? "")}&destination=${encodeURIComponent(searchValues.to ?? "")}&departure=${encodeURIComponent(searchValues.date ?? "")}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch buses");
        }
        const data: unknown = await response.json();
        if (cancelled) return;
        setBuses(Array.isArray(data) ? (data as Bus[]) : []);
      } catch (e) {
        console.error("Error fetching buses:", e);
        if (!cancelled) {
          setFetchError(
            "Imeshindikana kupata mabasi. Jaribu tena au angalia muunganisho.",
          );
          setBuses([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchBuses();
    return () => {
      cancelled = true;
    };
  }, [searchReady, searchValues.from, searchValues.to, searchValues.date]);

  const panelBase =
    "flex flex-col items-center text-center rounded-xl border border-border/50 p-[clamp(1.75rem,5vw,2.75rem)] px-[clamp(1.15rem,4vw,1.75rem)] shadow-sm";

  return (
    <TripProvider>
      <div className="w-full min-w-0 pb-[clamp(2.5rem,6vw,3rem)] pt-[0.35rem]">
        <section
          className="w-full min-w-0"
          aria-labelledby="booking-results-heading"
        >
          <header className="mb-[clamp(1.2rem,3vw,1.65rem)] flex flex-col gap-[0.85rem] border-b border-primary/12 pb-[1.1rem] sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2
                id="booking-results-heading"
                className="m-0 text-[clamp(1.28rem,3.2vw,1.7rem)] font-extrabold tracking-tight text-foreground leading-tight max-md:text-[clamp(1.45rem,4.5vw,1.75rem)]"
              >
                Mabasi yaliyopatikana
              </h2>
              <p className="mt-[0.4rem] mb-0 max-w-xl text-[0.92rem] leading-[1.55] text-muted-foreground max-md:text-base">
                Chagua basi, fungua kisha chagua kiti na maeneo ya kupanda /
                kushuka, halafu jaza maelezo ya abiria.
              </p>
            </div>
            {searchReady && !loading && !fetchError && (
              <p
                className="m-0 shrink-0 self-start rounded-full border border-primary/20 bg-primary/10 px-[0.9rem] py-[0.4rem] text-[0.88rem] font-extrabold text-primary max-md:px-4 max-md:py-[0.45rem] max-md:text-[0.95rem]"
                aria-live="polite"
              >
                Matokeo: {buses.length}{" "}
                {buses.length === 1 ? "basi" : "mabasi"}
              </p>
            )}
          </header>

          {!searchReady ? (
            <div
              className={`${panelBase} border-dashed border-primary/30 bg-linear-to-br from-primary/5 to-card`}
              role="status"
            >
              <Search
                className="size-[2.85rem] shrink-0 text-primary/70"
                strokeWidth={1.75}
                aria-hidden
              />
              <p className="m-0 mt-[0.85rem] text-[1.08rem] font-extrabold text-foreground max-md:mt-3.5 max-md:text-[1.15rem]">
                Tafuta safari kwanza
              </p>
              <p className="m-0 mt-2 max-w-md text-[0.88rem] font-semibold leading-[1.55] text-muted-foreground max-md:text-[0.95rem]">
                Tumia fomu hapo juu kuchagua mahali pa kupanda, kushuka, na
                tarehe ya safari.
              </p>
            </div>
          ) : loading ? (
            <div
              className={`${panelBase} min-h-40 justify-center gap-4 border-primary/15 bg-[color-mix(in_oklch,var(--card)_88%,var(--muted))]`}
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <LoadingRing size="sm" />
              <p className="m-0 text-[0.9rem] font-semibold text-muted-foreground max-md:text-[0.95rem]">
                Inapakia mabasi…
              </p>
            </div>
          ) : fetchError ? (
            <div
              className={`${panelBase} flex-row items-start gap-[0.85rem] border-destructive/35 bg-destructive/5 text-left`}
              role="alert"
            >
              <AlertCircle
                className="mt-0.5 size-[1.35rem] shrink-0 text-destructive"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="m-0 text-[1.08rem] font-extrabold text-destructive max-md:text-[1.15rem]">
                  {fetchError}
                </p>
                <p className="m-0 mt-2 max-w-md text-[0.88rem] font-semibold leading-[1.55] text-muted-foreground max-md:text-[0.95rem]">
                  Hakikisha una intaneti thabiti, kisha jaribu tena.
                </p>
              </div>
            </div>
          ) : buses.length === 0 ? (
            <div
              className={`${panelBase} border-primary/20 bg-linear-to-br from-card to-primary/6 shadow-md`}
              role="status"
            >
              <BusFront
                className="size-[3.25rem] shrink-0 text-primary/50"
                strokeWidth={1.25}
                aria-hidden
              />
              <p className="m-0 mt-[0.85rem] text-[1.08rem] font-extrabold text-foreground max-md:mt-3.5 max-md:text-[1.15rem]">
                Hakuna basi kwa sasa
              </p>
              <p className="m-0 mt-2 max-w-md text-[0.88rem] font-semibold leading-[1.55] text-muted-foreground max-md:text-[0.95rem]">
                Jaribu kubadilisha tarehe au maeneo, au angalia tena baada ya
                muda mfupi.
              </p>
            </div>
          ) : (
            <BusAccordion Bus={buses} loading={false} />
          )}
        </section>
      </div>
    </TripProvider>
  );
};

export default BusBooking;
