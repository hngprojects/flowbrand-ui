import axios, { AxiosInstance } from "axios";

const Calls = (): AxiosInstance => {
  const baseURL = process.env.BASE_URL;
  return axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
};

const CallsWithBearer = (
  baseURL: string,
  authorization: string,
): AxiosInstance => {
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${authorization}`,
    },
  });
};

export { Calls, CallsWithBearer };
