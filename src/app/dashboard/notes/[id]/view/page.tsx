// app/dashboard/notes/[id]/view/page.tsx
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNote, useDeleteNote } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import sanitizeHtml from 'sanitize-html';
import { SummarizeButton } from '@/components/notes/SummarizeButton';


export default function NoteViewPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = typeof params.id === 'string' ? params.id : '';

  const { data: note, isLoading, error } = useNote(noteId);
  const deleteNote = useDeleteNote();

  const [isDeleting, setIsDeleting] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteNote.mutateAsync(noteId);
      toast.success("Note deleted successfully");
      router.push("/dashboard/notes");
    } catch (error) {
      toast.error("Failed to delete note");
      console.error(error)
      setIsDeleting(false);
    }
  };

  const handleSummarizeComplete = (newSummary: string) => {
    setSummary(newSummary);
  };

  const displaySummary = summary || note?.summary;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-bold mb-2">Note not found</h2>
          <p className="text-muted-foreground mb-4">The note you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it</p>
          <Link href="/dashboard/notes">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Notes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-4 px-4 md:py-6 md:px-6">
        {/* Header section */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
          {/* Back button and title */}
          <div className="flex items-start gap-2 md:gap-4 w-full md:w-auto">
            <Link href="/dashboard/notes">
              <Button variant="ghost" size="icon" className="mt-1 md:mt-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold line-clamp-2 md:line-clamp-1 flex-1 pr-2">{note.title}</h1>
          </div>
          
          {/* Action buttons - desktop */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <SummarizeButton
              noteId={note?.id}
              content={note.content}
              onSummarizeComplete={handleSummarizeComplete}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/notes/${noteId}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your note.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Action buttons - mobile */}
          <div className="flex md:hidden items-center gap-2 justify-between w-full">
            <SummarizeButton
              noteId={note?.id}
              content={note.content}
              onSummarizeComplete={handleSummarizeComplete}
              variant="outline"
              size="sm"
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/notes/${noteId}/edit`)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex-1">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your note.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {/* Render the note content safely */}
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content || '') }} />
          </div>

          {displaySummary && (
            <div className="p-4 bg-muted rounded-md mt-8">
              <h3 className="font-medium mb-2">AI Summary</h3>
              <p className="text-muted-foreground">{displaySummary}</p>
            </div>
          )}

          <div className="text-xs md:text-sm text-muted-foreground pt-4">
            <p>Created: {new Date(note.created_at).toLocaleString()}</p>
            {note.updated_at && note.updated_at !== note.created_at && (
              <p>Last updated: {new Date(note.updated_at).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>

    </>
  );
}