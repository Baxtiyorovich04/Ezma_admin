import React, { useEffect } from "react";
import useThemeStore from "../store/theme";

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Apply theme-specific CSS variables
    if (theme === "light") {
      root.style.setProperty("--bg-primary", "#ffffff");
      root.style.setProperty("--bg-secondary", "#f3f4f6");
      root.style.setProperty("--text-primary", "#1f2937");
      root.style.setProperty("--text-secondary", "#4b5563");
      root.style.setProperty("--border", "#e5e7eb");
    } else {
      root.style.setProperty("--bg-primary", "#030712");
      root.style.setProperty("--bg-secondary", "#1f2937");
      root.style.setProperty("--text-primary", "#f3f4f6");
      root.style.setProperty("--text-secondary", "#9ca3af");
      root.style.setProperty("--border", "#374151");
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
