import axiosInstance from "./axiosInstance";
import type { Team } from "../types";

export const teamsApi = {
  async getAll(): Promise<Team[]> {
    const response = await axiosInstance.get("/teams");
    return response.data;
  },

  async getById(id: number): Promise<Team> {
    const response = await axiosInstance.get(`/teams/${id}`);
    return response.data;
  },

  async create(data: Partial<Team>): Promise<Team> {
    const response = await axiosInstance.post("/teams", data);
    return response.data;
  },

  async update(id: number, data: Partial<Team>): Promise<Team> {
    const response = await axiosInstance.patch(`/teams/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/teams/${id}`);
  },
};
