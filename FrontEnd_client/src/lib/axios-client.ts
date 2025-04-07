import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response || {};

    const isAuthRoute = window.location.pathname === "/" || 
                       window.location.pathname === "/sign-in" || 
                       window.location.pathname === "/sign-up" ||
                       window.location.pathname === "/google/oauth/callback" ||
                       window.location.pathname.startsWith("/invite/workspace/");

    if (!isAuthRoute && (data?.errorCode === "ACCESS_UNAUTHORIZED" || (data === "Unauthorized" && status === 401))) {
      window.location.href = "/";
      return;
    }

    const CustomError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(CustomError);
  }
);

export default API;