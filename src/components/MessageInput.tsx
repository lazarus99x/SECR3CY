import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export const MessageInput = ({
  onSendMessage,
  disabled,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-t border-white/20 dark:border-gray-700/20 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto w-full">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 sm:gap-3"
        >
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 border-white/40 dark:border-gray-600/40 rounded-full px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            />
          </div>

          <Button
            type="submit"
            disabled={disabled || !message.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-2 sm:p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
