'use client';
import { useTheme } from "@/components/ui/ThemeProvider";
import { Moon, Sun } from "lucide-react"; // optional icon lib like lucide-react

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none"
      aria-label="Toggle Dark Mode"
    >
        <div
        className={`w-4 h-4 flex items-center justify-center text-xs ${
            theme === "dark" ? "translate-x-6" : "translate-x-0"
        } bg-white rounded-full shadow-md transform transition-transform duration-300`}
        >
        {theme === "dark" ? "🌙" : "☀️"}
        </div>
    </button>
  );
}
