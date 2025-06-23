import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { ChatHeader } from "@/components/ChatHeader";
import { TokenDisplay } from "@/components/TokenDisplay";
import { generateAIResponse } from "@/services/geminiService";
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
  const [messages, setMessages] = useState<Message[]>(currentChat.messages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(currentChat.messages);
  }, [currentChat.id, currentChat.messages]);

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
    const updatedChat: Chat = {
      ...currentChat,
      messages: updatedMessages,
      lastMessageAt: new Date(),
      title:
        (currentChat.title === "New Chat" ||
          currentChat.title === "🎯 New Chat" ||
          currentChat.title === "🔒 New Secret Chat") &&
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
    return "🔒 New Secret Chat";
  };

  const handleSendMessage = async (text: string) => {
    if (!user?.id) {
      toast.error("🔒 Authentication required");
      return;
    }

    // Check if user has enough tokens
    const tokens = getUserTokens(user.id);
    if (tokens.remaining < 10) {
      toast.error("🔒 Insufficient tokens! Please upgrade to continue.");
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

    setTimeout(() => scrollToBottom("instant"), 10);

    setIsLoading(true);

    try {
      // Deduct tokens before making the request
      const tokenDeducted = deductTokens(user.id);
      if (!tokenDeducted) {
        toast.error("🔒 Insufficient tokens! Please upgrade to continue.");
        setIsLoading(false);
        return;
      }

      console.log("Sending message to SECRET AI:", text);
      const aiResponse = await generateAIResponse(text);
      console.log("Received response from SECRET AI:", aiResponse);

      const aiMessage: Message = {
        id: "ai-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      updateChatInStorage(finalMessages);

      toast.success("🔒 10 tokens deducted");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("🔒 Failed to get AI response. Please try again.");

      const errorMessage: Message = {
        id:
          "error-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        text: "🔒 I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
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
    <div className="h-150 flex flex-col">
      <ChatHeader onClearChat={handleClearChat} />

      <div className="px-4 py-2">
        <TokenDisplay />
      </div>

      <div className="flex-1 overflow-hidden" ref={messageListRef}>
        <MessageList
          messages={messages}
          isLoading={isLoading}
          theme={theme}
          currentChatId={currentChat.id}
          currentChatTitle={currentChat.title}
          onNotesUpdate={onNotesUpdate}
        />
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};
