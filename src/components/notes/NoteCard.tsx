// components/notes/NoteCard.tsx
"use client";

import { Note } from '@/types/database.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteNote } from '@/hooks/useNotes';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import sanitizeHtml from 'sanitize-html';


interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const router = useRouter();
  const deleteNote = useDeleteNote();

  const handleCardClick = () => {
    router.push(`/dashboard/notes/${note.id}/view`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/notes/${note.id}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNote.mutateAsync(note.id);
      toast.success("Your note has been deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="truncate">{note.title}</CardTitle>
          <CardDescription className="flex items-center text-xs mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={handleDelete}
              disabled={deleteNote.isPending}
            >
              {deleteNote.isPending ? 'Deleting...' : 'Delete'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="line-clamp-3 text-sm text-muted-foreground">
          {/* {note.content || "No content"} */}
          <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content || 'No content') }} />
        </div>
        {note.summary && (
          <div className="mt-2 p-2 bg-muted/50 rounded-md">
            <p className="text-xs font-medium text-muted-foreground">Summary:</p>
            <p className="line-clamp-2 text-xs">{note.summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}