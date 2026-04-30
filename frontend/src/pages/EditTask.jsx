import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import ColorPicker from "../components/ColorPicker";

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

  // JST のまま yyyy-mm-ddThh:mm に変換
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

  useEffect(() => {
    fetch(`http://localhost:8080/tasks/${id}`)
      .then(res => res.json())
      .then(data => {
        const isTimed = data.start.includes(" ");

        if (!isTimed) {
          // 終日イベント
          setTask({
            title: data.title,
            start: data.start,
            end: data.end,
            startTime: "",
            endTime: "",
            color: data.color
          });
        } else {
          // 時間ありイベント
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
      });
  }, [id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!task.title.trim()) return setError("タイトルを入力してください");
    if (!task.start) return setError("開始日を入力してください");
    if (!task.end) return setError("終了日を入力してください");
    if (task.start > task.end) return setError("開始日は終了日より前にしてください");

    const isTimed = task.startTime && task.endTime;

    let startDateTime, endDateTime;

    if (!isTimed) {
      // 終日イベント
      startDateTime = task.start;
      endDateTime = task.end;
    } else {
      // 時間ありイベント
      startDateTime = toMySQL(`${task.start}T${task.startTime}`);
      endDateTime = toMySQL(`${task.end}T${task.endTime}`);
    }

    fetch(`http://localhost:8080/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        start: startDateTime,
        end: endDateTime,
        color: task.color
      })
    })
      .then(() => fetchEvents())
      .then(() => navigate("/"));
  };

  const handleDelete = () => {
    fetch(`http://localhost:8080/tasks/${id}`, { method: "DELETE" })
      .then(() => fetchEvents())
      .then(() => navigate("/"));
  };

  return (
    <FormContainer
      title="タスク編集"
      right={
        <button
          type="button"
          className="deleteBtn"
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

        <InputField label="開始時間" type="time" name="startTime" value={task.startTime} onChange={handleChange} />

        <InputField label="終了時間" type="time" name="endTime" value={task.endTime} onChange={handleChange} />

        <label>タグカラー</label>
        <ColorPicker color={task.color} setColor={(c) => setTask({ ...task, color: c })} />

        <div className="btnArea">
          <button type="submit" className="saveBtn">更新</button>
          <button type="button" className="backBtn" onClick={() => navigate(-1)}>戻る</button>
        </div>
      </form>
    </FormContainer>
  );
}
