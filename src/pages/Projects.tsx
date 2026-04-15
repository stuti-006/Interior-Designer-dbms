import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Pencil, Trash2, Calendar, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { useProjects, useClients, usePayments, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/useQueries";
import { Project } from "@/types";

export default function Projects() {
  const { data: projectList = [], isLoading: pLoading } = useProjects();
  const { data: clientsList = [], isLoading: cLoading } = useClients();
  const { data: paymentsList = [], isLoading: payLoading } = usePayments();

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ client_id: "", area_sqft: "", num_rooms: "", design_type: "", budget: "", start_date: "", end_date: "" });

  const filtered = projectList.filter(p => {
    const matchSearch = p.design_type?.toLowerCase().includes(search.toLowerCase());
    return matchSearch || search === "";
  });

  const openAdd = () => { setEditing(null); setForm({ client_id: "", area_sqft: "", num_rooms: "", design_type: "", budget: "", start_date: "", end_date: "" }); setDialogOpen(true); };
  
  const openEdit = (p: Project) => { 
    setEditing(p); 
    setForm({ client_id: String(p.client_id), area_sqft: String(p.area_sqft), num_rooms: String(p.num_rooms), design_type: p.design_type, budget: String(p.budget), start_date: p.start_date || "", end_date: p.end_date || "" }); 
    setDialogOpen(true); 
  };

  const handleSave = async () => {
    if (!form.client_id || !form.design_type) { toast.error("Client and Design Type are required"); return; }
    try {
      const payload = { client_id: Number(form.client_id), area_sqft: Number(form.area_sqft), num_rooms: Number(form.num_rooms), design_type: form.design_type, budget: Number(form.budget), start_date: form.start_date, end_date: form.end_date };
      if (editing) {
        await updateProject.mutateAsync({ id: editing.project_id, ...payload });
        toast.success("Project updated");
      } else {
        await createProject.mutateAsync(payload as any);
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

  const getPaid = (projectId: number) => paymentsList.filter(p => (p.project_id === projectId) && p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const getClientName = (id: number) => clientsList.find(c => c.client_id === id)?.name ?? "Unknown";

  const isLoading = pLoading || cLoading || payLoading;

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client</Label>
                  <Select value={form.client_id} onValueChange={v => setForm(f => ({ ...f, client_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                    <SelectContent>
                      {clientsList.map(c => <SelectItem key={c.client_id} value={String(c.client_id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Design Type</Label>
                  <Input value={form.design_type} onChange={e => setForm(f => ({ ...f, design_type: e.target.value }))} placeholder="e.g. Minimalist" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Area (Sqft)</Label><Input type="number" value={form.area_sqft} onChange={e => setForm(f => ({ ...f, area_sqft: e.target.value }))} /></div>
                <div><Label>Number of Rooms</Label><Input type="number" value={form.num_rooms} onChange={e => setForm(f => ({ ...f, num_rooms: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Budget (₹)</Label><Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} /></div>
                <div><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} /></div>
                <div><Label>End Date</Label><Input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} /></div>
              </div>
              <Button onClick={handleSave} className="w-full" disabled={createProject.isPending || updateProject.isPending}>{editing ? "Update" : "Create"} Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search projects by design type..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground p-8 text-center">Loading Data...</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted-foreground p-8 text-center">No projects found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(project => {
            const paid = getPaid(project.project_id);
            const progress = project.budget > 0 ? Math.round((paid / project.budget) * 100) : 0;

            return (
              <Card key={project.project_id} className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading font-semibold">{project.design_type || 'Unknown'} Project</h3>
                        <Badge variant="outline">{project.area_sqft} sqft | {project.num_rooms} rooms</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(project)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(project.project_id)} disabled={deleteProject.isPending}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <p className="text-muted-foreground">Client: <span className="text-foreground">{getClientName(project.client_id)}</span></p>
                    <p className="text-muted-foreground"></p>
                    <p className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{project.start_date || '?'} — {project.end_date || '?'}</p>
                    <p className="text-muted-foreground flex items-center gap-1"><IndianRupee className="w-3 h-3" />Budget: ₹{project.budget?.toLocaleString("en-IN") || 0}</p>
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
