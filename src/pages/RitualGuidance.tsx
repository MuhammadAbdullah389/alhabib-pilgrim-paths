import ScrollReveal from "@/components/animations/ScrollReveal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import heroKaaba from "@/assets/hero-kaaba.jpg";
import { SITE_CONTACT } from "@/lib/siteContact";
import { useRitualGuidancePublic, type RitualGuidanceSection } from "@/hooks/useSupabase";
import { fallbackRitualGuidance, type RitualGuidanceSectionSeed } from "@/data/ritualGuidance";

const GROUP_META = [
  {
    key: "general",
    label: "Getting Started",
    description: "How to use this guide and stay prepared.",
  },
  {
    key: "before_departure",
    label: "Before Departure",
    description: "Documents, packing, and preparation checklist.",
  },
  {
    key: "madinah",
    label: "Madinah",
    description: "Etiquette and key visits in Madinah.",
  },
  {
    key: "makkah",
    label: "Makkah",
    description: "Tawaf etiquette and crowd guidance.",
  },
  {
    key: "umrah",
    label: "Umrah Steps",
    description: "Step-by-step Umrah flow.",
  },
  {
    key: "hajj",
    label: "Hajj Steps",
    description: "Summary of the main Hajj rites.",
  },
  {
    key: "hajj_days",
    label: "Hajj Days",
    description: "Mina, Arafat, Muzdalifah, and Jamarat.",
  },
  {
    key: "ihram",
    label: "Ihram Rules",
    description: "Key prohibitions and etiquette.",
  },
  {
    key: "duas",
    label: "Essential Duas",
    description: "Short transliteration for key duas.",
  },
  {
    key: "videos",
    label: "Video Tutorials",
    description: "Helpful walkthroughs and practical tips.",
  },
  {
    key: "maps",
    label: "Interactive Maps",
    description: "Key locations in Makkah and Madinah.",
  },
] as const;

type GuidanceSection = RitualGuidanceSection | RitualGuidanceSectionSeed;

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

const toBlocks = (body: string) => {
  const lines = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: ContentBlock[] = [];

  for (const line of lines) {
    if (line.startsWith("- ")) {
      const item = line.slice(2).trim();
      const last = blocks[blocks.length - 1];
      if (last?.type === "list") {
        last.items.push(item);
      } else {
        blocks.push({ type: "list", items: [item] });
      }
    } else {
      blocks.push({ type: "paragraph", text: line });
    }
  }

  return blocks;
};

const renderLine = (text: string) => {
  const match = text.match(/(https?:\/\/\S+)/i);
  if (!match) return text;

  const url = match[1];
  const label = text.replace(url, "").trim();
  return (
    <span>
      {label ? `${label} ` : ""}
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline">
        {url}
      </a>
    </span>
  );
};

const renderBody = (body: string) =>
  toBlocks(body).map((block, index) => {
    if (block.type === "list") {
      return (
        <ul key={`list-${index}`} className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          {block.items.map((item, idx) => (
            <li key={`item-${idx}`}>{renderLine(item)}</li>
          ))}
        </ul>
      );
    }

    const isHeading = block.text.endsWith(":");
    return (
      <p
        key={`p-${index}`}
        className={isHeading ? "text-sm font-semibold text-foreground" : "text-sm text-muted-foreground"}
      >
        {renderLine(block.text)}
      </p>
    );
  });

const RitualGuidance = () => {
  const { data, isLoading } = useRitualGuidancePublic();
  const hasData = !!data && data.length > 0;
  const sections = (hasData ? data : fallbackRitualGuidance) as GuidanceSection[];

  const grouped = GROUP_META.map((group) => {
    const groupSections = sections
      .filter((section) => section.section_group === group.key)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    return { ...group, sections: groupSections };
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroKaaba}
          alt="Ritual Guidance"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 text-center pt-16 px-4">
          <ScrollReveal>
            <p className="text-gold-light tracking-[0.3em] uppercase text-sm mb-3">Guidance</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground">Ritual Guidance Manual</h1>
            <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
              Step-by-step Hajj and Umrah guidance, key duas, Ihram rules, and essential maps to help you stay confident.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">Quick Reminders</h2>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Follow your group leader and official schedules.</li>
                  <li>Keep your documents and emergency contacts secured.</li>
                  <li>Stay hydrated, rest often, and avoid overcrowded lanes.</li>
                  <li>Ask a qualified scholar for personal rulings.</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-display text-lg font-semibold">Need live assistance?</h3>
                <p className="text-sm text-muted-foreground">
                  Our team can guide you on timing, logistics, and training updates.
                </p>
                <a href={`https://wa.me/${SITE_CONTACT.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="gold" size="sm">Chat on WhatsApp</Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {!hasData && (
                <div className="rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-muted-foreground">
                  Showing the default guidance. Admins can customize the content anytime from the dashboard.
                </div>
              )}

              {grouped.map((group) => (
                <Card key={group.key} className="overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-xl font-bold text-foreground">{group.label}</h3>
                      <Badge className="bg-slate-100 text-slate-700">{group.sections.length} sections</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{group.description}</p>

                    {group.sections.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Content will be added soon.</p>
                    ) : (
                      <Accordion type="single" collapsible className="w-full">
                        {group.sections.map((section) => (
                          <AccordionItem key={section.id} value={section.slug}>
                            <AccordionTrigger className="text-left text-foreground">
                              {section.title}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3">{renderBody(section.body)}</div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default RitualGuidance;
