# ✈️ WanderPilot AI — Smart Travel Planning

An AI-powered travel planner built with Next.js 15, featuring real-time attraction discovery, smart route planning, and personalized itinerary generation using **Groq AI** and **Google Gemini** — all free!

## 🚀 Features

- 🗺️ **Attraction Discovery** — Find attractions using OpenStreetMap's free Overpass API
- 💎 **Hidden Gems** — AI-powered off-the-beaten-path recommendations
- 🛣️ **Smart Route Planner** — Optimized routes with fuel cost estimates
- 📅 **AI Itinerary Generator** — Day-by-day plans powered by Groq + Gemini
- 🤖 **AI Travel Assistant** — Llama 3.3 70B chat interface with voice input
- 🌤️ **Weather Integration** — OpenWeatherMap real-time data
- 📱 **PWA Support** — Installable on mobile

## 🛠️ Tech Stack

Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Mapbox GL · Groq AI · Google Gemini · OpenStreetMap · PostgreSQL · Prisma ORM · NextAuth.js · Vercel

## 📦 Quick Start

### Free API Keys Required

| Service | Free Tier | Signup |
|---------|-----------|--------|
| Mapbox | 50k map loads/month | [mapbox.com](https://mapbox.com) |
| Groq | Free (fast LLM) | [console.groq.com](https://console.groq.com) |
| Google Gemini | Free tier | [aistudio.google.com](https://aistudio.google.com) |
| OpenWeatherMap | 60 calls/min | [openweathermap.org](https://openweathermap.org) |

### Installation

```bash
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npx prisma migrate dev --name init
npm run dev
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
