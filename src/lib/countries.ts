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

/** Canonical labels accepted by PATCH /api/users/me (staging OpenAPI enum). */
export const API_COUNTRY_LABEL_BY_CODE: Record<string, string> = {
  AO: "Angola",
  BJ: "Benin",
  BW: "Botswana",
  BF: "Burkina Faso",
  BI: "Burundi",
  CV: "Cabo Verde (Cape Verde)",
  CM: "Cameroon",
  CF: "Central African Republic",
  TD: "Chad",
  KM: "Comoros",
  CD: "Democratic Republic of the Congo (DRC)",
  CG: "Republic of the Congo",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  SZ: "Eswatini (Swaziland)",
  ET: "Ethiopia",
  GA: "Gabon",
  GM: "Gambia",
  GH: "Ghana",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  CI: "Ivory Coast (Côte d'Ivoire)",
  KE: "Kenya",
  LS: "Lesotho",
  LR: "Liberia",
  MG: "Madagascar",
  MW: "Malawi",
  ML: "Mali",
  MR: "Mauritania",
  MU: "Mauritius",
  MZ: "Mozambique",
  NA: "Namibia",
  NE: "Niger",
  NG: "Nigeria",
  RW: "Rwanda",
  ST: "Sao Tome and Principe",
  SN: "Senegal",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SO: "Somalia",
  ZA: "South Africa",
  SS: "South Sudan",
  SD: "Sudan",
  TZ: "Tanzania",
  TG: "Togo",
  UG: "Uganda",
  ZM: "Zambia",
  ZW: "Zimbabwe",
};

const API_LABEL_TO_CODE = Object.fromEntries(
  Object.entries(API_COUNTRY_LABEL_BY_CODE).map(([code, label]) => [
    label,
    code,
  ]),
) as Record<string, string>;

/** ISO code → API enum label for PATCH /api/users/me. */
export function countryCodeToApiLabel(code: string): string | null {
  const normalized = code.trim().toUpperCase();
  return API_COUNTRY_LABEL_BY_CODE[normalized] ?? null;
}

/** API / profile country value → ISO code for the select control. */
export function apiCountryLabelToCode(raw: string | null | undefined): string {
  if (!raw?.trim()) return "";

  const value = raw.trim();
  const fromApi = API_LABEL_TO_CODE[value];
  if (fromApi) return fromApi;

  const fromUiLabel = COUNTRY_OPTIONS.find(
    (option) => option.label.toLowerCase() === value.toLowerCase(),
  );
  if (fromUiLabel?.value) return fromUiLabel.value;

  // Some API responses may return a raw ISO code instead of the enum label.
  const upper = value.toUpperCase();
  if (upper.length === 2 && API_COUNTRY_LABEL_BY_CODE[upper]) {
    return upper;
  }

  return "";
}
