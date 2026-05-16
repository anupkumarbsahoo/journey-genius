"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Map,
  Route,
  BookOpen,
  Bookmark,
  Bot,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Plane,
} from "lucide-react";
import { useTheme } from "@/components/shared/ThemeProvider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Plane },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/route-planner", label: "Routes", icon: Route },
  { href: "/itinerary", label: "Itinerary", icon: BookOpen },
  { href: "/saved-trips", label: "Saved", icon: Bookmark },
  { href: "/ai-assistant", label: "AI Chat", icon: Bot },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-shadow">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight gradient-text">
              WanderPilot
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-brand-500/15 text-brand-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/profile"
              className={cn(
                "hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === "/profile"
                  ? "bg-brand-500/15 text-brand-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>

            <Link
              href="/explore"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-105"
            >
              <Map className="w-4 h-4" />
              Explore Now
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50"
          >
            <div className="px-4 py-4 space-y-1">
              {[...navLinks, { href: "/profile", label: "Profile", icon: User }].map(
                ({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-brand-500/15 text-brand-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  );
                }
              )}
              <Link
                href="/explore"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-teal-500 text-white text-sm font-semibold mt-2"
              >
                <Map className="w-5 h-5" />
                Explore Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
