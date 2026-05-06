import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";
import { validateLogin } from "../utils/validation";

export default function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationError = validateLogin({ email, password });
        if (validationError) {
            setError(validationError);
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(res => {
                if (!res.ok) throw new Error("登録失敗");
                return res.text();
            })
            .then(() => {
                alert("登録が完了しました。ログインしてください。");
                navigate("/login");
            })
            .catch(() => setError("登録に失敗しました"));

    };

    return (
        <FormContainer title="新規登録">
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
                    <button type="submit" className="btn btn-primary">登録</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                        戻る
                    </button>
                </div>
            </form>
        </FormContainer>
    );
}
