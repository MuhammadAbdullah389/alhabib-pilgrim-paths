import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES, getCategoryLabel, getStatusInfo } from "@/data/complaints";
import type { Complaint } from "@/hooks/useSupabase";

interface ComplaintFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint?: Complaint | null;
  bookings?: Array<{ id: string; booking_code: string }>;
  onSubmit?: (data: any) => Promise<void>;
  isLoading?: boolean;
  isAdmin?: boolean;
}

const ComplaintForm = ({
  open,
  onOpenChange,
  complaint,
  bookings = [],
  onSubmit,
  isLoading = false,
  isAdmin = false,
}: ComplaintFormProps) => {
  const isViewOnly = !!complaint && !isAdmin;
  const isEditing = !!complaint && isAdmin;

  const [form, setForm] = useState<{
    title: string;
    category: "general" | "hotel_issue" | "transport_issue" | "guide_issue" | "document_issue" | "package_issue";
    description: string;
    bookingId: string;
    contactPhone: string;
    proofImage: File | null;
    proofImageUrl: string | null;
  }>({
    title: complaint?.title || "",
    category: (complaint?.category || "general") as "general" | "hotel_issue" | "transport_issue" | "guide_issue" | "document_issue" | "package_issue",
    description: complaint?.description || "",
    bookingId: complaint?.booking_id || "",
    contactPhone: complaint?.user_id ? "" : "", // Will be filled from profile
    proofImage: null,
    proofImageUrl: complaint?.proof_image_url || null,
  });

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const filePath = `complaints/${Date.now()}-${safeName}`;

      const { data, error } = await supabase.storage
        .from("complaints-proof")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("complaints-proof")
        .getPublicUrl(data.path);

      setForm((p) => ({ ...p, proofImageUrl: publicData.publicUrl, proofImage: null }));
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (onSubmit) {
      await onSubmit({
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        booking_id: form.bookingId || null,
        proof_image_url: form.proofImageUrl,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isViewOnly ? "Complaint Details" : isEditing ? "Edit Complaint" : "Submit Complaint"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isViewOnly ? "View complaint details and admin response" : isEditing ? "Update complaint status and response" : "Submit a new complaint"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-4">
            {isViewOnly && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Status</Label>
                <div>
                  <Badge className={getStatusInfo(complaint.status).color}>
                    {getStatusInfo(complaint.status).label}
                  </Badge>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Title {!isViewOnly && "*"}</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Brief complaint title"
                readOnly={isViewOnly}
                disabled={isViewOnly}
              />
            </div>

            <div className="space-y-2">
              <Label>Category {!isViewOnly && "*"}</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm((p) => ({ ...p, category: value as "general" | "hotel_issue" | "transport_issue" | "guide_issue" | "document_issue" | "package_issue" }))}>
                <SelectTrigger disabled={isViewOnly}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description {!isViewOnly && "*"}</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Detailed description of the issue..."
                rows={4}
                readOnly={isViewOnly}
                disabled={isViewOnly}
              />
            </div>

            {bookings.length > 0 && (
              <div className="space-y-2">
                <Label>Booking (Optional)</Label>
                <Select
                  value={form.bookingId || "none"}
                  onValueChange={(value) => setForm((p) => ({ ...p, bookingId: value === "none" ? "" : value }))}
                >
                  <SelectTrigger disabled={isViewOnly}>
                    <SelectValue placeholder="Select booking..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {bookings.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.booking_code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {!isViewOnly && (
              <div className="space-y-2">
                <Label>Proof Image (Optional)</Label>
                {form.proofImageUrl ? (
                  <div className="space-y-2">
                    <img
                      src={form.proofImageUrl}
                      alt="Proof"
                      className="h-32 w-full object-cover rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setForm((p) => ({ ...p, proofImageUrl: null }))}>
                      <X className="w-4 h-4 mr-1" /> Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={uploading}
                      className="hidden"
                      id="proof-upload"
                    />
                    <label htmlFor="proof-upload" className="cursor-pointer">
                      <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload image</p>
                    </label>
                  </div>
                )}
              </div>
            )}

            {isViewOnly && form.proofImageUrl && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Proof Image</Label>
                <img
                  src={form.proofImageUrl}
                  alt="Proof"
                  className="h-48 w-full object-cover rounded-lg border border-border cursor-pointer hover:opacity-90"
                  onClick={() => window.open(form.proofImageUrl)}
                />
              </div>
            )}

            {isViewOnly && complaint.admin_response && (
              <div className="bg-accent/5 rounded-lg p-3 border border-accent/20">
                <p className="text-xs font-semibold text-accent mb-2">Admin Response:</p>
                <p className="text-sm text-muted-foreground">{complaint.admin_response}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {isViewOnly ? "Close" : "Cancel"}
            </Button>
            {!isViewOnly && (
              <Button type="submit" variant="gold" disabled={isLoading || uploading}>
                {isLoading ? "Submitting..." : isEditing ? "Save Changes" : "Submit Complaint"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintForm;
