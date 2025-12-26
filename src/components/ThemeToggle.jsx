import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-muted border border-border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Track background */}
      <span 
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          isDark ? 'bg-primary/20' : 'bg-primary/10'
        }`}
      />
      
      {/* Sliding thumb */}
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-background border border-border shadow-sm flex items-center justify-center transition-all duration-300 ease-in-out ${
          isDark ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'
        }`}
      >
        <Sun className={`h-3.5 w-3.5 text-primary absolute transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
        }`} />
        <Moon className={`h-3.5 w-3.5 text-primary absolute transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
        }`} />
      </span>
    </button>
  );
};

export default ThemeToggle;
