import { useState } from "react";
import useLogin from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/isAuth";
import useThemeStore from "../store/theme";
import { Moon, Sun } from "lucide-react";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const { theme, toggleTheme } = useThemeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { phone, password },
      {
        onSuccess: () => {
          setAuthenticated(true);
          navigate("/profile");
        },
      }
    );
  };

  return (
    <div className="login-page">
      <button
        onClick={toggleTheme}
        className="toggle-theme"
      >
        {theme === "dark" ? <Sun size={34} /> : <Moon size={34} />}
      </button>
      <div className="login-container">
        <div className="login-header">
          <h2>Tizimga kirish</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phone">Telefon raqam</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="Telefon raqam"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Parol</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Kuting..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
