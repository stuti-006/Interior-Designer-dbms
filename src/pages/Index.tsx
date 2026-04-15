import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Palette, FolderKanban, TrendingUp } from "lucide-react";
import { useClients, useEmployees, useProjects } from "@/hooks/useQueries";

export default function Dashboard() {
const { data: clients = [], isLoading: cLoading } = useClients();
const { data: employees = [], isLoading: dLoading } = useEmployees();
const { data: projects = [], isLoading: pLoading } = useProjects();

const isLoading = cLoading || dLoading || pLoading;

if (isLoading) {
return <div className="p-8 text-center text-muted-foreground">Loading Dashboard...</div>;
}

// ✅ Correct ID mapping
const getClientName = (id: number) =>
clients.find(c => c.client_id === id)?.name ?? "Unknown";

const getEmployeeName = (id: number) =>
employees.find(e => e.employee_id === id)?.name ?? "Unknown";

// ✅ Ongoing projects logic (no status column)
const today = new Date();

const ongoingProjects = projects.filter(p => {
return new Date(p.start_date) <= today &&
(!p.end_date || new Date(p.end_date) >= today);
});

const completedProjects = projects.filter(p => p.end_date && new Date(p.end_date) < today);

const stats = [
{
label: "Total Clients",
value: clients.length,
icon: Users,
trend: "+2 this month"
},
{
label: "Total Employees",
value: employees.length,
icon: Palette,
trend: "Team active"
},
{
label: "Ongoing Projects",
value: ongoingProjects.length,
icon: FolderKanban,
trend: "Active work"
},
{
label: "Completed Projects",
value: completedProjects.length,
icon: FolderKanban,
trend: "Finished"
},
];

const recentProjects = projects.slice(0, 4);

return ( <div className="space-y-8 max-w-7xl">


  {/* Header */}
  <div>
    <h1 className="text-3xl font-semibold">Dashboard</h1>
    <p className="text-muted-foreground mt-1">Welcome back</p>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((stat) => (
      <Card key={stat.label}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
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

  {/* Recent Projects */}
  <Card>
    <CardHeader>
      <CardTitle>Recent Projects</CardTitle>
    </CardHeader>

    <CardContent className="space-y-3">
      {recentProjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects found.</p>
      ) : (
        recentProjects.map((project) => (
          <div
            key={project.project_id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
          >
            <div>
              <p className="font-medium text-sm">
                Project #{project.project_id}
              </p>

              <p className="text-xs text-muted-foreground">
                {getClientName(project.client_id)} · Area: {project.area_sqft} sqft
              </p>
            </div>

            <Badge variant="outline">
              {project.end_date ? "Completed" : "Ongoing"}
            </Badge>
          </div>
        ))
      )}
    </CardContent>
  </Card>

</div>


);
}
