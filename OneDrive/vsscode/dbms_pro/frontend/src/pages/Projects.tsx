import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Pencil, Trash2, Calendar, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { useProjects, useClients, useDesigners, usePayments, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/useQueries";
import { Project } from "@/types";

const statusColor: Record<string, string> = {
  "in-progress": "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  planning: "bg-muted text-muted-foreground border-border",
  "on-hold": "bg-warning/10 text-warning border-warning/20",
};

export default function Projects() {
  const { data: projectList = [], isLoading: pLoading } = useProjects();
  const { data: clientsList = [], isLoading: cLoading } = useClients();
  const { data: designersList = [], isLoading: dLoading } = useDesigners();
  const { data: paymentsList = [], isLoading: payLoading } = usePayments();

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ name: "", clientId: "", designerId: "", status: "planning" as Project["status"], budget: "", startDate: "", endDate: "", description: "" });

  const filtered = projectList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setEditing(null); setForm({ name: "", clientId: "", designerId: "", status: "planning", budget: "", startDate: "", endDate: "", description: "" }); setDialogOpen(true); };
  
  const openEdit = (p: Project) => { 
    setEditing(p); 
    const cid = p.clientId || p.client_id;
    const did = p.designerId || p.designer_id;
    const sd = p.startDate || p.start_date || "";
    const ed = p.endDate || p.end_date || "";
    setForm({ name: p.name, clientId: String(cid), designerId: String(did), status: p.status, budget: String(p.budget), startDate: sd, endDate: ed, description: p.description }); 
    setDialogOpen(true); 
  };

  const handleSave = async () => {
    if (!form.name || !form.clientId || !form.designerId) { toast.error("Name, client, and designer are required"); return; }
    try {
      const payload = { ...form, clientId: Number(form.clientId), designerId: Number(form.designerId), budget: Number(form.budget) };
      if (editing) {
        await updateProject.mutateAsync({ id: editing.id, ...payload });
        toast.success("Project updated");
      } else {
        await createProject.mutateAsync(payload);
        toast.success("Project added");
      }
      setDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save project");
    }
  };

  const handleDelete = async (id: number) => { 
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Project removed"); 
    } catch (e: any) {
      toast.error(e.message || "Failed to delete project");
    }
  };

  const getPaid = (projectId: number) => paymentsList.filter(p => (p.projectId === projectId || p.project_id === projectId) && p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const getClientName = (id: number) => clientsList.find(c => c.id === id)?.name ?? "Unknown";
  const getDesignerName = (id: number) => designersList.find(d => d.id === id)?.name ?? "Unknown";

  const isLoading = pLoading || cLoading || dLoading || payLoading;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-heading font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Track and manage all design projects</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />New Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Project</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Project Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client</Label>
                  <Select value={form.clientId} onValueChange={v => setForm(f => ({ ...f, clientId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                    <SelectContent>
                      {clientsList.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Designer</Label>
                  <Select value={form.designerId} onValueChange={v => setForm(f => ({ ...f, designerId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select designer" /></SelectTrigger>
                    <SelectContent>
                      {designersList.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as Project["status"] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Budget (₹)</Label><Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
                <div><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <Button onClick={handleSave} className="w-full" disabled={createProject.isPending || updateProject.isPending}>{editing ? "Update" : "Create"} Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground p-8 text-center">Loading Data...</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted-foreground p-8 text-center">No projects found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(project => {
            const paid = getPaid(project.id);
            const progress = project.budget > 0 ? Math.round((paid / project.budget) * 100) : 0;
            const cid = project.clientId || project.client_id;
            const did = project.designerId || project.designer_id;
            const sd = project.startDate || project.start_date;
            const ed = project.endDate || project.end_date;

            return (
              <Card key={project.id} className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading font-semibold">{project.name}</h3>
                        <Badge variant="outline" className={statusColor[project.status]}>{project.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(project)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(project.id)} disabled={deleteProject.isPending}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <p className="text-muted-foreground">Client: <span className="text-foreground">{cid !== undefined ? getClientName(cid) : 'Unknown'}</span></p>
                    <p className="text-muted-foreground">Designer: <span className="text-foreground">{did !== undefined ? getDesignerName(did) : 'Unknown'}</span></p>
                    <p className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{sd} — {ed}</p>
                    <p className="text-muted-foreground flex items-center gap-1"><IndianRupee className="w-3 h-3" />Budget: ₹{project.budget.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Payment Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
