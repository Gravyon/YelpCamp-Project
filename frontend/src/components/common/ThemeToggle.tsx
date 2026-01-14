import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-link text-decoration-none fs-4 d-flex align-items-center"
      style={{ color: theme === "light" ? "#f39c12" : "#f1c40f" }}
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
    >
      {theme === "light" ? <FaSun /> : <FaMoon />}
    </button>
  );
}
