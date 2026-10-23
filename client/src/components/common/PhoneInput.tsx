import * as React from "react";  
import { CheckIcon, ChevronsUpDown } from "lucide-react";  
import * as RPNInput from "react-phone-number-input";  
import flags from "react-phone-number-input/flags"; 

import { Button } from "@/components/ui/button"; 
import {  
  Command,  
  CommandEmpty,  
  CommandGroup,  
  CommandInput,  
  CommandItem,  
  CommandList,  
} from "@/components/ui/command";  
import { Input } from "@/components/ui/input";  
import {  
  Popover,  
  PopoverContent,  
  PopoverTrigger,  
} from "@/components/ui/popover";  
import { ScrollArea } from "@/components/ui/scroll-area";  
import { cn } from "@/lib/utils";  

type PhoneInputProps = {  
  error?: string; // Add an optional error prop  
} & Omit<  
  React.ComponentProps<"input">,  
  "onChange" | "value" | "ref"  
> &  
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {  
    onChange?: (value: RPNInput.Value) => void;  
  };  

const PhoneInput = React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(  
  ({ error, className, onChange, ...props }, ref) => {  
    const handleChange = (value: RPNInput.Value) => {
      if (value) {
        const digitsOnly = value.replace(/\D/g, '');
        
        // Check if number starts with 255 (with or without +)
        const isInternationalFormat = digitsOnly.startsWith('255');
        
        // Validate based on format
        if (digitsOnly.startsWith('0')) {
          // Local format (0XXXXXXXXX) - exactly 10 digits
          if (digitsOnly.length > 10) {
            return; // Don't update if exceeds limit
          }
        } else if (isInternationalFormat) {
          // International format (255XXXXXXXXX) - max 12 digits
          if (digitsOnly.length > 12) {
            return; // Don't update if exceeds limit
          }
        } else {
          // Doesn't match either format - don't allow
          return;
        }
      }
      
      onChange?.(value || ("" as RPNInput.Value));
    };

    return (  
      <div className="flex flex-col"> {/* Wrap with a div for layout to include error message */}  
        <RPNInput.default  
          ref={ref}  
          className={cn("flex", className)}  
          flagComponent={FlagComponent}  
          countrySelectComponent={CountrySelect}  
          inputComponent={InputComponent}  
          smartCaret={false}
          defaultCountry="TZ" // Default to Tanzania
          onChange={handleChange}  
          {...props}  
        />  
        {/* Display error message if present */}  
        {error && <span className="text-red-500 text-sm hidden">{error}</span>}  
      </div>  
    );  
  },  
);  
PhoneInput.displayName = "PhoneInput";  

// Rest of the component remains the same...
const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(  
  ({ className, ...props }, ref) => (  
    <Input  
      className={cn("rounded-e-lg rounded-s-none bg-white", className)}  
      {...props}  
      ref={ref}  
      aria-invalid={props['aria-invalid'] ? "true" : "false"} // Maintain accessibility  
    />  
  )  
);  
InputComponent.displayName = "InputComponent";  

type CountryEntry = { label: string; value: RPNInput.Country | undefined };  

type CountrySelectProps = {  
  disabled?: boolean;  
  value: RPNInput.Country;  
  options: CountryEntry[];  
  onChange: (country: RPNInput.Country) => void;  
};  

const CountrySelect = ({  
  disabled,  
  value: selectedCountry,  
  options: countryList,  
  onChange,  
}: CountrySelectProps) => {  
  return (  
    <Popover>  
      <PopoverTrigger asChild>  
        <Button  
          type="button"  
          variant="outline"  
          className="flex gap-1 rounded-e-none rounded-s-lg border-r-0 px-3 focus:z-10"  
          disabled={disabled}  
          aria-haspopup="dialog" // Accessibility improvement  
          aria-expanded  
        >  
          <FlagComponent  
            country={selectedCountry}  
            countryName={selectedCountry}  
          />  
          <ChevronsUpDown  
            className={cn(  
              "-mr-2 size-4 opacity-50",  
              disabled ? "hidden" : "opacity-100",  
            )}  
          />  
        </Button>  
      </PopoverTrigger>  
      <PopoverContent className="w-[300px] p-0">  
        <Command>  
          <CommandInput placeholder="Search country..." />  
          <CommandList>  
            <ScrollArea className="h-72">  
              <CommandEmpty>No country found.</CommandEmpty>  
              <CommandGroup>  
                {countryList.map(({ value, label }) =>  
                  value ? (  
                    <CountrySelectOption  
                      key={value}  
                      country={value}  
                      countryName={label}  
                      selectedCountry={selectedCountry}  
                      onChange={onChange}  
                    />  
                  ) : null,  
                )}  
              </CommandGroup>  
            </ScrollArea>  
          </CommandList>  
        </Command>  
      </PopoverContent>  
    </Popover>  
  );  
};  

interface CountrySelectOptionProps extends RPNInput.FlagProps {  
  selectedCountry: RPNInput.Country;  
  onChange: (country: RPNInput.Country) => void;  
}  

const CountrySelectOption = ({  
  country,  
  countryName,  
  selectedCountry,  
  onChange,  
}: CountrySelectOptionProps) => {  
  return (  
    <CommandItem className="gap-2" onSelect={() => onChange(country)}>  
      <FlagComponent country={country} countryName={countryName} />  
      <span className="flex-1 text-sm">{countryName}</span>  
      <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>  
      <CheckIcon  
        className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}  
        aria-hidden="true" // Hides icon from accessibility tools  
      />  
    </CommandItem>  
  );  
};  

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {  
  const Flag = flags[country];  

  return (  
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg]:size-full">  
      {Flag && <Flag title={countryName} />}  
    </span>  
  );  
};  

export { PhoneInput };