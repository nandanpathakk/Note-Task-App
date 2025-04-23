"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock, ChevronRight, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { format, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import sanitizeHtml from 'sanitize-html';
import { Note } from "@/types/database.types";


export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [notesCount, setNotesCount] = useState(0);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [summarizedCount, setSummarizedCount] = useState(0);
  const [lastActivity, setLastActivity] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Get user
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Count notes
          const { count } = await supabase
            .from('notes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

          // Get recent notes
          const { data: recent } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(2);

          // Count notes with summaries
          const { count: summarizedNotesCount } = await supabase
            .from('notes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .not('summary', 'is', null);

          // Get last activity date
          const { data: latestNote } = await supabase
            .from('notes')
            .select('updated_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

          setNotesCount(count || 0);
          setRecentNotes(recent || []);
          setSummarizedCount(summarizedNotesCount || 0);
          setLastActivity(latestNote?.updated_at || null);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNoteClick = (noteId: string) => {
    router.push(`/dashboard/notes/${noteId}/view`);
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/notes/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Note
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-1 opacity-70"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Total Notes
              </CardTitle>
              <CardDescription>All your created notes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{notesCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                AI Summaries
              </CardTitle>
              <CardDescription>Notes with AI summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summarizedCount}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {notesCount > 0 ? (
                  `${Math.round((summarizedCount / notesCount) * 100)}% of your notes are summarized`
                ) : (
                  "No notes created yet"
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Last Activity
              </CardTitle>
              <CardDescription>most recently added note</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {lastActivity ? (
                  formatDistanceToNow(new Date(lastActivity), { addSuffix: true })
                ) : (
                  "No activity"
                )}
              </p>
              {lastActivity && (
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(lastActivity), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Notes</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/notes">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 bg-muted rounded w-2/3"></div>
                  <div className="h-4 bg-muted rounded w-1/3 mt-1 opacity-70"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentNotes.map((note) => (
              <Card
                key={note.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleNoteClick(note.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="truncate">{note.title}</CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    {format(new Date(note.updated_at), "MMM d, yyyy")} ·
                    {note.summary ? (
                      <span className="flex items-center ml-2">
                        <Sparkles className="h-3 w-3 text-primary mr-1" />
                        AI Summary
                      </span>
                    ) : "No summary"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {note.summary ? (
                    <div className="rounded-md bg-muted/40 p-2">
                      <p className="line-clamp-3 text-sm">{note.summary}</p>
                    </div>
                  ) : (
                    <div className="line-clamp-3 text-sm text-muted-foreground">
                      <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content || 'No content') }} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/40">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No notes yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first note to get started with AI-powered note taking
              </p>
              <Button asChild>
                <Link href="/dashboard/notes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Note
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}