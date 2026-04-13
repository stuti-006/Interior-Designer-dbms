import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Palette, FolderKanban, DollarSign, TrendingUp, Clock } from "lucide-react";
import { useClients, useDesigners, useProjects, usePayments } from "@/hooks/useQueries";

const statusColor: Record<string, string> = {
  "in-progress": "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  planning: "bg-muted text-muted-foreground border-border",
  "on-hold": "bg-warning/10 text-warning border-warning/20",
};

export default function Dashboard() {
  const { data: clients = [], isLoading: cLoading } = useClients();
  const { data: designers = [], isLoading: dLoading } = useDesigners();
  const { data: projects = [], isLoading: pLoading } = useProjects();
  const { data: payments = [], isLoading: payLoading } = usePayments();

  const isLoading = cLoading || dLoading || pLoading || payLoading;

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading Dashboard...</div>;
  }

  const getClientName = (id: number) => clients.find(c => c.id === id)?.name ?? "Unknown";
  const getDesignerName = (id: number) => designers.find(d => d.id === id)?.name ?? "Unknown";

  const stats = [
    { label: "Total Clients", value: clients.length, icon: Users, trend: "+2 this month" },
    { label: "Active Designers", value: designers.length, icon: Palette, trend: "All assigned" },
    { label: "Ongoing Projects", value: projects.filter(p => p.status === "in-progress").length, icon: FolderKanban, trend: "2 starting soon" },
    { label: "Revenue Collected", value: `₹${payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0).toLocaleString("en-IN")}`, icon: DollarSign, trend: "+12% vs last quarter" },
  ];

  const recentProjects = projects.slice(0, 4);
  const pendingPayments = payments.filter(p => p.status !== "paid").slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-heading font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to your design studio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-heading font-semibold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProjects.length === 0 && <p className="text-sm text-muted-foreground">No recent projects.</p>}
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{project.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {getClientName(project.clientId || project.client_id || 0)} · {getDesignerName(project.designerId || project.designer_id || 0)}
                  </p>
                </div>
                <Badge variant="outline" className={statusColor[project.status]}>
                  {project.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-heading">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingPayments.length === 0 && <p className="text-sm text-muted-foreground">No pending payments.</p>}
            {pendingPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">
                    {projects.find(p => p.id === payment.projectId || p.id === payment.project_id)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Due {payment.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">₹{payment.amount.toLocaleString("en-IN")}</p>
                  <Badge variant="outline" className={payment.status === "overdue" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-warning/10 text-warning border-warning/20"}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
