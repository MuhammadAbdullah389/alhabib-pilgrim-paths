import UserLayout from "@/components/user/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, CheckCircle, Clock, FileText } from "lucide-react";

const stats = [
  { label: "Total Applications", value: "3", icon: ClipboardList, color: "text-primary" },
  { label: "Confirmed", value: "1", icon: CheckCircle, color: "text-green-600" },
  { label: "In Progress", value: "1", icon: Clock, color: "text-accent" },
  { label: "Pending", value: "1", icon: FileText, color: "text-yellow-600" },
];

const recentActivity = [
  { date: "Feb 20, 2026", text: "Umrah application status updated to Visa Processing" },
  { date: "Feb 15, 2026", text: "Documents submitted for Standard Hajj Package" },
  { date: "Jan 10, 2026", text: "Premium Umrah booking confirmed ✓" },
];

const UserOverview = () => {
  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Welcome Back!</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`p-2 rounded-lg bg-muted ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold font-display">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Badge variant="secondary" className="text-xs shrink-0 mt-0.5">{a.date}</Badge>
                  <p className="text-sm text-foreground">{a.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserOverview;
