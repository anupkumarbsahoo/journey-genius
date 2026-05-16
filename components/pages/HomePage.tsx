"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plane,
  Compass,
  Route,
  BookOpen,
  Bot,
  Sparkles,
  MapPin,
  Star,
  Gem,
  ChevronRight,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

const FEATURES = [
  {
    icon: Compass,
    title: "Attraction Discovery",
    description: "Find attractions, hidden gems, restaurants, and essentials within any radius using live OpenStreetMap data.",
    color: "from-brand-500 to-blue-600",
    href: "/explore",
  },
  {
    icon: Route,
    title: "Smart Route Planner",
    description: "Optimized routes with fuel cost estimates, scenic alternatives, and attraction-rich corridors.",
    color: "from-teal-500 to-emerald-600",
    href: "/route-planner",
  },
  {
    icon: BookOpen,
    title: "AI Itinerary Generator",
    description: "Day-by-day personalized itineraries with meals, hotels, and timing — powered by Groq & Gemini.",
    color: "from-purple-500 to-violet-600",
    href: "/itinerary",
  },
  {
    icon: Bot,
    title: "AI Travel Assistant",
    description: "Ask anything — hidden gems, local tips, weather-aware plans, and real-time personalized advice.",
    color: "from-pink-500 to-rose-600",
    href: "/ai-assistant",
  },
];

const STATS = [
  { value: "10M+", label: "Attractions mapped" },
  { value: "150+", label: "Countries covered" },
  { value: "98%", label: "Planning accuracy" },
  { value: "Free", label: "Always & forever" },
];

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Adventure Traveler",
    text: "WanderPilot planned our 10-day Japan trip in minutes. The hidden gems feature found places we'd never have discovered!",
    rating: 5,
  },
  {
    name: "Marcus R.",
    role: "Road Trip Enthusiast",
    text: "The route planner with fuel cost estimates saved us so much money on our cross-country drive. Incredible tool.",
    rating: 5,
  },
  {
    name: "Elena M.",
    role: "Family Traveler",
    text: "Generated a complete family itinerary with kid-friendly activities and budget breakdown. Absolutely love it!",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HomePage() {
  return (
    <div className="min-h-screen animated-gradient">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/6 rounded-full blur-3xl" />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-sm text-brand-300">Powered by Groq AI & Google Gemini</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            <span className="text-white">Your AI-Powered</span>
            <br />
            <span className="gradient-text">Travel Co-Pilot</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover hidden gems, plan scenic routes, generate day-by-day itineraries, and chat with
            your AI travel assistant — all in one beautiful app.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/explore">
              <Button size="xl" className="gap-2 w-full sm:w-auto">
                <Compass className="w-5 h-5" />
                Start Exploring Free
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/itinerary">
              <Button size="xl" variant="glass" className="gap-2 w-full sm:w-auto">
                <BookOpen className="w-5 h-5" />
                Generate Itinerary
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold gradient-text">{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-muted-foreground/50" />
          <span className="text-xs">Scroll to explore</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to travel{" "}
              <span className="gradient-text">smarter</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From discovery to departure, WanderPilot AI handles every step of your journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Link href={feature.href} className="block h-full">
                    <div className="glass-card rounded-2xl p-6 h-full hover:border-white/20 transition-all duration-300 group">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                      <div className="flex items-center gap-1 mt-4 text-brand-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-brand-500/3" />
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Plan your dream trip in{" "}
              <span className="gradient-text">3 simple steps</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: MapPin, title: "Enter your destination", desc: "Tell us where you're going and how long you'll be there." },
              { step: "02", icon: Sparkles, title: "AI generates your plan", desc: "Our AI crafts a personalized itinerary based on your interests and budget." },
              { step: "03", icon: Plane, title: "Travel with confidence", desc: "Export your itinerary, share with travel companions, and go!" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-brand-500/50 to-transparent z-10" />
                  )}
                  <div className="glass-card rounded-2xl p-6 relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {item.step}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-brand-400" />
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nearby Essentials */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Find everything <span className="gradient-text">nearby</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From EV charging stations to hidden local restaurants — discover what's around you.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: "🍽️", label: "Restaurants" },
              { icon: "⛽", label: "Gas Stations" },
              { icon: "🛒", label: "Walmart & Costco" },
              { icon: "🥬", label: "Grocery Stores" },
              { icon: "🏥", label: "Hospitals" },
              { icon: "⚡", label: "EV Charging" },
              { icon: "🏛️", label: "Attractions" },
              { icon: "🌳", label: "Parks" },
              { icon: "💎", label: "Hidden Gems" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href="/explore">
                  <div className="flex items-center gap-2 px-4 py-3 glass rounded-xl cursor-pointer hover:border-brand-500/30 transition-all">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Loved by travelers worldwide</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Groq-powered responses in milliseconds" },
              { icon: Shield, title: "Privacy First", desc: "No tracking, no data selling, ever" },
              { icon: Globe, title: "100% Free", desc: "Powered by free-tier APIs, no paywall" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-2xl p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-500/30">
              <Gem className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to discover your next adventure?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join thousands of travelers planning smarter trips with WanderPilot AI. It's free, forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore">
                <Button size="xl" className="gap-2">
                  <Compass className="w-5 h-5" />
                  Start Exploring
                </Button>
              </Link>
              <Link href="/ai-assistant">
                <Button size="xl" variant="glass" className="gap-2">
                  <Bot className="w-5 h-5" />
                  Chat with AI
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
