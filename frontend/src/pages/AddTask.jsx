import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import ColorPicker from "../components/ColorPicker";

function AddTask({ fetchEvents }) {
  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [color, setColor] = useState("#4A90E2");
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const navigate = useNavigate();

  function normalizeTime(timeStr) {
    if (!timeStr) return "";
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;

    const cleaned = timeStr
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace("am", " am")
      .replace("pm", " pm");

    const date = new Date(`1970-01-01T${cleaned}`);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");

    return `${hh}:${mm}`;
  }

  function toMySQLDateTime(str) {
    return str.replace("T", " ") + ":00";
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === "") return setError("タイトルを入力してください");
    if (!start) return setError("開始日を入力してください");
    if (!end) return setError("終了日を入力してください");
    if (start > end) return setError("開始日は終了日より前にしてください");
    if (!startTime && endTime !== "") return setError("開始時間を入力してください");
    if (!endTime && startTime !== "") return setError("終了時間を入力してください");
    if (start && end && startTime > endTime) return setError("開始時間は終了時間より前にしてください");
    if (!color) return setError("カラーを選択してください");

    setError("");

    let startDateTime;
    let endDateTime;

    if (!startTime && !endTime) {
      // 終日イベントは start と end をそのまま保存
      startDateTime = start;
      endDateTime = end;
    } else {
      const normalizedStartTime = normalizeTime(startTime);
      const normalizedEndTime = normalizeTime(endTime);

      startDateTime = `${start}T${normalizedStartTime}`;
      endDateTime = `${end}T${normalizedEndTime}`;
    }


    fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        start: (!startTime && !endTime) ? startDateTime : toMySQLDateTime(startDateTime),
        end: (!startTime && !endTime) ? endDateTime : toMySQLDateTime(endDateTime),
        color
      })
    })
      .then(() => {
        fetchEvents();
        navigate("/");
      })
      .catch(() => alert("追加に失敗しました"));
  };

  return (
    <FormContainer title="タスク追加">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <InputField label="タイトル" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <InputField label="開始日" type="date" name="start" value={start} onChange={(e) => setStart(e.target.value)} />

        <InputField label="終了日" type="date" name="end" value={end} onChange={(e) => setEnd(e.target.value)} />

        <InputField label="開始時間" type="time" name="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

        <InputField label="終了時間" type="time" name="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

        <label>タグカラー</label>
        <ColorPicker color={color} setColor={setColor} />

        <div className="btnArea">
          <button type="submit" className="saveBtn">保存</button>
          <button type="button" className="backBtn" onClick={() => navigate(-1)}>戻る</button>
        </div>
      </form>
    </FormContainer>
  );
}

export default AddTask;
