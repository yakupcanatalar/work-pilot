// services/authService.ts
import axios from "axios";
import { UserData } from "../types/UserData";
import { AuthResponse } from "../types/AuthResponse";
import { LoginData } from "../types/LoginData";

//const API_URL = "http://137.184.83.58:8080/api/v1/";
const API_URL = "http://localhost:8080/api/v1/";
const AUTH_URL = `${API_URL}auth`;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = async (
  userData: UserData
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      `${AUTH_URL}/register`,
      userData
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Register error:", error.response.data);
      throw error.response.data;
    }
    throw error;
  }
};

export const loginUser = async (userData: LoginData): Promise<AuthResponse> => {
  const response = await axiosInstance.put<AuthResponse>(
    `${AUTH_URL}/authenticate`,
    userData
  );
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await axiosInstance.post(`${AUTH_URL}/logout`);
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    `${AUTH_URL}/refresh`
  );
  return response.data;
};
