import { useMemo, useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAdminRitualGuidanceSections,
  useCreateRitualGuidanceSection,
  useDeleteRitualGuidanceSection,
  useUpdateRitualGuidanceSection,
  type RitualGuidanceSection,
} from "@/hooks/useSupabase";
import { fallbackRitualGuidance } from "@/data/ritualGuidance";

const GROUPS = [
  { value: "general", label: "Getting Started" },
  { value: "before_departure", label: "Before Departure" },
  { value: "madinah", label: "Madinah" },
  { value: "makkah", label: "Makkah" },
  { value: "umrah", label: "Umrah Steps" },
  { value: "hajj", label: "Hajj Steps" },
  { value: "hajj_days", label: "Hajj Days" },
  { value: "ihram", label: "Ihram Rules" },
  { value: "duas", label: "Essential Duas" },
  { value: "videos", label: "Video Tutorials" },
  { value: "maps", label: "Interactive Maps" },
] as const;

const statusClasses: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-yellow-100 text-yellow-800",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "section";

const getGroupLabel = (value: string) => GROUPS.find((g) => g.value === value)?.label ?? value;

const AdminRitualGuidance = () => {
  const { data: sections = [], isLoading } = useAdminRitualGuidanceSections();
  const { mutateAsync: createSection, isPending: isCreating } = useCreateRitualGuidanceSection();
  const { mutateAsync: updateSection, isPending: isUpdating } = useUpdateRitualGuidanceSection();
  const { mutate: deleteSection, isPending: isDeleting } = useDeleteRitualGuidanceSection();

  const [showDefaultsAlert, setShowDefaultsAlert] = useState(false);

  // Show alert if no sections exist (fallback guidelines are being used)
  useEffect(() => {
    setShowDefaultsAlert(!isLoading && sections.length === 0);
  }, [isLoading, sections.length]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    sectionGroup: "general",
    sortOrder: "0",
    status: "published",
    body: "",
  });

  const sortedSections = useMemo(
    () =>
      [...sections].sort((a, b) => {
        if (a.section_group === b.section_group) {
          return (a.sort_order || 0) - (b.sort_order || 0);
        }
        return a.section_group.localeCompare(b.section_group);
      }),
    [sections],
  );

  const handleLoadDefaults = async () => {
    try {
      // Create all default sections
      for (const defaultSection of fallbackRitualGuidance) {
        await createSection({
          slug: defaultSection.slug,
          title: defaultSection.title,
          section_group: defaultSection.section_group,
          body: defaultSection.body,
          sort_order: defaultSection.sort_order,
          is_published: defaultSection.is_published,
        });
      }
      setShowDefaultsAlert(false);
      toast.success("Default guidance sections loaded!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to load defaults");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      sectionGroup: "general",
      sortOrder: "0",
      status: "published",
      body: "",
    });
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (section: RitualGuidanceSection) => {
    setForm({
      title: section.title || "",
      sectionGroup: section.section_group,
      sortOrder: String(section.sort_order ?? 0),
      status: section.is_published ? "published" : "draft",
      body: section.body || "",
    });
    setEditingId(section.id);
    setDialogOpen(true);
  };

  const resolveUniqueSlug = (value: string) => {
    const base = slugify(value);
    const existing = new Set(sections.map((section) => section.slug));
    if (!existing.has(base)) return base;
    let counter = 2;
    while (existing.has(`${base}-${counter}`)) {
      counter += 1;
    }
    return `${base}-${counter}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!form.body.trim()) {
      toast.error("Body content is required");
      return;
    }

    const payload = {
      title: form.title.trim(),
      section_group: form.sectionGroup as RitualGuidanceSection["section_group"],
      body: form.body.trim(),
      sort_order: Number(form.sortOrder) || 0,
      is_published: form.status === "published",
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await updateSection({ id: editingId, ...payload });
        toast.success("Guidance section updated");
      } else {
        await createSection({ slug: resolveUniqueSlug(form.title), ...payload });
        toast.success("Guidance section created");
      }
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save section");
    }
  };

  const handleDelete = (section: RitualGuidanceSection) => {
    if (!window.confirm(`Delete guidance section "${section.title}"?`)) return;
    deleteSection(section.id, {
      onSuccess: () => toast.success("Section deleted"),
      onError: (error: any) => toast.error(error?.message || "Failed to delete section"),
    });
  };

  const isSaving = isCreating || isUpdating;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Ritual Guidance</h1>
            <p className="text-sm text-muted-foreground">
              Add and organize the public ritual guidance manual. Only published sections are visible.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2" onClick={openCreate}>
                <Plus className="h-4 w-4" /> Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Guidance Section" : "Add Guidance Section"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Section Group</Label>
                      <Select value={form.sectionGroup} onValueChange={(value) => setForm((p) => ({ ...p, sectionGroup: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {GROUPS.map((group) => (
                            <SelectItem key={group.value} value={group.value}>{group.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Sort Order</Label>
                      <Input
                        type="number"
                        value={form.sortOrder}
                        onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(value) => setForm((p) => ({ ...p, status: value }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Body *</Label>
                    <Textarea
                      value={form.body}
                      onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                      rows={12}
                      placeholder="Use plain text. Start list items with - to format bullets."
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end border-t border-border pt-4">
                  <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" disabled={isSaving}>
                    {isSaving ? "Saving..." : editingId ? "Save Changes" : "Create Section"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {showDefaultsAlert && (
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">No custom sections yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The public site currently shows default guidelines. Load them here to start customizing.
                </p>
              </div>
              <Button variant="gold" size="sm" onClick={handleLoadDefaults} disabled={isCreating}>
                {isCreating ? "Loading..." : "Load Default Guidelines"}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                        </TableRow>
                      ))
                    : sortedSections.map((section) => (
                        <TableRow key={section.id}>
                          <TableCell className="font-medium">{section.title}</TableCell>
                          <TableCell>{getGroupLabel(section.section_group)}</TableCell>
                          <TableCell>{section.sort_order ?? 0}</TableCell>
                          <TableCell>
                            <Badge className={statusClasses[section.is_published ? "published" : "draft"]}>
                              {section.is_published ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost" onClick={() => openEdit(section)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(section)} disabled={isDeleting}>
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
                : sortedSections.map((section) => (
                    <div key={section.id} className="rounded-lg border p-4 bg-card space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{section.title}</p>
                          <p className="text-xs text-muted-foreground">{getGroupLabel(section.section_group)}</p>
                          <p className="text-xs text-muted-foreground">Order: {section.sort_order ?? 0}</p>
                        </div>
                        <Badge className={statusClasses[section.is_published ? "published" : "draft"]}>
                          {section.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(section)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(section)} disabled={isDeleting}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
            </div>

            {!isLoading && sortedSections.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                No guidance sections yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminRitualGuidance;
