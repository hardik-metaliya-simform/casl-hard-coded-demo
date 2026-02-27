import axiosInstance from "../api/axiosInstance";
import type {
  LoginDto,
  RegisterDto,
  User,
  UserContext,
  Abilities,
} from "../types";

class AuthService {
  private static instance: AuthService;
  private currentUser: UserContext | null = null;
  private currentAbilities: Abilities | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(dto: LoginDto): Promise<User> {
    const response = await axiosInstance.post("/auth/login", dto);
    localStorage.setItem("accessToken", response.data.accessToken);

    // Fetch user context and abilities
    await this.loadUserData();

    return response.data.user;
  }

  async register(dto: RegisterDto): Promise<User> {
    const response = await axiosInstance.post("/auth/register", dto);
    return response.data;
  }

  async loadUserData(): Promise<void> {
    try {
      const [userResponse, abilitiesResponse] = await Promise.all([
        axiosInstance.get("/auth/me"),
        axiosInstance.get("/auth/abilities"),
      ]);

      this.currentUser = userResponse.data;
      this.currentAbilities = abilitiesResponse.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem("accessToken");
    this.currentUser = null;
    this.currentAbilities = null;
    window.location.href = "/login";
  }

  getUser(): UserContext | null {
    return this.currentUser;
  }

  getAbilities(): Abilities | null {
    return this.currentAbilities;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken") && !!this.currentUser;
  }

  async initialize(): Promise<void> {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        await this.loadUserData();
      } catch (error) {
        console.error("Failed to load user data:", error);
        this.logout();
      }
    }
  }
}

export const authService = AuthService.getInstance();
