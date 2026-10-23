import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, BusFront, MapPin, MapPinned } from "lucide-react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTripContext } from "@/context/TripContext";
import { PointLocations } from "@/types/tripData";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    from: z.string().min(1, { message: "Chagua mahali pa kupandia." }),
    to: z.string().min(1, { message: "Chagua mahali pa kushukia." }),
  })
  .refine((data) => data.from !== data.to, {
    message: "Mahali pa kupanda na pa kushuka yawe tofauti.",
    path: ["to"],
  });

type PickupFormValues = z.infer<typeof formSchema>;

interface BusPickupDropoffPointProps {
  kupandia?: string;
  kushukia?: string;
  PickUpPoints: { name: string }[];
  DropOffPoints: { name: string }[];
  onError: (errors: string[]) => void;
  onSubmit: (data: PointLocations | undefined) => void;
}

export interface BusPickupDropoffPointRef {
  submit: () => void;
}

function collectSubmitErrors(errors: Record<string, { message?: string } | undefined>): string[] {
  const msgs = Object.values(errors)
    .map((e) => e?.message)
    .filter((m): m is string => Boolean(m));
  return msgs.length ? msgs : ["Tafadhali hakiki fomu."];
}

export const BusPickupDropoffPoint = forwardRef<
  BusPickupDropoffPointRef,
  BusPickupDropoffPointProps
>(({ PickUpPoints, DropOffPoints, kupandia, kushukia, onSubmit, onError }, ref) => {
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const { setPoints } = useTripContext();

  const form = useForm<PickupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { from: "", to: "" },
    mode: "onChange",
  });

  const fromVal = form.watch("from");
  const toVal = form.watch("to");

  const tryNotifyBoth = useCallback(
    (next: PickupFormValues) => {
      if (next.from && next.to && next.from !== next.to) {
        onSubmit({ from: next.from, to: next.to });
        setPoints(next);
      }
    },
    [onSubmit, setPoints]
  );

  useImperativeHandle(ref, () => ({
    submit: form.handleSubmit(
      (values) => {
        const from = values.from || kupandia;
        const to = values.to || kushukia;

        if (from && to && from !== to) {
          onSubmit({ from, to });
          setPoints(values);
        } else {
          onError([
            "Sehemu za kupanda na kushuka lazima zijazwe na ziwe tofauti.",
          ]);
        }
      },
      (errors) => {
        onError(collectSubmitErrors(errors as Record<string, { message?: string }>));
        onSubmit(undefined);
      }
    ),
  }));

  useEffect(() => {
    const fromExists = PickUpPoints.some((route) => route.name === kupandia);
    const toExists = DropOffPoints.some((route) => route.name === kushukia);

    form.setValue("from", fromExists && kupandia ? kupandia : "");
    form.setValue("to", toExists && kushukia ? kushukia : "");
  }, [kupandia, kushukia, PickUpPoints, DropOffPoints, form]);

  const cleanedPickUpPoints = useMemo(
    () => PickUpPoints.filter((route) => route.name.trim() !== ""),
    [PickUpPoints]
  );

  const cleanedDropOffPoints = useMemo(
    () => DropOffPoints.filter((route) => route.name.trim() !== ""),
    [DropOffPoints]
  );

  const filteredFromRoutes = useMemo(
    () =>
      cleanedPickUpPoints
        .filter((route) =>
          route.name.toLowerCase().includes(searchFrom.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [searchFrom, cleanedPickUpPoints]
  );

  const filteredToRoutes = useMemo(
    () =>
      cleanedDropOffPoints
        .filter((route) =>
          route.name.toLowerCase().includes(searchTo.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [searchTo, cleanedDropOffPoints]
  );

  return (
    <section className="bus-pickup-shell" aria-labelledby="bus-pickup-heading">
      <header className="bus-pickup-header">
        <h3 id="bus-pickup-heading" className="bus-pickup-header-title">
          <span className="bus-pickup-header-icon" aria-hidden>
            <BusFront className="h-4 w-4" strokeWidth={2} />
          </span>
          Sehemu za kupanda na kushuka
        </h3>
        <p className="bus-pickup-header-sub">
          Chagua kituo cha kupanda na cha kushuka kutoka kwenye orodha ya basi hili. Unaweza kutafuta kwa
          kuandika katika kisanduku cha utafutaji.
        </p>
      </header>

      <form
        className="bus-pickup-grid"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className="bus-pickup-field">
          <Label htmlFor="pickup-from-trigger" className="bus-pickup-label">
            <span className="bus-pickup-label-badge" aria-hidden>
              A
            </span>
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            Mahali pa kupandia
          </Label>
          <Select
            value={fromVal || undefined}
            onValueChange={(value) => {
              form.setValue("from", value, { shouldValidate: true });
              setSearchFrom("");
              void form.trigger(["from", "to"]);
              tryNotifyBoth({ from: value, to: form.getValues("to") });
            }}
          >
            <SelectTrigger
              id="pickup-from-trigger"
              className={cn(
                "bus-pickup-trigger",
                form.formState.errors.from && "border-destructive/60"
              )}
              aria-invalid={Boolean(form.formState.errors.from)}
              aria-describedby={
                form.formState.errors.from ? "pickup-from-error" : undefined
              }
            >
              <SelectValue placeholder="Chagua kituo cha kupanda" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <Input
                type="search"
                autoComplete="off"
                placeholder="Tafuta kituo…"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="bus-pickup-search h-9"
                onKeyDown={(e) => e.stopPropagation()}
              />
              {filteredFromRoutes.length === 0 ? (
                <div className="bus-pickup-empty" role="status">
                  Hakuna matokeo. Jaribu neno lingine au angalia orodha kamili.
                </div>
              ) : (
                filteredFromRoutes.map((route) => (
                  <SelectItem
                    key={route.name}
                    value={route.name}
                    className="bus-pickup-item cursor-pointer"
                  >
                    {route.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <p className="bus-pickup-hint">Kituo unapoingia basini.</p>
          {form.formState.errors.from ? (
            <p id="pickup-from-error" className="bus-pickup-error" role="alert">
              {form.formState.errors.from.message}
            </p>
          ) : null}
        </div>

        <div className="bus-pickup-connector" aria-hidden>
          <ArrowRight className="h-5 w-5 opacity-70" strokeWidth={2} />
        </div>

        <div className="bus-pickup-field">
          <Label htmlFor="pickup-to-trigger" className="bus-pickup-label">
            <span
              className="bus-pickup-label-badge bus-pickup-label-badge--drop"
              aria-hidden
            >
              B
            </span>
            <MapPinned className="h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden />
            Mahali pa kushuka
          </Label>
          <Select
            value={toVal || undefined}
            onValueChange={(value) => {
              form.setValue("to", value, { shouldValidate: true });
              setSearchTo("");
              void form.trigger(["from", "to"]);
              tryNotifyBoth({ from: form.getValues("from"), to: value });
            }}
          >
            <SelectTrigger
              id="pickup-to-trigger"
              className={cn(
                "bus-pickup-trigger",
                form.formState.errors.to && "border-destructive/60"
              )}
              aria-invalid={Boolean(form.formState.errors.to)}
              aria-describedby={
                form.formState.errors.to ? "pickup-to-error" : undefined
              }
            >
              <SelectValue placeholder="Chagua kituo cha kushuka" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <Input
                type="search"
                autoComplete="off"
                placeholder="Tafuta kituo…"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="bus-pickup-search h-9"
                onKeyDown={(e) => e.stopPropagation()}
              />
              {filteredToRoutes.length === 0 ? (
                <div className="bus-pickup-empty" role="status">
                  Hakuna matokeo. Jaribu neno lingine au angalia orodha kamili.
                </div>
              ) : (
                filteredToRoutes.map((route) => (
                  <SelectItem
                    key={route.name}
                    value={route.name}
                    className="bus-pickup-item cursor-pointer"
                  >
                    {route.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <p className="bus-pickup-hint">Kituo unachoshuka basini.</p>
          {form.formState.errors.to ? (
            <p id="pickup-to-error" className="bus-pickup-error" role="alert">
              {form.formState.errors.to.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
});

BusPickupDropoffPoint.displayName = "BusPickupDropoffPoint";

export default BusPickupDropoffPoint;
