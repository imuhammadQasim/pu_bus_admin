import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Buses from "./pages/Buses";
import RoutesPage from "./pages/Routes";
import Users from "./pages/Users";
import LostFound from "./pages/LostFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "sonner";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

// Placeholder components for other pages
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
    <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center border-2 border-dashed border-border">
      <p className="text-2xl font-bold text-muted-foreground">{title[0]}</p>
    </div>
    <div>
      <h1 className="text-2xl font-bold text-foreground">{title} Page</h1>
      <p className="text-muted-foreground max-w-md">
        This section of the admin portal is currently under development. Please
        check back later.
      </p>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="buses" element={<Buses />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="reports" element={<Reports />} />
        <Route path="lost-found" element={<LostFound />} />
        <Route path="users" element={<Users />} />
        <Route
          path="settings"
          element={<PlaceholderPage title="System Settings" />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" expand={true} richColors />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
