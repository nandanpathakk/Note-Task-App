// app/app/notes/new/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateNote } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function NewNotePage() {
  const router = useRouter();
  const createNote = useCreateNote();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.warning("Please enter a title for your note")
      return;
    }

    try {
      const newNote = await createNote.mutateAsync({
        title,
        content,
      });
      toast.success("Your note has been created successfully")
      
      router.push(`/dashboard/notes/${newNote.id}`);
    } catch (error) {
      toast.error("Failed to create note")
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Note</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
            onChange={(e: any) => setContent(e.target.value)}
            className="min-h-[300px]"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createNote.isPending}
          >
            {createNote.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Note'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}