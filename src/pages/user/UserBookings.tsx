import UserLayout from "@/components/user/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatPrice } from "@/data/packages";

const statusSteps = ['pending', 'documents', 'visa', 'confirmed'] as const;
const stepLabels = { pending: 'Applied', documents: 'Documents', visa: 'Visa Processing', confirmed: 'Confirmed' };

const userBookings = [
  { id: 'B008', packageName: 'Premium Umrah Package', type: 'umrah', sharingType: 'Double', status: 'confirmed' as const, date: '2026-01-10', amount: 450000 },
  { id: 'B002', packageName: 'Economy Umrah Package', type: 'umrah', sharingType: 'Quad', status: 'visa' as const, date: '2026-02-01', amount: 135000 },
  { id: 'B004', packageName: 'Ramadan Special Umrah', type: 'umrah', sharingType: 'Triple', status: 'pending' as const, date: '2026-02-20', amount: 300000 },
];

const getProgress = (status: typeof statusSteps[number]) => {
  const idx = statusSteps.indexOf(status);
  return ((idx + 1) / statusSteps.length) * 100;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  documents: "bg-blue-100 text-blue-800",
  visa: "bg-purple-100 text-purple-800",
  confirmed: "bg-green-100 text-green-800",
};

const UserBookings = () => {
  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">My Bookings</h1>

        <div className="grid gap-4">
          {userBookings.map((b) => (
            <Card key={b.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-lg">{b.packageName}</CardTitle>
                  <Badge className={`${statusColors[b.status]} capitalize`}>{b.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{b.id}</span></div>
                  <div><span className="text-muted-foreground">Type:</span> <span className="capitalize">{b.type}</span></div>
                  <div><span className="text-muted-foreground">Sharing:</span> {b.sharingType}</div>
                  <div><span className="text-muted-foreground">Amount:</span> {formatPrice(b.amount)}</div>
                </div>

                {/* Progress Tracker */}
                <div className="space-y-2">
                  <Progress value={getProgress(b.status)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {statusSteps.map((step) => (
                      <span key={step} className={statusSteps.indexOf(step) <= statusSteps.indexOf(b.status) ? "text-primary font-medium" : ""}>
                        {stepLabels[step]}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserBookings;
