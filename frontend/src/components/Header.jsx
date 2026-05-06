import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="header">
            <h1 className="header-title">My Calendar</h1>

            <button className="logoutBtn" onClick={handleLogout}>
                ログアウト
            </button>
        </header>
    );
}
