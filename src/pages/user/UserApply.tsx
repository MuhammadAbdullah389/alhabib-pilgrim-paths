import { useMemo, useState } from "react";
import UserLayout from "@/components/user/UserLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useCreateBooking, usePackages } from "@/hooks/useSupabase";
import type { PackageType } from "@/data/packages";
import PackageCard from "@/components/packages/PackageCard";
import PackageModal from "@/components/packages/PackageModal";
import { useAuth } from "@/lib/authContext";
import { toast } from "sonner";

const visaCountries = [
  "Saudi Arabia", "Turkey", "Malaysia", "Thailand", "UAE", "Iran", "Iraq",
  "United Kingdom", "United States", "Canada", "Australia", "China", "Japan",
];

const visaTypes = ["tourist", "visit", "student", "work", "business"] as const;

const UserApply = () => {
  const { user, profile } = useAuth();
  const { mutate: createBooking, isPending: isSubmittingVisa } = useCreateBooking();
  const [packageType, setPackageType] = useState<"hajj" | "umrah" | "visa">("hajj");
  const [selectedPkg, setSelectedPkg] = useState<PackageType | null>(null);
  const [visaForm, setVisaForm] = useState({
    name: profile?.full_name || "",
    phone: profile?.phone || "",
    email: user?.email || "",
    country: "",
    visaType: "",
    travelDuration: "",
    passportNo: "",
    travelDate: "",
    message: "",
  });

  const selectedPackageType = packageType === "visa" ? "hajj" : packageType;
  const { data: packages = [], isLoading } = usePackages(selectedPackageType);

  const sortedPackages = useMemo(
    () => [...packages].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))),
    [packages]
  );

  const handleVisaSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Please sign in first.");
      return;
    }

    if (!visaForm.name || !visaForm.phone || !visaForm.country || !visaForm.visaType) {
      toast.error("Please fill all required visa fields.");
      return;
    }

    createBooking(
      {
        user_id: user.id,
        package_id: null,
        package_name_snapshot: `${visaForm.visaType.toUpperCase()} Visa - ${visaForm.country}`,
        package_type: "visa",
        sharing_type: null,
        amount_pkr: null,
        status: "pending",
        travel_date: visaForm.travelDate || null,
        admin_notes: null,
        applicant_email: visaForm.email || user.email || null,
        applicant_phone: visaForm.phone || null,
        temp_password_token: null,
        temp_password_expires_at: null,
        password_reset_required: false,
        form_data: {
          fullName: visaForm.name,
          name: visaForm.name,
          phone: visaForm.phone,
          email: visaForm.email || user.email || null,
          country: visaForm.country,
          visaType: visaForm.visaType,
          travelDuration: visaForm.travelDuration || null,
          passportNo: visaForm.passportNo || null,
          travelDate: visaForm.travelDate || null,
          message: visaForm.message || null,
          source: "portal_visa_request",
        },
      },
      {
        onSuccess: () => {
          toast.success("Visa inquiry submitted successfully.");
          setVisaForm((prev) => ({
            ...prev,
            country: "",
            visaType: "",
            travelDuration: "",
            passportNo: "",
            travelDate: "",
            message: "",
          }));
        },
        onError: (error: any) => toast.error(error?.message || "Failed to submit visa inquiry."),
      }
    );
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Apply Again</h1>
            <p className="text-muted-foreground mt-1">
              Submit another Hajj, Umrah, or Visa application from your existing portal account.
            </p>
          </div>
          <Card className="lg:max-w-md w-full border-accent/20 bg-accent/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-accent" /> Repeat applicant flow
              </CardTitle>
              <CardDescription>
                This creates a new booking under your current account. No temporary password is needed.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant={packageType === "hajj" ? "gold" : "outline"} onClick={() => setPackageType("hajj")}>
            Hajj Packages
          </Button>
          <Button variant={packageType === "umrah" ? "gold" : "outline"} onClick={() => setPackageType("umrah")}>
            Umrah Packages
          </Button>
          <Button variant={packageType === "visa" ? "gold" : "outline"} onClick={() => setPackageType("visa")}>
            Visa Assistance
          </Button>
        </div>

        {packageType === "visa" ? (
          <Card>
            <CardHeader>
              <CardTitle>Visa Inquiry Form</CardTitle>
              <CardDescription>
                Submit your visa request directly from your dashboard account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVisaSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input value={visaForm.name} onChange={(e) => setVisaForm((p) => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input value={visaForm.phone} onChange={(e) => setVisaForm((p) => ({ ...p, phone: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={visaForm.email} onChange={(e) => setVisaForm((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Country *</Label>
                    <Select value={visaForm.country} onValueChange={(value) => setVisaForm((p) => ({ ...p, country: value }))}>
                      <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      <SelectContent>
                        {visaCountries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Visa Type *</Label>
                    <Select value={visaForm.visaType} onValueChange={(value) => setVisaForm((p) => ({ ...p, visaType: value }))}>
                      <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                      <SelectContent>
                        {visaTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Passport Number</Label>
                    <Input value={visaForm.passportNo} onChange={(e) => setVisaForm((p) => ({ ...p, passportNo: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Travel Date</Label>
                    <Input type="date" value={visaForm.travelDate} onChange={(e) => setVisaForm((p) => ({ ...p, travelDate: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Stay Duration</Label>
                    <Input value={visaForm.travelDuration} onChange={(e) => setVisaForm((p) => ({ ...p, travelDuration: e.target.value }))} placeholder="e.g. 2 weeks" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Message</Label>
                  <Textarea value={visaForm.message} onChange={(e) => setVisaForm((p) => ({ ...p, message: e.target.value }))} rows={4} />
                </div>

                <Button type="submit" variant="gold" disabled={isSubmittingVisa}>
                  {isSubmittingVisa ? "Submitting..." : "Submit Visa Inquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-64 w-full rounded-lg" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))
                : sortedPackages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} onViewDetails={setSelectedPkg} />)}
            </div>

            {!isLoading && sortedPackages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No active packages available right now.</div>
            )}
          </>
        )}
      </div>

      <PackageModal pkg={selectedPkg} open={!!selectedPkg} onClose={() => setSelectedPkg(null)} portalMode />
    </UserLayout>
  );
};

export default UserApply;
