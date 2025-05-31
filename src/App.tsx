import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './context/AppContext';

// Pages
import Dashboard from './components/Dashboard';
import AddBookPage from './pages/AddBookPage';
import BookDetailPage from './pages/BookDetailPage';
import BooksPage from './pages/BooksPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import StatsPage from './pages/StatsPage';

function App() {
  // Set the document title
  useEffect(() => {
    document.title = 'BookQuest - Track Your Reading Journey';
  }, []);

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/books" element={<Layout><BooksPage /></Layout>} />
          <Route path="/add-book" element={<Layout><AddBookPage /></Layout>} />
          <Route path="/book/:id" element={<Layout><BookDetailPage /></Layout>} />
          <Route path="/stats" element={<Layout><StatsPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFF',
            color: '#333',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
          },
        }}
      />
    </AppProvider>
  );
}

export default App;