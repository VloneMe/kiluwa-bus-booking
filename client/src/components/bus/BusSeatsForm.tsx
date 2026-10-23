import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldError, FieldErrors } from "react-hook-form";
import { Armchair } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formData } from "@/types/tripData";
import { PhoneInput } from "../common/PhoneInput";
import { cn } from "@/lib/utils";

const phoneRefine = (v: string) => {
  const d = v.replace(/\D/g, "");
  if (d.length < 9) return false;
  if (d.startsWith("0")) return d.length >= 10 && d.length <= 10;
  if (d.startsWith("255")) return d.length >= 12 && d.length <= 12;
  return d.length >= 9;
};

const FormSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(1, { message: "Jina la kwanza linahitajika." }),
    middle_name: z.string().trim().optional(),
    last_name: z
      .string()
      .trim()
      .min(1, { message: "Jina la mwisho linahitajika." }),
    phone_number: z
      .string()
      .min(1, { message: "Nambari ya simu inahitajika." })
      .refine(phoneRefine, {
        message: "Tumia nambari sahihi ya Tanzania (0XXXXXXXXX au 255XXXXXXXXX).",
      }),
    passenger_gender: z.string().min(1, { message: "Chagua jinsia." }),
    age_group: z.string().min(1, { message: "Chagua kundi la umri." }),
    nationality: z.string().min(1, { message: "Chagua uraia." }),
    email: z
      .string()
      .trim()
      .refine(
        (s) => s === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s),
        { message: "Barua pepe si sahihi." }
      ),
    idType: z.string().optional(),
    idNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const t = (data.idType ?? "NIL").trim();
    if (t !== "NIL") {
      const n = data.idNumber?.trim() ?? "";
      if (!n) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Weka nambari ya kitambulisho.",
          path: ["idNumber"],
        });
      }
    }
  });

type FormValues = z.infer<typeof FormSchema>;

function buildDefaults(existing?: formData): FormValues {
  if (!existing) {
    return {
      first_name: "",
      middle_name: "",
      last_name: "",
      phone_number: "",
      passenger_gender: "",
      age_group: "Adult",
      nationality: "TANZANIAN",
      email: "",
      idType: "NIL",
      idNumber: "",
    };
  }
  return {
    first_name: existing.first_name ?? "",
    middle_name: existing.middle_name ?? "",
    last_name: existing.last_name ?? "",
    phone_number: existing.phone_number ?? "",
    passenger_gender: existing.passenger_gender ?? "",
    age_group: existing.age_group ?? "Adult",
    nationality: existing.nationality ?? "TANZANIAN",
    email: existing.email ?? "",
    idType: existing.idType ?? "NIL",
    idNumber: existing.idNumber ?? "",
  };
}

function collectErrorMessages(errors: FieldErrors): string[] {
  const out: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const n = node as FieldError | Record<string, unknown>;
    if (typeof n.message === "string" && n.message) {
      out.push(n.message);
      return;
    }
    for (const v of Object.values(n)) walk(v);
  };
  walk(errors);
  return [...new Set(out)];
}

/**
 * WHATWG autocomplete: `section-*` scopes each seat so multiple passenger blocks
 * don’t overwrite each other’s saved autofill values.
 * @see https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill-detail-tokens
 */
function seatAutofillSection(seatLabel: string): string {
  const slug = seatLabel
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `section-seat-${slug}` : "section-seat-unknown";
}

function scopedAutocomplete(section: string, detail: string): string {
  return `${section} ${detail}`;
}

const formShellClass =
  "mt-5 w-full overflow-hidden rounded-xl border border-primary/20 bg-card shadow-md";

const formHeaderClass =
  "flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 bg-[linear-gradient(95deg,color-mix(in_oklch,var(--primary)_9%,transparent)_0%,color-mix(in_oklch,var(--card)_97%,var(--primary))_55%)] px-4 py-3";

const formTitleRowClass =
  "flex min-w-0 items-center gap-2 text-[0.9rem] font-bold tracking-wide text-foreground";

const seatBadgeClass =
  "inline-flex min-w-[2.15rem] items-center justify-center rounded-md bg-primary px-[0.55rem] py-[0.2rem] text-[0.8rem] font-extrabold tracking-wider text-primary-foreground shadow-xs";

const formBodyClass =
  "grid grid-cols-1 gap-x-5 gap-y-4 px-4 pb-[1.15rem] pt-4 md:grid-cols-2 md:px-[1.15rem] md:pb-5 md:pt-[1.1rem]";

const fieldClass =
  "flex min-w-0 flex-col gap-1.5 [&_label]:text-xs [&_label]:font-semibold [&_label]:tracking-tight [&_label]:text-foreground";

const fieldHintClass =
  "mt-[0.2rem] text-[0.68rem] leading-snug text-muted-foreground";

const reqStarClass = "ms-[0.15rem] font-bold text-destructive";

/** Stand out from `bg-card` shell: stronger border, tinted fill, shadow, hover/focus */
const passengerInputClass = cn(
  "h-10 rounded-lg border-2 border-primary/25 bg-muted/35 text-foreground shadow-sm",
  "placeholder:text-muted-foreground",
  "transition-[border-color,background-color,box-shadow] duration-150",
  "hover:border-primary/40 hover:bg-muted/45",
  "focus-visible:border-primary/55 focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
  "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25",
);

/** Radix Select shows placeholders on an inner span, not ::placeholder */
const passengerSelectTriggerClass = (extra?: string) =>
  cn(
    passengerInputClass,
    "w-full cursor-pointer text-foreground [&_span[data-placeholder]]:text-muted-foreground",
    extra,
  );

interface BusSeatsFormProps {
  seat_label: string;
  existingPassenger: formData | undefined;
  onDataReady: (data: formData[] | null) => void;
  onError: (errors: string[]) => void;
  onCancel: () => void;
  passengers: formData[] | null;
}

const Req = () => <span className={reqStarClass} aria-hidden>*</span>;

export const BusSeatsForm = forwardRef<unknown, BusSeatsFormProps>(
  ({ seat_label, existingPassenger, onDataReady, onError, onCancel, passengers }, ref) => {
    const autofillSection = seatAutofillSection(seat_label);
    const passengerFormId = `bus-passenger-seat-${seat_label.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

    const form = useForm<FormValues>({
      resolver: zodResolver(FormSchema),
      defaultValues: buildDefaults(existingPassenger),
      mode: "onBlur",
    });

    useEffect(() => {
      form.reset(buildDefaults(existingPassenger));
    }, [existingPassenger, seat_label, form.reset]);

    useImperativeHandle(ref, () => ({
      submit: async () => {
        const ok = await form.trigger();
        if (ok) {
          const data = form.getValues();
          const payload: formData = {
            ...data,
            middle_name: data.middle_name || "",
            seat_label,
            passenger_index: passengers?.length || 0,
          };

          const updatedPassengers = passengers ? [...passengers] : [];
          const existingPassengerIndex = updatedPassengers.findIndex(
            (p) => p.seat_label === seat_label
          );

          if (existingPassengerIndex !== -1) {
            updatedPassengers[existingPassengerIndex] = payload;
          } else {
            updatedPassengers.push(payload);
          }

          onDataReady(updatedPassengers);
        } else {
          onError(collectErrorMessages(form.formState.errors));
        }
      },
    }));

    return (
      <Form {...form}>
        <div className={formShellClass}>
          <div className={formHeaderClass}>
            <div className={formTitleRowClass}>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/15"
                aria-hidden
              >
                <Armchair className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium text-muted-foreground">
                  Abiria — kiti
                </span>
                <span className="flex flex-wrap items-baseline gap-2">
                  <span className="font-normal text-muted-foreground">Kiti</span>
                  <span className={seatBadgeClass}>{seat_label}</span>
                </span>
              </span>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="shrink-0 rounded-lg font-semibold"
              onClick={onCancel}
            >
              Ondoa kiti
            </Button>
          </div>

          <form
            id={passengerFormId}
            className={formBodyClass}
            autoComplete="on"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className={fieldClass}>
                  <FormLabel>
                    Jina la kwanza
                    <Req />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingiza jina la kwanza"
                      autoComplete={scopedAutocomplete(
                        autofillSection,
                        "given-name",
                      )}
                      className={passengerInputClass}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="middle_name"
              render={({ field }) => (
                <FormItem className={fieldClass}>
                  <FormLabel>Jina la kati</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Si lazima"
                      autoComplete={scopedAutocomplete(
                        autofillSection,
                        "additional-name",
                      )}
                      className={passengerInputClass}
                      {...field}
                    />
                  </FormControl>
                  <p className={fieldHintClass}>Weka ikiwa lipo.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className={fieldClass}>
                  <FormLabel>
                    Jina la mwisho
                    <Req />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingiza jina la mwisho"
                      autoComplete={scopedAutocomplete(
                        autofillSection,
                        "family-name",
                      )}
                      className={passengerInputClass}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className={fieldClass}>
                  <FormLabel>
                    Nambari ya simu
                    <Req />
                  </FormLabel>
                  <PhoneInput
                    value={field.value}
                    placeholder="Weka namba ya simu"
                    autoComplete={scopedAutocomplete(autofillSection, "tel")}
                    inputMode="tel"
                    onChange={(v) => {
                      field.onChange(v ?? "");
                      void form.trigger("phone_number");
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    className={cn(
                      passengerInputClass,
                      "h-auto min-h-10 py-2",
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passenger_gender"
              render={({ field }) => (
                <FormItem className={fieldClass}>
                  <FormLabel>
                    Jinsia
                    <Req />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className={passengerSelectTriggerClass()}>
                        <SelectValue placeholder="Chagua jinsia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Mwanaume</SelectItem>
                      <SelectItem value="female">Mwanamke</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age_group"
              render={({ field }) => (
                <FormItem className={fieldClass}>
                  <FormLabel>
                    Kundi la umri
                    <Req />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className={passengerSelectTriggerClass()}>
                        <SelectValue placeholder="Chagua umri" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Adult">Mkubwa</SelectItem>
                      <SelectItem value="Child">Mdogo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className={cn(fieldClass, "md:col-span-2")}>
                  <FormLabel>
                    Uraia
                    <Req />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className={passengerSelectTriggerClass()}>
                        <SelectValue placeholder="Chagua uraia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TANZANIAN">Mtanzania</SelectItem>
                      <SelectItem value="NON TANZANIAN">Si Mtanzania</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={cn(fieldClass, "md:col-span-2")}>
                  <FormLabel>Barua pepe</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="mfano@barua.com"
                      autoComplete={scopedAutocomplete(autofillSection, "email")}
                      className={passengerInputClass}
                      {...field}
                    />
                  </FormControl>
                  <p className={fieldHintClass}>
                    Hiari — kwa risiti au mawasiliano.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idType"
              render={({ field }) => (
                <FormItem className={fieldClass}>
                  <FormLabel>Aina ya kitambulisho</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      void form.trigger("idNumber");
                    }}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className={passengerSelectTriggerClass()}>
                        <SelectValue placeholder="Chagua aina" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NIL">Hakuna</SelectItem>
                      <SelectItem value="National ID (NIDA)">Kitambulisho cha Taifa (NIDA)</SelectItem>
                      <SelectItem value="Passport">Pasipoti</SelectItem>
                      <SelectItem value="Voting ID">Kitambulisho cha Kura</SelectItem>
                      <SelectItem value="Driving Licence">Leseni ya kuendesha</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem className={fieldClass}>
                  <FormLabel>Nambari ya kitambulisho</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingiza nambari"
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore
                      className={passengerInputClass}
                      {...field}
                    />
                  </FormControl>
                  <p className={fieldHintClass}>
                    Inahitajika ukiwa umechagua aina isiyo &quot;Hakuna&quot;.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </div>
      </Form>
    );
  }
);

BusSeatsForm.displayName = "BusSeatsForm";
