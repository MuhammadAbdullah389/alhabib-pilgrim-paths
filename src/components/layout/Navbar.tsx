import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logoIcon from "../../../image-removebg-preview.png";
import { LoginModal } from "../LoginModal";
import { useAuth } from "@/lib/authContext";
import { SITE_CONTACT } from "@/lib/siteContact";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Hajj Packages", path: "/hajj-packages" },
  { label: "Umrah Packages", path: "/umrah-packages" },
  { label: "Visa Assistance", path: "/visa-assistance" },
  { label: "Hajj Training", path: "/hajj-training" },
  { label: "Ritual Guidance", path: "/ritual-guidance" },
  { label: "About Us", path: "/about-us" },
  { label: "FAQs", path: "/faqs" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/95 backdrop-blur-xl shadow-lg shadow-foreground/5 border-b border-border"
          : "bg-primary/80 backdrop-blur-md border-b border-emerald-light/10"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4 h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3 group min-w-0 shrink-0">
          <img
            src={logoIcon}
            alt={SITE_CONTACT.agencyName}
            className="h-12 w-12 md:h-14 md:w-14 rounded-xl shadow-emerald transition-transform duration-300 group-hover:scale-105"
          />
          <div className="hidden sm:block min-w-0">
            <h1 className={`font-display text-lg font-bold leading-tight transition-colors duration-300 ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>
              {SITE_CONTACT.agencyShortName}
            </h1>
            <p className={`text-[10px] tracking-[0.18em] uppercase transition-colors duration-300 ${scrolled ? "text-accent" : "text-gold-light"}`}>
              {SITE_CONTACT.agencyTaglineCompact ?? SITE_CONTACT.agencyTagline}
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex flex-1 items-center justify-center gap-4 xl:gap-5 whitespace-nowrap min-w-0 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-medium transition-colors duration-300 py-1 px-1 ${
                location.pathname === link.path
                  ? "text-accent"
                  : scrolled
                    ? "text-foreground hover:text-accent"
                    : "text-primary-foreground hover:text-accent"
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 gradient-gold rounded-full"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            disabled={!mounted}
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="gold" size="sm" className="gap-2" onClick={() => setLoginModalOpen(true)}>
              <LogIn className="w-4 h-4" /> Login
            </Button>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            disabled={!mounted}
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
            aria-label="Toggle menu"
            style={{ zIndex: 60 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden backdrop-blur-xl border-t ${scrolled ? "bg-card/98 border-border" : "bg-primary/98 border-emerald-light/10"}`}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1 w-full">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block text-sm font-medium py-3 px-3 rounded-lg transition-all ${
                      location.pathname === link.path
                        ? "text-accent bg-accent/10"
                        : scrolled
                          ? "text-foreground hover:text-accent hover:bg-accent/5"
                          : "text-primary-foreground hover:text-accent hover:bg-accent/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 gap-2"
                onClick={toggleTheme}
                disabled={!mounted}
              >
                {isDark ? <SunMedium className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDark ? "Light Mode" : "Dark Mode"}
              </Button>
              {user ? (
                <Button variant="outline" className="w-full mt-2" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Button
                  variant="gold"
                  className="w-full gap-2 mt-2"
                  onClick={() => {
                    setIsOpen(false);
                    setLoginModalOpen(true);
                  }}
                >
                  <LogIn className="w-4 h-4" /> Login
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </motion.nav>
  );
};

export default Navbar;
