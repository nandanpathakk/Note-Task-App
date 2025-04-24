"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateNote, useGenerateTitle } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
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

export default function NewNotePage() {
  const router = useRouter();
  const createNote = useCreateNote();
  const generateTitle = useGenerateTitle();

  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState<boolean>(false);

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
        placeholder: 'Start writing your note here...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[400px] p-4 focus:outline-none prose prose-sm dark:prose-invert max-w-none',
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editor?.getHTML() || editor?.isEmpty) {
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
      setIsSubmitting(true);

      let finalTitle = title.trim();
      if (!finalTitle) {
        setIsGeneratingTitle(true);
        try {
          finalTitle = await generateTitle.mutateAsync(cleanContent);
          toast.success("Title generated automatically");
        } catch (error) {
          console.error("Failed to generate title:", error);
          finalTitle = "Untitled Note"; // Fallback title
          toast.error("Failed to generate title, using default");
        } finally {
          setIsGeneratingTitle(false);
        }
      }

      const newNote = await createNote.mutateAsync({
        title: finalTitle,
        content: cleanContent,
      });
      toast.success("Your note has been created successfully");
      router.push(`/dashboard/notes/${newNote.id}/view`);
    } catch (error) {
      console.error(error)
      toast.error("Failed to create note");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/notes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="md:text-2xl text-xl font-bold">Create New Note</h1>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || isGeneratingTitle || !editor?.getHTML() || editor?.isEmpty}
        >
          {isSubmitting || isGeneratingTitle ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isGeneratingTitle ? 'Generating title...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Note
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            placeholder="Note Title (Leave empty for auto-generation)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="md:text-sm text-sm font-medium"
          />
        </div>

        <div className="border rounded-md">
          {editor && <EditorMenuBar editor={editor} />}
          <EditorContent editor={editor} className="min-h-[400px]" />
        </div>

        <div className="flex justify-start gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}