import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Home,
  ListOrdered,
  Lock,
  Smartphone,
} from "lucide-react";

import { TicketData } from "@/types/busTypes";
import { paymentMethods } from "@/data/PaymentData";
import { cn } from "@/lib/utils";

import { Section } from "../Section";
import { Button } from "../ui/button";
import { Container } from "../Container";
import { Separator } from "../ui/separator";
import { Ticket } from "./Ticket";
import LoadingRing from "../common/LoadingRing";
import { PhoneInput } from "../common/PhoneInput";
import { Modal } from "../common/Modal";
import { DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: "Nambari ya simu lazima iwe na angalau tarakimu 10." }),
  selectedMethod: z.string().min(1, { message: "Njia ya malipo inahitajika." }),
});

type FormData = z.infer<typeof formSchema>;

/** How long the customer has to complete payment, in seconds (5 minutes). */
const PAYMENT_WINDOW_SECONDS = 300;
const deadlineKey = (id: string) => `payment_deadline_${id}`;

const Payment = () => {
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModalMethod, setOpenModalMethod] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(PAYMENT_WINDOW_SECONDS);
  const [isPaid, setIsPaid] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isExpired = !isPaid && timeLeft <= 0;

  const [copiedItem, setCopiedItem] = useState<
    "business" | "reference" | "amount" | null
  >(null);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      selectedMethod: "",
    },
    mode: "onChange",
  });

  const selectedMethod = watch("selectedMethod");
  const pushProviderEnv = String(
    import.meta.env.VITE_PUSH_PROVIDER ?? "azam"
  ).toLowerCase();
  const useUbxPush = pushProviderEnv === "ubx";

  const toUbxMsisdn = (raw: string) => {
    const digits = String(raw ?? "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("255") && digits.length >= 12) return `0${digits.slice(3)}`;
    return digits;
  };

  const ubxPushTypeForMethod = (methodName: string) => {
    const m = String(methodName ?? "").toLowerCase();
    if (m === "tigo") return "tigo_push";
    if (m === "mpesa") return "voda_push";
    if (m === "airtel") return "airtel_push";
    if (m === "halopesa") return "halotel_push";
    return null;
  };

  const handleCopy = async (type: "business" | "reference" | "amount") => {
    if (isExpired) return;
    let textToCopy = "";
    switch (type) {
      case "business":
        textToCopy = "009009";
        break;
      case "reference":
        textToCopy = ticketData?.id_no ?? "N/A";
        break;
      case "amount":
        textToCopy = ticketData?.price?.toString() ?? "0";
        break;
      default:
        return;
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          const successful = document.execCommand("copy");
          if (!successful) throw new Error("Copy failed");
        } finally {
          document.body.removeChild(textArea);
        }
      }
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const showErrorToast = useCallback((message: string) => {
    toast.error(message, { duration: 5000 });
  }, []);

  const showSuccessToast = useCallback((message: string) => {
    toast.success(message, { duration: 5000 });
  }, []);

  const fetchTicketData = useCallback(async () => {
    if (!id) return;
    try {
      const base = String(import.meta.env.VITE_API_TICKET ?? "").replace(/\/$/, "");
      const url = `${base}/${encodeURIComponent(id)}`;
      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch ticket data");
      const data: TicketData = await response.json();
      setTicketData(data);
      setIsPaid(data.booking_type === "PAID");

      if (data.booking_type === "CANCELLED") {
        localStorage.removeItem(deadlineKey(id));
        navigate("/transactionfailed", { replace: true });
      }
    } catch (error) {
      console.error("Error fetching ticket data:", error);
      showErrorToast("Could not load ticket data. Please try again later.");
    }
  }, [id, navigate, showErrorToast]);

  useEffect(() => {
    fetchTicketData();
  }, [fetchTicketData]);

  useEffect(() => {
    if (isPaid) return;
    const interval = setInterval(fetchTicketData, 3000);
    return () => clearInterval(interval);
  }, [fetchTicketData, isPaid]);

  // Payment deadline: persisted per booking so a page refresh cannot reset it.
  useEffect(() => {
    if (!id || isPaid) return;

    const key = deadlineKey(id);
    // Drop the deadline written by the old 15-minute timer.
    localStorage.removeItem(`timer_${id}`);

    const maxEndTime = Date.now() + PAYMENT_WINDOW_SECONDS * 1000;
    const saved = parseInt(localStorage.getItem(key) ?? "", 10);
    // Never allow a stored deadline to exceed the 5-minute window.
    const endTime = Number.isFinite(saved) ? Math.min(saved, maxEndTime) : maxEndTime;
    localStorage.setItem(key, String(endTime));

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      return remaining;
    };

    if (updateTimer() === 0) return;
    const interval = setInterval(() => {
      if (updateTimer() === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [id, isPaid]);

  // Once paid, the deadline is no longer needed.
  useEffect(() => {
    if (id && isPaid) localStorage.removeItem(deadlineKey(id));
  }, [id, isPaid]);

  // Lock the page when the time is over: close any open payment dialog.
  useEffect(() => {
    if (isExpired) setOpenModalMethod(null);
  }, [isExpired]);

  const fetchPaymentToken = async (): Promise<string | null> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_KEY_AZAM_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch token");

      const responseData = await response.json();
      const data = JSON.parse(responseData.data);
      return data.data.accessToken;
    } catch (error) {
      console.error("Token request failed:", error);
      showErrorToast("Failed to retrieve payment token. Please try again.");
      return null;
    }
  };

  const submitAzamPush: SubmitHandler<FormData> = async (data) => {
    if (!ticketData || isExpired) return;

    setLoading(true);
    try {
      const token = await fetchPaymentToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const payload = {
        mobile: data.phoneNumber,
        payMethod: data.selectedMethod,
        price: ticketData.price,
        booking_id: ticketData.id_no,
        payToken: token,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_KEY_AZAM_PAY_CHECKOUT}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        showErrorToast("Hakiki nambari yako ya simu!");
        throw new Error("Payment failed");
      }

      setOpenModalMethod(null);
      showSuccessToast("Thibitisha malipo kwenye simu yako!");
      await fetchTicketData();
    } catch (error) {
      console.error("Payment failed:", error);
      showErrorToast("Malipo hayajafanikiwa. Tafadhali jaribu tena!");
    } finally {
      setLoading(false);
    }
  };

  const submitUbxPush: SubmitHandler<FormData> = async (data) => {
    if (!ticketData || isExpired) return;

    setLoading(true);
    try {
      const ubxUrl =
        import.meta.env.VITE_UBX_PUSH_USSD_URL ??
        "https://ticket-push.ubx.co.tz/api/v1/push-ussd";

      const type = ubxPushTypeForMethod(data.selectedMethod);
      if (!type) {
        showErrorToast(
          "Njia hii ya malipo haijawezeshwa kwa push. Tafadhali tumia maelekezo ya kulipa kwa mkono (USSD) hapo juu."
        );
        return;
      }

      const msisdn = toUbxMsisdn(data.phoneNumber);
      if (!msisdn) {
        showErrorToast("Tafadhali weka namba sahihi ya simu.");
        return;
      }

      // UBX payload format (exact)
      const payload = {
        msisdn,
        amount: Number(ticketData.price),
        reference: String(ticketData.id_no),
        type,
      };

      const response = await fetch(ubxUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const bodyText = await response.text().catch(() => "");
        console.error("UBX push-ussd failed:", response.status, bodyText);
        showErrorToast("Imeshindikana kuanzisha ombi la malipo. Jaribu tena.");
        throw new Error("UBX push-ussd failed");
      }

      const ubxResult: any = await response.json().catch(() => null);
      const ubxTopCode = String(ubxResult?.ResponseCode ?? "");
      const ubxOk = Boolean(ubxResult?.ResponseStatus) && ubxTopCode === "00";
      const ubxDesc = String(ubxResult?.ResponseDescription ?? "").toLowerCase();

      // Known non-success case: reused reference number.
      if (ubxDesc.includes("reference number already used")) {
        showErrorToast(
          "Namba ya marejeleo tayari imetumika. Tafadhali tumia maelekezo ya kulipa kwa mkono (USSD) hapo juu."
        );
        return;
      }

      // Treat any other non-success response as "use manual instructions".
      if (!ubxOk) {
        showErrorToast(
          "Ombi la malipo halijaanzishwa moja kwa moja. Tafadhali tumia maelekezo ya kulipa kwa mkono (USSD) hapo juu."
        );
        return;
      }

      const ubxRef =
        ubxResult?.ReferenceID?.result?.ReferenceID ??
        ubxResult?.ReferenceID?.ReferenceID ??
        ubxResult?.ReferenceID ??
        "";

      setOpenModalMethod(null);
      showSuccessToast(
        ubxRef
          ? `Thibitisha malipo kwenye simu yako! Rejea: ${String(ubxRef)}`
          : "Thibitisha malipo kwenye simu yako!"
      );
      await fetchTicketData();
    } catch (error) {
      console.error("UBX payment failed:", error);
      showErrorToast("Malipo hayajafanikiwa. Tafadhali jaribu tena!");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isExpired) {
      showErrorToast("Muda wa malipo umekwisha. Tafadhali weka tiketi upya.");
      return;
    }
    // Use one push provider at a time, configured by env (no user choice).
    return useUbxPush ? submitUbxPush(data) : submitAzamPush(data);
  };

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await fetchTicketData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchTicketData, refreshing]);

  const priceLabel = ticketData
    ? `${new Intl.NumberFormat("sw-TZ").format(Number(ticketData.price))} TZS`
    : "";

  const activeMethod = useMemo(
    () => paymentMethods.find((m) => m.name === openModalMethod),
    [openModalMethod]
  );

  const renderInstructionLine = (instruction: string, idx: number) => {
    const parts = instruction.split(/(\{business\}|\{reference\}|\{amount\})/);
    const hasCopy =
      instruction.includes("{business}") ||
      instruction.includes("{reference}") ||
      instruction.includes("{amount}");

    return (
      <li key={idx} className="bus-payment-modal-step">
        <div className="bus-payment-modal-step__rail" aria-hidden>
          <span className="bus-payment-modal-step__index">{idx + 1}</span>
        </div>
        <div className="bus-payment-modal-step__main">
          <p className="bus-payment-modal-step__text">
            {parts.map((part, i) => {
              if (part === "{business}") {
                return (
                  <strong key={`${idx}-b-${i}`} className="bus-payment-modal-step__hl">
                    009009
                  </strong>
                );
              }
              if (part === "{reference}") {
                return (
                  <strong key={`${idx}-r-${i}`} className="bus-payment-modal-step__hl">
                    {ticketData?.id_no ?? "N/A"}
                  </strong>
                );
              }
              if (part === "{amount}") {
                return (
                  <strong key={`${idx}-a-${i}`} className="bus-payment-modal-step__hl">
                    {ticketData?.price?.toString() ?? "0"}
                  </strong>
                );
              }
              return <span key={`${idx}-t-${i}`}>{part}</span>;
            })}
          </p>
          {hasCopy && (
            <div
              className="bus-payment-modal-step__copy-row"
              role="group"
              aria-label="Nakili namba kwenye ubao wa kunakili"
            >
              {instruction.includes("{business}") && (
                <button
                  type="button"
                  className="bus-payment-modal-copy"
                  onClick={() => handleCopy("business")}
                  aria-label="Nakili namba ya kampuni"
                >
                  {copiedItem === "business" ? (
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                  )}
                  <span>Kampuni</span>
                </button>
              )}
              {instruction.includes("{reference}") && (
                <button
                  type="button"
                  className="bus-payment-modal-copy"
                  onClick={() => handleCopy("reference")}
                  aria-label="Nakili namba ya malipo"
                >
                  {copiedItem === "reference" ? (
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                  )}
                  <span>Marejeleo</span>
                </button>
              )}
              {instruction.includes("{amount}") && (
                <button
                  type="button"
                  className="bus-payment-modal-copy"
                  onClick={() => handleCopy("amount")}
                  aria-label="Nakili kiasi"
                >
                  {copiedItem === "amount" ? (
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                  )}
                  <span>Kiasi</span>
                </button>
              )}
            </div>
          )}
        </div>
      </li>
    );
  };

  return (
    <>
      <Section className="bus-payment-shell w-full">
        {!ticketData ? (
          <Container>
            <div className="bus-payment-container">
              <div className="bus-payment-loading">
                <LoadingRing size="lg" />
                <p className="bus-payment-loading__text">
                  Inapakia taarifa za tiketi… Tafadhali subiri.
                </p>
              </div>
            </div>
          </Container>
        ) : (
          <Container>
            <div className="bus-payment-container">
              <div role="region" aria-label="Malipo ya tiketi">
                <div className="bus-payment-card">
                  <div className="bus-payment-card__masthead">
                    <span className="bus-payment-card__icon" aria-hidden>
                      <CreditCard />
                    </span>
                    <div className="min-w-0">
                      <h1 className="bus-payment-card__heading">
                        Malipo ya tiketi
                      </h1>
                      <p className="bus-payment-card__sub">
                        Ombi: {ticketData.id_no}
                      </p>
                    </div>
                  </div>

                  <div className="bus-payment-card__inner relative">
                    {loading && (
                      <div
                        className="absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] bg-background/80 backdrop-blur-[2px]"
                        aria-busy="true"
                        aria-live="polite"
                      >
                        <LoadingRing size="sm" />
                      </div>
                    )}

                    {isPaid ? (
                      <div className="bus-payment-success">
                        <div className="bus-payment-success__badge" aria-hidden>
                          <CheckCircle2 />
                        </div>
                        <div>
                          <h2 className="bus-payment-success__title">Hongera!</h2>
                          <p className="bus-payment-success__text">
                            Umefanikiwa kulipa tiketi yako mtandaoni. Unaweza
                            kutazama tiketi hapa chini.
                          </p>
                        </div>
                        <Ticket ticketid={ticketData.id_no} non_input />
                      </div>
                    ) : isExpired ? (
                      <div
                        className="bus-payment-success bus-payment-expired"
                        role="alert"
                        aria-live="assertive"
                      >
                        <div className="bus-payment-success__badge" aria-hidden>
                          <Lock />
                        </div>
                        <div>
                          <h2 className="bus-payment-success__title">
                            Muda wa malipo umekwisha
                          </h2>
                          <p className="bus-payment-success__text">
                            Samahani, malipo hayakukamilika ndani ya dakika 5,
                            kwa hiyo ombi hili la tiketi limefungwa.
                          </p>
                          <p className="bus-payment-success__text mt-2">
                            Kama ulishalipa, subiri kidogo kwenye ukurasa huu.
                            Tiketi yako itaonekana hapa mara malipo
                            yatakapothibitishwa.
                          </p>
                        </div>
                        <Button
                          type="button"
                          className="bus-payment-expired__home"
                          onClick={() => navigate("/")}
                        >
                          <Home className="h-4 w-4" aria-hidden />
                          Rudi Nyumbani
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="bus-payment-summary__label">
                          Muhtasari wa malipo
                        </p>
                        <div className="bus-payment-summary">
                          <div className="bus-payment-row bus-payment-row--route">
                            <dt>Safari</dt>
                            <dd>{ticketData.trip_route_name}</dd>
                          </div>

                          <div className="bus-payment-row">
                            <dt>Namba ya kampuni</dt>
                            <dd>
                              <span>009009</span>
                              <button
                                type="button"
                                className="bus-payment-copy"
                                onClick={() => handleCopy("business")}
                                aria-label="Nakili namba ya kampuni"
                              >
                                {copiedItem === "business" ? (
                                  <Check className="h-4 w-4" aria-hidden />
                                ) : (
                                  <Copy className="h-4 w-4" aria-hidden />
                                )}
                              </button>
                            </dd>
                          </div>

                          <div className="bus-payment-row">
                            <dt>Namba ya malipo</dt>
                            <dd>
                              <span>{ticketData.id_no}</span>
                              <button
                                type="button"
                                className="bus-payment-copy"
                                onClick={() => handleCopy("reference")}
                                aria-label="Nakili namba ya malipo"
                              >
                                {copiedItem === "reference" ? (
                                  <Check className="h-4 w-4" aria-hidden />
                                ) : (
                                  <Copy className="h-4 w-4" aria-hidden />
                                )}
                              </button>
                            </dd>
                          </div>

                          <div className="bus-payment-row">
                            <dt>Kiasi</dt>
                            <dd>
                              <span>{priceLabel}</span>
                              <button
                                type="button"
                                className="bus-payment-copy"
                                onClick={() => handleCopy("amount")}
                                aria-label="Nakili kiasi"
                              >
                                {copiedItem === "amount" ? (
                                  <Check className="h-4 w-4" aria-hidden />
                                ) : (
                                  <Copy className="h-4 w-4" aria-hidden />
                                )}
                              </button>
                            </dd>
                          </div>

                          <div
                            className={cn(
                              "bus-payment-timer",
                              timeLeft <= 60 && "bus-payment-timer--urgent"
                            )}
                            role="timer"
                            aria-live="polite"
                            aria-label={`Muda uliosalia: ${formatTimeLeft(timeLeft)}`}
                          >
                            <p className="bus-payment-timer__digits">
                              {formatTimeLeft(timeLeft)}
                            </p>
                            <p className="bus-payment-timer__hint">
                              Malipo yanapaswa kukamilishwa ndani ya muda huu.
                            </p>
                          </div>
                        </div>

                        {/* Refresh button */}
                        <div className="bus-payment-refresh">
                          <button
                            type="button"
                            className="bus-payment-refresh__label"
                            onClick={() => void handleRefresh()}
                            disabled={refreshing}
                          >
                            {refreshing
                              ? "Inasasisha…"
                              : "Bonyeza kusasisha ukishalipa (hali ya tiketi inasasishwa kiotomatiki)"}
                          </button>
                        </div>

                        <Separator className="my-5 bg-border" />

                        <h2 className="bus-payment-section-title">
                          <Smartphone className="shrink-0" aria-hidden />
                          Chagua njia ya malipo
                        </h2>
                        <div className="bus-payment-methods">
                          {paymentMethods.map((method) => (
                            <button
                              key={method.id}
                              type="button"
                              className={cn(
                                "bus-payment-method-tile",
                                selectedMethod === method.name &&
                                  "bus-payment-method-tile--selected"
                              )}
                              aria-pressed={selectedMethod === method.name}
                              onClick={() => {
                                setValue("selectedMethod", method.name, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                setOpenModalMethod(method.name);
                              }}
                            >
                              {selectedMethod === method.name && (
                                <span
                                  className="bus-payment-method-tile__selected-icon"
                                  aria-hidden
                                >
                                  <Check />
                                </span>
                              )}
                              <img
                                src={method.image}
                                alt=""
                                width={64}
                                height={64}
                                className="size-12 md:size-16"
                              />
                              <span>{method.title}</span>
                            </button>
                          ))}
                        </div>
                        {errors.selectedMethod && (
                          <p className="bus-payment-error" role="alert">
                            {errors.selectedMethod.message}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        )}
      </Section>

      {activeMethod && !isExpired && (
        <Modal
          open={!!openModalMethod}
          onOpenChange={(open) => {
            if (!open) setOpenModalMethod(null);
          }}
          className="bus-payment-dialog w-[min(100%,96vw)] max-w-2xl overflow-hidden rounded-2xl border border-border/70 p-0 shadow-2xl"
        >
          <DialogTitle className="sr-only">
            Maelekezo ya malipo — {activeMethod.title}
          </DialogTitle>

          <div className="bus-payment-modal">
            <header className="bus-payment-modal__header">
              <div className="bus-payment-modal__header-top">
                <div className="bus-payment-modal__brand">
                  <div className="bus-payment-modal__brand-frame">
                    <img
                      src={activeMethod.image}
                      className="bus-payment-modal__brand-img"
                      alt=""
                      width={56}
                      height={56}
                    />
                  </div>
                  <div className="bus-payment-modal__intro">
                    <p className="bus-payment-modal__eyebrow">Njia ya malipo</p>
                    <h2
                      id="payment-modal-title"
                      className="bus-payment-modal__heading"
                    >
                      {activeMethod.title}
                    </h2>
                    <p className="bus-payment-modal__lede">
                      Fuata hatua kwenye menyu ya simu. Tumia vitufe vya hapa chini
                      kuhamisha namba haraka bila kuchapa tena.
                    </p>
                  </div>
                </div>
              </div>

              {ticketData && (
                <div
                  className="bus-payment-modal__chips"
                  aria-label="Vigezo vya kuhakiki malipo"
                >
                  <div className="bus-payment-modal__chip flex flex-col lg:flex-row items-start lg:items-center gap-2">
                    <span className="bus-payment-modal__chip-label">Kiasi</span>
                    <div className="flex items-center gap-2">
                      <span className="bus-payment-modal__chip-value">
                        {priceLabel}
                      </span>
                      <button
                        type="button"
                        className="bus-payment-modal__chip-action"
                        onClick={() => handleCopy("amount")}
                        aria-label="Nakili kiasi"
                      >
                        {copiedItem === "amount" ? (
                          <Check className="h-3.5 w-3.5" aria-hidden />
                        ) : (
                          <Copy className="h-3.5 w-3.5" aria-hidden />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="bus-payment-modal__chip flex flex-col lg:flex-row items-start lg:items-center gap-2">
                    <span className="bus-payment-modal__chip-label">
                      Marejeleo
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="bus-payment-modal__chip-value bus-payment-modal__chip-value--mono">
                        {ticketData.id_no}
                      </span>
                      <button
                        type="button"
                        className="bus-payment-modal__chip-action"
                        onClick={() => handleCopy("reference")}
                        aria-label="Nakili namba ya marejeleo"
                      >
                        {copiedItem === "reference" ? (
                          <Check className="h-3.5 w-3.5" aria-hidden />
                        ) : (
                          <Copy className="h-3.5 w-3.5" aria-hidden />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </header>

            <div className="bus-payment-modal__scroll">
              <section
                className="bus-payment-modal__section"
                aria-labelledby="payment-modal-steps-heading"
              >
                <div className="bus-payment-modal__section-head">
                  <span
                    className="bus-payment-modal__section-icon"
                    aria-hidden
                  >
                    <ListOrdered className="size-4" strokeWidth={2} />
                  </span>
                  <h3
                    id="payment-modal-steps-heading"
                    className="bus-payment-modal__section-title"
                  >
                    Hatua za malipo
                  </h3>
                </div>
                <ol className="bus-payment-modal-steps">
                  {activeMethod.desc.map((instruction: string, idx: number) =>
                    renderInstructionLine(instruction, idx)
                  )}
                </ol>
              </section>

              {(useUbxPush || activeMethod.title !== "M-Pesa2") && (
                <section
                  className="bus-payment-modal__section bus-payment-modal__section--accent"
                  aria-labelledby="payment-modal-ussd-heading"
                >
                  <div className="bus-payment-modal__push-head">
                    <span
                      className="bus-payment-modal__push-icon"
                      aria-hidden
                    >
                      <Smartphone className="size-5" strokeWidth={2} />
                    </span>
                    <div>
                      <h3
                        id="payment-modal-ussd-heading"
                        className="bus-payment-modal__push-title"
                      >
                        Malipo ya haraka (push)
                      </h3>
                      <p className="bus-payment-modal__push-text">
                        Weka namba ya simu ya malipo.
                        Utapokea ombi la kuthibitisha malipo.
                      </p>
                    </div>
                  </div>

                  <div className="bus-payment-modal__field">
                    <Label
                      htmlFor="payment-phone"
                      className="bus-payment-modal__label"
                    >
                      Namba ya simu
                    </Label>
                    <PhoneInput
                      id="payment-phone"
                      defaultCountry="TZ"
                      placeholder="Mfano: 07XX XXX XXX"
                      onChange={(value) =>
                        setValue("phoneNumber", value || "", {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      error={errors.phoneNumber?.message}
                      className={cn(
                        "bus-payment-modal__phone-input",
                        errors.phoneNumber && "bus-payment-modal__phone-input--invalid"
                      )}
                    />
                    {errors.phoneNumber && (
                      <p className="bus-payment-modal__field-error" role="alert">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    className="bus-payment-modal__submit"
                    disabled={loading}
                    onClick={handleSubmit(onSubmit)}
                  >
                    {loading ? "Inatumwa…" : "Thibitisha na lipa"}
                  </Button>
                </section>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Payment;
