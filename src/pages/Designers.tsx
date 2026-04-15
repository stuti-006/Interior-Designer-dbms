import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from "@/hooks/useQueries";

export default function Designers() {
const { data: designerList = [], isLoading } = useEmployees();
const createEmployee = useCreateEmployee();
const updateEmployee = useUpdateEmployee();
const deleteEmployee = useDeleteEmployee();

const [search, setSearch] = useState("");
const [dialogOpen, setDialogOpen] = useState(false);
const [editing, setEditing] = useState<any>(null);

const [form, setForm] = useState({
name: "",
contact: "",
role: "",
experience: "",
salary: ""
});

// 🔍 Filter
const filtered = designerList.filter((d: any) =>
d.name.toLowerCase().includes(search.toLowerCase()) ||
d.role.toLowerCase().includes(search.toLowerCase())
);

// ➕ Add
const openAdd = () => {
setEditing(null);
setForm({ name: "", contact: "", role: "", experience: "", salary: "" });
setDialogOpen(true);
};

// ✏️ Edit
const openEdit = (d: any) => {
setEditing(d);
setForm({
name: d.name,
contact: d.contact,
role: d.role,
experience: String(d.experience),
salary: String(d.salary)
});
setDialogOpen(true);
};

// 💾 Save
const handleSave = async () => {
if (!form.name || !form.role) {
toast.error("Name and role are required");
return;
}


try {
  if (editing) {
    await updateEmployee.mutateAsync({
      id: editing.employee_id,
      name: form.name,
      role: form.role,
      contact: form.contact,
      experience: Number(form.experience),
      salary: Number(form.salary)
    });
    toast.success("Employee updated");
  } else {
    await createEmployee.mutateAsync({
      name: form.name,
      role: form.role,
      contact: form.contact,
      experience: Number(form.experience),
      salary: Number(form.salary)
    }as any);
    toast.success("Employee added");
  }
  setDialogOpen(false);
} catch (e: any) {
  toast.error(e.message || "Failed to save");
}


};

// 🗑 Delete
const handleDelete = async (id: number) => {
try {
await deleteEmployee.mutateAsync(id);
toast.success("Employee removed");
} catch (e: any) {
toast.error(e.message || "Failed to delete");
}
};

return ( <div className="space-y-6 max-w-7xl">


  {/* Header */}
  <div className="flex items-center justify-between flex-wrap gap-4">
    <div>
      <h1 className="text-3xl font-semibold">Employees</h1>
      <p className="text-muted-foreground mt-1">Your team members</p>
    </div>

    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Employee
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit" : "Add"} Employee</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div>
            <Label>Contact</Label>
            <Input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
          </div>

          <div>
            <Label>Role</Label>
            <Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Experience (yrs)</Label>
              <Input type="number" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
            </div>
            <div>
              <Label>Salary</Label>
              <Input type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            {editing ? "Update" : "Add"} Employee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>

  {/* Search */}
  <div className="relative max-w-sm">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    <Input
      placeholder="Search employees..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      className="pl-9"
    />
  </div>

  {/* Content */}
  {isLoading ? (
    <div className="text-muted-foreground p-8 text-center">Loading Data...</div>
  ) : filtered.length === 0 ? (
    <div className="text-muted-foreground p-8 text-center">No employees found.</div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((designer: any) => (
        <Card key={designer.employee_id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">

            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{designer.name}</h3>
                <Badge variant="outline" className="mt-1">
                  {designer.role}
                </Badge>
              </div>

              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(designer)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={() => handleDelete(designer.employee_id)}>
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </Button>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>{designer.contact}</p>
            </div>

            <div className="mt-4 flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-primary" />
                {designer.experience} yrs
              </span>

              <span className="font-semibold">
                ₹{designer.salary?.toLocaleString("en-IN")}
              </span>
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  )}
</div>


);
}
