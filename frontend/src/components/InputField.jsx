function InputField({ label, type = "text", name, value, onChange, required = false, ...rest }) {
  return (
    <div className="inputField">
      <label>
        {label}
        {required && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          name={name}
          value={value ?? ""}
          onChange={onChange}
          rows={4}
          style={{ width: "100%", resize: "vertical" }}
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
