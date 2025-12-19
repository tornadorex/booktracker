import { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import type { Book, BookStatus } from '../../types/database';

interface BookModalProps {
  book: Book | null;
  onSave: (bookData: Partial<Book>) => void;
  onClose: () => void;
}

const statusOptions: BookStatus[] = ['To-Read', 'Currently Reading', 'Finished', 'Did Not Finish'];

export function BookModal({ book, onSave, onClose }: BookModalProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('To-Read');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setStatus(book.status);
      setNotes(book.notes);
      setStartDate(book.start_date || '');
      setFinishDate(book.finish_date || '');
      setRating(book.rating);
    } else {
      setTitle('');
      setAuthor('');
      setStatus('To-Read');
      setNotes('');
      setStartDate('');
      setFinishDate('');
      setRating(null);
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let autoStatus = status;
    if (finishDate) {
      autoStatus = 'Finished';
    } else if (startDate) {
      autoStatus = 'Currently Reading';
    }

    onSave({
      title,
      author,
      status: autoStatus,
      notes,
      start_date: startDate || null,
      finish_date: finishDate || null,
      rating,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[rgb(var(--bg-secondary))] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[rgb(var(--bg-secondary))] border-b border-[rgb(var(--border-primary))] px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))]">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[rgb(var(--text-tertiary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-hover))] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Book Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter book title"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="author" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Author
              </label>
              <input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Status *
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as BookStatus)}
                className="w-full px-4 py-3 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(rating === star ? null : star)}
                    className="p-2 hover:bg-[rgb(var(--bg-hover))] rounded-lg transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        rating && star <= rating
                          ? 'text-[rgb(var(--amber-400))] fill-[rgb(var(--amber-400))]'
                          : 'text-[rgb(var(--text-muted))]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="finishDate" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Finish Date
              </label>
              <input
                id="finishDate"
                type="date"
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
                className="w-full px-4 py-3 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Add your thoughts, favorite quotes, or any notes about this book..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[rgb(var(--border-primary))] text-[rgb(var(--text-secondary))] rounded-lg font-medium hover:bg-[rgb(var(--bg-hover))] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              {book ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
