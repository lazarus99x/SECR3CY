import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/clerk-react";

interface ChatHeaderProps {
  onClearChat: () => void;
}

export const ChatHeader = ({ onClearChat }: ChatHeaderProps) => {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      // Clear any local storage
      localStorage.removeItem("chatHistory");
      localStorage.removeItem("userTokens");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-b border-white/20 dark:border-gray-700/20 p-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            •‿•
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onClearChat}
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-800/10 hover:text-cyan-400 transition-colors"
          >
            🔒 Clear Queries
          </Button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-800/10 hover:text-red-400 transition-colors"
          >
            <Settings className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
