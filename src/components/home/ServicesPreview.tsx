import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Plane, Moon, FileText } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import heroKaaba from "@/assets/hero-kaaba.jpg";
import masjidNabawi from "@/assets/masjid-nabawi.jpg";
import visaImage from "@/assets/visa-assistance.jpg";

const services = [
  { title: "Hajj Packages", desc: "Complete Hajj packages with 5-star accommodation, guided tours, and all-inclusive services for the journey of a lifetime.", image: heroKaaba, link: "/hajj-packages", icon: Moon },
  { title: "Umrah Packages", desc: "Affordable Umrah packages throughout the year including special Ramadan offerings for a blessed experience.", image: masjidNabawi, link: "/umrah-packages", icon: Plane },
  { title: "Visa Assistance", desc: "Expert visa processing for Saudi Arabia, Turkey, Malaysia, and many more countries with hassle-free documentation.", image: visaImage, link: "/visa-assistance", icon: FileText },
];

const ServicesPreview = () => {
  return (
    <section className="py-32 bg-background relative">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4 font-semibold">Our Services</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 text-pretty">What We Offer</h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto mb-8">Comprehensive solutions for all your pilgrimage needs, from booking to spiritual guidance</p>
            <div className="divider-gold w-32 mx-auto h-1 rounded-full" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {services.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -12 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group rounded-2xl overflow-hidden glass-card shimmer-hover hover:shadow-elevated transition-all duration-500 border border-border/40 hover:border-accent/30"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent group-hover:from-foreground/80 transition-all duration-300" />
                  <div className="absolute bottom-6 left-6 w-14 h-14 rounded-xl gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-300">
                    <s.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-base mb-7 leading-relaxed">{s.desc}</p>
                  <Link to={s.link}>
                    <Button variant="outline-gold" size="sm" className="gap-2 group/btn font-medium">
                      Learn More <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
