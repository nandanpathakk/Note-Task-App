// app/dashboard/notes/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNote, useUpdateNote, useSummarizeNote } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Sparkles, Save } from 'lucide-react';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TiptapLink from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { EditorMenuBar } from '@/components/notes/EditorMenuBar';
import sanitizeHtml from 'sanitize-html';

export default function NoteEditPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = typeof params.id === 'string' ? params.id : '';

  const { data: note, isLoading, error } = useNote(noteId);
  const updateNote = useUpdateNote();
  const summarizeNote = useSummarizeNote();

  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);


  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Edit your note here...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[400px] p-4 focus:outline-none prose prose-sm dark:prose-invert max-w-none',
      },
    },
  });

  // Set initial content when note data is loaded
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(note.content || '');
      }
    }
  }, [note, editor]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      toast.warning("Please enter a title for your note");
      return;
    }

    if (!editor || editor.isEmpty) {
      toast.warning("Please add some content to your note");
      return;
    }

    const cleanContent = sanitizeHtml(editor.getHTML(), {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'width', 'height'],
        a: ['href', 'target', 'rel']
      },
      allowedSchemes: ['http', 'https', 'data'],
    });

    try {
      setIsSaving(true);
      await updateNote.mutateAsync({
        id: noteId,
        title,
        content: cleanContent,
      });

      toast.success("Your note has been saved successfully");
      // Navigate to view mode after saving
      router.push(`/dashboard/notes/${noteId}/view`);
    } catch (error) {
      toast.error("Failed to save note");
      console.error(error);
      setIsSaving(false);
    }
  };

  const handleSummarize = async () => {
    if (!editor || editor.isEmpty) {
      toast.warning("Please add some content to summarize");
      return;
    }

    const cleanContent = sanitizeHtml(editor.getHTML(), {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'width', 'height'],
        a: ['href', 'target', 'rel']
      },
      allowedSchemes: ['http', 'https', 'data'],
    });

    try {
      await summarizeNote.mutateAsync({
        id: noteId,
        content: cleanContent
      });
      toast.success("Your note has been summarized successfully");
    } catch (error) {
      toast.error("Failed to generate summary");
      console.error(error)
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
          <p className="text-muted-foreground mb-4">
            The note you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it
          </p>
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
          <Link href={`/dashboard/notes/${noteId}/view`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Note</h1>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || !title.trim() || (editor ? editor.isEmpty : true)}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <Input
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-medium"
          />
        </div>

        <div className="border rounded-md">
          {editor && <EditorMenuBar editor={editor} />}
          <EditorContent editor={editor} className="min-h-[400px]" />
        </div>

        {note.summary && (
          <div className="p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">AI Summary</h3>
            <p className="text-sm text-muted-foreground">{note.summary}</p>
          </div>
        )}

        <div className="flex justify-start gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSummarize}
            disabled={summarizeNote.isPending || (editor ? editor.isEmpty : true)}
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
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/notes/${noteId}/view`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}