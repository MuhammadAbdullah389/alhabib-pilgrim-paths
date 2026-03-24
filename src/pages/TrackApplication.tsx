import { FormEvent, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, FileSearch, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type BookingStatus = "pending" | "documents" | "visa" | "confirmed" | "cancelled";

interface PublicBookingLookup {
  booking_code: string;
  package_name_snapshot: string;
  package_type: "hajj" | "umrah" | "visa";
  status: BookingStatus;
  created_at: string;
  travel_date: string | null;
  updated_at: string;
}

const statusSteps: BookingStatus[] = ["pending", "documents", "visa", "confirmed"];

const stepLabels: Record<BookingStatus, string> = {
  pending: "Applied",
  documents: "Documents",
  visa: "Visa Processing",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  documents: "bg-blue-100 text-blue-800",
  visa: "bg-purple-100 text-purple-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const getProgress = (status: BookingStatus) => {
  if (status === "cancelled") return 0;
  const idx = statusSteps.indexOf(status);
  return ((idx + 1) / statusSteps.length) * 100;
};

const TrackApplication = () => {
  const [bookingCode, setBookingCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<PublicBookingLookup | null>(null);

  const normalizedBookingCode = useMemo(() => bookingCode.trim().toUpperCase(), [bookingCode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!normalizedBookingCode) {
      toast.error("Please enter booking code.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_code, package_name_snapshot, package_type, status, created_at, travel_date, updated_at")
        .eq("booking_code", normalizedBookingCode)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error("No application found for the provided booking code.");
        return;
      }

      setResult(data as PublicBookingLookup);
    } catch (error: any) {
      toast.error(error?.message || "Failed to track application.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl gradient-gold flex items-center justify-center shadow-gold">
              <FileSearch className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Track Application</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enter your booking code to view your latest application status.
            </p>
            <div className="section-divider w-24 mx-auto mt-4" />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Find Your Application</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingCode">Booking Code</Label>
                  <Input
                    id="bookingCode"
                    placeholder="e.g. B9C26A00F"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                  />
                </div>

                <Button type="submit" variant="gold" className="w-full sm:w-auto gap-2" disabled={isLoading}>
                  <Search className="w-4 h-4" />
                  {isLoading ? "Tracking..." : "Track Status"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-xl">Application Details</CardTitle>
                  <Badge className={`${statusColors[result.status]} capitalize w-fit`}>{result.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Booking Code:</span> <span className="font-mono font-medium">{result.booking_code}</span></div>
                  <div><span className="text-muted-foreground">Package Type:</span> <span className="capitalize font-medium">{result.package_type}</span></div>
                  <div><span className="text-muted-foreground">Package:</span> <span className="font-medium">{result.package_name_snapshot}</span></div>
                  <div><span className="text-muted-foreground">Applied On:</span> <span className="font-medium">{new Date(result.created_at).toLocaleDateString()}</span></div>
                </div>

                {result.status !== "cancelled" ? (
                  <div className="space-y-2">
                    <Progress value={getProgress(result.status)} className="h-2" />
                    <div className="flex flex-wrap gap-2 justify-between text-xs text-muted-foreground">
                      {statusSteps.map((step) => (
                        <span
                          key={step}
                          className={statusSteps.indexOf(step) <= statusSteps.indexOf(result.status) ? "text-primary font-medium" : ""}
                        >
                          {stepLabels[step]}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    This application has been marked as cancelled. Contact support for assistance.
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {hasSearched && !result && !isLoading && (
            <Card>
              <CardContent className="py-8 text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No matching application found. Please verify the booking code.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TrackApplication;
