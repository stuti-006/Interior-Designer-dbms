import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { useDesigners, useCreateDesigner, useUpdateDesigner, useDeleteDesigner } from "@/hooks/useQueries";
import { Designer } from "@/types";

export default function Designers() {
  const { data: designerList = [], isLoading } = useDesigners();
  const createDesigner = useCreateDesigner();
  const updateDesigner = useUpdateDesigner();
  const deleteDesigner = useDeleteDesigner();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Designer | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", specialty: "", experience: "", rate: "" });

  const filtered = designerList.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm({ name: "", email: "", phone: "", specialty: "", experience: "", rate: "" }); setDialogOpen(true); };
  const openEdit = (d: Designer) => { setEditing(d); setForm({ name: d.name, email: d.email, phone: d.phone, specialty: d.specialty, experience: String(d.experience), rate: String(d.rate) }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.specialty) { toast.error("Name and specialty are required"); return; }
    try {
      if (editing) {
        await updateDesigner.mutateAsync({ id: editing.id, ...form, experience: Number(form.experience), rate: Number(form.rate) });
        toast.success("Designer updated");
      } else {
        await createDesigner.mutateAsync({ ...form, experience: Number(form.experience), rate: Number(form.rate) });
        toast.success("Designer added");
      }
      setDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save designer");
    }
  };

  const handleDelete = async (id: number) => { 
    try {
      await deleteDesigner.mutateAsync(id);
      toast.success("Designer removed"); 
    } catch (e: any) {
      toast.error(e.message || "Failed to delete designer");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-heading font-semibold tracking-tight">Designers</h1>
          <p className="text-muted-foreground mt-1">Your creative team</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Designer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Designer</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><Label>Specialty</Label><Input value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Experience (yrs)</Label><Input type="number" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} /></div>
                <div><Label>Rate (₹/hr)</Label><Input type="number" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} /></div>
              </div>
              <Button onClick={handleSave} className="w-full" disabled={createDesigner.isPending || updateDesigner.isPending}>{editing ? "Update" : "Add"} Designer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search designers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {isLoading ? (
        <div className="text-muted-foreground p-8 text-center">Loading Data...</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted-foreground p-8 text-center">No designers found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(designer => (
            <Card key={designer.id} className="glass-card hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-lg">{designer.name}</h3>
                    <Badge variant="outline" className="mt-1">{designer.specialty}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(designer)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(designer.id)} disabled={deleteDesigner.isPending}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  <p>{designer.email}</p>
                  <p>{designer.phone}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-primary" />{designer.experience} yrs exp.</span>
                  <span className="font-semibold text-foreground">₹{designer.rate.toLocaleString("en-IN")}/hr</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
