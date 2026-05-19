import React, { useMemo, useState, Suspense } from "react";
import { usePackages } from "@/hooks/useSupabase";
import { PackageType, formatPrice } from "@/data/packages";
import PackageCard from "@/components/packages/PackageCard";
const PackageModal = React.lazy(() => import("@/components/packages/PackageModal"));
import ScrollReveal from "@/components/animations/ScrollReveal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import masjidNabawi from "@/assets/masjid-nabawi.jpg";

const UmrahPackages = () => {
  const { data: packages, isLoading } = usePackages('umrah');
  const [selectedPkg, setSelectedPkg] = useState<PackageType | null>(null);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const parseDistance = (distance: string) => {
    const match = distance.match(/\d+/);
    return match ? Number(match[0]) : null;
  };

  const getLowestPrice = (pkg: PackageType) => {
    const values = Object.values(pkg.prices).filter((v): v is number => typeof v === "number");
    return values.length ? Math.min(...values) : null;
  };

  const getMinDistance = (pkg: PackageType) => {
    const distances = pkg.hotels
      .map((h) => parseDistance(h.distance))
      .filter((v): v is number => typeof v === "number");
    return distances.length ? Math.min(...distances) : null;
  };

  const filteredPackages = useMemo(() => {
    const minValue = minPrice ? Number(minPrice) : null;
    const maxValue = maxPrice ? Number(maxPrice) : null;
    const maxDistanceValue = maxDistance ? Number(maxDistance) : null;
    const query = search.trim().toLowerCase();

    return (packages || []).filter((pkg) => {
      if (featuredOnly && !pkg.featured) return false;
      if (query && !pkg.name.toLowerCase().includes(query)) return false;

      const lowestPrice = getLowestPrice(pkg);
      if (minValue !== null && lowestPrice !== null && lowestPrice < minValue) return false;
      if (maxValue !== null && lowestPrice !== null && lowestPrice > maxValue) return false;

      const nearestHotel = getMinDistance(pkg);
      if (maxDistanceValue !== null && nearestHotel !== null && nearestHotel > maxDistanceValue) return false;

      return true;
    });
  }, [packages, featuredOnly, search, minPrice, maxPrice, maxDistance]);

  const comparePackages = useMemo(
    () => (packages || []).filter((pkg) => compareIds.includes(pkg.id)),
    [packages, compareIds]
  );

  const toggleCompare = (pkg: PackageType) => {
    setCompareIds((prev) => {
      if (prev.includes(pkg.id)) return prev.filter((id) => id !== pkg.id);
      if (prev.length >= 3) {
        toast.error("You can compare up to 3 packages at a time");
        return prev;
      }
      return [...prev, pkg.id];
    });
  };

  const handleCompareModeChange = (value: boolean) => {
    setCompareMode(value);
    if (!value) {
      setCompareIds([]);
      setCompareOpen(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setMaxDistance("");
    setFeaturedOnly(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img src={masjidNabawi} alt="Masjid-e-Nabawi" className="absolute inset-0 w-full h-full object-cover" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 text-center pt-16">
          <ScrollReveal>
            <p className="text-gold-light tracking-[0.3em] uppercase text-sm mb-3">Blessed Journey</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.75)]">Umrah Packages</h1>
            <p className="text-white/90 mt-4 max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
              Year-round Umrah packages including special Ramadan offerings for a spiritually enriching experience.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="mb-8">
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
                <div className="xl:col-span-2">
                  <Label>Search</Label>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by package name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Min Price (PKR)</Label>
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="e.g. 200000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Max Price (PKR)</Label>
                  <Input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="e.g. 1500000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Max Hotel Distance (m)</Label>
                  <Input
                    type="number"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                    placeholder="e.g. 800"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={featuredOnly} onCheckedChange={setFeaturedOnly} />
                  <Label>Featured only</Label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Switch checked={compareMode} onCheckedChange={handleCompareModeChange} />
                  <Label>Compare mode</Label>
                </div>
                <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))
              : filteredPackages.map((pkg, i) => (
                  <ScrollReveal key={pkg.id} delay={i * 0.1}>
                    <PackageCard
                      pkg={pkg}
                      onViewDetails={setSelectedPkg}
                      compareMode={compareMode}
                      compareSelected={compareIds.includes(pkg.id)}
                      onToggleCompare={toggleCompare}
                    />
                  </ScrollReveal>
                ))}
          </div>

          {!isLoading && filteredPackages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No packages match your filters.</div>
          )}

          {compareMode && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <p className="text-sm text-muted-foreground">
                Selected for compare: <span className="font-semibold text-foreground">{compareIds.length}</span>
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCompareIds([])} disabled={compareIds.length === 0}>
                  Clear
                </Button>
                <Button variant="gold" onClick={() => setCompareOpen(true)} disabled={compareIds.length < 2}>
                  Compare
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Compare Umrah Packages</DialogTitle>
          </DialogHeader>
          {comparePackages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Select at least two packages to compare.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    {comparePackages.map((pkg) => (
                      <TableHead key={pkg.id}>{pkg.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Lowest Price</TableCell>
                    {comparePackages.map((pkg) => {
                      const price = getLowestPrice(pkg);
                      return <TableCell key={pkg.id}>{price ? formatPrice(price) : "N/A"}</TableCell>;
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Duration</TableCell>
                    {comparePackages.map((pkg) => (
                      <TableCell key={pkg.id}>{pkg.duration}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Nearest Hotel</TableCell>
                    {comparePackages.map((pkg) => (
                      <TableCell key={pkg.id}>{getMinDistance(pkg) ? `${getMinDistance(pkg)}m` : "-"}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Services</TableCell>
                    {comparePackages.map((pkg) => (
                      <TableCell key={pkg.id}>{pkg.services.length} items</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Featured</TableCell>
                    {comparePackages.map((pkg) => (
                      <TableCell key={pkg.id}>{pkg.featured ? "Yes" : "No"}</TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Suspense fallback={null}>
        <PackageModal pkg={selectedPkg} open={!!selectedPkg} onClose={() => setSelectedPkg(null)} />
      </Suspense>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default UmrahPackages;
