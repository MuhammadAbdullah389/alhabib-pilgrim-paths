import { useState } from "react";
import UserLayout from "@/components/user/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const myTestimonials = [
  { id: '1', text: 'Alhamdulillah! Amazing experience with Alhabib Travel.', rating: 5, status: 'approved' as const, date: '2026-01-20' },
  { id: '2', text: 'The Ramadan Umrah arrangements were wonderful.', rating: 4, status: 'pending' as const, date: '2026-02-25' },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const UserTestimonials = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [rating, setRating] = useState(5);

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">My Testimonials</h1>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2"><Plus className="h-4 w-4" /> Write Testimonial</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Share Your Experience</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Testimonial submitted for review!"); setAddOpen(false); }}>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button key={i} type="button" onClick={() => setRating(i)}>
                        <Star className={`h-6 w-6 cursor-pointer ${i <= rating ? "fill-accent text-accent" : "text-muted"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Your Experience</Label>
                  <Textarea placeholder="Share your journey with Alhabib Travel..." rows={4} />
                </div>
                <Button type="submit" variant="gold" className="w-full">Submit for Review</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {myTestimonials.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-foreground">{t.text}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                  <Badge className={statusColors[t.status]}>{t.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserTestimonials;
