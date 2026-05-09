import { useNavigate } from "react-router-dom";

export default function SideMenu({ open, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className={`side-menu ${open ? "open" : ""}`}>
            <div className="menu-content">
                <button onClick={onClose} className="close-btn">×</button>

                {/* タスク一覧 */}
                <button onClick={() => alert("近日実装予定です！")}>
                    タスク一覧
                </button>

                {/* 設定 */}
                <button onClick={() => alert("近日実装予定です！")}>
                    設定
                </button>

                {/* テーマ切替 */}
                <button onClick={() => alert("近日実装予定です！")}>
                    テーマ切替
                </button>

                {/* ログアウト */}
                <button onClick={handleLogout}>
                    ログアウト
                </button>
            </div>
        </div>
    );
}
