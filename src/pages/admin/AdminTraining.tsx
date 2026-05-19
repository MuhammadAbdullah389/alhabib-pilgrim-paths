import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  useAdminTrainingSessions,
  useCreateTrainingSession,
  useUpdateTrainingSession,
  useDeleteTrainingSession,
  type TrainingSession,
} from "@/hooks/useSupabase";

const statusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
};

const AdminTraining = () => {
  const { data: sessions = [], isLoading } = useAdminTrainingSessions();
  const { mutateAsync: createSession, isPending: isCreating } = useCreateTrainingSession();
  const { mutateAsync: updateSession, isPending: isUpdating } = useUpdateTrainingSession();
  const { mutate: deleteSession, isPending: isDeleting } = useDeleteTrainingSession();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    sessionType: "upcoming",
    status: "draft",
    downloadUrl: "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      location: "",
      sessionType: "upcoming",
      status: "draft",
      downloadUrl: "",
    });
    setEditingId(null);
    setCoverFile(null);
    setGalleryFiles([]);
    setExistingCoverUrl(null);
    setExistingPhotoUrls([]);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (session: TrainingSession) => {
    setForm({
      title: session.title || "",
      description: session.description || "",
      eventDate: session.event_date || "",
      startTime: session.start_time || "",
      endTime: session.end_time || "",
      location: session.location || "",
      sessionType: session.session_type || "upcoming",
      status: session.status || "draft",
      downloadUrl: session.download_url || "",
    });
    setEditingId(session.id);
    setCoverFile(null);
    setGalleryFiles([]);
    setExistingCoverUrl(session.cover_image_url || null);
    setExistingPhotoUrls(Array.isArray(session.photo_urls) ? session.photo_urls : []);
    setDialogOpen(true);
  };

  const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "-");

  const uploadMediaFile = async (file: File, folder: string) => {
    const safeName = sanitizeFileName(file.name);
    const filePath = `training-sessions/${folder}/${Date.now()}-${safeName}`;

    const { data, error } = await supabase.storage
      .from("training-media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from("training-media")
      .getPublicUrl(data.path);

    if (!publicData?.publicUrl) {
      throw new Error("Failed to resolve public media URL");
    }

    return publicData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsUploadingMedia(true);

    try {
      let coverUrl = existingCoverUrl;
      let photoUrls = [...existingPhotoUrls];

      if (coverFile) {
        coverUrl = await uploadMediaFile(coverFile, "covers");
      }

      if (galleryFiles.length > 0) {
        const uploaded = await Promise.all(galleryFiles.map((file) => uploadMediaFile(file, "gallery")));
        photoUrls = uploaded;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        event_date: form.eventDate || null,
        start_time: form.startTime || null,
        end_time: form.endTime || null,
        location: form.location.trim() || null,
        session_type: form.sessionType as "upcoming" | "completed",
        status: form.status as "draft" | "published",
        cover_image_url: coverUrl || null,
        photo_urls: photoUrls,
        download_url: form.downloadUrl.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        await updateSession({ id: editingId, ...payload });
        toast.success("Training session updated");
      } else {
        await createSession(payload);
        toast.success("Training session created");
      }

      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save session");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleDelete = (session: TrainingSession) => {
    if (!window.confirm(`Delete training session "${session.title}"?`)) return;
    deleteSession(session.id, {
      onSuccess: () => toast.success("Session deleted"),
      onError: (error: any) => toast.error(error?.message || "Failed to delete session"),
    });
  };

  const isSaving = isCreating || isUpdating || isUploadingMedia;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Hajj Training Sessions</h1>
            <p className="text-sm text-muted-foreground">
              Sessions appear on the public site only when status is published.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2" onClick={openCreate}>
                <Plus className="h-4 w-4" /> Add Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Training Session" : "Add Training Session"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" value={form.eventDate} onChange={(e) => setForm((p) => ({ ...p, eventDate: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Training venue" />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input type="time" value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input type="time" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Session Type</Label>
                      <Select value={form.sessionType} onValueChange={(value) => setForm((p) => ({ ...p, sessionType: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming Training</SelectItem>
                          <SelectItem value="completed">Completed / Portfolio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={form.status} onValueChange={(value) => setForm((p) => ({ ...p, status: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Download Link</Label>
                      <Input value={form.downloadUrl} onChange={(e) => setForm((p) => ({ ...p, downloadUrl: e.target.value }))} placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Cover Image (Upload)</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      />
                      {coverFile && (
                        <p className="text-xs text-muted-foreground">Selected: {coverFile.name}</p>
                      )}
                      {!coverFile && existingCoverUrl && (
                        <p className="text-xs text-muted-foreground">Current cover image is set.</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Gallery Photos (Upload)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setGalleryFiles(e.target.files ? Array.from(e.target.files) : [])}
                    />
                    {galleryFiles.length > 0 && (
                      <p className="text-xs text-muted-foreground">Selected: {galleryFiles.length} file(s)</p>
                    )}
                    {galleryFiles.length === 0 && existingPhotoUrls.length > 0 && (
                      <p className="text-xs text-muted-foreground">Current photos: {existingPhotoUrls.length}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-end border-t border-border pt-4">
                  <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" disabled={isSaving}>
                    {isSaving ? "Saving..." : editingId ? "Save Changes" : "Create Session"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                        </TableRow>
                      ))
                    : sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">{session.title}</TableCell>
                          <TableCell>{session.event_date || "TBA"}</TableCell>
                          <TableCell>
                            <Badge className="bg-slate-100 text-slate-700">
                              {session.session_type === "completed" ? "Portfolio" : "Upcoming"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusColors[session.status] || "bg-muted text-muted-foreground"}`}>
                              {session.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{session.location || "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost" onClick={() => openEdit(session)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(session)} disabled={isDeleting}>
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
                : sessions.map((session) => (
                    <div key={session.id} className="rounded-lg border p-4 bg-card space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{session.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" /> {session.event_date || "TBA"}
                          </p>
                          <p className="text-xs text-muted-foreground">{session.location || "-"}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className="bg-slate-100 text-slate-700">
                            {session.session_type === "completed" ? "Portfolio" : "Upcoming"}
                          </Badge>
                          <Badge className={`${statusColors[session.status] || "bg-muted text-muted-foreground"}`}>{session.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(session)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(session)} disabled={isDeleting}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
            </div>

            {!isLoading && sessions.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                No training sessions yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTraining;
