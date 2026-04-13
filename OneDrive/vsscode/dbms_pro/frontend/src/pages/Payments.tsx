import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePayments, useProjects, useCreatePayment, useUpdatePayment, useDeletePayment } from "@/hooks/useQueries";
import { Payment } from "@/types";

const statusStyle: Record<string, string> = {
  paid: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Payments() {
  const { data: paymentList = [], isLoading: payLoading } = usePayments();
  const { data: projectsList = [], isLoading: pLoading } = useProjects();
  
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const deletePayment = useDeletePayment();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [form, setForm] = useState({ projectId: "", amount: "", date: "", method: "bank-transfer" as Payment["method"], status: "pending" as Payment["status"], description: "" });

  const getProjectName = (id: number) => projectsList.find(p => p.id === id)?.name ?? "Unknown";

  const filtered = paymentList.filter(p => {
    const pid = p.projectId || p.project_id || 0;
    return getProjectName(pid).toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase());
  });

  const openAdd = () => { setEditing(null); setForm({ projectId: "", amount: "", date: "", method: "bank-transfer", status: "pending", description: "" }); setDialogOpen(true); };
  
  const openEdit = (p: Payment) => { 
    setEditing(p); 
    const pid = p.projectId || p.project_id;
    setForm({ projectId: String(pid), amount: String(p.amount), date: p.date, method: p.method, status: p.status, description: p.description }); 
    setDialogOpen(true); 
  };

  const handleSave = async () => {
    if (!form.projectId || !form.amount) { toast.error("Project and amount are required"); return; }
    try {
      const payload: any = { ...form, projectId: Number(form.projectId), amount: Number(form.amount) };
      if (editing) {
        await updatePayment.mutateAsync({ id: editing.id, ...payload });
        toast.success("Payment updated");
      } else {
        await createPayment.mutateAsync(payload);
        toast.success("Payment recorded");
      }
      setDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save payment");
    }
  };

  const handleDelete = async (id: number) => { 
    try {
      await deletePayment.mutateAsync(id);
      toast.success("Payment removed"); 
    } catch (e: any) {
      toast.error(e.message || "Failed to delete payment");
    }
  };

  const totalPaid = paymentList.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = paymentList.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const totalOverdue = paymentList.filter(p => p.status === "overdue").reduce((s, p) => s + p.amount, 0);

  const isLoading = payLoading || pLoading;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-heading font-semibold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1">Track budget and payment status</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Record Payment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Record"} Payment</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Project</Label>
                <Select value={form.projectId} onValueChange={v => setForm(f => ({ ...f, projectId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>{projectsList.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Amount (₹)</Label><Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
                <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Method</Label>
                  <Select value={form.method} onValueChange={v => setForm(f => ({ ...f, method: v as Payment["method"] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as Payment["status"] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <Button onClick={handleSave} className="w-full" disabled={createPayment.isPending || updatePayment.isPending}>{editing ? "Update" : "Record"} Payment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card"><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Collected</p><p className="text-2xl font-heading font-semibold text-success">₹{totalPaid.toLocaleString("en-IN")}</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-heading font-semibold text-warning">₹{totalPending.toLocaleString("en-IN")}</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Overdue</p><p className="text-2xl font-heading font-semibold text-destructive">₹{totalOverdue.toLocaleString("en-IN")}</p></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                 <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                 <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No payments found</TableCell></TableRow>
              ) : filtered.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{getProjectName(payment.projectId || payment.project_id || 0)}</p>
                    <p className="text-xs text-muted-foreground">{payment.description}</p>
                  </TableCell>
                  <TableCell className="font-semibold">₹{payment.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{payment.date}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm capitalize">{payment.method.replace("-", " ")}</TableCell>
                  <TableCell><Badge variant="outline" className={statusStyle[payment.status]}>{payment.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(payment)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(payment.id)} disabled={deletePayment.isPending}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
