import axios from "axios";
import { useToken } from "../utils/TokenContext";

const API_URL = process.env.REACT_APP_API_URL;
const AUTH_URL = `${API_URL}auth`;

interface RefreshTokenResponse {
  accessToken: string;
}

export const useAxios = () => {
  const { accessToken, setAccessToken, refreshToken } = useToken();

  const axiosInstance = axios.create({
    baseURL: API_URL,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        refreshToken
      ) {
        originalRequest._retry = true;
        try {
          const response = await axios.post<RefreshTokenResponse>(
            `${AUTH_URL}/refresh`,
            { refreshToken }
          );
          const newAccessToken = response.data.accessToken;
          setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
