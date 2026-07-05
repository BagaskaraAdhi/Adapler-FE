import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./Dashboard/dashboard";
import { ThemeProvider } from "./Component/ThemeContext";
import TaskPage from "./Dashboard/TaskPage";
import MaterialPage from "./Dashboard/MaterialPage";
import AITutorPage from "./Dashboard/AITutorPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/materials" element={<MaterialPage />} />
          <Route path="/ai-tutor" element={<AITutorPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
