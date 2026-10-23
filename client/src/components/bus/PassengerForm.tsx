import { useForm, useFieldArray, type FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Users, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formData } from "@/types/tripData";
import { cn } from "@/lib/utils";

const passengerSchema = z.object({
  firstName: z.string().trim().min(1, { message: "Jina la kwanza linahitajika." }),
  lastName: z.string().trim().min(1, { message: "Jina la mwisho linahitajika." }),
  mobile: z
    .string()
    .trim()
    .min(10, { message: "Nambari ya simu inapaswa kuwa angalau tarakimu 10." }),
  gender: z.enum(["child", "adult"], {
    message: "Chagua kundi la umri.",
  }),
  idType: z.string().trim().min(1, { message: "Chagua aina ya kitambulisho." }),
  idNumber: z.string().trim().min(1, { message: "Nambari ya kitambulisho inahitajika." }),
  email: z
    .string()
    .trim()
    .refine((s) => s === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s), {
      message: "Barua pepe si sahihi.",
    }),
});

const multiplePassengersSchema = z.object({
  passengers: z
    .array(passengerSchema)
    .min(1, { message: "Ongeza angalau abiria mmoja." })
    .max(10, { message: "Kiwango cha juu ni abiria 10." }),
});

type FormValues = z.infer<typeof multiplePassengersSchema>;

interface MultiplePassengerFormProps {
  seat: string;
  onDataReady: (passengerData: formData[]) => void;
  onError: (errors: string[]) => void;
  onCancel: () => void;
}

function collectPassengerErrors(errors: FieldErrors<FormValues>): string[] {
  const out: string[] = [];
  const passengers = errors.passengers;
  if (Array.isArray(passengers)) {
    passengers.forEach((p, i) => {
      if (!p || typeof p !== "object") return;
      Object.values(p).forEach((val) => {
        if (val && typeof val === "object" && "message" in val && val.message) {
          out.push(`Abiria ${i + 1}: ${String(val.message)}`);
        }
      });
    });
  }
  if (
    passengers &&
    typeof passengers === "object" &&
    !Array.isArray(passengers) &&
    "message" in passengers &&
    passengers.message
  ) {
    out.push(String(passengers.message));
  }
  return [...new Set(out)];
}

const Req = () => <span className="bus-passenger-required" aria-hidden>*</span>;

const defaultPassenger = {
  firstName: "",
  lastName: "",
  mobile: "",
  gender: "adult" as const,
  idType: "",
  idNumber: "",
  email: "",
};

export const MultiplePassengerForm = ({
  seat,
  onDataReady,
  onError,
  onCancel,
}: MultiplePassengerFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(multiplePassengersSchema),
    defaultValues: {
      passengers: [defaultPassenger],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengers",
  });

  const onSubmit = (data: FormValues) => {
    const passengerData: formData[] = data.passengers.map((passenger, index) => ({
      passenger_index: index,
      first_name: passenger.firstName.trim(),
      middle_name: "",
      last_name: passenger.lastName.trim(),
      phone_number: passenger.mobile.trim(),
      seat_label: `${seat}-${index + 1}`,
      age_group: passenger.gender === "child" ? "Child" : "Adult",
      nationality: "TANZANIAN",
      idType: passenger.idType.trim(),
      idNumber: passenger.idNumber.trim(),
      passenger_gender: passenger.gender === "child" ? "Child" : "Adult",
      email: passenger.email.trim() || undefined,
    }));
    onDataReady(passengerData);
  };

  const onInvalid = (e: FieldErrors<FormValues>) => {
    const msgs = collectPassengerErrors(e);
    onError(msgs.length ? msgs : ["Tafadhali sahihisha makosa kwenye fomu."]);
  };

  const fieldErr = (index: number, key: keyof FormValues["passengers"][number]) => {
    const p = errors.passengers?.[index];
    if (!p || typeof p !== "object") return undefined;
    const err = p[key];
    return err?.message as string | undefined;
  };

  const inputError = (index: number, key: keyof FormValues["passengers"][number]) =>
    Boolean(fieldErr(index, key));

  return (
    <div className="bus-passenger-form mt-5 w-full">
      <div className="bus-passenger-form-header">
        <div className="bus-passenger-form-title">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/15"
            aria-hidden
          >
            <Users className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              Abiria — kundi cha viti
            </span>
            <span className="flex flex-wrap items-baseline gap-2">
              <span className="font-normal text-muted-foreground">Kiti</span>
              <span className="bus-passenger-form-badge">{seat}</span>
            </span>
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 rounded-lg border-border font-semibold"
          onClick={onCancel}
        >
          <X className="h-4 w-4" aria-hidden />
          Ghairi
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="bus-passenger-form-stack"
        noValidate
      >
        {fields.map((field, index) => (
          <div key={field.id} className="bus-passenger-form-card">
            <div className="bus-passenger-form-card__head">
              <h3 className="bus-passenger-form-card__title">
                Abiria {index + 1} / {fields.length}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={fields.length <= 1}
                onClick={() => remove(index)}
                aria-label={`Ondoa abiria ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Ondoa
              </Button>
            </div>

            <div className="bus-passenger-form-body">
              <div className="bus-passenger-field">
                <Label htmlFor={`pf-${field.id}-fn`} className="bus-passenger-label">
                  Jina la kwanza
                  <Req />
                </Label>
                <Input
                  id={`pf-${field.id}-fn`}
                  autoComplete="given-name"
                  aria-invalid={inputError(index, "firstName")}
                  className={cn(
                    "bus-passenger-input",
                    inputError(index, "firstName") && "border-destructive"
                  )}
                  {...register(`passengers.${index}.firstName`)}
                />
                {fieldErr(index, "firstName") && (
                  <p className="bus-passenger-error" role="alert">
                    {fieldErr(index, "firstName")}
                  </p>
                )}
              </div>

              <div className="bus-passenger-field">
                <Label htmlFor={`pf-${field.id}-ln`} className="bus-passenger-label">
                  Jina la mwisho
                  <Req />
                </Label>
                <Input
                  id={`pf-${field.id}-ln`}
                  autoComplete="family-name"
                  aria-invalid={inputError(index, "lastName")}
                  className={cn(
                    "bus-passenger-input",
                    inputError(index, "lastName") && "border-destructive"
                  )}
                  {...register(`passengers.${index}.lastName`)}
                />
                {fieldErr(index, "lastName") && (
                  <p className="bus-passenger-error" role="alert">
                    {fieldErr(index, "lastName")}
                  </p>
                )}
              </div>

              <div className="bus-passenger-field">
                <Label htmlFor={`pf-${field.id}-mob`} className="bus-passenger-label">
                  Nambari ya simu
                  <Req />
                </Label>
                <Input
                  id={`pf-${field.id}-mob`}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  aria-invalid={inputError(index, "mobile")}
                  className={cn(
                    "bus-passenger-input",
                    inputError(index, "mobile") && "border-destructive"
                  )}
                  {...register(`passengers.${index}.mobile`)}
                />
                {fieldErr(index, "mobile") && (
                  <p className="bus-passenger-error" role="alert">
                    {fieldErr(index, "mobile")}
                  </p>
                )}
              </div>

              <div className="bus-passenger-field">
                <Label htmlFor={`pf-${field.id}-email`} className="bus-passenger-label">
                  Barua pepe (si lazima)
                </Label>
                <Input
                  id={`pf-${field.id}-email`}
                  type="email"
                  autoComplete="email"
                  aria-invalid={inputError(index, "email")}
                  className={cn(
                    "bus-passenger-input",
                    inputError(index, "email") && "border-destructive"
                  )}
                  {...register(`passengers.${index}.email`)}
                />
                {fieldErr(index, "email") && (
                  <p className="bus-passenger-error" role="alert">
                    {fieldErr(index, "email")}
                  </p>
                )}
              </div>

              <div className="bus-passenger-field">
                <Label htmlFor={`pf-${field.id}-gender`} className="bus-passenger-label">
                  Kundi la umri
                  <Req />
                </Label>
                <select
                  id={`pf-${field.id}-gender`}
                  aria-invalid={inputError(index, "gender")}
                  className={cn(
                    "bus-passenger-input w-full min-h-10 px-3",
                    inputError(index, "gender") && "border-destructive"
                  )}
                  {...register(`passengers.${index}.gender`)}
                >
                  <option value="adult">Mzima</option>
                  <option value="child">Mtoto</option>
                </select>
                {fieldErr(index, "gender") && (
                  <p className="bus-passenger-error" role="alert">
                    {fieldErr(index, "gender")}
                  </p>
                )}
              </div>

              <div className="bus-passenger-field">
                <Label htmlFor={`pf-${field.id}-idt`} className="bus-passenger-label">
                  Aina ya kitambulisho
                  <Req />
                </Label>
                <Input
                  id={`pf-${field.id}-idt`}
                  aria-invalid={inputError(index, "idType")}
                  className={cn(
                    "bus-passenger-input",
                    inputError(index, "idType") && "border-destructive"
                  )}
                  placeholder="NIDA, pasipoti, n.k."
                  {...register(`passengers.${index}.idType`)}
                />
                {fieldErr(index, "idType") && (
                  <p className="bus-passenger-error" role="alert">
                    {fieldErr(index, "idType")}
                  </p>
                )}
              </div>

              <div className="bus-passenger-field">
                <Label htmlFor={`pf-${field.id}-idn`} className="bus-passenger-label">
                  Nambari ya kitambulisho
                  <Req />
                </Label>
                <Input
                  id={`pf-${field.id}-idn`}
                  aria-invalid={inputError(index, "idNumber")}
                  className={cn(
                    "bus-passenger-input",
                    inputError(index, "idNumber") && "border-destructive"
                  )}
                  {...register(`passengers.${index}.idNumber`)}
                />
                {fieldErr(index, "idNumber") && (
                  <p className="bus-passenger-error" role="alert">
                    {fieldErr(index, "idNumber")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="bus-passenger-form-actions bus-passenger-form-actions--split">
          <Button
            type="button"
            variant="secondary"
            className="gap-1.5 font-semibold"
            disabled={fields.length >= 10}
            onClick={() => append(defaultPassenger)}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Ongeza abiria mwingine
          </Button>
          <Button
            type="submit"
            className="bus-passenger-form-submit bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Wasilisha taarifa za abiria
          </Button>
        </div>
      </form>
    </div>
  );
};
