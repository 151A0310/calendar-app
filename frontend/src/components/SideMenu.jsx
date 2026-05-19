import { useNavigate } from "react-router-dom";

export default function SideMenu({ open, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className={`side-menu ${open ? "open" : ""}`} onClick={onClose}>
            {/* 背景タップで閉じる */}
            <div className="menu-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => alert("近日実装予定です！")}>
                    タスク一覧
                </button>

                <button onClick={() => alert("近日実装予定です！")}>
                    設定
                </button>

                <button onClick={() => alert("近日実装予定です！")}>
                    テーマ切替
                </button>

                <button onClick={handleLogout}>
                    ログアウト
                </button>
            </div>
        </div>
    );
}
