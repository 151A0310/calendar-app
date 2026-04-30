export function validateTask({ title, start, end }) {
  if (!title || title.trim() === "") {
    return "タイトルを入力してください。";
  }

  if (!start) {
    return "開始日時を入力してください。";
  }

  if (!end) {
    return "終了日時を入力してください。";
  }

  // 日付の前後チェック
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate > endDate) {
    return "終了日時は開始日時より後にしてください。";
  }

  return ""; // エラーなし
}
