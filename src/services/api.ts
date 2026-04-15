import { Client, Designer, Project, Payment } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

export const api = {
  // Clients
  getClients: () => fetcher<Client[]>('/clients'),
  createClient: (data: Omit<Client, 'id' | 'createdAt' | 'created_at'>) => fetcher<Client[]>('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: number, data: Partial<Client>) => fetcher<Client[]>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClient: (id: number) => fetcher<Client[]>(`/clients/${id}`, { method: 'DELETE' }),

  // Designers (Maps to Employees)
  getEmployees: () => fetcher<Designer[]>('/employees'),
  createEmployee: (data: Omit<Designer, 'id' | 'created_at'>) => fetcher<Designer[]>('/employees', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id: number, data: Partial<Designer>) => fetcher<Designer[]>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmployee: (id: number) => fetcher<Designer[]>(`/employees/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: () => fetcher<Project[]>('/projects'),
  createProject: (data: Omit<Project, 'id' | 'created_at'>) => fetcher<Project[]>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: number, data: Partial<Project>) => fetcher<Project[]>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: number) => fetcher<Project[]>(`/projects/${id}`, { method: 'DELETE' }),

  // Payments
  getPayments: () => fetcher<Payment[]>('/payments'),
  createPayment: (data: Omit<Payment, 'id' | 'created_at'>) => fetcher<Payment[]>('/payments', { method: 'POST', body: JSON.stringify(data) }),
  updatePayment: (id: number, data: Partial<Payment>) => fetcher<Payment[]>(`/payments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePayment: (id: number) => fetcher<Payment[]>(`/payments/${id}`, { method: 'DELETE' }),
};
