import React, { createContext, useContext, useState, useEffect } from "react";

type TokenContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
  clearTokens: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // Token yükleme durumu için
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // İlk yüklemede true

  // Component mount olduğunda localStorage'dan token'ları yükle
  useEffect(() => {
    const loadTokens = () => {
      try {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");
        
        if (storedAccessToken) setAccessTokenState(storedAccessToken);
        if (storedRefreshToken) setRefreshTokenState(storedRefreshToken);
      } catch (error) {
        console.error("Error loading tokens from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, []);

  // Access token değiştiğinde localStorage'a kaydet
  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    try {
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.error("Error saving access token to localStorage:", error);
    }
  };

  // Refresh token değiştiğinde localStorage'a kaydet
  const setRefreshToken = (token: string | null) => {
    setRefreshTokenState(token);
    try {
      if (token) {
        localStorage.setItem("refreshToken", token);
      } else {
        localStorage.removeItem("refreshToken");
      }
    } catch (error) {
      console.error("Error saving refresh token to localStorage:", error);
    }
  };

  // Tüm token'ları temizle
  const clearTokens = () => {
    setAccessTokenState(null);
    setRefreshTokenState(null);
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      console.error("Error clearing tokens from localStorage:", error);
    }
  };

  // Kullanıcının authenticated olup olmadığını kontrol et
  const isAuthenticated = !!(accessToken && refreshToken);

  return (
    <TokenContext.Provider 
      value={{ 
        accessToken, 
        setAccessToken, 
        refreshToken, 
        setRefreshToken, 
        clearTokens,
        isAuthenticated,
        isLoading
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) throw new Error("useToken must be used within a TokenProvider");
  return context;
};