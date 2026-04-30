import React from "react";

export default function FormContainer({ title, right, children }) {
  return (
    <div className="formContainer">

      <div className="formHeader">
        <h2>{title}</h2>
        {right && <div className="formHeaderRight">{right}</div>}
      </div>

      {children}
    </div>
  );
}
