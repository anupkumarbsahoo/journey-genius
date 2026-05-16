import Link from "next/link";
import { Plane, Code2, MessageCircle, Share } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">WanderPilot AI</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              AI-powered travel planning that discovers hidden gems, optimizes routes, and creates
              personalized itineraries for unforgettable journeys.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Code2, MessageCircle, Share].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Features</h3>
            <ul className="space-y-2">
              {[
                { href: "/explore", label: "Attraction Discovery" },
                { href: "/route-planner", label: "Route Planner" },
                { href: "/itinerary", label: "AI Itinerary" },
                { href: "/ai-assistant", label: "AI Assistant" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2">
              {["About", "Privacy Policy", "Terms of Service", "Contact"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} WanderPilot AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by Groq AI & Google Gemini
          </p>
        </div>
      </div>
    </footer>
  );
}
