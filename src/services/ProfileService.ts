import { useAxios } from "../utils/TokenService";
import { ErrorMessage } from "../utils/ErrorMessage";

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

const USER_URL = "/users";

export const useProfileService = () => {
  const axiosInstance = useAxios();

  const getUserProfile = async (): Promise<UserDto> => {
    try {
      const response = await axiosInstance.get<UserDto>(USER_URL);
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const updateUserProfile = async (
    updateData: UserUpdateRequest
  ): Promise<void> => {
    try {
      await axiosInstance.put(USER_URL, updateData);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const changePassword = async (
    passwordData: ChangePasswordRequest
  ): Promise<void> => {
    try {
      await axiosInstance.put(`${USER_URL}/change/password`, passwordData);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };
  return {
    getUserProfile,
    updateUserProfile,
    changePassword,
  };
};