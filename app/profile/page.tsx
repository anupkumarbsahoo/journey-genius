import { Metadata } from "next";
import { ProfilePage } from "@/components/pages/ProfilePage";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your WanderPilot AI profile and preferences.",
};

export default function Profile() {
  return <ProfilePage />;
}
