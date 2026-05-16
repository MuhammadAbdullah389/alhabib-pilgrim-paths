import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Star } from "lucide-react";
import logoIcon from "../../../image-removebg-preview.png";
import { SITE_CONTACT } from "@/lib/siteContact";

const Footer = () => {
  return (
    <footer className="bg-gradient-emerald text-primary-foreground relative overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="container mx-auto px-4 py-20 relative">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full border border-gold/10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logoIcon} alt={SITE_CONTACT.agencyName} className="h-16 w-16 rounded-2xl shadow-elevated transition-transform duration-300 hover:scale-110" />
            <div>
              <p className="font-display text-xl font-bold text-primary-foreground">{SITE_CONTACT.agencyShortName}</p>
              <p className="text-gold-light text-xs uppercase tracking-[0.2em] font-medium mt-1">{SITE_CONTACT.agencyTaglineCompact ?? SITE_CONTACT.agencyTagline}</p>
            </div>
            <p className="text-primary-foreground/75 text-sm leading-relaxed">
              Your trusted partner for Hajj, Umrah, and visa services since 2010. Proudly serving pilgrims from Rawalpindi and across Pakistan with dedication and care.
            </p>
            <div className="flex items-center gap-1.5 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
              <span className="text-xs text-primary-foreground/60 ml-2">Rated 5/5</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-light font-display text-base font-semibold mb-6 uppercase tracking-wider">Quick Links</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "Hajj Packages", path: "/hajj-packages" },
                { label: "Umrah Packages", path: "/umrah-packages" },
                { label: "Visa Assistance", path: "/visa-assistance" },
                { label: "About Us", path: "/about-us" },
                { label: "Contact Us", path: "/contact-us" },
                { label: "FAQs", path: "/faqs" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-primary-foreground/75 hover:text-gold-light text-sm transition-all duration-200 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="text-gold/50 group-hover:text-gold transition-colors">›</span> {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold-light font-display text-base font-semibold mb-6 uppercase tracking-wider">Contact Us</h3>
            <div className="flex flex-col gap-4 text-sm text-primary-foreground/75">
              <a href={`tel:${SITE_CONTACT.primaryPhoneDial}`} className="flex items-center gap-3 hover:text-gold-light transition-colors duration-200 group">
                <Phone className="w-5 h-5 text-gold/70 group-hover:text-gold transition-colors" /> {SITE_CONTACT.primaryPhoneDisplay}
              </a>
              <a href={`tel:${SITE_CONTACT.secondaryPhoneDial}`} className="flex items-center gap-3 hover:text-gold-light transition-colors duration-200 group">
                <Phone className="w-5 h-5 text-gold/70 group-hover:text-gold transition-colors" /> {SITE_CONTACT.secondaryPhoneDisplay}
              </a>
              <a href={`mailto:${SITE_CONTACT.email}`} className="flex items-center gap-3 hover:text-gold-light transition-colors duration-200 group">
                <Mail className="w-5 h-5 text-gold/70 group-hover:text-gold transition-colors" /> {SITE_CONTACT.email}
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold/70 mt-0.5 shrink-0" />
                <span>{SITE_CONTACT.officeAddressSingleLine}</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-gold-light font-display text-base font-semibold mb-6 uppercase tracking-wider">Office Hours</h3>
            <div className="text-sm text-primary-foreground/75 space-y-4">
              <div className="glass-dark rounded-lg p-4 border border-gold/15">
                <p className="text-xs uppercase tracking-wider text-gold-light/70 mb-2 font-medium">Monday – Saturday</p>
                <p className="text-gold-light font-semibold">9:00 AM – 8:00 PM</p>
              </div>
              <div className="glass-dark rounded-lg p-4 border border-gold/15">
                <p className="text-xs uppercase tracking-wider text-gold-light/70 mb-2 font-medium">Sunday</p>
                <p className="text-gold-light font-semibold">10:00 AM – 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/15 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} {SITE_CONTACT.agencyName}. All rights reserved.</p>
          <p className="font-arabic text-sm text-gold/50">دیدارِ رحمت ٹریولز اینڈ ٹورز</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
