import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-50 px-10 md:px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Notes
          </h1>
          <p className="mt-3 text-md md:text-lg text-gray-500">
            Create, organize, and summarize your notes with AI assistance
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button asChild size="lg">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}