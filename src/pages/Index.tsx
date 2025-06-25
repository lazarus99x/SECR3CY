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
              theme === "dark" ? "text-cyan-200" : "text-blue-400"
            }`}
          >
            🔒 Initializing SECR3CY...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SignedIn>
        <SidebarProvider>
          <div className="flex h-screen">
            <SidebarInset className="hidden md:block">
              <ChatSidebar
                chats={chats}
                activeChatId={activeChatId}
                onChatSelect={handleChatSelect}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
                onRefresh={loadChats}
                onChatRename={handleChatRename}
                onNotesUpdate={loadChats}
              />
            </SidebarInset>

            <div className="flex-1 flex flex-col w-full">
              <div className="flex justify-between items-center p-2 sm:p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <SidebarTrigger>
                    <button className="p-1 sm:p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-600 dark:text-gray-400"
                      >
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                      </svg>
                    </button>
                  </SidebarTrigger>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 animate-fade-in">
                      <div className="relative group">
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
                      <span className="font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent ">
                        SECR3CY
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                </div>
              </div>

              <ChatInterface
                theme={theme}
                currentChat={currentChat}
                onChatUpdate={handleChatUpdate}
                onNotesUpdate={handleNotesUpdate}
              />
            </div>
          </div>
        </SidebarProvider>
      </SignedIn>

      <SignedOut>
        <Landing onAuth={() => {}} theme={theme} onToggleTheme={toggleTheme} />
      </SignedOut>
    </div>
  );
};

export default Index;
