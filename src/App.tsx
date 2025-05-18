import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import Container from "react-bootstrap/Container";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ContactPage from "./pages/ContactPage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import ProfilePage from "./pages/admin/ProfilePage";
import CustomerPage from "./pages/admin/Customer";
import StatisticsPage from "./pages/admin/Statistics";
import TaskPage from "./pages/admin/Task";
import WorkflowPage from "./pages/admin/Workflow";
import SettingsPage from "./pages/Settings";

// PrivateRoute component to protect admin routes
const PrivateRoute: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavigation = !location.pathname.startsWith("/admin");

  return (
    <>
      {showNavigation && <Navigation />}
      <div>
        <Routes>
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<PrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="customer" element={<CustomerPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="task" element={<TaskPage />} />
              <Route path="work-flow" element={<WorkflowPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;