// app/dashboard/notes/[id]/page.tsx
"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function NoteRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = typeof params.id === 'string' ? params.id : '';
  
  useEffect(() => {
    router.push(`/dashboard/notes/${noteId}/view`);
  }, [noteId, router]);

  return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
} 