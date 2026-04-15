import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  usePayments, useProjects,
  useCreatePayment, useUpdatePayment, useDeletePayment
} from "@/hooks/useQueries";

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

  const [form, setForm] = useState({
    projectId: "",
    amount: "",
    date: "",
    method: "bank-transfer" as Payment["method"],
    status: "pending" as Payment["status"],
    description: ""
  });

  // ✅ Filter using project_id instead of name
  const filtered = paymentList.filter(p =>
    String(p.project_id).includes(search) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Add
  const openAdd = () => {
    setEditing(null);
    setForm({
      projectId: "",
      amount: "",
      date: "",
      method: "bank-transfer",
      status: "pending",
      description: ""
    });
    setDialogOpen(true);
  };

  // ✅ Edit
  const openEdit = (p: Payment) => {
    setEditing(p);
    setForm({
      projectId: String(p.project_id),
      amount: String(p.amount),
      date: p.date,
      method: p.method,
      status: p.status,
      description: p.description
    });
    setDialogOpen(true);
  };

  // ✅ Save
  const handleSave = async () => {
    if (!form.projectId || !form.amount) {
      toast.error("Project and amount are required");
      return;
    }

    try {
      const payload = {
        project_id: Number(form.projectId),
        amount: Number(form.amount),
        date: form.date,
        method: form.method,
        status: form.status,
        description: form.description
      };

      if (editing) {
        await updatePayment.mutateAsync({
          id: editing.id,
          ...payload
        });
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

  // ✅ Delete
  const handleDelete = async (id: number) => {
    try {
      await deletePayment.mutateAsync(id);
      toast.success("Payment removed");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete payment");
    }
  };

  // ✅ Totals
  const totalPaid = paymentList
    .filter(p => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);

  const totalPending = paymentList
    .filter(p => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);

  const totalOverdue = paymentList
    .filter(p => p.status === "overdue")
    .reduce((s, p) => s + p.amount, 0);

  const isLoading = payLoading || pLoading;

  return (
    <div className="space-y-6 max-w-7xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Payments</h1>
          <p className="text-muted-foreground">Track payment status</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit" : "Record"} Payment</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">

              {/* Project ID */}
              <div>
                <Label>Project ID</Label>
                <Select
                  value={form.projectId}
                  onValueChange={v => setForm(f => ({ ...f, projectId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectsList.map(p => (
                      <SelectItem key={p.project_id} value={String(p.project_id)}>
                        Project #{p.project_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    value={form.amount}
                    onChange={e =>
                      setForm(f => ({ ...f, amount: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={e =>
                      setForm(f => ({ ...f, date: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Method + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Method</Label>
                  <Select
                    value={form.method}
                    onValueChange={v =>
                      setForm(f => ({ ...f, method: v as Payment["method"] }))
                    }
                  >
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
                  <Select
                    value={form.status}
                    onValueChange={v =>
                      setForm(f => ({ ...f, status: v as Payment["status"] }))
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={e =>
                    setForm(f => ({ ...f, description: e.target.value }))
                  }
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                {editing ? "Update" : "Record"} Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by Project ID or description..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
              ) : filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell>#{p.project_id}</TableCell>
                  <TableCell>₹{p.amount}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell>
                    <Badge className={statusStyle[p.status]}>
                      {p.status}
                    </Badge>
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