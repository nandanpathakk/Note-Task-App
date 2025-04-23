// src/app/signup/page.tsx
import { Metadata } from "next";
import SignupPageClient from "./client";

export const metadata: Metadata = {
  title: "Sign Up - Notes",
  description: "Create your Notes account",
};

export default function SignupPage() {
  return <SignupPageClient />;
}