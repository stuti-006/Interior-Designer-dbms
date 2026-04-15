export interface Client {
  client_id: number;
  name: string;
  contact: string;
  address: string;
}

export interface Designer {
  employee_id: number;
  name: string;
  role: string;
  contact: string;
  experience: number;
  salary: number;
}

export interface Project {
  project_id: number;
  client_id: number;
  area_sqft: number;
  num_rooms: number;
  design_type: string;
  budget: number;
  start_date: string;
  end_date: string;
  employee_id:number;
  status: "planning" | "in-progress" | "completed" | "on-hold";
}

export interface Payment {
  id: number;
  project_id: number;
  amount: number;
  date: string;
  method: "bank-transfer" | "credit-card" | "cash" | "check";
  status: "paid" | "pending" | "overdue";
  description: string;
}
