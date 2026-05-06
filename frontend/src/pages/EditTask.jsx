import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import ColorPicker from "../components/ColorPicker";
import { validateTask } from "../utils/validation";
import authFetch from "../utils/authFetch";

export default function EditTask({ fetchEvents }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    start: "",
    end: "",
    startTime: "",
    endTime: "",
    color: "#4A90E2"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function toLocalInput(datetime) {
    if (!datetime) return "";
    const d = new Date(datetime.replace(" ", "T"));
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }

  function toMySQL(str) {
    return str.replace("T", " ") + ":00";
  }

  // ★★★ 認証付き GET に修正 ★★★
  useEffect(() => {
    authFetch(`/tasks/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("403");
        return res.json();
      })
      .then(data => {
        const isTimed = data.start.includes(" ");

        if (!isTimed) {
          setTask({
            title: data.title,
            start: data.start,
            end: data.end,
            startTime: "",
            endTime: "",
            color: data.color
          });
        } else {
          const localStart = toLocalInput(data.start);
          const localEnd = toLocalInput(data.end);

          const [sDate, sTime] = localStart.split("T");
          const [eDate, eTime] = localEnd.split("T");

          setTask({
            title: data.title,
            start: sDate,
            end: eDate,
            startTime: sTime,
            endTime: eTime,
            color: data.color
          });
        }

        setLoading(false);
      })
      .catch(() => {
        alert("認証が切れています。ログインし直してください。");
        navigate("/login");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  // ★★★ async + authFetch に修正 ★★★
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

    const res = await authFetch(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: task.title,
        start: startDateTime,
        end: endDateTime,
        color: task.color
      })
    });

    if (!res.ok) {
      console.error("Failed to update task");
      return;
    }

    await fetchEvents();
    navigate("/");
  };

  // ★★★ DELETE も authFetch に修正 ★★★
  const handleDelete = async () => {
    const res = await authFetch(`/tasks/${id}`, { method: "DELETE" });

    if (!res.ok) {
      console.error("Failed to delete task");
      return;
    }

    await fetchEvents();
    navigate("/");
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <FormContainer
      title="タスク編集"
      right={
        <button
          type="button"
          className="btn-danger"
          onClick={handleDelete}
        >
          削除
        </button>
      }
    >
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <InputField label="タイトル" name="title" value={task.title} onChange={handleChange} />

        <InputField label="開始日" type="date" name="start" value={task.start} onChange={handleChange} />

        <InputField label="終了日" type="date" name="end" value={task.end} onChange={handleChange} />

        <InputField label="開始時間（任意）" type="time" name="startTime" value={task.startTime} onChange={handleChange} />

        <InputField label="終了時間（任意）" type="time" name="endTime" value={task.endTime} onChange={handleChange} />

        <label>タグカラー</label>
        <ColorPicker color={task.color} setColor={(c) => setTask({ ...task, color: c })} />

        <div className="btnArea">
          <button type="submit" className="btn btn-primary">更新</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            戻る
          </button>
        </div>
      </form>
    </FormContainer>
  );
}
