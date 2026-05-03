//時間を"HH:MM"に揃える
function normalizeTime(time) {
  if (!time) return "";
  const [h, m] = time.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}

export function validateTask({ title, start, end, startTime, endTime, color }) {
  if (!title || title.trim() === "") return "タイトルを入力してください";

  if (!start) return "開始日を入力してください";
  if (!end) return "終了日を入力してください";

  if (new Date(start) > new Date(end)) {
    return "開始日は終了日より前にしてください";
  }

  if (!startTime && endTime !== "") return "終了時間を入力した場合、開始時間も入力してください";
  if (!endTime && startTime !== "") return "開始時間を入力した場合、終了時間を入力してください";

  if (startTime && endTime) {
    const st = normalizeTime(startTime);
    const et = normalizeTime(endTime);
    if (st > et) return "開始時間は終了時間より前にしてください";
  }

  if (!color) return "カラーを選択してください";

  return null;
}

export function validateLogin({ email, password }) {
  if (!email) {
    return "メールアドレスを入力してください";
  }

  if (!email.includes("@")) {
    return "メールアドレスの形式が正しくありません";
  }

  if (!password) {
    return "パスワードを入力してください";
  }

  return null;
}
