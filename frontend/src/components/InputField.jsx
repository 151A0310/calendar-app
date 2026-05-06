function InputField({ label, type = "text", name, value, onChange }) {
  return (
    <div className="inputField">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
}

export default InputField;
