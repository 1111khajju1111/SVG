import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="glass flex h-8 w-14 items-center rounded-full px-1 transition-colors sm:h-9 sm:w-16"
    >
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-ink-950 transition-transform duration-300 sm:h-7 sm:w-7 ${
          isDark ? "translate-x-0" : "translate-x-[24px] sm:translate-x-[28px]"
        }`}
      >
        {isDark ? <Moon size={13} /> : <Sun size={13} />}
      </div>
    </button>
  );
}
