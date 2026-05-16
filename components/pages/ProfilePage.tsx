"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Edit3,
  Save,
  Bookmark,
  BookOpen,
  Star,
  TrendingUp,
  DollarSign,
  Camera,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";

const TRAVEL_STYLES = ["Adventure", "Cultural", "Luxury", "Budget", "Family", "Solo", "Romantic"];
const INTERESTS = ["Culture", "Food", "Nature", "Adventure", "Shopping", "Photography", "History", "Music"];

const STATS = [
  { icon: Bookmark, label: "Saved Trips", value: "3" },
  { icon: BookOpen, label: "Itineraries", value: "7" },
  { icon: Star, label: "Reviews", value: "12" },
  { icon: TrendingUp, label: "Miles Planned", value: "8,240" },
];

const EXPENSE_DATA = [
  { category: "Transport", amount: 1240, color: "bg-brand-500" },
  { category: "Accommodation", amount: 2100, color: "bg-teal-500" },
  { category: "Food", amount: 640, color: "bg-amber-500" },
  { category: "Activities", amount: 380, color: "bg-purple-500" },
];

export function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Traveler",
    email: "alex@example.com",
    location: "San Francisco, CA",
    bio: "Adventure seeker and travel enthusiast. Always planning the next journey!",
    travelStyle: "Adventure",
    interests: ["Culture", "Food", "Nature"],
  });

  const totalExpenses = EXPENSE_DATA.reduce((s, e) => s + e.amount, 0);

  const handleSave = () => {
    setEditing(false);
    toast.success("Profile updated!");
  };

  const toggleInterest = (interest: string) => {
    setProfile((p) => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter((i) => i !== interest)
        : [...p.interests, interest],
    }));
  };

  return (
    <div className="min-h-screen animated-gradient">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-6 flex-wrap">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-brand-500/30">
                {profile.name.charAt(0)}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-white/5 transition-all">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-3">
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className="bg-white/5 font-bold text-lg"
                  />
                  <Input
                    value={profile.location}
                    icon={<MapPin className="w-3.5 h-3.5" />}
                    onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                    className="bg-white/5"
                  />
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    rows={2}
                    className="w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.location}
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">{profile.bio}</p>
                </>
              )}
            </div>

            <Button
              variant={editing ? "default" : "glass"}
              size="sm"
              onClick={editing ? handleSave : () => setEditing(true)}
              className="gap-1.5"
            >
              {editing ? (
                <><Save className="w-4 h-4" /> Save</>
              ) : (
                <><Edit3 className="w-4 h-4" /> Edit</>
              )}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Travel Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 pt-0">
                {STATS.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center p-3 rounded-xl bg-white/3">
                    <Icon className="w-5 h-5 mx-auto mb-1 text-brand-400" />
                    <div className="font-bold text-lg">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Travel Style */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Travel Style
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex flex-wrap gap-2">
                {TRAVEL_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setProfile((p) => ({ ...p, travelStyle: style }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      profile.travelStyle === style
                        ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                        : "border-border/30 bg-white/3 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      profile.interests.includes(interest)
                        ? "border-teal-500/50 bg-teal-500/15 text-teal-300"
                        : "border-border/30 bg-white/3 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expense Tracker */}
            <Card className="bg-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    Expense Analytics
                  </CardTitle>
                  <Badge variant="default">Total: ${totalExpenses.toLocaleString()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {EXPENSE_DATA.map((expense) => {
                  const pct = Math.round((expense.amount / totalExpenses) * 100);
                  return (
                    <div key={expense.category}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium">{expense.category}</span>
                        <span className="text-muted-foreground">${expense.amount} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${expense.color}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {[
                  { action: "Generated itinerary", detail: "Tokyo 10-day trip", time: "2 hours ago", icon: "📅" },
                  { action: "Saved trip", detail: "European Road Trip", time: "Yesterday", icon: "🔖" },
                  { action: "Reviewed", detail: "Nishiki Market, Kyoto", time: "3 days ago", icon: "⭐" },
                  { action: "Planned route", detail: "LA → San Francisco", time: "1 week ago", icon: "🛣️" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                    <span className="text-xl">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
