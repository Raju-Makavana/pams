import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// User Pages
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import ForgotPassword from './pages/user/ForgotPassword';
import ResetPassword from './pages/user/ResetPassword';
import PetList from './pages/user/PetList';
import PetDetails from './pages/user/PetDetails';
import Dashboard from './pages/user/Dashboard';
import MyApplications from './pages/user/MyApplications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PetManagement from './pages/admin/PetManagement';
import AddNewPet from './pages/admin/AddNewPet';
import EditPet from './pages/admin/EditPet';
import ApplicationManagement from './pages/admin/ApplicationManagement';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/:id" element={<PetDetails />} />

          {/* User Routes - Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/my-applications" element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          } />

          {/* Admin Routes - Admin Only */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/pets" element={
            <AdminRoute>
              <PetManagement />
            </AdminRoute>
          } />
          <Route path="/admin/pets/new" element={
            <AdminRoute>
              <AddNewPet />
            </AdminRoute>
          } />
          <Route path="/admin/pets/edit/:id" element={
            <AdminRoute>
              <EditPet />
            </AdminRoute>
          } />
          <Route path="/admin/applications" element={
            <AdminRoute>
              <ApplicationManagement />
            </AdminRoute>
          } />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
