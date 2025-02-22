import { useState } from "react";
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const countries = [
    { label: "Afghanistan", value: "AF", flag: "https://flagcdn.com/af.svg" },
    { label: "Algeria", value: "DZ", flag: "https://flagcdn.com/dz.svg" },
    { label: "Angola", value: "AO", flag: "https://flagcdn.com/ao.svg" },
    { label: "Argentina", value: "AR", flag: "https://flagcdn.com/ar.svg" },
    { label: "Australia", value: "AU", flag: "https://flagcdn.com/au.svg" },
    { label: "Bangladesh", value: "BD", flag: "https://flagcdn.com/bd.svg" },
    { label: "Brazil", value: "BR", flag: "https://flagcdn.com/br.svg" },
    { label: "Canada", value: "CA", flag: "https://flagcdn.com/ca.svg" },
    { label: "China", value: "CN", flag: "https://flagcdn.com/cn.svg" },
    { label: "Colombia", value: "CO", flag: "https://flagcdn.com/co.svg" },
    { label: "Democratic Republic of the Congo", value: "CD", flag: "https://flagcdn.com/cd.svg" },
    { label: "Egypt", value: "EG", flag: "https://flagcdn.com/eg.svg" },
    { label: "Ethiopia", value: "ET", flag: "https://flagcdn.com/et.svg" },
    { label: "France", value: "FR", flag: "https://flagcdn.com/fr.svg" },
    { label: "Germany", value: "DE", flag: "https://flagcdn.com/de.svg" },
    { label: "Ghana", value: "GH", flag: "https://flagcdn.com/gh.svg" },
    { label: "India", value: "IN", flag: "https://flagcdn.com/in.svg" },
    { label: "Indonesia", value: "ID", flag: "https://flagcdn.com/id.svg" },
    { label: "Iran", value: "IR", flag: "https://flagcdn.com/ir.svg" },
    { label: "Iraq", value: "IQ", flag: "https://flagcdn.com/iq.svg" },
    { label: "Italy", value: "IT", flag: "https://flagcdn.com/it.svg" },
    { label: "Japan", value: "JP", flag: "https://flagcdn.com/jp.svg" },
    { label: "Kenya", value: "KE", flag: "https://flagcdn.com/ke.svg" },
    { label: "Malaysia", value: "MY", flag: "https://flagcdn.com/my.svg" },
    { label: "Mexico", value: "MX", flag: "https://flagcdn.com/mx.svg" },
    { label: "Morocco", value: "MA", flag: "https://flagcdn.com/ma.svg" },
    { label: "Mozambique", value: "MZ", flag: "https://flagcdn.com/mz.svg" },
    { label: "Myanmar", value: "MM", flag: "https://flagcdn.com/mm.svg" },
    { label: "Nepal", value: "NP", flag: "https://flagcdn.com/np.svg" },
    { label: "Nigeria", value: "NG", flag: "https://flagcdn.com/ng.svg" },
    { label: "Pakistan", value: "PK", flag: "https://flagcdn.com/pk.svg" },
    { label: "Peru", value: "PE", flag: "https://flagcdn.com/pe.svg" },
    { label: "Philippines", value: "PH", flag: "https://flagcdn.com/ph.svg" },
    { label: "Poland", value: "PL", flag: "https://flagcdn.com/pl.svg" },
    { label: "Russia", value: "RU", flag: "https://flagcdn.com/ru.svg" },
    { label: "Saudi Arabia", value: "SA", flag: "https://flagcdn.com/sa.svg" },
    { label: "South Africa", value: "ZA", flag: "https://flagcdn.com/za.svg" },
    { label: "South Korea", value: "KR", flag: "https://flagcdn.com/kr.svg" },
    { label: "Sri Lanka", value: "LK", flag: "https://flagcdn.com/lk.svg" },
    { label: "Sudan", value: "SD", flag: "https://flagcdn.com/sd.svg" },
    { label: "Tanzania", value: "TZ", flag: "https://flagcdn.com/tz.svg" },
    { label: "Thailand", value: "TH", flag: "https://flagcdn.com/th.svg" },
    { label: "Turkey", value: "TR", flag: "https://flagcdn.com/tr.svg" },
    { label: "United Kingdom", value: "GB", flag: "https://flagcdn.com/gb.svg" },
    { label: "United States", value: "US", flag: "https://flagcdn.com/us.svg" },
    { label: "Ukraine", value: "UA", flag: "https://flagcdn.com/ua.svg" },
    { label: "Uzbekistan", value: "UZ", flag: "https://flagcdn.com/uz.svg" },
    { label: "Venezuela", value: "VE", flag: "https://flagcdn.com/ve.svg" },
    { label: "Vietnam", value: "VN", flag: "https://flagcdn.com/vn.svg" },
    { label: "Yemen", value: "YE", flag: "https://flagcdn.com/ye.svg" }
  ];
  

const CountrySelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const selectedCountry = countries.find((country) => country.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-14"
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <Image
                src={selectedCountry.flag}
                alt={`${selectedCountry.label} flag`}
                width={20}
                height={15}
                className="object-contain"
              />
              <span>{selectedCountry.label}</span>
            </div>
          ) : (
            "Select country..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {countries.map((country) => (
              <CommandItem
                key={country.value}
                onSelect={() => {
                  onChange(country.value === value ? "" : country.value);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={country.flag}
                    alt={`${country.label} flag`}
                    width={20}
                    height={15}
                    className="object-contain"
                  />
                  {country.label}
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === country.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySelect;