import { PackageType, formatPrice } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Clock, Star, ArrowRight, Plane } from "lucide-react";
import { motion } from "framer-motion";
import heroKaaba from "@/assets/hero-kaaba.jpg";
import masjidNabawi from "@/assets/masjid-nabawi.jpg";

interface PackageCardProps {
  pkg: PackageType;
  onViewDetails: (pkg: PackageType) => void;
}

const PackageCard = ({ pkg, onViewDetails }: PackageCardProps) => {
  const image = pkg.type === 'hajj' ? heroKaaba : masjidNabawi;
  const priceEntries = Object.entries(pkg.prices).filter(([, v]) => v !== undefined);
  const lowestPrice = Math.min(...priceEntries.map(([, v]) => v!));

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group glass-card rounded-2xl overflow-hidden shimmer-hover hover:shadow-elevated transition-all duration-500 flex flex-col border border-border/40 hover:border-accent/30"
    >
      <div className="relative h-60 overflow-hidden">
        <img src={image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out" />
        {pkg.featured && (
          <div className="absolute top-5 right-5 gradient-gold px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold text-primary-foreground shadow-gold hover:shadow-elevated transition-all duration-300">
            <Star className="w-3.5 h-3.5 fill-current" /> Featured
          </div>
        )}
        {pkg.maktab && (
          <div className="absolute top-5 left-5 bg-accent/95 text-primary-foreground px-4 py-2 rounded-full text-xs font-bold shadow-soft">
            Maktab {pkg.maktab}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent h-28 group-hover:from-foreground/90 transition-all duration-300" />
        <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-primary-foreground/95">
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold">{pkg.duration}</span>
          </div>
          {pkg.flightInfo?.flight && (
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <Plane className="w-4 h-4" />
              <span className="text-xs font-medium">{pkg.flightInfo.flight}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-foreground mb-1 line-clamp-2 leading-tight">{pkg.name}</h3>
        
        {pkg.nightsBreakup && (
          <p className="text-xs text-muted-foreground mb-4 font-medium">Nights: {pkg.nightsBreakup}</p>
        )}

        <div className="mb-6 p-4 bg-accent/5 rounded-lg border border-accent/10">
          <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-semibold">Starting from</p>
          <p className="text-2xl font-bold text-accent font-display">{formatPrice(lowestPrice)}</p>
        </div>

        <div className="mb-6 flex-1 space-y-2">
          {pkg.hotels.slice(0, 3).map((h) => (
            <p key={h.name} className="text-xs text-foreground/70 flex items-start gap-2">
              <span className="text-accent/60 mt-0.5">🏨</span>
              <span><span className="font-semibold text-foreground">{h.name}</span> • <span className="text-accent">{h.distance}</span></span>
            </p>
          ))}
        </div>
        <Button variant="gold" className="w-full gap-2 shadow-gold group/btn font-semibold" onClick={() => onViewDetails(pkg)}>
          View Full Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PackageCard;
