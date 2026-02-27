import axiosInstance from "./axiosInstance";
import type { Department } from "../types";

export const departmentsApi = {
  async getAll(): Promise<Department[]> {
    const response = await axiosInstance.get("/departments");
    return response.data;
  },

  async getById(id: number): Promise<Department> {
    const response = await axiosInstance.get(`/departments/${id}`);
    return response.data;
  },

  async create(data: Partial<Department>): Promise<Department> {
    const response = await axiosInstance.post("/departments", data);
    return response.data;
  },

  async update(id: number, data: Partial<Department>): Promise<Department> {
    const response = await axiosInstance.patch(`/departments/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/departments/${id}`);
  },
};
