import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ThemeToggle';

interface LoginPageProps {
  onSwitchToSignUp: () => void;
}

export function LoginPage({ onSwitchToSignUp }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-primary))] flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="bg-[rgb(var(--bg-secondary))] rounded-2xl shadow-[var(--shadow-lg)] w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-[rgb(var(--text-primary))] mb-2">Welcome Back</h1>
        <p className="text-center text-[rgb(var(--text-tertiary))] mb-8">Log in to continue your reading journey</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-[rgb(var(--red-100))] border border-[rgb(var(--red-700))] text-[rgb(var(--red-700))] px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-primary))] text-[rgb(var(--text-primary))] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[rgb(var(--text-tertiary))]">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
