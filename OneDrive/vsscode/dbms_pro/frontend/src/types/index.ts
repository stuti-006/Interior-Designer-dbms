export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: string;
  created_at?: string; // supabase might use this
}

export interface Designer {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  rate: number;
  created_at?: string;
}

export interface Project {
  id: number;
  name: string;
  clientId: number;
  designerId: number;
  client_id?: number; // fallback for supabase
  designer_id?: number;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  budget: number;
  startDate: string;
  endDate: string;
  start_date?: string;
  end_date?: string;
  description: string;
  created_at?: string;
}

export interface Payment {
  id: number;
  projectId: number;
  project_id?: number; // fallback for supabase
  amount: number;
  date: string;
  method: "bank-transfer" | "credit-card" | "cash" | "check";
  status: "paid" | "pending" | "overdue";
  description: string;
  created_at?: string;
}
