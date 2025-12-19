import { useState, useEffect } from 'react';
import { Plus, LogOut, BookOpen, Filter, Grid, List } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ThemeToggle } from '../ThemeToggle';
import { BookCard } from './BookCard';
import { BookList } from './BookList';
import { BookModal } from './BookModal';
import type { Book, BookStatus } from '../../types/database';

type SortField = 'title' | 'author' | 'status' | 'start_date' | 'finish_date' | 'rating';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export function ReadingListPage() {
  const { user, signOut } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [filterStatus, setFilterStatus] = useState<BookStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = filterStatus === 'All'
      ? books
      : books.filter((book) => book.status === filterStatus);

    filtered = [...filtered].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredBooks(filtered);
  }, [books, filterStatus, sortField, sortDirection]);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching books:', error);
    } else {
      setBooks(data || []);
    }
    setLoading(false);
  };

  const handleSaveBook = async (bookData: Partial<Book>) => {
    if (editingBook) {
      const { error } = await supabase
        .from('books')
        .update({ ...bookData, updated_at: new Date().toISOString() })
        .eq('id', editingBook.id);

      if (error) {
        console.error('Error updating book:', error);
      } else {
        fetchBooks();
      }
    } else {
      const { error } = await supabase.from('books').insert([
        {
          ...bookData,
          user_id: user!.id,
        },
      ]);

      if (error) {
        console.error('Error adding book:', error);
      } else {
        fetchBooks();
      }
    }

    setModalOpen(false);
    setEditingBook(null);
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    const { error } = await supabase.from('books').delete().eq('id', id);

    if (error) {
      console.error('Error deleting book:', error);
    } else {
      fetchBooks();
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setModalOpen(true);
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setModalOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const statusCounts = {
    'All': books.length,
    'To-Read': books.filter((b) => b.status === 'To-Read').length,
    'Currently Reading': books.filter((b) => b.status === 'Currently Reading').length,
    'Finished': books.filter((b) => b.status === 'Finished').length,
    'Did Not Finish': books.filter((b) => b.status === 'Did Not Finish').length,
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-primary))]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-[var(--shadow-lg)]">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))]">My Reading List</h1>
              <p className="text-[rgb(var(--text-tertiary))] text-sm mt-1">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <ThemeToggle />
            <button
              onClick={handleAddBook}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-5 py-3 bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border-primary))] text-[rgb(var(--text-secondary))] rounded-lg font-medium hover:bg-[rgb(var(--bg-hover))] transition-colors shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </div>

        <div className="bg-[rgb(var(--bg-secondary))] rounded-xl shadow-[var(--shadow-sm)] border border-[rgb(var(--border-primary))] p-5 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[rgb(var(--text-tertiary))]" />
              <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Filter by Status</h2>
            </div>
            <div className="flex items-center gap-2 bg-[rgb(var(--bg-tertiary))] rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] shadow-[var(--shadow-sm)]'
                    : 'text-[rgb(var(--text-tertiary))] hover:text-[rgb(var(--text-primary))]'
                }`}
              >
                <Grid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] shadow-[var(--shadow-sm)]'
                    : 'text-[rgb(var(--text-tertiary))] hover:text-[rgb(var(--text-primary))]'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['All', 'To-Read', 'Currently Reading', 'Finished', 'Did Not Finish'] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[var(--shadow-md)]'
                      : 'bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-hover))]'
                  }`}
                >
                  {status} ({statusCounts[status]})
                </button>
              )
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-[rgb(var(--bg-secondary))] rounded-xl shadow-[var(--shadow-sm)] border border-[rgb(var(--border-primary))] p-12 text-center">
            <BookOpen className="w-16 h-16 text-[rgb(var(--text-muted))] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[rgb(var(--text-primary))] mb-2">
              {filterStatus === 'All' ? 'No books yet' : `No ${filterStatus} books`}
            </h3>
            <p className="text-[rgb(var(--text-tertiary))] mb-6">
              {filterStatus === 'All'
                ? 'Start building your reading list by adding your first book'
                : 'Try a different filter or add some books'}
            </p>
            {filterStatus === 'All' && (
              <button
                onClick={handleAddBook}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Your First Book
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        ) : (
          <BookList
            books={filteredBooks}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
      </div>

      {modalOpen && (
        <BookModal
          book={editingBook}
          onSave={handleSaveBook}
          onClose={() => {
            setModalOpen(false);
            setEditingBook(null);
          }}
        />
      )}
    </div>
  );
}
