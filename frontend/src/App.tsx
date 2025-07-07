import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BoardPage from "./pages/BoardPage";
import KanbanPage from "./pages/KanbanPage";
import InvitationPage from "./pages/InvitationPage";
import Navbar from "./components/Navbar";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/boards"
          element={token ? <BoardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/boards/:id"
          element={token ? <KanbanPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/invitations"
          element={token ? <InvitationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={token ? "/boards" : "/login"} />}
        />
        
      </Routes>
    </Router>
  );
}

export default App;
