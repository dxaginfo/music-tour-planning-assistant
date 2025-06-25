import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import tourReducer from './features/tours/tourSlice';
import eventReducer from './features/events/eventSlice';
import venueReducer from './features/venues/venueSlice';
import expenseReducer from './features/expenses/expenseSlice';
import revenueReducer from './features/revenue/revenueSlice';
import uiReducer from './features/ui/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tours: tourReducer,
    events: eventReducer,
    venues: venueReducer,
    expenses: expenseReducer,
    revenue: revenueReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;