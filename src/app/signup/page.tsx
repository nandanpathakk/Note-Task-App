// src/app/signup/page.tsx
import { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up - AI Notes",
  description: "Create a new AI Notes account",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <SignupForm />
      </div>
    </div>
  );
}