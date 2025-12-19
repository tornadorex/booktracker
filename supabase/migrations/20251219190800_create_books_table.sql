/*
  # Create Books Table for Reading List Tracker

  1. New Tables
    - `books`
      - `id` (uuid, primary key) - Unique identifier for each book entry
      - `user_id` (uuid, foreign key) - References auth.users, links book to user
      - `title` (text, required) - Book title
      - `author` (text, optional) - Book author name
      - `status` (text, required) - Reading status: 'To-Read', 'Currently Reading', 'Finished', 'Did Not Finish'
      - `notes` (text, optional) - User's notes about the book
      - `start_date` (date, optional) - Date when user started reading
      - `finish_date` (date, optional) - Date when user finished reading
      - `rating` (integer, optional) - User rating from 1-5 stars
      - `created_at` (timestamptz) - Timestamp when record was created
      - `updated_at` (timestamptz) - Timestamp when record was last updated

  2. Security
    - Enable RLS on `books` table
    - Add policy for authenticated users to view their own books
    - Add policy for authenticated users to insert their own books
    - Add policy for authenticated users to update their own books
    - Add policy for authenticated users to delete their own books

  3. Indexes
    - Index on user_id for efficient querying of user's books
    - Index on status for filtering by reading status
*/

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  author text DEFAULT '',
  status text NOT NULL DEFAULT 'To-Read',
  notes text DEFAULT '',
  start_date date,
  finish_date date,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own books"
  ON books FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
  ON books FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
  ON books FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS books_user_id_idx ON books(user_id);
CREATE INDEX IF NOT EXISTS books_status_idx ON books(status);