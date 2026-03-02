import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { hajjPackages, umrahPackages, formatPrice } from "@/data/packages";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockHotels } from "@/data/mockDashboard";
import { toast } from "sonner";

const AdminPackages = () => {
  const [addOpen, setAddOpen] = useState(false);

  const renderTable = (packages: typeof hajjPackages) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Double</TableHead>
          <TableHead>Triple</TableHead>
          <TableHead className="hidden md:table-cell">Quad</TableHead>
          <TableHead className="hidden md:table-cell">Quint</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packages.map((pkg) => (
          <TableRow key={pkg.id}>
            <TableCell className="font-medium">
              {pkg.name}
              {pkg.featured && <Badge className="ml-2 bg-accent text-accent-foreground">Featured</Badge>}
            </TableCell>
            <TableCell>{pkg.duration}</TableCell>
            <TableCell>{formatPrice(pkg.prices.double)}</TableCell>
            <TableCell>{formatPrice(pkg.prices.triple)}</TableCell>
            <TableCell className="hidden md:table-cell">{formatPrice(pkg.prices.quad)}</TableCell>
            <TableCell className="hidden md:table-cell">{formatPrice(pkg.prices.quint)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => toast.info("Edit mode (mock)")}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => toast.info("Delete (mock)")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Package Management</h1>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2"><Plus className="h-4 w-4" /> Add Package</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">Add New Package</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Package added (mock)"); setAddOpen(false); }}>
                <div className="space-y-2">
                  <Label>Package Name</Label>
                  <Input placeholder="e.g. Premium Hajj Package" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="hajj">Hajj</SelectItem><SelectItem value="umrah">Umrah</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input placeholder="e.g. 21 Days" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Price (Double)</Label><Input type="number" placeholder="0" /></div>
                  <div className="space-y-2"><Label>Price (Triple)</Label><Input type="number" placeholder="0" /></div>
                  <div className="space-y-2"><Label>Price (Quad)</Label><Input type="number" placeholder="0" /></div>
                  <div className="space-y-2"><Label>Price (Quint)</Label><Input type="number" placeholder="0" /></div>
                </div>
                <div className="space-y-2">
                  <Label>Makkah Hotel</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select Hotel" /></SelectTrigger>
                    <SelectContent>
                      {mockHotels.filter(h => h.city === 'Makkah').map(h => (
                        <SelectItem key={h.id} value={h.id}>{h.name} ({h.distanceMeters}m)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Madinah Hotel</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select Hotel" /></SelectTrigger>
                    <SelectContent>
                      {mockHotels.filter(h => h.city === 'Madinah').map(h => (
                        <SelectItem key={h.id} value={h.id}>{h.name} ({h.distanceMeters}m)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" variant="gold" className="w-full">Create Package</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="hajj">
          <TabsList>
            <TabsTrigger value="hajj">Hajj Packages</TabsTrigger>
            <TabsTrigger value="umrah">Umrah Packages</TabsTrigger>
          </TabsList>
          <TabsContent value="hajj">
            <Card><CardContent className="p-0">{renderTable(hajjPackages)}</CardContent></Card>
          </TabsContent>
          <TabsContent value="umrah">
            <Card><CardContent className="p-0">{renderTable(umrahPackages)}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminPackages;
