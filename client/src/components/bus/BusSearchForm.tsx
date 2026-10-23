import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { addDays, format, isValid } from "date-fns";
import { z } from "zod";
import { Bus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { LocationSelectField } from "./form/LocationSelectField";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { useSearch } from "@/context/SearchContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBusRoutes } from "@/context/BusRoutesContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { parseIsoDateLocal } from "@/lib/date";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    from: z.string().min(1, { message: "Mahali pa kuanzia ni lazima" }),
    to: z.string().min(1, { message: "Mahali pa kufikia ni lazima" }),
    date: z.date({ message: "Tarehe ni ya lazima." }),
  })
  .refine((data) => data.from !== data.to, {
    message: "Mahali pa kuanzia na kufikia lazima yawe tofauti.",
    path: ["to"],
  });

type FormValues = z.infer<typeof schema>;

export const BusSearchForm: React.FC = () => {
  const navigate = useNavigate();
  const { from: urlFrom, to: urlTo, date: urlDateParam } = useParams<{
    from?: string;
    to?: string;
    date?: string;
  }>();
  const [searchParams] = useSearchParams();
  const urlDate = urlDateParam ?? searchParams.get("date");

  const parsedUrlDate = urlDate ? parseIsoDateLocal(urlDate) : undefined;
  const initialDate =
    parsedUrlDate && isValid(parsedUrlDate) ? parsedUrlDate : new Date();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      from: urlFrom || "",
      to: urlTo || "",
      date:
        parsedUrlDate && isValid(parsedUrlDate) ? parsedUrlDate : new Date(),
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;
  const { buses } = useBusRoutes();
  const { searchValues, setSearchValues } = useSearch();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (urlFrom && urlTo && urlDate) {
      const d = parseIsoDateLocal(urlDate);
      if (!isValid(d)) return;
      setValue("from", urlFrom);
      setValue("to", urlTo);
      setValue("date", d);
      setSearchFrom(urlFrom);
      setSearchTo(urlTo);
      setDate(d);
    }
  }, [urlFrom, urlTo, urlDate, setValue]);

  useEffect(() => {
    setValue("date", date, { shouldValidate: true, shouldDirty: true });
  }, [date, setValue]);

  const uniquePickupPoints = [
    ...new Set(buses.flatMap((bus) => bus.orirgin_search_tokens.split(","))),
  ];

  const uniqueDropOffPoints = [
    ...new Set(
      buses.flatMap((bus) => bus.destination_search_tokens.split(","))
    ),
  ];

  const filteredFromRoutes = useMemo(
    () =>
      uniquePickupPoints.filter((route) =>
        route.toLowerCase().includes(searchFrom.toLowerCase())
      ),
    [searchFrom, uniquePickupPoints]
  );

  const filteredToRoutes = useMemo(
    () =>
      uniqueDropOffPoints.filter((route) =>
        route.toLowerCase().includes(searchTo.toLowerCase())
      ),
    [searchTo, uniqueDropOffPoints]
  );

  const onSubmit = (data: FormValues) => {
    const formattedDate = format(date, "yyyy-MM-dd");

    const updatedValues = {
      ...data,
      date: formattedDate,
    };
    setSearchValues(updatedValues);
    navigate(`/booking/${data.from}/${data.to}/${formattedDate}#buses`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bus-search-form"
      aria-label="Fomu ya kutafuta mabasi"
      noValidate
    >
      <header className="bus-search-form__header">
        <h2 className="bus-search-form__title">
          <span className="bus-search-form__title-icon" aria-hidden>
            <Bus />
          </span>
          Tafuta safari yako
        </h2>
        <p className="bus-search-form__subtitle">
          Chagua kupandia, kushukia na tarehe — kisha tafuta mabasi yanayopatikana.
        </p>
      </header>

      <div className="bus-search-form__grid">
        <LocationSelectField
          label="Kupandia"
          value={form.getValues("from")}
          setValue={(value: string) => setValue("from", value)}
          searchValue={searchValues.from || searchFrom}
          setSearchValue={setSearchFrom}
          defaultValue={urlFrom}
          filteredRoutes={filteredFromRoutes}
          error={errors.from?.message}
        />

        <LocationSelectField
          label="Kushukia"
          value={form.getValues("to")}
          setValue={(value: string) => setValue("to", value)}
          searchValue={searchValues.to || searchTo}
          setSearchValue={setSearchTo}
          defaultValue={urlTo}
          filteredRoutes={filteredToRoutes}
          error={errors.to?.message}
        />

        <div className="bus-search-form__field">
          <Label htmlFor="bus-search-date" className="bus-search-form__label">
            Tarehe ya safari
          </Label>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                id="bus-search-date"
                type="button"
                variant="outline"
                className={cn(
                  "bus-search-form__date-trigger font-normal shadow-sm",
                  "border-primary/30 bg-background/95 hover:border-primary/45 hover:bg-muted/50",
                  !date && "text-muted-foreground"
                )}
              >
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="bus-search-form__popover w-auto p-0"
              align="start"
            >
              <div className="bus-search-form__popover-inner">
                <Select
                  onValueChange={(value) => {
                    if (value === "clear") {
                      setDate(initialDate);
                    } else {
                      const daysToAdd = parseInt(value, 10);
                      setDate(addDays(new Date(), daysToAdd));
                      setIsPopoverOpen(false);
                    }
                  }}
                >
                  <SelectTrigger className="bus-search-form__trigger bus-search-form__quick-select">
                    <SelectValue placeholder="Haraka: leo, kesho…" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value="0">Leo</SelectItem>
                    <SelectItem value="1">Kesho</SelectItem>
                    <SelectItem value="3">Baada ya siku 3</SelectItem>
                    <SelectItem value="7">Baada ya wiki moja</SelectItem>
                  </SelectContent>
                </Select>
                <div className="bus-search-form__calendar-wrap">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate);
                        setIsPopoverOpen(false);
                      }
                    }}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {errors.date ? (
            <p className="bus-search-form__error" role="alert">
              {errors.date.message}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          className={cn(
            "bus-search-form__submit",
            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
            "border-transparent shadow-sm"
          )}
        >
          Tafuta mabasi
        </Button>
      </div>
    </form>
  );
};

export default BusSearchForm;
