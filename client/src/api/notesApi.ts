import axiosInstance from "./axiosInstance";
import type { Note } from "../types";

export const notesApi = {
  async getAll(): Promise<Note[]> {
    const response = await axiosInstance.get("/notes");
    return response.data;
  },

  async getById(id: number): Promise<Note> {
    const response = await axiosInstance.get(`/notes/${id}`);
    return response.data;
  },

  async create(data: Partial<Note>): Promise<Note> {
    const response = await axiosInstance.post("/notes", data);
    return response.data;
  },

  async update(id: number, data: Partial<Note>): Promise<Note> {
    const response = await axiosInstance.patch(`/notes/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/notes/${id}`);
  },
};
