import { Star, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { Book } from '../../types/database';

type SortField = 'title' | 'author' | 'status' | 'start_date' | 'finish_date' | 'rating';
type SortDirection = 'asc' | 'desc';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const statusColors = {
  'To-Read': 'bg-[rgb(var(--slate-100))] text-[rgb(var(--slate-700))]',
  'Currently Reading': 'bg-[rgb(var(--amber-100))] text-[rgb(var(--amber-700))]',
  'Finished': 'bg-[rgb(var(--emerald-100))] text-[rgb(var(--emerald-700))]',
  'Did Not Finish': 'bg-[rgb(var(--red-100))] text-[rgb(var(--red-700))]',
};

export function BookList({ books, onEdit, onDelete, sortField, sortDirection, onSort }: BookListProps) {
  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      onClick={() => onSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wider cursor-pointer hover:bg-[rgb(var(--bg-hover))] transition-colors"
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-[rgb(var(--bg-secondary))] rounded-xl shadow-[var(--shadow-sm)] border border-[rgb(var(--border-primary))] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[rgb(var(--border-primary))]">
          <thead className="bg-[rgb(var(--bg-tertiary))]">
            <tr>
              <SortHeader field="title">Title</SortHeader>
              <SortHeader field="author">Author</SortHeader>
              <SortHeader field="status">Status</SortHeader>
              <SortHeader field="rating">Rating</SortHeader>
              <SortHeader field="start_date">Started</SortHeader>
              <SortHeader field="finish_date">Finished</SortHeader>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[rgb(var(--bg-secondary))] divide-y divide-[rgb(var(--border-primary))]">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-[rgb(var(--bg-hover))] transition-colors">
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-[rgb(var(--text-primary))]">{book.title}</div>
                  {book.notes && (
                    <div className="text-xs text-[rgb(var(--text-muted))] mt-1 line-clamp-1">{book.notes}</div>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-[rgb(var(--text-secondary))]">{book.author || '-'}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[book.status]}`}>
                    {book.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {book.rating ? (
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
                  ) : (
                    <span className="text-[rgb(var(--text-muted))] text-sm">-</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-[rgb(var(--text-secondary))]">{formatDate(book.start_date)}</td>
                <td className="px-4 py-4 text-sm text-[rgb(var(--text-secondary))]">{formatDate(book.finish_date)}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(book)}
                      className="p-1.5 text-[rgb(var(--text-tertiary))] hover:text-orange-600 hover:bg-[rgb(var(--orange-50))] rounded transition-colors"
                      title="Edit book"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(book.id)}
                      className="p-1.5 text-[rgb(var(--text-tertiary))] hover:text-red-600 hover:bg-[rgb(var(--red-100))] rounded transition-colors"
                      title="Delete book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
