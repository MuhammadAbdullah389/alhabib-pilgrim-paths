import ScrollReveal from "@/components/animations/ScrollReveal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Download, MapPin } from "lucide-react";
import heroKaaba from "@/assets/hero-kaaba.jpg";
import { SITE_CONTACT } from "@/lib/siteContact";
import { useTrainingSessionsPublic, type TrainingSession } from "@/hooks/useSupabase";

const formatDate = (value?: string | null) => {
  if (!value) return "TBA";
  return new Date(value).toLocaleDateString();
};

const formatTimeRange = (start?: string | null, end?: string | null) => {
  if (!start && !end) return "TBA";
  if (start && end) return `${start} - ${end}`;
  return start || end || "TBA";
};

const getPhotoUrls = (session: TrainingSession) => {
  if (Array.isArray(session.photo_urls)) return session.photo_urls.filter(Boolean);
  if (!session.photo_urls) return [] as string[];
  if (typeof session.photo_urls === "string") {
    return session.photo_urls
      .split(/\n|,/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [] as string[];
};

const resolveSessionType = (session: TrainingSession) => {
  if (session.session_type === "completed") return "completed";
  if (session.session_type === "upcoming") return "upcoming";
  if (!session.event_date) return "upcoming";
  const today = new Date();
  const date = new Date(session.event_date);
  return date >= new Date(today.toDateString()) ? "upcoming" : "completed";
};

const HajjTraining = () => {
  const { data: sessions = [], isLoading } = useTrainingSessionsPublic();
  const upcomingSessions = sessions.filter((s) => resolveSessionType(s) === "upcoming");
  const completedSessions = sessions.filter((s) => resolveSessionType(s) === "completed");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroKaaba}
          alt="Hajj Training"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 text-center pt-16 px-4">
          <ScrollReveal>
            <p className="text-gold-light tracking-[0.3em] uppercase text-sm mb-3">Preparation</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground">Hajj Training Sessions</h1>
            <p className="text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
              Get guided preparation sessions with scholars and travel experts to ensure a smooth, confident journey.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="font-display text-3xl font-bold text-foreground">Coming Soon</h2>
              <p className="text-muted-foreground">
                Training sessions will be announced here soon. Contact us on WhatsApp to reserve your spot early.
              </p>
              <a href={`https://wa.me/${SITE_CONTACT.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                <Button variant="gold" size="lg">Chat on WhatsApp</Button>
              </a>
            </div>
          ) : (
            <div className="space-y-10">
              {upcomingSessions.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-display text-2xl font-bold text-foreground">Upcoming Training</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {upcomingSessions.map((session) => {
                      const photos = getPhotoUrls(session);
                      return (
                        <ScrollReveal key={session.id}>
                          <Card className="overflow-hidden">
                            {session.cover_image_url && (
                              <div className="h-48 w-full overflow-hidden">
                                <img
                                  src={session.cover_image_url}
                                  alt={session.title}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                            )}
                            <CardContent className="p-6 space-y-4">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="font-display text-xl font-bold text-foreground flex-1">{session.title}</h3>
                                <Badge className="bg-emerald-100 text-emerald-700">Upcoming</Badge>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" /> {formatDate(session.event_date)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" /> {formatTimeRange(session.start_time, session.end_time)}
                                </div>
                                {session.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> {session.location}
                                  </div>
                                )}
                              </div>

                              {session.description && (
                                <p className="text-sm text-muted-foreground leading-relaxed">{session.description}</p>
                              )}

                              {photos.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                  {photos.slice(0, 4).map((url) => (
                                    <img
                                      key={url}
                                      src={url}
                                      alt="Training session"
                                      className="h-24 w-full rounded-lg object-cover"
                                      loading="lazy"
                                    />
                                  ))}
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2">
                                {session.download_url && (
                                  <a href={session.download_url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="gap-2">
                                      <Download className="w-4 h-4" /> Download Guide
                                    </Button>
                                  </a>
                                )}
                                <a href={`https://wa.me/${SITE_CONTACT.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                                  <Button variant="gold" size="sm">Register via WhatsApp</Button>
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                </div>
              )}

              {completedSessions.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-display text-2xl font-bold text-foreground">Training Portfolio</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {completedSessions.map((session) => {
                      const photos = getPhotoUrls(session);
                      return (
                        <ScrollReveal key={session.id}>
                          <Card className="overflow-hidden">
                            {session.cover_image_url && (
                              <div className="h-48 w-full overflow-hidden">
                                <img
                                  src={session.cover_image_url}
                                  alt={session.title}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                            )}
                            <CardContent className="p-6 space-y-4">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="font-display text-xl font-bold text-foreground flex-1">{session.title}</h3>
                                <Badge className="bg-slate-100 text-slate-700">Completed</Badge>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" /> {formatDate(session.event_date)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" /> {formatTimeRange(session.start_time, session.end_time)}
                                </div>
                                {session.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> {session.location}
                                  </div>
                                )}
                              </div>

                              {session.description && (
                                <p className="text-sm text-muted-foreground leading-relaxed">{session.description}</p>
                              )}

                              {photos.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                  {photos.slice(0, 4).map((url) => (
                                    <img
                                      key={url}
                                      src={url}
                                      alt="Training session"
                                      className="h-24 w-full rounded-lg object-cover"
                                      loading="lazy"
                                    />
                                  ))}
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2">
                                {session.download_url && (
                                  <a href={session.download_url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="gap-2">
                                      <Download className="w-4 h-4" /> Download Guide
                                    </Button>
                                  </a>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default HajjTraining;
