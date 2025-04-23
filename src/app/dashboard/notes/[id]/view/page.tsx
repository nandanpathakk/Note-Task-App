// app/dashboard/notes/[id]/view/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNote } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteNote } from '@/hooks/useNotes';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function NoteViewPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = typeof params.id === 'string' ? params.id : '';
  
  const { data: note, isLoading, error } = useNote(noteId);
  const deleteNote = useDeleteNote();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteNote.mutateAsync(noteId);
      toast.success("Your note has been deleted successfully");
      router.push('/dashboard/notes');
    } catch (error) {
      toast.error("Failed to delete note");
      setIsDeleting(false);
    }
  };

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
          <p className="text-muted-foreground mb-4">The note you're looking for doesn't exist or you don't have access to it</p>
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
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/notes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{note.title}</h1>
        </div>
        <div className="flex gap-2">
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
      </div>
      
      <div className="mb-4 text-sm text-muted-foreground">
        Last updated: {format(new Date(note.updated_at), 'PPpp')}
      </div>
      
      {note.summary && (
        <div className="p-4 bg-muted rounded-md mb-6">
          <h3 className="font-medium text-sm mb-2">AI Summary</h3>
          <p className="text-sm">{note.summary}</p>
        </div>
      )}
      
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {note.content ? (
          <div className="whitespace-pre-wrap">{note.content}</div>
        ) : (
          <p className="text-muted-foreground italic">This note has no content.</p>
        )}
      </div>
    </div>
  );
}