// src/app/signup/page.tsx
import { Metadata } from "next";
import SignupPageClient from "./client";

export const metadata: Metadata = {
  title: "Sign Up - AI Notes",
  description: "Create your AI Notes account",
};

export default function SignupPage() {
  return <SignupPageClient />;
}