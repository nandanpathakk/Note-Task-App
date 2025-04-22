export type Note = {
    id: string;
    user_id: string;
    title: string;
    content: string;
    summary: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export type User = {
    id: string;
    email: string;
  }