import { useState, useEffect } from "react";
import { Chat, Note } from "@/types/chat";
import { chatStorage } from "@/utils/chatStorage";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Plus,
  Pin,
  Trash2,
  Edit3,
  FileText,
  Target,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NoteEditor } from "@/components/NoteEditor";
import { CompetitorAnalyzer } from "@/components/CompetitorAnalyzer";
import { ChatRenameDialog } from "@/components/ChatRenameDialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRefresh: () => void;
  onChatRename?: (chatId: string, newTitle: string) => void;
  onNotesUpdate?: () => void;
}

export const ChatSidebar = ({
  chats,
  activeChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onRefresh,
  onChatRename,
  onNotesUpdate,
}: ChatSidebarProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [isChatsOpen, setIsChatsOpen] = useState(true);
  const [isCompetitorOpen, setIsCompetitorOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const allNotes = chatStorage.getAllNotes();
    setNotes(allNotes);
    console.log("Loaded notes:", allNotes);
  };

  const handleNotesRefresh = () => {
    loadNotes();
    if (onNotesUpdate) {
      onNotesUpdate();
    }
  };

  const handlePinChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      const updatedChat = { ...chat, isPinned: !chat.isPinned };
      chatStorage.saveChat(updatedChat);
      onRefresh();
    }
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("🔒 Are you sure you want to delete this chat?")) {
      onDeleteChat(chatId);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm("🔒 Are you sure you want to delete this note?")) {
      chatStorage.deleteNote(noteId);
      handleNotesRefresh();
    }
  };

  const handleEditNote = (noteId: string) => {
    setEditingNoteId(noteId);
  };

  const handleNoteUpdated = () => {
    handleNotesRefresh();
    setEditingNoteId(null);
  };

  const handleRenameChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingChatId(chatId);
  };

  const handleChatRename = (newTitle: string) => {
    if (renamingChatId && onChatRename) {
      onChatRename(renamingChatId, newTitle);
      setRenamingChatId(null);
    }
  };

  const formatChatTitle = (chat: Chat) => {
    if (chat.title !== "New Chat" && chat.title !== "🎯 New Chat")
      return chat.title;
    const firstUserMessage = chat.messages.find((m) => m.sender === "user");
    if (firstUserMessage) {
      return (
        firstUserMessage.text.slice(0, 30) +
        (firstUserMessage.text.length > 30 ? "..." : "")
      );
    }
    return "🎯 New Chat";
  };

  const sortedChats = [...chats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  });

  const renamingChat = chats.find((c) => c.id === renamingChatId);

  return (
    <>
      <Sidebar
        className={`transition-all duration-300 border-r-2 border-purple-100 dark:border-purple-900 ${
          isCollapsed ? "w-16" : "w-80"
        }`}
      >
        {/* Collapse Button */}
        <div className="flex justify-end p-2">
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="rounded-full p-1 hover:bg-accent transition"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
        <SidebarHeader className="p-4 space-y-2">
          <Button
            onClick={onNewChat}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {!isCollapsed && <span>💬 New Chat</span>}
          </Button>
        </SidebarHeader>
        <SidebarContent className="space-y-2">
          {/* Chats Section */}
          <SidebarGroup>
            <Collapsible open={isChatsOpen} onOpenChange={setIsChatsOpen}>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-accent/50 rounded-md p-2">
                  <div className="flex items-center">
                    {isCollapsed ? (
                      <span className="text-lg">🕵️</span>
                    ) : (
                      <MessageSquare className="w-4 h-4 mr-2" />
                    )}
                    {!isCollapsed && <span>💬 Chats ({chats.length})</span>}
                  </div>
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sortedChats.map((chat) => (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={chat.id === activeChatId}
                          className="group relative"
                        >
                          <div
                            onClick={() => onChatSelect(chat.id)}
                            className="flex items-center justify-between w-full p-2 cursor-pointer hover:bg-accent rounded-md transition-colors"
                          >
                            <div className="flex items-center flex-1 min-w-0">
                              <MessageSquare className="w-3 h-3 mr-2 flex-shrink-0" />
                              {!isCollapsed && (
                                <span className="truncate flex-1 text-xs sm:text-sm">
                                  {formatChatTitle(chat)}
                                </span>
                              )}
                              {chat.isPinned && !isCollapsed && (
                                <Pin className="w-3 h-3 ml-1 text-yellow-500 fill-current" />
                              )}
                            </div>
                            {!isCollapsed && (
                              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <button
                                  onClick={(e) => handleRenameChat(chat.id, e)}
                                  className="p-1 hover:bg-background rounded"
                                  title="🎯 Rename chat"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => handlePinChat(chat.id, e)}
                                  className="p-1 hover:bg-background rounded"
                                  title={
                                    chat.isPinned
                                      ? "🔒 Unpin chat"
                                      : "🎯 Pin chat"
                                  }
                                >
                                  <Pin
                                    className={`w-3 h-3 ${
                                      chat.isPinned
                                        ? "text-yellow-500 fill-current"
                                        : ""
                                    }`}
                                  />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteChat(chat.id, e)}
                                  className="p-1 hover:bg-background rounded text-red-500"
                                  title="🔒 Delete chat"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>

          {/* Notes Section */}
          <SidebarGroup>
            <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-accent/50 rounded-md p-2">
                  <div className="flex items-center">
                    {isCollapsed ? (
                      <span className="text-lg">🗒️</span>
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    {!isCollapsed && <span>📝 Notes ({notes.length})</span>}
                  </div>
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {notes.map((note) => (
                      <SidebarMenuItem key={note.id}>
                        <div className="p-2 border rounded-md bg-card/50 hover:bg-card transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-xs sm:text-sm truncate flex-1">
                              {!isCollapsed && note.title}
                            </h4>
                            {!isCollapsed && (
                              <div className="flex items-center ml-2">
                                <button
                                  onClick={() => handleEditNote(note.id)}
                                  className="p-1 hover:bg-background rounded"
                                  title="🎯 Edit note"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="p-1 hover:bg-background rounded text-red-500"
                                  title="🔒 Delete note"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                          {!isCollapsed && (
                            <>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {note.content}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {note.createdAt.toLocaleDateString()}
                                </Badge>
                                <NoteExportButtons note={note} />
                              </div>
                            </>
                          )}
                        </div>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>

          {/* Competitor Analyzer Section */}
          <SidebarGroup>
            <Collapsible
              open={isCompetitorOpen}
              onOpenChange={setIsCompetitorOpen}
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-accent/50 rounded-md p-2">
                  <div className="flex items-center">
                    {isCollapsed ? (
                      <span className="text-lg">🧩</span>
                    ) : (
                      <Target className="w-4 h-4 mr-2" />
                    )}
                    {!isCollapsed && <span>🧠 Analyzer</span>}
                    <Lock className="w-3 h-3 ml-2 text-gray-400" />
                  </div>
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  {!isCollapsed && (
                    <CompetitorAnalyzer onNotesUpdate={handleNotesRefresh} />
                  )}
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <div>
                {isCollapsed ? "" : "💬"} {chats.length} chats •{" "}
                {isCollapsed ? "" : "📝"} {notes.length} notes
              </div>
              <div className="text-purple-500">Secure & Minimal Design</div>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      {editingNoteId && (
        <NoteEditor
          noteId={editingNoteId}
          isOpen={!!editingNoteId}
          onClose={() => setEditingNoteId(null)}
          onSave={handleNoteUpdated}
        />
      )}

      {renamingChat && (
        <ChatRenameDialog
          isOpen={!!renamingChatId}
          currentTitle={renamingChat.title}
          onClose={() => setRenamingChatId(null)}
          onRename={handleChatRename}
        />
      )}
    </>
  );
};

const NoteExportButtons = ({ note }: { note: Note }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "txt" | "pdf" | "word") => {
    setIsExporting(true);
    try {
      const { exportUtils } = await import("@/utils/exportUtils");

      switch (format) {
        case "txt":
          exportUtils.downloadAsText(note);
          break;
        case "pdf":
          exportUtils.downloadAsPDF(note);
          break;
        case "word":
          exportUtils.downloadAsWord(note);
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleExport("txt")}
        disabled={isExporting}
        className="p-1 hover:bg-background rounded text-xs"
        title="📄 Export as TXT"
      >
        TXT
      </button>
      <button
        onClick={() => handleExport("pdf")}
        disabled={isExporting}
        className="p-1 hover:bg-background rounded text-xs"
        title="📄 Export as PDF"
      >
        PDF
      </button>
      <button
        onClick={() => handleExport("word")}
        disabled={isExporting}
        className="p-1 hover:bg-background rounded text-xs"
        title="📄 Export as Word"
      >
        DOC
      </button>
    </div>
  );
};
