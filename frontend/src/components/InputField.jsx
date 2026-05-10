function InputField({ label, type = "text", name, value, onChange, ...rest }) {
  return (
    <div className="inputField">
      <label>{label}</label>

      {type === "textarea" ? (
        <textarea
          name={name}
          value={value ?? ""}
          onChange={onChange}
          rows={4}
          style={{ width: "100%", resize: "vertical" }}
          maxLength={200}
          {...rest}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          {...rest}
        />
      )}
    </div>
  );
}

export default InputField;
