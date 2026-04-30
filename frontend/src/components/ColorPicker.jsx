export default function ColorPicker({ color, setColor }) {
  const colors = [
    "#4A90E2",
    "#E74C3C",
    "#2ECC71",
    "#F1C40F",
    "#9B59B6",
    "#95A5A6"
  ];

  return (
    <div className="color-options">
      {colors.map(c => (
        <span
          key={c}
          onMouseDown={(e) => e.preventDefault()}
          className={`color ${color === c ? "selected" : ""}`}
          style={{ background: c }}
          onClick={() => setColor(c)}
        />
      ))}
    </div>
  );
}
