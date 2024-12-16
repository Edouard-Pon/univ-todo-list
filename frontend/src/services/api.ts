import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setToken = (token: string) => {
  api.defaults.headers.Authorization = `Bearer ${token}`;
};

export const clearToken = () => {
  delete api.defaults.headers.Authorization;
};

