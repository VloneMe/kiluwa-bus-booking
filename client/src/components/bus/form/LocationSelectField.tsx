import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const LocationSelectField: React.FC<{
  label: string;
  value: string;
  setValue: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  filteredRoutes: string[];
  defaultValue?: string;
  error?: string;
}> = ({
  label,
  setValue,
  searchValue,
  setSearchValue,
  filteredRoutes,
  defaultValue,
  error,
}) => {
  return (
    <div className="bus-search-form__field">
      <Label className="bus-search-form__label">{label}</Label>
      <Select
        onValueChange={(val) => {
          setValue(val);
          setSearchValue("");
        }}
        defaultValue={defaultValue}
      >
        <SelectTrigger className="bus-search-form__trigger">
          <SelectValue placeholder={`Chagua ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <Input
            type="text"
            placeholder="Andika kutafuta…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={cn("bus-search-form__filter-input", "w-full")}
            aria-label={`Tafuta ${label.toLowerCase()}`}
          />
          {filteredRoutes.map((route) => (
            <SelectItem
              key={route}
              value={route || "Hana Thamani bado ..."}
              className="uppercase tracking-wide"
            >
              {route}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p className="bus-search-form__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};