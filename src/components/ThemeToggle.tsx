
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 z-50 p-3 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
    >
      {theme === 'light' ? (
        <ToggleLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      ) : (
        <ToggleRight className="w-6 h-6 text-blue-400" />
      )}
    </button>
  );
};
