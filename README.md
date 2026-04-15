# 🏠 Interior Design Management System

A full-stack web application to manage interior design projects, clients, employees, materials, and project execution efficiently.

---

## 🚀 Features

### 👤 Client Management

* Add, update, delete, and view client details
* Store contact and address information

### 👨‍💼 Employee Management

* Manage designers, workers, and managers
* Track salary, experience, and roles

### 🏗 Project Management

* Create and manage projects
* Assign clients to projects
* Track budget, area, and timelines

### 🔗 Project Assignment

* Assign employees to specific projects
* Define roles/work types per project

### 🧱 Material Management

* Maintain list of materials
* Track usage of materials per project


## 🛠 Tech Stack

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* ShadCN UI

### Backend

* Node.js
* Express.js

### Database

* Supabase (PostgreSQL)

---

## 📂 Project Structure

```
dbms_pro/
│
├── frontend/          # React frontend
│   ├── src/
│   └── package.json
│
├── backend/           # Express backend
│   ├── routes/
│   │   └── api.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd dbms_pro
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
PORT=5000
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

### Clients

* GET `/api/clients`
* POST `/api/clients`
* PUT `/api/clients/:id`
* DELETE `/api/clients/:id`

### Employees

* GET `/api/employees`
* POST `/api/employees`
* PUT `/api/employees/:id`
* DELETE `/api/employees/:id`

### Projects

* GET `/api/projects`
* POST `/api/projects`
* PUT `/api/projects/:id`
* DELETE `/api/projects/:id`

### Materials

* GET `/api/materials`
* POST `/api/materials`

### Project-Employee

* GET `/api/project-employees`

### Project-Material

* GET `/api/project-materials`


## 🗄 Database Schema Overview

### Client

* client_id (PK)
* name
* contact
* address

### Employee

* employee_id (PK)
* name
* role
* salary
* experience
* contact

### Project

* project_id (PK)
* client_id (FK)
* area_sqft
* num_rooms
* design_type
* budget
* start_date
* end_date
* employee_id (FK)
* status

### Project_Employee

* project_id (FK)
* employee_id (FK)
* work_type

### Material

* material_id (PK)
* name
* unit


### Project_Material

* project_id (FK)
* material_id (FK)
* quantity

---

## ⚠️ Important Notes

* Ensure **Row Level Security (RLS)** is disabled or configured properly in Supabase
* Table names must match exactly (case-sensitive)
* Use correct column names (e.g., `client_id`, not `id`)

---

## 📌 Future Improvements

* Authentication & role-based access
* Dashboard analytics
* Cost estimation module
* Notifications system

---

## 👩‍💻 Author

Developed as part of a DBMS project.

---
