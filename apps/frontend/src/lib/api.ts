import { FileType } from "@audit-system/shared";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export async function getAll<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  const { data } = await api.get<T>(endpoint, { params });
  return data;
}

export async function getById<T>(endpoint: string, id: number): Promise<T> {
  const { data } = await api.get<T>(`${endpoint}/${id}`);
  return data;
}

export async function create<T, D = T>(
  endpoint: string,
  payload: T
): Promise<D> {
  const { data } = await api.post(endpoint, payload);
  return data;
}

export async function update<T, D = T>(
  endpoint: string,
  id: number | string,
  payload: T
): Promise<D> {
  const { data } = await api.put(`${endpoint}/${id}`, payload);
  return data;
}

export async function updateById<T, D = T>(
  endpoint: string,
  id: number | string,
  payload: T
): Promise<D> {
  const { data } = await api.patch(`${endpoint}/${id}`, payload);
  return data;
}

export function deleteById(
  endpoint: string,
  id: number | string
): Promise<void> {
  return api.delete(`${endpoint}/${id}`);
}

export async function uploadFile(file: File): Promise<FileType> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/upload", formData);
  return data;
}

export default api;
