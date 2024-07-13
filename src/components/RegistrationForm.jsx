import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      const response = await register({ email, password, name });
      console.log("register response:", response);

      // Сохраняем данные пользователя в localStorage
      const user = { name, email };
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.errors?.email || "Произошла ошибка!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Имя"
        maxLength="25"
        inputMode="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Эл. почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div className="error">{error}</div>}

      <div className="d-flex">
        <Link to="/login">Войти</Link>
        <button type="submit">Регистрация</button>
      </div>
    </form>
  );
};

export default RegistrationForm;
