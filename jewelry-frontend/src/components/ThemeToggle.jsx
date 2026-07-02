import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="glass flex h-9 w-16 items-center rounded-full px-1 transition-colors"
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-ink-950 transition-transform duration-300"
        style={{ transform: isDark ? "translateX(0)" : "translateX(28px)" }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </div>
    </button>
  );
}
