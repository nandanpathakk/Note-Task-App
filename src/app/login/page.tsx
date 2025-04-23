// src/app/login/page.tsx
import { Metadata } from "next";
import LoginPageClient from "./client";

export const metadata: Metadata = {
  title: "Login - AI Notes",
  description: "Login to your AI Notes account",
};

export default function LoginPage() {
  return <LoginPageClient />;
}