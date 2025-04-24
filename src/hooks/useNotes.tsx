// hooks/useNotes.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabase';
import { Note, CreateNoteInput, UpdateNoteInput } from '@/types/database.types';
import { useAuth } from '@/context/AuthContext';

export function useNotes() {
    return useQuery({
        queryKey: ['notes'],
        queryFn: async (): Promise<Note[]> => {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) throw userError;

            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', user?.id) // optional if RLS is setup
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return data;
        },
    });
}

// Fetch a single note by ID
export function useNote(id: string | undefined) {
    return useQuery({
        queryKey: ['notes', id],
        queryFn: async (): Promise<Note> => {
            if (!id) throw new Error('Note ID is required');

            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!id, // Only run the query if we have an ID
    });
}

// Create a new note
export function useCreateNote() {

    const queryClient = useQueryClient();
    const { user } = useAuth(); // Get the current user from your auth context

    return useMutation({
        mutationFn: async (note: CreateNoteInput): Promise<Note> => {
            console.log("Current authenticated user:", user?.id);

            if (!user) {
                throw new Error('You must be logged in to create a note');
            }

            const { data, error } = await supabase
                .from('notes')
                .insert([{
                    ...note,
                    user_id: user.id,
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
}

// Update an existing note
export function useUpdateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...noteData }: UpdateNoteInput): Promise<Note> => {
            const { data, error } = await supabase
                .from('notes')
                .update(noteData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            queryClient.invalidateQueries({ queryKey: ['notes', data.id] });
        },
    });
}

// Delete a note
export function useDeleteNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
}

// Generate summary for a note
export function useSummarizeNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, content }: { id: string, content: string }): Promise<Note> => {
            try {
                // Call our API endpoint that interfaces with ChatGPT
                const response = await fetch('/api/summarize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content }),
                });

                if (!response.ok) {
                    throw new Error('Failed to generate summary');
                }

                const { summary } = await response.json();

                // Update the note with the generated summary
                const { data, error } = await supabase
                    .from('notes')
                    .update({ summary })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Error generating summary:', error);
                throw error;
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            queryClient.invalidateQueries({ queryKey: ['notes', data.id] });
        },
    });
}

// Generate title for a note
export function useGenerateTitle() {
    return useMutation({
        mutationFn: async (content: string): Promise<string> => {
            try {
                const response = await fetch('/api/generateTitle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content }),
                })

                if (!response.ok) {
                    throw new Error('Failed to generate title');
                }

                const { title } = await response.json();
                return title;
            } catch (error) {
                console.error('Error generating title:', error);
                throw error;
            }
        }
    })
}


