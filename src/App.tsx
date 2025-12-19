import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/Auth/LoginPage';
import { SignUpPage } from './components/Auth/SignUpPage';
import { ReadingListPage } from './components/ReadingList/ReadingListPage';

function App() {
  const { user, loading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return showSignUp ? (
      <SignUpPage onSwitchToLogin={() => setShowSignUp(false)} />
    ) : (
      <LoginPage onSwitchToSignUp={() => setShowSignUp(true)} />
    );
  }

  return <ReadingListPage />;
}

export default App;
