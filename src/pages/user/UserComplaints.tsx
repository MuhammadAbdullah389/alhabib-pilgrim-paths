import { useState } from "react";
import UserLayout from "@/components/user/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/authContext";
import {
  useUserComplaints,
  useCreateComplaint,
  useUserBookings,
  type Complaint,
} from "@/hooks/useSupabase";
import ComplaintCard from "@/components/complaints/ComplaintCard";
import ComplaintForm from "@/components/complaints/ComplaintForm";
import { COMPLAINT_STATUSES } from "@/data/complaints";

const UserComplaints = () => {
  const { user } = useAuth();
  const { data: complaints = [], isLoading } = useUserComplaints(user?.id || "");
  const { data: bookings = [] } = useUserBookings(user?.id || "");
  const { mutateAsync: createComplaint, isPending } = useCreateComplaint();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = complaints.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (data: any) => {
    try {
      await createComplaint({
        user_id: user!.id,
        booking_id: data.booking_id,
        title: data.title,
        category: data.category,
        description: data.description,
        proof_image_url: data.proof_image_url,
        status: "pending",
        admin_response: null,
        assigned_to: null,
      });
      toast.success("Complaint submitted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit complaint");
    }
  };

  if (!user) {
    return (
      <UserLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please log in to view complaints</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">My Complaints</h1>
            <p className="text-sm text-muted-foreground">Track and manage your complaints</p>
          </div>
          <Button variant="gold" className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" /> New Complaint
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {COMPLAINT_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                {complaints.length === 0 ? "No complaints yet" : "No complaints match your filters"}
              </p>
              <Button variant="gold" className="gap-2" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" /> Submit First Complaint
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onView={() => {
                  setSelectedComplaint(complaint);
                  setDialogOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <ComplaintForm
        open={dialogOpen && !selectedComplaint}
        onOpenChange={(open) => !open && setDialogOpen(false)}
        bookings={bookings.map((b) => ({ id: b.id, booking_code: b.booking_code }))}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />

      {selectedComplaint && (
        <ComplaintForm
          open={dialogOpen && !!selectedComplaint}
          onOpenChange={(open) => {
            if (!open) {
              setDialogOpen(false);
              setSelectedComplaint(null);
            }
          }}
          complaint={selectedComplaint}
        />
      )}
    </UserLayout>
  );
};

export default UserComplaints;
