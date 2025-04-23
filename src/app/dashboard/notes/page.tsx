// app/app/notes/page.tsx
"use client";

import { useNotes } from '@/hooks/useNotes';
import NoteCard from '@/components/notes/NoteCard';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function NotesPage() {
  const { data: notes, isLoading, error } = useNotes();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <h2 className="text-xl font-bold text-destructive">Error loading notes</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <Link href="notes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Note
          </Button>
        </Link>
      </div>

      {notes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-medium mb-2">No notes yet</h2>
          <p className="text-muted-foreground mb-4">Create your first note to get started</p>
          <Link href="notes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes?.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}