// app/app/notes/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNote, useUpdateNote, useSummarizeNote } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = typeof params.id === 'string' ? params.id : '';
  
  const { data: note, isLoading, error } = useNote(noteId);
  const updateNote = useUpdateNote();
  const summarizeNote = useSummarizeNote();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("Please enter a title for your note")
      return;
    }

    try {
      setIsSaving(true);
      await updateNote.mutateAsync({
        id: noteId,
        title,
        content,
      });

      toast.success("Your note has been saved successfully")
    } catch (error) {
      toast.error("Failed to save note")
    } finally {
      setIsSaving(false);
    }
  };

  const handleSummarize = async () => {
    if (!content.trim()) {
      toast.warning("Please add some content to summarize")
      return;
    }

    try {
      await summarizeNote.mutateAsync({ id: noteId, content });
      toast.success("Your note has been summarized successfully")
    } catch (error) {
      toast.error("Failed to generate summary")
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
          <Link href="/app/notes">
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
      <div className="flex items-center gap-4 mb-6">
        <Link href="/app/notes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Note</h1>
      </div>
      
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />
        </div>
        
        <div>
          <Textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px]"
          />
        </div>
        
        {note.summary && (
          <div className="p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">AI Summary</h3>
            <p className="text-sm text-muted-foreground">{note.summary}</p>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleSummarize}
            disabled={summarizeNote.isPending || !content.trim()}
          >
            {summarizeNote.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {note.summary ? 'Regenerate Summary' : 'Generate Summary'}
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Note'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}