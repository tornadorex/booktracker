import { Star, Calendar, Trash2, Edit } from 'lucide-react';
import type { Book } from '../../types/database';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  'To-Read': 'bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-700))] border-[rgb(var(--slate-100))]',
  'Currently Reading': 'bg-[rgb(var(--amber-100))] text-[rgb(var(--amber-700))] border-[rgb(var(--amber-100))]',
  'Finished': 'bg-[rgb(var(--emerald-100))] text-[rgb(var(--emerald-700))] border-[rgb(var(--emerald-100))]',
  'Did Not Finish': 'bg-[rgb(var(--red-100))] text-[rgb(var(--red-700))] border-[rgb(var(--red-100))]',
};

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-[rgb(var(--bg-secondary))] rounded-xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all border border-[rgb(var(--border-primary))] p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] truncate">{book.title}</h3>
          {book.author && <p className="text-sm text-[rgb(var(--text-tertiary))] mt-1">{book.author}</p>}
        </div>
        <div className="flex gap-2 ml-3">
          <button
            onClick={() => onEdit(book)}
            className="p-2 text-[rgb(var(--text-tertiary))] hover:text-orange-600 hover:bg-[rgb(var(--orange-50))] rounded-lg transition-colors"
            title="Edit book"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="p-2 text-[rgb(var(--text-tertiary))] hover:text-red-600 hover:bg-[rgb(var(--red-100))] rounded-lg transition-colors"
            title="Delete book"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[book.status]}`}>
          {book.status}
        </span>
        {book.rating && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < book.rating! ? 'text-[rgb(var(--amber-400))] fill-[rgb(var(--amber-400))]' : 'text-[rgb(var(--text-muted))]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {(book.start_date || book.finish_date) && (
        <div className="flex items-center gap-4 text-xs text-[rgb(var(--text-tertiary))] mb-3">
          {book.start_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Started {formatDate(book.start_date)}</span>
            </div>
          )}
          {book.finish_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Finished {formatDate(book.finish_date)}</span>
            </div>
          )}
        </div>
      )}

      {book.notes && (
        <p className="text-sm text-[rgb(var(--text-secondary))] bg-[rgb(var(--bg-tertiary))] rounded-lg p-3 border border-[rgb(var(--border-secondary))] line-clamp-3">
          {book.notes}
        </p>
      )}
    </div>
  );
}
