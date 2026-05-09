import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SideMenu from "./SideMenu";

export default function Header() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="header">

            {/* ハンバーガーアイコン */}
            <MenuIcon
                className="menu-icon"
                onClick={() => setOpen(true)}
            />

            {/* タイトル */}
            <h1 className="header-title">My Calendar</h1>

            {/* ログアウト */}
            <button className="logoutBtn" onClick={handleLogout}>
                ログアウト
            </button>

            {/* サイドメニュー */}
            <SideMenu open={open} onClose={() => setOpen(false)} />
        </header>
    );
}
