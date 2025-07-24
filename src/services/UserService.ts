import { useAxios } from "../utils/TokenService";
import { useToken } from "../utils/TokenContext";
import { UserData } from "../types/UserData";
import { AuthResponse } from "../types/AuthResponse";
import { LoginData } from "../types/LoginData";

export const useUserService = () => {
  const axiosInstance = useAxios();
  const { setAccessToken, setRefreshToken, clearTokens, isAuthenticated } = useToken();

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
    
    // Login başarılıysa token'ları context'e kaydet
    if (response.data.access_token && response.data.refresh_token) {
      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);
    }
    
    return response.data;
  };

  const logoutUser = async (): Promise<void> => {
    try {
      await axiosInstance.post(`/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Server hatası olsa bile local token'ları temizle
      clearTokens();
    }
  };

  const refreshTokens = async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(`/auth/refresh`);
    
    // Refresh başarılıysa yeni token'ları kaydet
    if (response.data.access_token) {
      setAccessToken(response.data.refresh_token);
      if (response.data.refresh_token) {
        setRefreshToken(response.data.access_token);
      }
    }
    
    return response.data;
  };

  // Manuel token yenileme (interceptor dışında)
  const manualRefresh = async (): Promise<AuthResponse> => {
    try {
      return await refreshTokens();
    } catch (error) {
      clearTokens();
      throw error;
    }
  };

  // Kullanıcı bilgilerini getir
  const getCurrentUser = async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  };

  // Şifre değiştirme
  const changePassword = async (passwordData: { 
    currentPassword: string; 
    newPassword: string; 
  }) => {
    const response = await axiosInstance.put('/auth/change-password', passwordData);
    return response.data;
  };

  // Email doğrulama
  const verifyEmail = async (token: string) => {
    const response = await axiosInstance.post('/auth/verify-email', { token });
    return response.data;
  };

  // Şifre sıfırlama isteği
  const requestPasswordReset = async (email: string) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  };

  // Şifre sıfırlama
  const resetPassword = async (token: string, newPassword: string) => {
    const response = await axiosInstance.post('/auth/reset-password', { 
      token, 
      newPassword 
    });
    return response.data;
  };

  return { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshTokens: manualRefresh,
    getCurrentUser,
    changePassword,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    isAuthenticated: () => isAuthenticated
  };
};