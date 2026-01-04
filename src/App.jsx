import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Layout from './components/Layout';

// Placeholder components for now
import Calendar from './pages/Calendar';
import Tasks from './pages/Tasks';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/profile" element={<Profile />} />
            {/* Default redirect to Calendar */}
            <Route path="/" element={<Navigate to="/calendar" />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
