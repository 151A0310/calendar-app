import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Calendar from "./pages/Calendar";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import authFetch from "./utils/authFetch";

import "./styles/base.css";
import "./styles/layout.css";
import "./styles/form.css";
import "./styles/components.css";
import "./styles/calendar.css";
import "./styles/modal.css";

function App() {
  const [events, setEvents] = useState([]);

  async function fetchEvents() {
    const res = await authFetch("/tasks");
    if (!res.ok) {
      console.error("Failed to fetch tasks");
      return;
    }
    const data = await res.json();
    setEvents(data);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // ★ 初期表示の403を防ぐ
    fetchEvents();
  }, []);

  return (
    <Routes>
      {/* ログイン不要 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ログイン必須 */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Calendar events={events} fetchEvents={fetchEvents} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddTask fetchEvents={fetchEvents} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditTask fetchEvents={fetchEvents} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
