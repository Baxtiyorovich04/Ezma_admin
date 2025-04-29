import { useState } from "react";
import useLogin from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/isAuth";
import useThemeStore from "../store/theme";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../scss/pages/_login.scss";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const { theme, toggleTheme } = useThemeStore();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { phone, password },
      {
        onSuccess: () => {
          setAuthenticated(true);
          const from = location.state?.from?.pathname || "/";
          navigate(from, { replace: true });
        },
      }
    );
  };

  return (
    <div className="login-page">
      <button className="toggle-theme" onClick={toggleTheme}>
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        {theme === "dark" ? "Light" : "Dark"}
      </button>
      <div className="login-container">
        <div className="login-header">
          <h2>Ezma Admin</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="phone">{t("auth.phone")}</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("auth.phonePlaceholder")}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t("auth.password")}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.passwordPlaceholder")}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? t("common.loading") : t("auth.login")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
