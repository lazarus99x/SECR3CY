import { useState, useEffect } from "react";
import { useAuth, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { ChatInterface } from "@/components/ChatInterface";
import { Landing } from "@/pages/Landing";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatSidebar } from "@/components/ChatSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Chat } from "@/types/chat";
import { chatStorage } from "@/utils/chatStorage";
import { initializeUserTokens } from "@/utils/tokenManager";
import { Lock, Target, Shield } from "lucide-react";

const Index = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  useEffect(() => {
    // Check system preference and stored theme, default to dark for SECRECY
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "dark"); // Default to dark
    setTheme(initialTheme);

    // Apply theme immediately to prevent flash
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (isSignedIn && isLoaded && user?.id) {
      // Initialize user tokens on first login
      initializeUserTokens(user.id);
      loadChats();

      // Subscribe to real-time chat updates
      const unsubscribeChats = chatStorage.onChatsUpdate(() => {
        console.log("Real-time chat update detected");
        loadChats();
      });

      return unsubscribeChats;
    }
  }, [isSignedIn, isLoaded, user?.id]);

  const loadChats = () => {
    const allChats = chatStorage.getAllChats();
    setChats(allChats);

    // Get or set active chat
    let activeId = chatStorage.getActiveChatId();

    if (!activeId || !allChats.find((c) => c.id === activeId)) {
      // Create a new chat if no active chat or active chat doesn't exist
      const newChat = chatStorage.createNewChat();
      allChats.push(newChat);
      activeId = newChat.id;
      chatStorage.setActiveChatId(activeId);
      setChats(allChats);
    }

    setActiveChatId(activeId);
    const active = allChats.find((c) => c.id === activeId);
    if (active) {
      setCurrentChat(active);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save to localStorage
    localStorage.setItem("theme", newTheme);
    console.log("Theme toggled to:", newTheme);
  };

  const handleChatSelect = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setActiveChatId(chatId);
      setCurrentChat(chat);
      chatStorage.setActiveChatId(chatId);
    }
  };

  const handleNewChat = () => {
    const newChat = chatStorage.createNewChat();
    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    setActiveChatId(newChat.id);
    setCurrentChat(newChat);
    chatStorage.setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (chatId: string) => {
    chatStorage.deleteChat(chatId);
    const updatedChats = chats.filter((c) => c.id !== chatId);
    setChats(updatedChats);

    // If we deleted the active chat, switch to another or create new
    if (chatId === activeChatId) {
      if (updatedChats.length > 0) {
        const newActiveChat = updatedChats[0];
        setActiveChatId(newActiveChat.id);
        setCurrentChat(newActiveChat);
        chatStorage.setActiveChatId(newActiveChat.id);
      } else {
        handleNewChat();
      }
    }
  };

  const handleChatUpdate = (updatedChat: Chat) => {
    const updatedChats = chats.map((c) =>
      c.id === updatedChat.id ? updatedChat : c
    );
    setChats(updatedChats);
    setCurrentChat(updatedChat);
  };

  const handleChatRename = (chatId: string, newTitle: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      const updatedChat = { ...chat, title: newTitle };
      chatStorage.saveChat(updatedChat);
      const updatedChats = chats.map((c) =>
        c.id === chatId ? updatedChat : c
      );
      setChats(updatedChats);
      if (chatId === activeChatId) {
        setCurrentChat(updatedChat);
      }
    }
  };

  const handleNotesUpdate = () => {
    console.log("Notes updated - real-time refresh triggered");
  };

  // Show loading screen while Clerk is initializing
  if (!isLoaded) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 to-black"
            : "bg-gradient-to-br from-blue-50 to-white"
        }`}
      >
        <div className="text-center animate-fade-in">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse shadow-glow-pink">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-red-600 shadow-glow-pink animate-pulse"></div>
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
            </div>
          </div>
          <p
            className={`flex items-center justify-center gap-2 text-lg font-mono transition-colors duration-300 ${
              theme === "dark" ? "text-cyan-400" : "text-blue-600"
            }`}
          >
            <Target className="w-5 h-5 " />
            🔒 Initializing SECRECY...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <Landing onAuth={() => {}} theme={theme} onToggleTheme={toggleTheme} />
      </SignedOut>

      <SignedIn>
        <div
          className={`min-h-screen transition-all duration-500 ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-900 to-gray-800"
              : "bg-gradient-to-br from-blue-50 to-indigo-100"
          }`}
        >
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          {!currentChat ? (
            <div
              className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-900 to-gray-800"
                  : "bg-gradient-to-br from-blue-50 to-indigo-100"
              }`}
            >
              <div className="text-center animate-fade-in">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-300 to-red-400 rounded-full flex items-center justify-center mx-auto animate-pulse shadow-glow-pink">
                    <div className="absolute inset-0 rounded-full bg-red-300 animate-ping opacity-100"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-200 to-red-300 shadow-glow-pink animate-pulse"></div>
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
                  </div>
                </div>
                <p
                  className={`flex items-center justify-center gap-2 text-lg font-mono transition-colors duration-300 ${
                    theme === "dark" ? "text-cyan-400" : "text-blue-600"
                  }`}
                >
                  <Target className="w-5 h-5 " />
                  🔒 INITIALIZING SECRECY...
                </p>
              </div>
            </div>
          ) : (
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <ChatSidebar
                  chats={chats}
                  activeChatId={activeChatId}
                  onChatSelect={handleChatSelect}
                  onNewChat={handleNewChat}
                  onDeleteChat={handleDeleteChat}
                  onRefresh={loadChats}
                  onChatRename={handleChatRename}
                  onNotesUpdate={handleNotesUpdate}
                />

                <SidebarInset className="flex-1">
                  <div
                    className={`flex items-center gap-2 p-3 sm:p-4 border-b backdrop-blur-sm transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gray-800/50 border-gray-700"
                        : "bg-white/50 border-gray-200"
                    }`}
                  >
                    <SidebarTrigger />
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="relative">
                        <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center animate-pulse">
                          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
                          <svg
                            width="36"
                            height="36"
                            viewBox="0 0 36 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="36"
                              height="36"
                              rx="18"
                              fill="#181A20"
                            />
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
                        </div>
                      </div>
                      <h1 className="font-semibold text-sm sm:text-base bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent truncate">
                        {currentChat.title === "New Chat" ||
                        currentChat.title === "🎯 New Chat" ||
                        (currentChat.title === "🔒 New Secret Chat" &&
                          currentChat.messages.length > 0)
                          ? currentChat.messages
                              .find((m) => m.sender === "user")
                              ?.text.slice(0, 30) + "..."
                          : currentChat.title}
                      </h1>
                    </div>
                  </div>

                  <ChatInterface
                    theme={theme}
                    currentChat={currentChat}
                    onChatUpdate={handleChatUpdate}
                    onNotesUpdate={handleNotesUpdate}
                  />
                </SidebarInset>
              </div>
            </SidebarProvider>
          )}
        </div>
      </SignedIn>
    </>
  );
};

export default Index;
