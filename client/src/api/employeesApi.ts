import axiosInstance from "./axiosInstance";
import type { Employee } from "../types";

export const employeesApi = {
  async getAll(): Promise<Employee[]> {
    const response = await axiosInstance.get("/employees");
    return response.data;
  },

  async getById(id: number): Promise<Employee> {
    const response = await axiosInstance.get(`/employees/${id}`);
    return response.data;
  },

  async create(data: Partial<Employee>): Promise<Employee> {
    const response = await axiosInstance.post("/employees", data);
    return response.data;
  },

  async update(id: number, data: Partial<Employee>): Promise<Employee> {
    const response = await axiosInstance.patch(`/employees/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/employees/${id}`);
  },
};
