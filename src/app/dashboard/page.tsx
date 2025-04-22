"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/lib/supabase";

export default function Dashboard() {
  const [notesCount, setNotesCount] = useState(0);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
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
          .order('created_at', { ascending: false })
          .limit(3);
          
        setNotesCount(count || 0);
        setRecentNotes(recent || []);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to AI Notes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Your total notes count</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{notesCount}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Recent Notes</h2>
        {recentNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                  <CardDescription>
                    {new Date(note.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{note.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>No notes yet. Create your first note!</p>
        )}
      </div>
    </div>
  );
}