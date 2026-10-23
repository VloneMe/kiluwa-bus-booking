import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BusFront, CreditCard, Loader2, Users } from "lucide-react";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Container } from "../Container";
import { Input } from "../ui/input";
import { formData, TripData } from "@/types/tripData";
import { useTripContext } from "@/context/TripContext";
import { Bus } from "@/types/busTypes";
import { cn } from "@/lib/utils";

interface TripProps {
  tripData: TripData | undefined;
  busInfo: Bus | undefined;
}

function formatTzs(amount: string | number | undefined): string {
  const n = Number(amount);
  if (Number.isNaN(n)) return "0";
  return `${new Intl.NumberFormat().format(n)}.00`;
}

function fullName(p: formData): string {
  const mid = p.middle_name?.trim();
  return [p.first_name, mid, p.last_name].filter(Boolean).join(" ");
}

function parseISODate(isoString: string): Date {
  return new Date(isoString);
}

const TripDetails = ({ tripData, busInfo }: TripProps) => {
  const [isAgreed, setIsAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [voucher, setVoucher] = useState("");
  const navigate = useNavigate();
  const { setReservation } = useTripContext();

  const handlePayment = async () => {
    if (!tripData) return;
    setPayError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY_passengerdata}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tripData),
        },
      );

      if (!response.ok) {
        throw new Error("Jibu la mtandao halikuwa sawa.");
      }

      const result = await response.json();
      setReservation(result);
      navigate(`/payments/${result.reservation_id}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Kosa lisilojulikana limetokea.";
      setPayError(`Malipo hayakuweza kukamilika: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!tripData) {
    return (
      <Container className="w-full max-w-full px-3 py-6">
        <div
          className="max-h-[min(90vh,52rem)] w-full overflow-x-hidden overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]"
          role="region"
          aria-label="Muhtasari wa safari"
        >
          <div className="bus-trip-loading" role="status" aria-live="polite">
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden
            />
            <p className="text-sm font-semibold text-foreground">
              Inapakia taarifa za safari…
            </p>
          </div>
        </div>
      </Container>
    );
  }

  const departure = busInfo?.departure ?? "";
  const tripDate =
    departure &&
    new Date(departure).toLocaleDateString("en-GB").replace(/\//g, "-");
  const tripTime =
    departure &&
    parseISODate(departure).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <Container className="w-full max-w-full px-2 py-3 sm:px-4 sm:py-4 md:px-5">
      <div
        className="max-h-[min(90vh,52rem)] w-full overflow-x-hidden overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]"
        role="region"
        aria-label="Muhtasari wa safari"
      >
        <div className="bus-trip-details">
          <header className="bus-trip-header">
            <div>
              <h2 id="trip-review-title" className="bus-trip-header-title">
                Hakiki taarifa zako
              </h2>
              <p className="bus-trip-header-sub">
                Angalia safari, abiria na kiasi kabla ya kuendelea na malipo.
                Bonyeza &quot;Endelea na malipo&quot; unapokuwa tayari.
              </p>
            </div>
            <span
              className="hidden shrink-0 rounded-lg bg-primary-foreground/15 p-2 sm:flex"
              aria-hidden
            >
              <BusFront
                className="h-7 w-7 text-primary-foreground"
                strokeWidth={2}
              />
            </span>
          </header>

          <div className="bus-trip-grid" aria-labelledby="trip-review-title">
            {/* Safari */}
            <section
              className="bus-trip-panel"
              aria-labelledby="trip-section-safari"
            >
              <h3 id="trip-section-safari" className="bus-trip-panel-head">
                <span className="inline-flex items-center gap-2">
                  <BusFront className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  Taarifa za safari
                </span>
              </h3>
              <div className="bus-trip-panel-body">
                <dl className="bus-trip-deflist">
                  <div className="bus-trip-row">
                    <dt>Jina la basi</dt>
                    <dd>{busInfo?.brand_name ?? "—"}</dd>
                  </div>
                  <div className="bus-trip-row">
                    <dt>Namba ya basi</dt>
                    <dd className="font-mono text-[0.78rem]">
                      {busInfo?.bus_plate_number ?? "—"}
                    </dd>
                  </div>
                  <div className="bus-trip-row">
                    <dt>Tarehe ya safari</dt>
                    <dd>{tripDate || "—"}</dd>
                  </div>
                  <div className="bus-trip-row">
                    <dt>Njia</dt>
                    <dd>
                      {busInfo?.origin ?? "—"} → {busInfo?.destination ?? "—"}
                    </dd>
                  </div>
                  <div className="bus-trip-row">
                    <dt>Mahali pa kupandia</dt>
                    <dd>{tripData.bording_point_name ?? "—"}</dd>
                  </div>
                  <div className="bus-trip-row">
                    <dt>Mahali pa kushuka</dt>
                    <dd>{tripData.dropoff_point_name ?? "—"}</dd>
                  </div>
                  <div className="bus-trip-row">
                    <dt>Kiti / viti</dt>
                    <dd>
                      <span className="bus-trip-seats-inline">
                        {tripData.passengers.map((p) => (
                          <span
                            key={p.seat_label}
                            className="bus-trip-seat-chip"
                          >
                            {p.seat_label}
                          </span>
                        ))}
                      </span>
                    </dd>
                  </div>
                  <div className="bus-trip-row">
                    <dt>Idadi ya viti</dt>
                    <dd>{tripData.passengers.length}</dd>
                  </div>
                  <div className="bus-trip-row">
                    <dt>Muda wa kuondoka</dt>
                    <dd>{tripTime || "—"}</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Abiria */}
            <section
              className="bus-trip-panel"
              aria-labelledby="trip-section-passengers"
            >
              <h3 id="trip-section-passengers" className="bus-trip-panel-head">
                <span className="inline-flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  Taarifa za abiria
                </span>
              </h3>
              <div className="bus-trip-panel-body">
                <div className="bus-trip-passenger-list">
                  {tripData.passengers.map((passenger) => (
                    <article
                      key={passenger.seat_label}
                      className="bus-trip-passenger-card"
                      aria-label={`Abiria kiti ${passenger.seat_label}`}
                    >
                      <p className="bus-trip-passenger-seat">
                        Kiti {passenger.seat_label}
                      </p>
                      <div className="bus-trip-passenger-body">
                        <div className="bus-trip-passenger-line">
                          <span>Jina kamili</span>
                          <span>{fullName(passenger)}</span>
                        </div>
                        <div className="bus-trip-passenger-line">
                          <span>Simu</span>
                          <span dir="ltr">{passenger.phone_number}</span>
                        </div>
                        <div className="bus-trip-passenger-line">
                          <span>Umri</span>
                          <span>
                            {passenger.age_group === "Adult"
                              ? "Mkubwa"
                              : "Mdogo"}
                          </span>
                        </div>
                        <div className="bus-trip-passenger-line">
                          <span>Jinsia</span>
                          <span>
                            {passenger.passenger_gender === "male"
                              ? "Mwanaume"
                              : "Mwanamke"}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Malipo */}
            <section
              className="bus-trip-panel"
              aria-labelledby="trip-section-payment"
            >
              <h3 id="trip-section-payment" className="bus-trip-panel-head">
                <span className="inline-flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  Malipo
                </span>
              </h3>
              <div className="bus-trip-panel-body">
                <div className="bus-trip-money-row">
                  <span className="font-semibold text-muted-foreground">
                    Bei kwa kiti
                  </span>
                  <span className="tabular-nums font-semibold">
                    TZS {formatTzs(busInfo?.price)}
                  </span>
                </div>
                <div className="bus-trip-money-row">
                  <span className="font-semibold text-muted-foreground">
                    Jumla ya malipo
                  </span>
                  <span className="tabular-nums font-semibold">
                    TZS {formatTzs(tripData.price)}
                  </span>
                </div>
                <div className="bus-trip-money-row">
                  <span className="font-semibold text-muted-foreground">
                    Makato
                  </span>
                  <span className="tabular-nums font-semibold">TZS 0.00</span>
                </div>
                <div
                  className={cn(
                    "bus-trip-money-row",
                    "bus-trip-money-row--total",
                  )}
                >
                  <span>Unalipa</span>
                  <span className="tabular-nums">
                    TZS {formatTzs(tripData.price)}
                  </span>
                </div>

                <div className="bus-trip-voucher">
                  <label htmlFor="trip-voucher" className="sr-only">
                    Nambari ya vocha
                  </label>
                  <Input
                    id="trip-voucher"
                    type="text"
                    placeholder="Nambari ya vocha (ikiwa ipo)"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    className="bus-trip-voucher-input h-10"
                    autoComplete="off"
                  />
                </div>

                {payError ? (
                  <div className="bus-trip-alert" role="alert">
                    {payError}
                  </div>
                ) : null}

                <div className="bus-trip-terms">
                  <Checkbox
                    id="trip-terms"
                    checked={isAgreed}
                    onCheckedChange={(v) => setIsAgreed(v === true)}
                    aria-describedby="trip-terms-desc"
                  />
                  <label htmlFor="trip-terms" id="trip-terms-desc">
                    Ninakubaliana na masharti na hali za huduma na malipo.
                  </label>
                </div>

                <Button
                  type="button"
                  className="bus-trip-pay-btn bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handlePayment}
                  disabled={loading || !isAgreed}
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden
                      />
                      Inashughulikia…
                    </>
                  ) : (
                    "Endelea na malipo"
                  )}
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TripDetails;
