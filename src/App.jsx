import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LandingPage from "./LandingPage";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import Dashboard from "./Dashboard/dashboard";
import TaskPage from "./Dashboard/TaskPage";
import MaterialPage from "./Dashboard/MaterialPage";
import AITutorPage from "./Dashboard/AITutorPage";
import ProfilePage from "./Dashboard/ProfilePage";
import QuizPage from "./Dashboard/QuizPage";
import { ThemeProvider } from "./Component/ThemeContext";

// ==================== Protected Route ====================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  // Tidak ada token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    console.log("Decoded JWT:", decoded);

    if (decoded.exp * 1000 < Date.now()) {
      console.log("Token expired");

      localStorage.removeItem("authToken");

      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    console.error("Token tidak valid:", error);

    localStorage.removeItem("authToken");

    return <Navigate to="/login" replace />;
  }
};

// ==================== Public Route ====================
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return children;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      return children;
    }

    return <Navigate to="/dashboard" replace />;
  } catch (error) {
    localStorage.removeItem("authToken");
    return children;
  }
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}

          <Route path="/" element={<LandingPage />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* ================= PROTECTED ROUTES ================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/materials"
            element={
              <ProtectedRoute>
                <MaterialPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-tutor"
            element={
              <ProtectedRoute>
                <AITutorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz-generate"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect jika route tidak ditemukan */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
