import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Calendar from "./pages/Calendar";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/form.css";
import "./styles/components.css";
import "./styles/calendar.css";
import "./styles/modal.css";

function App() {
  const [events, setEvents] = useState([]);

  async function fetchEvents() {
    const res = await fetch("https://calendar-app-gdwo.onrender.com/api/tasks");
    const data = await res.json();
    setEvents(data);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<Calendar events={events} fetchEvents={fetchEvents} />}
      />
      <Route
        path="/add"
        element={<AddTask fetchEvents={fetchEvents} />}
      />
      <Route
        path="/edit/:id"
        element={<EditTask fetchEvents={fetchEvents} />}
      />
    </Routes>
  );
}

export default App;
