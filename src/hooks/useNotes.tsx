// hooks/useNotes.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabase';
import { Note, CreateNoteInput, UpdateNoteInput } from '@/types/database.types';


export function useNotes() {
    return useQuery({
        queryKey: ['notes'],
        queryFn: async (): Promise<Note[]> => {
            const { data, error } = await supabase
                .from('notes')
                .select('*')
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

    return useMutation({
        mutationFn: async (note: CreateNoteInput): Promise<Note> => {
            const { data, error } = await supabase
                .from('notes')
                .insert([note])
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
            // This will be replaced with the DeepSeek API call
            // For now, we'll just simulate a summary
            const summary = `Summary of: ${content.substring(0, 50)}...`;

            const { data, error } = await supabase
                .from('notes')
                .update({ summary })
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