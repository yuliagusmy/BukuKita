import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';

// Pages
import Dashboard from './components/Dashboard';
import BooksPage from './pages/BooksPage';
import AddBookPage from './pages/AddBookPage';
import BookDetailPage from './pages/BookDetailPage';
import StatsPage from './pages/StatsPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  // Set the document title
  useEffect(() => {
    document.title = 'BookQuest - Track Your Reading Journey';
  }, []);

  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/add-book" element={<AddBookPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
        </Layout>
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