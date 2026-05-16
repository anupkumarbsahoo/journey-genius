import { Metadata } from "next";
import { AIAssistantPage } from "@/components/pages/AIAssistantPage";

export const metadata: Metadata = {
  title: "AI Travel Assistant",
  description: "Chat with your AI travel assistant for personalized recommendations.",
};

export default function AIAssistant() {
  return <AIAssistantPage />;
}
