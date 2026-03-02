import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { mockBookings, type Booking } from "@/data/mockDashboard";
import { formatPrice } from "@/data/packages";
import { toast } from "sonner";
import { Search, Filter } from "lucide-react";

const statusColors: Record<Booking['status'], string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  documents: "bg-blue-100 text-blue-800 border-blue-300",
  visa: "bg-purple-100 text-purple-800 border-purple-300",
  confirmed: "bg-green-100 text-green-800 border-green-300",
};

const statusNext: Record<Booking['status'], Booking['status'] | null> = {
  pending: 'documents',
  documents: 'visa',
  visa: 'confirmed',
  confirmed: null,
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = bookings.filter(b => {
    if (filterType !== "all" && b.packageType !== filterType) return false;
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (search && !b.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const advanceStatus = (id: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== id) return b;
      const next = statusNext[b.status];
      if (!next) return b;
      toast.success(`${b.customerName}: ${b.status} → ${next}`);
      return { ...b, status: next };
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Booking Management</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customer..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hajj">Hajj</SelectItem>
              <SelectItem value="umrah">Umrah</SelectItem>
              <SelectItem value="visa">Visa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Package</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Amount</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">{b.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{b.customerName}</p>
                        <p className="text-xs text-muted-foreground">{b.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{b.packageName}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[b.status]} border capitalize`}>{b.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatPrice(b.amount)}</TableCell>
                    <TableCell>
                      {statusNext[b.status] ? (
                        <Button size="sm" variant="outline" onClick={() => advanceStatus(b.id)}>
                          → {statusNext[b.status]}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Done</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
