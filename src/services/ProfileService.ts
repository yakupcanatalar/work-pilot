// services/profileService.ts
import axios from "axios";

//const API_URL = "http://137.184.83.58:8080/api/v1/";
const API_URL = "http://localhost:8080/api/v1/";
const USER_URL = `${API_URL}users`;

// Types matching your backend DTOs
export interface UserDto {
  firstname: string;
  lastname: string;
  email: string;
  companyName: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmationPassword: string; 
}

export interface UserUpdateRequest {
  firstname?: string;
  lastname?: string;
  email?: string;
  companyName?: string;
  phone?: string;
  address?: string;
}

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getUserProfile = async (): Promise<UserDto> => {
  try {
    const response = await axiosInstance.get<UserDto>(USER_URL);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Get profile error:", error.response.data);
      throw error.response.data;
    }
    throw error;
  }
};

export const updateUserProfile = async (
  updateData: UserUpdateRequest
): Promise<void> => {
  try {
    await axiosInstance.put(USER_URL, updateData);
  } catch (error: any) {
    if (error.response) {
      console.error("Update profile error:", error.response.data);
      throw error.response.data;
    }
    throw error;
  }
};

export const changePassword = async (
  passwordData: ChangePasswordRequest
): Promise<void> => {
  try {
    await axiosInstance.put(`${USER_URL}/change/password`, passwordData);
  } catch (error: any) {
    if (error.response) {
      console.error("Change password error:", error.response.data);
      throw error.response.data;
    }
    throw error;
  }
};

export const profileService = {
  getUserProfile,
  updateUserProfile,
  changePassword,
};