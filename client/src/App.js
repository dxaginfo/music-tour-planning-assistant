import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/features/auth/authSlice';

// Layout Components
import Layout from './components/layouts/Layout';
import PublicLayout from './components/layouts/PublicLayout';

// Authentication Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';

// Tour Pages
import TourList from './pages/tours/TourList';
import TourDetails from './pages/tours/TourDetails';
import TourCreate from './pages/tours/TourCreate';
import TourEdit from './pages/tours/TourEdit';

// Event Pages
import EventList from './pages/events/EventList';
import EventDetails from './pages/events/EventDetails';
import EventCreate from './pages/events/EventCreate';
import EventEdit from './pages/events/EventEdit';

// Venue Pages
import VenueList from './pages/venues/VenueList';
import VenueDetails from './pages/venues/VenueDetails';
import VenueCreate from './pages/venues/VenueCreate';
import VenueEdit from './pages/venues/VenueEdit';

// Financial Pages
import FinancialDashboard from './pages/financial/FinancialDashboard';
import ExpenseList from './pages/financial/ExpenseList';
import ExpenseCreate from './pages/financial/ExpenseCreate';
import RevenueList from './pages/financial/RevenueList';
import RevenueCreate from './pages/financial/RevenueCreate';

// User/Profile Pages
import Profile from './pages/profile/Profile';
import ProfileEdit from './pages/profile/ProfileEdit';

// Error/Misc Pages
import NotFound from './pages/errors/NotFound';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    // Try to load user on app start if token exists
    dispatch(loadUser());
  }, [dispatch]);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>; // Or your custom loader
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        
        {/* Tour routes */}
        <Route path="/tours" element={<TourList />} />
        <Route path="/tours/create" element={<TourCreate />} />
        <Route path="/tours/:id" element={<TourDetails />} />
        <Route path="/tours/:id/edit" element={<TourEdit />} />
        
        {/* Event routes */}
        <Route path="/events" element={<EventList />} />
        <Route path="/events/create" element={<EventCreate />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/edit" element={<EventEdit />} />
        
        {/* Venue routes */}
        <Route path="/venues" element={<VenueList />} />
        <Route path="/venues/create" element={<VenueCreate />} />
        <Route path="/venues/:id" element={<VenueDetails />} />
        <Route path="/venues/:id/edit" element={<VenueEdit />} />
        
        {/* Financial routes */}
        <Route path="/finances" element={<FinancialDashboard />} />
        <Route path="/finances/expenses" element={<ExpenseList />} />
        <Route path="/finances/expenses/create" element={<ExpenseCreate />} />
        <Route path="/finances/revenue" element={<RevenueList />} />
        <Route path="/finances/revenue/create" element={<RevenueCreate />} />
        
        {/* Profile routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;