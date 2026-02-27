import axiosInstance from "./axiosInstance";
import type {
  LoginDto,
  RegisterDto,
  User,
  UserContext,
  Abilities,
} from "../types";

export const authApi = {
  async login(dto: LoginDto): Promise<{ accessToken: string; user: User }> {
    const response = await axiosInstance.post("/auth/login", dto);
    return response.data;
  },

  async register(dto: RegisterDto): Promise<User> {
    const response = await axiosInstance.post("/auth/register", dto);
    return response.data;
  },

  async getMe(): Promise<UserContext> {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  async getAbilities(): Promise<Abilities> {
    const response = await axiosInstance.get("/auth/abilities");
    return response.data;
  },
};
