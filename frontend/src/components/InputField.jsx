function InputField({ label, type = "text", name, value, onChange }) {
  return (
    <div className="inputField">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value ?? ""}   // ← undefined を防ぐ
        onChange={(e) => onChange(e)}   // ← e をそのまま渡す
      />
    </div>
  );
}

export default InputField;
