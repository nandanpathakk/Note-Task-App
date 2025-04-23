// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClientProvider } from "@/components/providers/QueryClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Notes App",
  description: "A smart notes app with AI summarization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}