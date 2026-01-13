import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  // 1. Initialize state from LocalStorage or default to 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("camp-theme");
    return (saved as Theme) || "light";
  });

  // 2. Effect to apply the theme to the HTML tag
  useEffect(() => {
    // Bootstrap 5.3 uses this attribute to switch modes
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("camp-theme", theme);
  }, [theme]);

  // 3. Toggle function
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
