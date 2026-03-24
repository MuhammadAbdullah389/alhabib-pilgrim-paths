import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  FileUp,
  FileSearch,
  Plane,
  Landmark,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const steps = [
  {
    number: "01",
    title: "Apply",
    description: "Choose your package and submit your application in a few minutes.",
    icon: BadgeCheck,
    color: "from-amber-400 to-yellow-500",
  },
  {
    number: "02",
    title: "Upload Documents",
    description: "Submit required documents from your secure portal dashboard.",
    icon: FileUp,
    color: "from-blue-400 to-indigo-500",
  },
  {
    number: "03",
    title: "Visa Processing",
    description: "Our team reviews your file and starts visa processing updates.",
    icon: FileSearch,
    color: "from-violet-400 to-purple-500",
  },
  {
    number: "04",
    title: "Confirmed",
    description: "Receive final confirmation and prepare for your spiritual journey.",
    icon: Plane,
    color: "from-emerald-400 to-green-500",
  },
];

const JourneyStepsSection = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleApplySelection = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">How It Works</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Hajj, Umrah & Visa Journey in 4 Clear Steps
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            A transparent process from application to confirmation, so every applicant knows exactly what comes next.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-sm`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="font-display text-2xl text-muted-foreground/50 leading-none">{step.number}</span>
              </div>

              <h3 className="font-display text-xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

              <div className="mt-4">
                <span className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  Step {index + 1} of 4
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div className="hidden xl:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-[2px] bg-accent/40" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" size="lg">Start Your Application</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Choose Your Application Type</DialogTitle>
                <DialogDescription>
                  Select what you want to apply for and you will be redirected to the correct page.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => handleApplySelection("/hajj-packages")}
                >
                  <BadgeCheck className="w-4 h-4" />
                  Apply for Hajj
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => handleApplySelection("/umrah-packages")}
                >
                  <Landmark className="w-4 h-4" />
                  Apply for Umrah
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => handleApplySelection("/visa-assistance")}
                >
                  <FileText className="w-4 h-4" />
                  Apply for Visa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Link to="/auth/sign-in">
            <Button variant="outline" size="lg">Track From Dashboard</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneyStepsSection;
