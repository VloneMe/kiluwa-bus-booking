import { useEffect, useRef, useState } from "react";
import { Section } from "../Section";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import * as htmlToImage from "html-to-image";
import logo from "/logo.png";
import { Container } from "../Container";
import jsPDF from "jspdf";
import { Download, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketData {
  company_no: string;
  id_no: string;
  price: number;
  booking_time: string;
  booking_date: string;
  seat_numbers: string;
  trip_route_name: string;
  pickup_trip_location: string;
  drop_trip_location: string;
  reg_no: string;
  booking_type: string;
  passenger_name: string;
  qr_image_link?: string;
}

interface TicketFormData {
  ticket_number: string;
}

interface TicketProps {
  ticketid: string;
  non_input: boolean;
}

function statusClass(type: string): string {
  const t = (type || "").toUpperCase();
  if (t === "CANCELLED") return "bus-ticket-card__status--bad";
  if (t === "PENDING") return "bus-ticket-card__status--pending";
  return "bus-ticket-card__status--ok";
}

function formatPriceTzs(n: number): string {
  return new Intl.NumberFormat("sw-TZ", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

function parseBookingStamp(raw: string): { date: string; time: string } {
  const parts = raw?.trim().split(/\s+/) ?? [];
  return {
    date: parts[0] ?? "—",
    time: parts.slice(1).join(" ") || "",
  };
}

function formatSafariFromIso(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    const bits = iso?.split(/\s+/) ?? [];
    return { date: bits[0] ?? "—", time: bits[3] ?? bits[1] ?? "" };
  }
  return {
    date: d.toLocaleDateString("sw-TZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: d.toLocaleTimeString("sw-TZ", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export const Ticket = ({ ticketid, non_input }: TicketProps) => {
  const { register, handleSubmit, formState } = useForm<TicketFormData>();
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const fetchTicketData = async (ticketNumber: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${String(import.meta.env.VITE_API_TICKET ?? "").replace(/\/$/, "")}/${encodeURIComponent(ticketNumber)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch ticket data");
      }

      const fetchedData: TicketData = await response.json();
      setTicketData(fetchedData);
    } catch (err) {
      console.error("Error fetching ticket data:", err);
      setError("Hatukuweza kupata tiketi. Jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketid) {
      fetchTicketData(ticketid);
    }
  }, [ticketid]);

  useEffect(() => {
    let alive = true;
    setQrDataUrl(null);

    const url = ticketData?.qr_image_link;
    if (!url) return;

    (async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return;
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onload = () => {
          if (!alive) return;
          setQrDataUrl(typeof reader.result === "string" ? reader.result : null);
        };
        reader.readAsDataURL(blob);
      } catch {
        // If CORS blocks fetch, we keep the original URL for display.
      }
    })();

    return () => {
      alive = false;
    };
  }, [ticketData?.qr_image_link]);

  const onRequestTicket = (data: TicketFormData) => {
    fetchTicketData(data.ticket_number);
  };

  const downloadTicketAsPDF = async () => {
    if (!contentRef.current || !ticketData) return;
    setPdfBusy(true);
    setPdfError(null);
    try {
      contentRef.current.classList.add("bus-ticket-card--export");
      const pdfWidth = 620;
      const dataUrl = await htmlToImage.toPng(contentRef.current, {
        style: { overflow: "visible" },
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        filter: (node) => {
          if (!(node instanceof HTMLElement)) return true;
          // If the QR can't be safely inlined (CORS/404), exclude it from PDF export.
          if (node.dataset?.pdfExclude === "true") return false;
          return true;
        },
      });

      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const aspectRatio = img.height / img.width;
        const pdfHeight = pdfWidth * aspectRatio;
        const pdf = new jsPDF("p", "px", [pdfWidth, pdfHeight]);
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        const safeId = String(ticketData.id_no).replace(/[^\w.-]+/g, "_");
        pdf.save(`Tiketi-${safeId || "bus"}.pdf`);
        setPdfBusy(false);
      };
      img.onerror = () => {
        setPdfBusy(false);
        setPdfError("Imeshindwa kutengeneza PDF. Jaribu tena.");
      };
    } catch (e) {
      console.error("Error generating ticket PDF:", e);
      setPdfBusy(false);
      setPdfError(
        "Pakua haijafanikiwa (huenda QR image imezuiwa). Jaribu screenshot au jaribu tena."
      );
    } finally {
      contentRef.current?.classList.remove("bus-ticket-card--export");
    }
  };

  const cutStamp = ticketData ? parseBookingStamp(ticketData.booking_date) : null;
  const safari = ticketData ? formatSafariFromIso(ticketData.booking_time) : null;

  return (
    <Section
      className={cn(
        "flex justify-center",
        !non_input && "bus-ticket-shell--padded"
      )}
    >
      <Container className="w-full max-w-6xl px-3 md:px-4">
        <div className="bus-ticket-shell">
          <div
            className={cn(
              "bus-ticket-shell__inner items-center justify-center",
              non_input && "bus-ticket-shell__inner--wide"
            )}
          >
            <form
              onSubmit={handleSubmit(onRequestTicket)}
              className={cn("bus-ticket-lookup", non_input && "hidden")}
              aria-label="Tafuta tiketi kwa namba"
            >
              <p className="bus-ticket-lookup__title">Ingiza namba ya tiketi</p>
              <div className="bus-ticket-lookup__row">
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Mfano: 12345"
                  className="bus-ticket-lookup__input"
                  aria-invalid={Boolean(formState.errors.ticket_number)}
                  {...register("ticket_number", {
                    required: "Namba ya tiketi inahitajika",
                  })}
                />
                <Button
                  type="submit"
                  className={cn(
                    "bus-ticket-lookup__submit",
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  disabled={loading}
                >
                  {loading ? "Inapakia…" : "Omba tiketi"}
                </Button>
              </div>
              {formState.errors.ticket_number ? (
                <p className="bus-ticket-lookup__error" role="alert">
                  {formState.errors.ticket_number.message}
                </p>
              ) : null}
              {error ? (
                <p className="bus-ticket-lookup__error" role="alert">
                  {error}
                </p>
              ) : null}
            </form>

            {non_input ? (
              <p className="bus-ticket-blessing">Tunakutakia safari njema.</p>
            ) : null}

            {ticketData ? <hr className="bus-ticket-divider" aria-hidden /> : null}

            {ticketData ? (
              <div ref={contentRef} className="bus-ticket-card">
                <header className="bus-ticket-card__header">
                  <img
                    src={logo}
                    alt="Nembo ya kampuni"
                    className="bus-ticket-card__logo"
                    crossOrigin="anonymous"
                  />
                  <div className="bus-ticket-card__brand">
                    <p className="bus-ticket-card__company">
                      KILUWA LUXURY COACH
                    </p>
                    <p className="bus-ticket-card__route">
                      {ticketData.trip_route_name}
                    </p>
                  </div>
                </header>

                <div className="bus-ticket-card__body">
                  <div className="bus-ticket-card__contact">
                    <Phone aria-hidden strokeWidth={2.25} />
                    <span>{ticketData.company_no}</span>
                  </div>

                  <div className="bus-ticket-card__row">
                    <div>
                      <span className="bus-ticket-card__label">
                        Namba ya tiketi
                      </span>
                      <span className="bus-ticket-card__value">
                        {ticketData.id_no}
                      </span>
                    </div>
                    <div>
                      <span className="bus-ticket-card__label">Kiasi</span>
                      <span
                        className={cn(
                          "bus-ticket-card__value bus-ticket-card__value--end",
                          statusClass(ticketData.booking_type)
                        )}
                      >
                        TZS {formatPriceTzs(ticketData.price)}
                      </span>
                    </div>
                  </div>

                  <div className="bus-ticket-card__row">
                    <div>
                      <span className="bus-ticket-card__label">Imekatwa</span>
                      <span className="bus-ticket-card__value">
                        {cutStamp?.date}
                      </span>
                      {cutStamp?.time ? (
                        <span className="bus-ticket-card__value bus-ticket-card__value--muted">
                          {cutStamp.time}
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <span className="bus-ticket-card__label">Safari</span>
                      <span className="bus-ticket-card__value bus-ticket-card__value--end">
                        {safari?.date}
                      </span>
                      {safari?.time ? (
                        <span
                          className={cn(
                            "bus-ticket-card__value",
                            "bus-ticket-card__value--end",
                            "bus-ticket-card__value--muted"
                          )}
                        >
                          {safari.time}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="bus-ticket-card__row">
                    <div>
                      <span className="bus-ticket-card__label">Viti</span>
                    </div>
                    <div>
                      <span className="bus-ticket-card__value bus-ticket-card__value--end">
                        {ticketData.seat_numbers}
                      </span>
                    </div>
                  </div>

                  <div className="bus-ticket-card__row bus-ticket-card__row--locations">
                    <div>
                      <span className="bus-ticket-card__label">Kupanda</span>
                      <span className="bus-ticket-card__value">
                        {ticketData.pickup_trip_location}
                      </span>
                    </div>
                    <div>
                      <span className="bus-ticket-card__label">Kushukia</span>
                      <span className="bus-ticket-card__value bus-ticket-card__value--end">
                        {ticketData.drop_trip_location}
                      </span>
                    </div>
                  </div>

                  <div className="bus-ticket-card__row">
                    <div>
                      <span className="bus-ticket-card__label">
                        Namba za gari
                      </span>
                      <span className="bus-ticket-card__value">
                        {ticketData.reg_no}
                      </span>
                    </div>
                    <div>
                      <span className="bus-ticket-card__label">
                        Hali ya tiketi
                      </span>
                      <span
                        className={cn(
                          "bus-ticket-card__value bus-ticket-card__value--end",
                          statusClass(ticketData.booking_type)
                        )}
                      >
                        {ticketData.booking_type}
                      </span>
                    </div>
                  </div>

                  {ticketData.qr_image_link ? (
                    <div
                      className="bus-ticket-card__qr"
                      data-pdf-exclude={qrDataUrl ? undefined : "true"}
                    >
                      <img
                        src={qrDataUrl ?? ticketData.qr_image_link}
                        alt="Msimbo wa QR wa tiketi"
                        crossOrigin="anonymous"
                      />
                      <p className="bus-ticket-card__qr-caption">
                        Thibitisha kwa skana
                      </p>
                    </div>
                  ) : null}

                  <div className="bus-ticket-card__row bus-ticket-card__row--full">
                    <span className="bus-ticket-card__label bus-ticket-card__value--center">
                      Msafiri
                    </span>
                    <p className="bus-ticket-card__passenger">
                      {ticketData.passenger_name}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {ticketData ? (
              <div className="bus-ticket-actions">
                <Button
                  type="button"
                  onClick={downloadTicketAsPDF}
                  disabled={pdfBusy}
                  className={cn(
                    "bus-ticket-actions__btn",
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {pdfBusy ? (
                    "Inatengeneza PDF…"
                  ) : (
                    <>
                      Pakua tiketi
                      <Download className="h-5 w-5" aria-hidden />
                    </>
                  )}
                </Button>
                {pdfError ? (
                  <p className="bus-ticket-lookup__error mt-2 text-center" role="alert">
                    {pdfError}
                  </p>
                ) : null}
              </div>
            ) : null}

            <p className="bus-ticket-footnote text-center">
              Unaweza pia kuchukua picha ya skrini ya tiketi yako.
              <br />
              <strong>(Or screenshot your ticket.)</strong>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
};
