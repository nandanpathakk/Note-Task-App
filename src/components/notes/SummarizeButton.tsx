import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useSummarizeNote } from '@/hooks/useNotes';
import { toast } from 'sonner';

interface SummarizeButtonProps {
    noteId: string;
    content: string;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    onSummarizeComplete?: (summary: string) => void;
}

export function SummarizeButton({
    noteId,
    content,
    variant = 'outline',
    size = 'default',
    className = '',
    onSummarizeComplete,
}: SummarizeButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const summarizeMutation = useSummarizeNote();

    const handleSummarize = async () => {
        if (!content || content.trim() === '') {
            toast.error("Please add some content to your note first.")
            return;
        }

        setIsLoading(true);
        try {
            const updatedNote = await summarizeMutation.mutateAsync({
                id: noteId,
                content,
            });
            toast.success("Your note has been summarized successfully.")

            if (onSummarizeComplete && updatedNote.summary) {
                onSummarizeComplete(updatedNote.summary);
            }
        } catch (error) {

            toast.error("There was an error generating your summary.")
            console.error('Error summarizing note:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleSummarize}
            disabled={isLoading}
        >
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? 'Summarizing...' : 'Summarize'}
        </Button>
    );
}