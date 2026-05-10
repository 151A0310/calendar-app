import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import ColorPicker from "../components/ColorPicker";
import { validateTask } from "../utils/validation";
import authFetch from "../utils/authFetch";

export default function AddTask({ fetchEvents }) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [task, setTask] = useState({
    title: "",
    start: today,
    end: today,
    startTime: "",
    endTime: "",
    color: "#4A90E2",
    description: ""
  });

  const [error, setError] = useState("");

  function toMySQL(str) {
    return str.replace("T", " ") + ":00";
  }

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateTask(task);
    if (validationError) {
      setError(validationError);
      return;
    }

    const isTimed = task.startTime && task.endTime;

    let startDateTime, endDateTime;

    if (!isTimed) {
      startDateTime = task.start;
      endDateTime = task.end;
    } else {
      startDateTime = toMySQL(`${task.start}T${task.startTime}`);
      endDateTime = toMySQL(`${task.end}T${task.endTime}`);
    }

    const res = await authFetch("/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: task.title,
        start: startDateTime,
        end: endDateTime,
        color: task.color,
        description: task.description
      })
    });

    if (!res.ok) {
      console.error("Failed to add task");
      return;
    }

    await fetchEvents();
    navigate("/");
  };

  return (
    <FormContainer title="タスク追加">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <InputField label="タイトル" name="title" value={task.title} onChange={handleChange} />

        <InputField label="開始日" type="date" name="start" value={task.start} onChange={handleChange} />

        <InputField label="終了日" type="date" name="end" value={task.end} onChange={handleChange} />

        <InputField label="開始時間" type="time" name="startTime" value={task.startTime} onChange={handleChange} />

        <InputField label="終了時間" type="time" name="endTime" value={task.endTime} onChange={handleChange} />

        <InputField type="textarea" label="説明" name="description" value={task.description} onChange={handleChange} />

        <label>タグカラー</label>
        <ColorPicker color={task.color} setColor={(c) => setTask({ ...task, color: c })} />

        <div className="btnArea">
          <button type="submit" className="btn btn-primary">追加</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            戻る
          </button>
        </div>
      </form>
    </FormContainer>
  );
}
