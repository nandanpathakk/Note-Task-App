// components/notes/NoteCard.tsx
"use client";

import { Note } from '@/types/database.types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { useDeleteNote } from '@/hooks/useNotes';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
    note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
    const deleteNote = useDeleteNote();

    const handleDelete = async () => {
        try {
            await deleteNote.mutateAsync(note.id);
            toast.success("Your note has been deleted successfully")
        } catch (error) {
            toast.error("Failed to delete note")
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="truncate">{note.title}</CardTitle>
                <CardDescription>
                    Updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                    {note.content || "No content"}
                </p>
                {note.summary && (
                    <div className="mt-2 p-2 bg-muted rounded-md">
                        <p className="text-xs font-medium">Summary:</p>
                        <p className="line-clamp-2 text-xs">{note.summary}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/app/notes/${note.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Link>
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteNote.isPending}
                >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}