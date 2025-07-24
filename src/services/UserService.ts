import { useAxios } from "../utils/TokenService";
import { UserData } from "../types/UserData";
import { AuthResponse } from "../types/AuthResponse";
import { LoginData } from "../types/LoginData";

export const useUserService = () => {
  const axiosInstance = useAxios();

  const registerUser = async (userData: UserData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      `/auth/register`,
      userData
    );
    return response.data;
  };

  const loginUser = async (userData: LoginData): Promise<AuthResponse> => {
    const response = await axiosInstance.put<AuthResponse>(
      `/auth/authenticate`,
      userData
    );
    return response.data;
  };

  const logoutUser = async (): Promise<void> => {
    await axiosInstance.post(`/auth/logout`);
  };

  const refreshToken = async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(`/auth/refresh`);
    return response.data;
  };

  return { registerUser, loginUser, logoutUser, refreshToken };
};