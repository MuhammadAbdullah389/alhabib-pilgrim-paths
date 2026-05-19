import { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import {
  useAllComplaints,
  useUpdateComplaint,
  useDeleteComplaint,
  useStaffProfiles,
  type Complaint,
} from "@/hooks/useSupabase";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES, getCategoryLabel, getStatusInfo } from "@/data/complaints";

const AdminComplaints = () => {
  const { data: complaints = [], isLoading } = useAllComplaints();
  const { data: staff = [] } = useStaffProfiles();
  const { mutateAsync: updateComplaint, isPending: isUpdating } = useUpdateComplaint();
  const { mutate: deleteComplaint, isPending: isDeleting } = useDeleteComplaint();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [editForm, setEditForm] = useState({
    status: "",
    adminResponse: "",
    assignedTo: "",
  });

  const filtered = useMemo(
    () =>
      complaints.filter((c) => {
        const matchesSearch =
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.booking_id && c.booking_id.includes(searchTerm));
        const matchesStatus = statusFilter === "all" || c.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
      }),
    [complaints, searchTerm, statusFilter, categoryFilter],
  );

  const openEdit = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setEditForm({
      status: complaint.status,
      adminResponse: complaint.admin_response || "",
      assignedTo: complaint.assigned_to || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedComplaint) return;

    try {
      await updateComplaint({
        id: selectedComplaint.id,
        status: editForm.status as any,
        admin_response: editForm.adminResponse.trim() || null,
        assigned_to: editForm.assignedTo || null,
      });
      toast.success("Complaint updated");
      setDialogOpen(false);
      setSelectedComplaint(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update complaint");
    }
  };

  const handleDelete = (complaint: Complaint) => {
    if (!window.confirm(`Delete complaint "${complaint.title}"?`)) return;
    deleteComplaint(complaint.id, {
      onSuccess: () => toast.success("Complaint deleted"),
      onError: (error: any) => toast.error(error?.message || "Failed to delete"),
    });
  };

  const getStaffName = (id: string | null) =>
    id ? staff.find((s) => s.id === id)?.full_name || "Unknown" : "-";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Complaints Management</h1>
          <p className="text-sm text-muted-foreground">View, respond to, and manage user complaints</p>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input placeholder="Search by title or booking ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {COMPLAINT_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {COMPLAINT_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={5}>
                            <Skeleton className="h-8 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    : filtered.map((complaint) => (
                        <TableRow key={complaint.id} className="cursor-pointer hover:bg-accent/5">
                          <TableCell className="font-medium">{complaint.title}</TableCell>
                          <TableCell>{getCategoryLabel(complaint.category)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusInfo(complaint.status).color}>
                              {getStatusInfo(complaint.status).label}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStaffName(complaint.assigned_to)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost" onClick={() => openEdit(complaint)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(complaint)} disabled={isDeleting}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden p-4 space-y-3">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                : filtered.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="rounded-lg border p-4 bg-card space-y-2 cursor-pointer hover:shadow-md"
                      onClick={() => openEdit(complaint)}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{complaint.title}</p>
                          <p className="text-xs text-muted-foreground">{getCategoryLabel(complaint.category)}</p>
                        </div>
                        <Badge className={getStatusInfo(complaint.status).color}>{getStatusInfo(complaint.status).label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Assigned: {getStaffName(complaint.assigned_to)}</p>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(complaint)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDelete(complaint); }} disabled={isDeleting}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
            </div>

            {!isLoading && filtered.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                No complaints found
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Manage Complaint</DialogTitle>
            <DialogDescription>
              Review the complaint details, respond to the user, and update the complaint status.
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Title</Label>
                <p className="text-sm font-medium">{selectedComplaint.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
                  <p className="text-sm">{getCategoryLabel(selectedComplaint.category)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Submitted</Label>
                  <p className="text-sm">{new Date(selectedComplaint.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Description</Label>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.proof_image_url && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Proof Image</Label>
                  <img src={selectedComplaint.proof_image_url} alt="Proof" className="h-32 w-full object-cover rounded-lg border border-border cursor-pointer" onClick={() => window.open(selectedComplaint.proof_image_url)} />
                </div>
              )}

              <div className="border-t border-border pt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select value={editForm.status} onValueChange={(value) => setEditForm((p) => ({ ...p, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPLAINT_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <Select value={editForm.assignedTo || "unassigned"} onValueChange={(value) => setEditForm((p) => ({ ...p, assignedTo: value === "unassigned" ? null : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Not assigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {staff.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.full_name} ({s.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Admin Response</Label>
                  <Textarea
                    value={editForm.adminResponse}
                    onChange={(e) => setEditForm((p) => ({ ...p, adminResponse: e.target.value }))}
                    placeholder="Your response to the complaint..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminComplaints;
