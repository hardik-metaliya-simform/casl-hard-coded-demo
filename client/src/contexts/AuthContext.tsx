import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authApi } from "../api/authApi";
import type {
  UserContext,
  Abilities,
  LoginDto,
  RegisterDto,
  User,
} from "../types";

interface AuthContextType {
  user: UserContext | null;
  abilities: Abilities | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (dto: LoginDto) => Promise<User>;
  register: (dto: RegisterDto) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserContext | null>(null);
  const [abilities, setAbilities] = useState<Abilities | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserAndAbilities = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const [userData, abilitiesData] = await Promise.all([
        authApi.getMe(),
        authApi.getAbilities(),
      ]);

      setUser(userData);
      setAbilities(abilitiesData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndAbilities();
  }, []);

  const login = async (dto: LoginDto): Promise<User> => {
    const response = await authApi.login(dto);
    localStorage.setItem("accessToken", response.accessToken);

    // Fetch user and abilities after login
    const [userData, abilitiesData] = await Promise.all([
      authApi.getMe(),
      authApi.getAbilities(),
    ]);

    setUser(userData);
    setAbilities(abilitiesData);

    return response.user;
  };

  const register = async (dto: RegisterDto): Promise<User> => {
    const user = await authApi.register(dto);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setAbilities(null);
  };

  const isAuthenticated = !!user && !!abilities;

  return (
    <AuthContext.Provider
      value={{
        user,
        abilities,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
