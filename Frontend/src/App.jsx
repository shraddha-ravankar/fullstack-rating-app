import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import UpdatePassword from "./pages/auth/UpdatePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users"; 
import Stores from "./pages/admin/Stores"; 
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import UserDashboard from "./pages/user/UserDashboard";




const AdminDashboard = () => (
  <h1 className="text-center mt-10">Admin Dashboard</h1>
);
const UserStores = () => (
  <h1 className="text-center mt-10">User Stores</h1>
);
const OwnerStores = () => (
  <h1 className="text-center mt-10">Owner Stores</h1>
);

function AppLayout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/update-password"
          element={
            <ProtectedRoute roles={["admin", "user", "owner"]}>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Admin Users Management */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
          
        />
        <Route
  path="/admin/stores"
  element={
    <ProtectedRoute roles={["admin"]}>
      <Stores />
    </ProtectedRoute>
  }
/>

        
       <Route
  path="/user/dashboard"
  element={
    <ProtectedRoute roles={["user"]}>
      <UserDashboard />
    </ProtectedRoute>
  }
/>
        
        <Route
  path="/owner/dashboard"
  element={
    <ProtectedRoute roles={["owner"]}>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>
        <Route
          path="/owner/stores"
          element={
            <ProtectedRoute roles={["owner"]}>
              <OwnerStores />
            </ProtectedRoute>
          }
        />
        {/* Redirect / to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
