import { useAxios } from "../utils/TokenService";

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
    const response = await axiosInstance.get<UserDto>(USER_URL);
    return response.data;
  };

  const updateUserProfile = async (
    updateData: UserUpdateRequest
  ): Promise<void> => {
    await axiosInstance.put(USER_URL, updateData);
  };

  const changePassword = async (
    passwordData: ChangePasswordRequest
  ): Promise<void> => {
    await axiosInstance.put(`${USER_URL}/change/password`, passwordData);
  };

  return {
    getUserProfile,
    updateUserProfile,
    changePassword,
  };
};