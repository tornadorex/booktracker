/*
  # Fix RLS Performance and Remove Unused Index

  1. Performance Improvements
    - Update all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation of auth function for each row, improving query performance at scale
    - Policies affected: SELECT, INSERT, UPDATE, DELETE on books table

  2. Index Cleanup
    - Remove unused `books_status_idx` index
    - Status filtering is infrequent and doesn't warrant a dedicated index
    - The user_id index is sufficient for the primary query patterns

  3. Important Notes
    - Security: All RLS policies remain functionally identical, only performance is improved
    - No changes to data access permissions
    - Query behavior remains the same, only execution is more efficient
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own books" ON books;
DROP POLICY IF EXISTS "Users can insert their own books" ON books;
DROP POLICY IF EXISTS "Users can update their own books" ON books;
DROP POLICY IF EXISTS "Users can delete their own books" ON books;

-- Recreate policies with optimized auth.uid() calls
CREATE POLICY "Users can view their own books"
  ON books FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own books"
  ON books FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own books"
  ON books FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Remove unused status index
DROP INDEX IF EXISTS books_status_idx;
