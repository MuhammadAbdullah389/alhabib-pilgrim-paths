import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star } from "lucide-react";
import { mockTestimonials, type Testimonial } from "@/data/mockDashboard";
import { toast } from "sonner";

const statusColors: Record<Testimonial['status'], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState(mockTestimonials);

  const updateStatus = (id: string, status: Testimonial['status']) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    toast.success(`Testimonial ${status}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Testimonial Management</h1>

        <div className="grid gap-4">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{t.name}</h3>
                      <Badge className={statusColors[t.status]}>{t.status}</Badge>
                      <span className="text-xs text-muted-foreground">{t.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t.location}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-foreground">{t.text}</p>
                  </div>
                  {t.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="default" className="gap-1" onClick={() => updateStatus(t.id, 'approved')}>
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="gap-1" onClick={() => updateStatus(t.id, 'rejected')}>
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
