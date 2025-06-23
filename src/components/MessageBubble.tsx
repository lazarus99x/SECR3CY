import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, User, Pin, Target } from "lucide-react";
import { chatStorage } from "@/utils/chatStorage";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  theme: "light" | "dark";
  currentChatId: string;
  currentChatTitle: string;
  onNotesUpdate?: () => void;
}

export const MessageBubble = ({
  message,
  theme,
  currentChatId,
  currentChatTitle,
  onNotesUpdate,
}: MessageBubbleProps) => {
  const [isPinning, setIsPinning] = useState(false);
  const isUser = message.sender === "user";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePinToNote = async () => {
    if (isPinning) return;

    setIsPinning(true);
    try {
      const noteTitle = isUser
        ? `🔒 Secret Query: ${message.text.slice(0, 50)}${message.text.length > 50 ? "..." : ""}`
        : `🤖 AI Response: ${message.text.slice(0, 50)}${message.text.length > 50 ? "..." : ""}`;

      const note = chatStorage.createNoteFromMessage(
        message,
        currentChatId,
        noteTitle
      );
      console.log("Note created successfully:", note);
      toast.success("🔒 Message pinned as secret note!");

      // Trigger notes refresh if callback provided
      if (onNotesUpdate) {
        onNotesUpdate();
      }

      // Auto-refresh the page after successful pinning
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error pinning message:", error);
      toast.error("🔒 Failed to pin message as note");
    } finally {
      setIsPinning(false);
    }
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 items-start gap-3 group`}
    >
      {/* AI Avatar with Reduced Neon Animation - shown on left for AI messages */}
      {!isUser && (
        <div className="flex-shrink-0 relative">
          {/* Reduced Neon Ring Animation */}
          <div className="absolute inset-0 rounded-full animate-spin">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-30 blur-sm animate-pulse"></div>
          </div>
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-15 animate-pulse blur-md"></div>

          {/* Main Avatar */}

          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="36" height="36" rx="18" fill="#181A20" />
            <g>
              <path
                d="M18 9C18 9 27 12 27 18C27 24 18 27 18 27C18 27 9 24 9 18C9 12 18 9 18 9Z"
                stroke="#7C3AED"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="#23262F"
              />
              <path
                d="M18 15C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15Z"
                stroke="#00E0CA"
                strokeWidth="2"
                fill="#181A20"
              />
            </g>
          </svg>

          {/* Reduced Neon Particles Effect */}
          <div className="absolute -top-8 left-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-40 shadow-lg shadow-cyan-400/25"></div>
          <div className="absolute -top-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300 opacity-30 shadow-lg shadow-purple-400/25"></div>
          <div className="absolute -top-4 left-1 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-500 opacity-35 shadow-lg shadow-pink-400/25"></div>
          <div className="absolute -top-7 left-8 w-1 h-1 bg-cyan-300 rounded-full animate-ping delay-700 opacity-25 shadow-lg shadow-cyan-300/25"></div>
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${isUser ? "order-2" : "order-1"} relative`}
      >
        <div
          className={`
            backdrop-blur-xl rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg relative
            ${
              isUser
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-500/25"
                : "bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-gray-200 shadow-cyan-500/10"
            }
          `}
        >
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
          <div className="flex items-center justify-between mt-2 gap-2">
            <p
              className={`text-xs opacity-70 ${isUser ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}
            >
              {formatTime(message.timestamp)}
            </p>

            {/* Pin to Note button - show for all messages */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePinToNote}
              disabled={isPinning}
              className={`
                opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 h-auto text-xs sm:text-sm
                hover:bg-white/10 dark:hover:bg-gray-700/30 hover:shadow-lg
                ${isPinning ? "opacity-100 animate-pulse" : ""}
              `}
              title="🔒 Pin to Secret Notes"
            >
              {isPinning ? (
                <Target className="w-3 h-3 animate-spin text-cyan-400" />
              ) : (
                <Pin className="w-3 h-3 hover:text-cyan-400 transition-colors" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* User Avatar - shown on right for user messages */}
      {isUser && (
        <div className="flex-shrink-0">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-blue-300 dark:border-blue-600">
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};
