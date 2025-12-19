export type BookStatus = 'To-Read' | 'Currently Reading' | 'Finished' | 'Did Not Finish';

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  status: BookStatus;
  notes: string;
  start_date: string | null;
  finish_date: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      books: {
        Row: Book;
        Insert: Omit<Book, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Book, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
