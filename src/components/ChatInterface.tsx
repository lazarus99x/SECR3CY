import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { ChatHeader } from "@/components/ChatHeader";
import { TokenDisplay } from "@/components/TokenDisplay";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  generateAIResponse,
  ChatMode,
  CHAT_MODES,
} from "@/services/geminiService";
import { Bot, Search, Ghost } from "lucide-react";
import { toast } from "sonner";
import { Chat, Message } from "@/types/chat";
import { chatStorage } from "@/utils/chatStorage";
import { deductTokens, getUserTokens } from "@/utils/tokenManager";

interface ChatInterfaceProps {
  theme: "light" | "dark";
  currentChat: Chat;
  onChatUpdate: (chat: Chat) => void;
  onNotesUpdate?: () => void;
}

export const ChatInterface = ({
  theme,
  currentChat,
  onChatUpdate,
  onNotesUpdate,
}: ChatInterfaceProps) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>(
    currentChat?.messages || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>("CHAT");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages);
    }
  }, [currentChat]);

  // Improved scroll to bottom function
  const scrollToBottom = (behavior: "smooth" | "instant" = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior,
        block: "end",
        inline: "nearest",
      });
    }
  };

  // Scroll immediately when messages change
  useEffect(() => {
    // Use instant scroll for immediate feedback
    scrollToBottom("instant");

    // Follow up with smooth scroll to ensure proper positioning
    const timer = setTimeout(() => {
      scrollToBottom("smooth");
    }, 50);

    return () => clearTimeout(timer);
  }, [messages.length]);

  // Additional scroll when loading state changes
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom("smooth");
    }
  }, [isLoading]);

  const updateChatInStorage = (updatedMessages: Message[]) => {
    if (!currentChat) return currentChat;

    const updatedChat: Chat = {
      ...currentChat,
      messages: updatedMessages,
      lastMessageAt: new Date(),
      title:
        (currentChat.title === "New Request" ||
          currentChat.title === "🎯 New Request" ||
          currentChat.title === "🔒 New Secret Request") &&
        updatedMessages.length > 0
          ? generateChatTitle(updatedMessages)
          : currentChat.title,
    };

    chatStorage.saveChat(updatedChat);
    onChatUpdate(updatedChat);
    return updatedChat;
  };

  const generateChatTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find((m) => m.sender === "user");
    if (firstUserMessage) {
      const words = firstUserMessage.text.split(" ").slice(0, 4);
      return (
        "🔒 " +
        words.join(" ") +
        (firstUserMessage.text.split(" ").length > 4 ? "..." : "")
      );
    }
    return "🔒 New Secret Request";
  };

  const handleSendMessage = async (text: string) => {
    if (!user?.id) {
      toast.error("🔒 Authentication required");
      return;
    }

    const tokens = getUserTokens(user.id);
    const tokenCost = mode === "CHAT" ? 5 : mode === "SEARCH" ? 15 : 10;

    if (tokens.remaining < tokenCost) {
      toast.error(`🔒 Insufficient tokens! (${tokenCost} required)`);
      return;
    }

    const userMessage: Message = {
      id: "user-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    updateChatInStorage(newMessages);

    setIsLoading(true);

    try {
      const tokenDeducted = deductTokens(user.id, tokenCost);
      if (!tokenDeducted) {
        toast.error(`🔒 Insufficient tokens! (${tokenCost} required)`);
        setIsLoading(false);
        return;
      }

      // Convert recent messages for context
      const recentContext = messages.slice(-6).map((m) => ({
        role: m.sender as "user" | "assistant",
        content: m.text,
      }));

      const aiResponse = await generateAIResponse(text, mode, recentContext);

      const aiMessage: Message = {
        id: "ai-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      updateChatInStorage(finalMessages);

      toast.success(`🔒 ${tokenCost} tokens deducted`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("🔒 Failed to get AI response");

      const errorMessage: Message = {
        id:
          "error-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        text: "🔒 I apologize, I'm having trouble responding right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };

      const errorMessages = [...newMessages, errorMessage];
      setMessages(errorMessages);
      updateChatInStorage(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    const clearedChat = { ...currentChat, messages: [] };
    chatStorage.saveChat(clearedChat);
    onChatUpdate(clearedChat);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <ChatHeader onClearChat={handleClearChat} />

      {/* Mode Selector */}
      <div className="px-2 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        <Tabs value={mode} onValueChange={(value: ChatMode) => setMode(value)}>
          <TabsList className="flex w-full">
            <TabsTrigger
              value="CHAT"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Convo</span> Mode
              <span className="ml-1 text-xs text-gray-400">(5)</span>
            </TabsTrigger>
            <TabsTrigger
              value="SEARCH"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Search className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Research</span> Mode
              <span className="ml-1 text-xs text-gray-400">(15)</span>
            </TabsTrigger>
            <TabsTrigger
              value="GHOST"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Ghost className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Ghost</span> Mode
              <span className="ml-1 text-xs text-gray-400">(10)</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="px-4 py-2">
        <TokenDisplay mode={mode} />
      </div>

      <div className="flex-1 overflow-hidden" ref={messageListRef}>
        <MessageList
          messages={messages}
          isLoading={isLoading}
          theme={theme}
          currentChatId={currentChat?.id || ""}
          currentChatTitle={currentChat?.title || "New Chat"}
          onNotesUpdate={onNotesUpdate}
        />
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        mode={mode}
        theme={theme}
      />
    </div>
  );
};
