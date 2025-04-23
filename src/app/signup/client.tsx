// src/app/signup/client.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/context/AuthContext";

export default function SignupPageClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client before checking auth state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isClient && !loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router, isClient]);

  // Show nothing while loading or redirecting
  if (loading || (isClient && user)) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-50 px-10 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <SignupForm />
      </div>
    </div>
  );
}