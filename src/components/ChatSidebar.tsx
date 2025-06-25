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
    if (chat.title !== "New Query" && chat.title !== "🎯 New Query")
      return chat.title;
    const firstUserMessage = chat.messages.find((m) => m.sender === "user");
    if (firstUserMessage) {
      return (
        firstUserMessage.text.slice(0, 30) +
        (firstUserMessage.text.length > 30 ? "..." : "")
      );
    }
    return "🎯 New Query";
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
      <Sidebar className="w-64 sm:w-80 border-r-2 border-purple-100 dark:border-purple-900">
        <SidebarHeader className="p-2 sm:p-4 space-y-2">
          <Button
            onClick={onNewChat}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            🎯 New Query
          </Button>
        </SidebarHeader>

        <SidebarContent className="space-y-2">
          {/* Chats Section */}
          <SidebarGroup>
            <Collapsible open={isChatsOpen} onOpenChange={setIsChatsOpen}>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-accent/50 rounded-md p-1 sm:p-2">
                  <div className="flex items-center">
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">
                      🔒 Queries ({chats.length})
                    </span>
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
                            className="flex items-center justify-between w-full p-1 sm:p-2 cursor-pointer hover:bg-accent rounded-md transition-colors"
                          >
                            <div className="flex items-center flex-1 min-w-0">
                              <MessageSquare className="w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="truncate flex-1 text-xs">
                                {formatChatTitle(chat)}
                              </span>
                              {chat.isPinned && (
                                <Pin className="w-2 h-2 sm:w-3 sm:h-3 ml-1 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 sm:ml-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleRenameChat(chat.id, e)}
                                className="p-0.5 sm:p-1"
                              >
                                <Edit3 className="w-2 h-2 sm:w-3 sm:h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handlePinChat(chat.id, e)}
                                className="p-0.5 sm:p-1"
                              >
                                <Pin className="w-2 h-2 sm:w-3 sm:h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                className="p-0.5 sm:p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-2 h-2 sm:w-3 sm:h-3" />
                              </Button>
                            </div>
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
                    <FileText className="w-4 h-4 mr-2" />
                    🎯 Pinned Notes ({notes.length})
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
                              {note.title}
                            </h4>
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
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {note.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {note.createdAt.toLocaleDateString()}
                            </Badge>
                            <NoteExportButtons note={note} />
                          </div>
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
                    <Target className="w-4 h-4 mr-2" />
                    🎯 Competitor Analyzer
                    <Lock className="w-3 h-3 ml-2 text-gray-400" />
                  </div>
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <CompetitorAnalyzer onNotesUpdate={handleNotesRefresh} />
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <div>
              🔒 {chats.length} chats • 🎯 {notes.length} notes
            </div>
            <div className="text-purple-500">Secure & Minimal Design</div>
          </div>
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
