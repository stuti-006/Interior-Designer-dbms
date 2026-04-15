import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useClients, useEmployees, useProjects, usePayments } from "@/hooks/useQueries";

const COLORS = ["hsl(28, 60%, 45%)", "hsl(160, 30%, 40%)", "hsl(38, 92%, 50%)", "hsl(0, 65%, 50%)"];

export default function Reports() {
  const { data: clients = [], isLoading: cLoading } = useClients();
  const { data: employees = [], isLoading: eLoading } = useEmployees();
  const { data: projects = [], isLoading: pLoading } = useProjects();
  const { data: payments = [], isLoading: payLoading } = usePayments();

  const isLoading = cLoading || eLoading || pLoading || payLoading;

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading Analytics...</div>;
  }

  // Project status breakdown
 const statusData = [
  { name: "Planning", value: projects.filter(p => p.status === "planning").length },
  { name: "In Progress", value: projects.filter(p => p.status === "in-progress").length },
  { name: "Completed", value: projects.filter(p => p.status === "completed").length },
  { name: "On Hold", value: projects.filter(p => p.status === "on-hold").length },
];

  // Budget per project
  const budgetData = projects.map(p => ({
  name: `Project #${p.project_id}`,
  budget: p.budget,
  paid: payments
    .filter(pay => pay.project_id === p.project_id && pay.status === "paid")
    .reduce((s, pay) => s + pay.amount, 0),
}));

  const designerData = employees.map(d => ({
  name: d.name?.split(" ")[0] || "Unknown",
  projects: projects.filter(p => p.employee_id === d.employee_id).length,
}));

  // Payment method breakdown
  const methodData = [
    { name: "Bank Transfer", value: payments.filter(p => p.method === "bank-transfer").length },
    { name: "Credit Card", value: payments.filter(p => p.method === "credit-card").length },
    { name: "Cash", value: payments.filter(p => p.method === "cash").length },
    { name: "Check", value: payments.filter(p => p.method === "check").length },
  ].filter(d => d.value > 0);

  const totalRevenue = payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const avgProjectBudget = projects.length > 0 ? Math.round(totalBudget / projects.length) : 0;

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-heading font-semibold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">Analytics and business insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-heading font-semibold mt-1">₹{totalRevenue.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-3xl font-heading font-semibold mt-1">₹{totalBudget.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Avg. Project Budget</p>
            <p className="text-3xl font-heading font-semibold mt-1">₹{avgProjectBudget.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-lg font-heading">Budget vs Paid per Project</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                <Bar dataKey="budget" fill="hsl(28, 60%, 45%)" radius={[4, 4, 0, 0]} name="Budget" />
                <Bar dataKey="paid" fill="hsl(160, 30%, 40%)" radius={[4, 4, 0, 0]} name="Paid" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-lg font-heading">Project Status</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground">No data</p>}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-lg font-heading">Designer Workload</CardTitle></CardHeader>
          <CardContent>
            {designerData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={designerData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={60} />
                  <Tooltip />
                  <Bar dataKey="projects" fill="hsl(28, 60%, 55%)" radius={[0, 4, 4, 0]} name="Projects" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground">No data</p>}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-lg font-heading">Payment Methods</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            {methodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={methodData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {methodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground">No data</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
