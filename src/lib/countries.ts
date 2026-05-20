import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

export type CountryOption = {
  value: string;
  label: string;
};

const sortedCountries: CountryOption[] = Object.entries(
  countries.getNames("en"),
)
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const COUNTRY_OPTIONS: CountryOption[] = [
  { value: "", label: "Select your country" },
  ...sortedCountries,
];
