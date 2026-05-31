import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

export type CountryOption = {
  value: string;
  label: string;
};

const SUB_SAHARAN_CODES = [
  "AO", // Angola
  "BJ", // Benin
  "BW", // Botswana
  "BF", // Burkina Faso
  "BI", // Burundi
  "CV", // Cabo Verde
  "CM", // Cameroon
  "CF", // Central African Republic
  "TD", // Chad
  "KM", // Comoros
  "CD", // Democratic Republic of the Congo
  "CG", // Republic of the Congo
  "GQ", // Equatorial Guinea
  "ER", // Eritrea
  "SZ", // Eswatini
  "ET", // Ethiopia
  "GA", // Gabon
  "GM", // Gambia
  "GH", // Ghana
  "GN", // Guinea
  "GW", // Guinea-Bissau
  "CI", // Ivory Coast
  "KE", // Kenya
  "LS", // Lesotho
  "LR", // Liberia
  "MG", // Madagascar
  "MW", // Malawi
  "ML", // Mali
  "MR", // Mauritania
  "MU", // Mauritius
  "MZ", // Mozambique
  "NA", // Namibia
  "NE", // Niger
  "NG", // Nigeria
  "RW", // Rwanda
  "ST", // Sao Tome and Principe
  "SN", // Senegal
  "SC", // Seychelles
  "SL", // Sierra Leone
  "SO", // Somalia
  "ZA", // South Africa
  "SS", // South Sudan
  "SD", // Sudan
  "TZ", // Tanzania
  "TG", // Togo
  "UG", // Uganda
  "ZM", // Zambia
  "ZW", // Zimbabwe
];

const allCountries = countries.getNames("en");

const sortedCountries: CountryOption[] = SUB_SAHARAN_CODES.filter(
  (code) => allCountries[code],
)
  .map((code) => ({ value: code, label: allCountries[code] }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const COUNTRY_OPTIONS: CountryOption[] = [
  { value: "", label: "Select your country" },
  ...sortedCountries,
];
