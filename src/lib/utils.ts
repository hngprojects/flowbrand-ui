import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const inDevEnvironment =
  typeof process !== "undefined" && process.env.NODE_ENV === "development";

export const ROOT_DOMAIN = "abincii.online";

export function getSubdomain(hostname: string, rootDomain: string): string {
  hostname = hostname.split(":")[0];
  if (hostname.endsWith(`.${rootDomain}`)) {
    const subdomain = hostname.slice(0, -rootDomain.length - 1);
    return subdomain;
  }
  if (hostname === rootDomain) {
    return "";
  }
  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    if (parts.length > 1) {
      return parts[0];
    }
    return "";
  }
  const parts = hostname.split(".");
  if (parts.length > 2) {
    return parts[0];
  }

  return "";
}
