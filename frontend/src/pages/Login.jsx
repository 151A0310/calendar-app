import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import { validateLogin } from "../utils/validation";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationError = validateLogin({ email, password });
        if (validationError) {
            setError(validationError);
            return;
        }

        console.log("login fetch 実行", email, password);

        fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(res => {
                if (!res.ok) throw new Error("ログイン失敗");
                return res.json();  // ★ JSON を受け取る
            })
            .then(data => {
                localStorage.setItem("token", data.token);
                navigate("/");
                window.location.reload();
            })

            .catch(() => setError("メールまたはパスワードが正しくありません"));
    };

    return (
        <FormContainer title="ログイン">
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <InputField
                    label="メールアドレス"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <InputField
                    label="パスワード"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="btnArea">
                    <button type="submit" className="saveBtn">ログイン</button>
                </div>

                <p>
                    アカウントがない方は
                    <a href="/register">こちら</a>
                </p>
            </form>
        </FormContainer>
    );
}
