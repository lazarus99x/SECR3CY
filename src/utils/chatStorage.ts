
import { Chat, Message, Note } from '@/types/chat';

const CHATS_KEY = 'ai_chats';
const NOTES_KEY = 'ai_notes';
const ACTIVE_CHAT_KEY = 'active_chat_id';

// Event listeners for real-time updates
const notesUpdateCallbacks: (() => void)[] = [];
const chatsUpdateCallbacks: (() => void)[] = [];

export const chatStorage = {
  // Subscribe to real-time updates
  onNotesUpdate(callback: () => void) {
    notesUpdateCallbacks.push(callback);
    return () => {
      const index = notesUpdateCallbacks.indexOf(callback);
      if (index > -1) notesUpdateCallbacks.splice(index, 1);
    };
  },

  onChatsUpdate(callback: () => void) {
    chatsUpdateCallbacks.push(callback);
    return () => {
      const index = chatsUpdateCallbacks.indexOf(callback);
      if (index > -1) chatsUpdateCallbacks.splice(index, 1);
    };
  },

  // Trigger callbacks
  triggerNotesUpdate() {
    notesUpdateCallbacks.forEach(callback => callback());
  },

  triggerChatsUpdate() {
    chatsUpdateCallbacks.forEach(callback => callback());
  },

  // Chat management
  getAllChats(): Chat[] {
    try {
      const chats = localStorage.getItem(CHATS_KEY);
      if (!chats) return [];
      return JSON.parse(chats).map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        lastMessageAt: new Date(chat.lastMessageAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading chats:', error);
      return [];
    }
  },

  saveChat(chat: Chat): void {
    try {
      const chats = this.getAllChats();
      const existingIndex = chats.findIndex(c => c.id === chat.id);
      
      if (existingIndex >= 0) {
        chats[existingIndex] = chat;
      } else {
        chats.push(chat);
      }
      
      localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
      this.triggerChatsUpdate();
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  },

  deleteChat(chatId: string): void {
    try {
      const chats = this.getAllChats().filter(c => c.id !== chatId);
      localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
      this.triggerChatsUpdate();
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  },

  createNewChat(title?: string): Chat {
    const chat: Chat = {
      id: 'chat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      title: title || '🔒 New Secret Chat',
      messages: [],
      createdAt: new Date(),
      lastMessageAt: new Date(),
      isPinned: false
    };
    
    this.saveChat(chat);
    return chat;
  },

  // Active chat management
  getActiveChatId(): string | null {
    return localStorage.getItem(ACTIVE_CHAT_KEY);
  },

  setActiveChatId(chatId: string): void {
    localStorage.setItem(ACTIVE_CHAT_KEY, chatId);
  },

  // Notes management
  getAllNotes(): Note[] {
    try {
      const notes = localStorage.getItem(NOTES_KEY);
      if (!notes) return [];
      return JSON.parse(notes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  },

  saveNote(note: Note): void {
    try {
      const notes = this.getAllNotes();
      const existingIndex = notes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        notes[existingIndex] = note;
      } else {
        notes.push(note);
      }
      
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      console.log('Note saved successfully:', note);
      this.triggerNotesUpdate();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  },

  deleteNote(noteId: string): void {
    try {
      const notes = this.getAllNotes().filter(n => n.id !== noteId);
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      this.triggerNotesUpdate();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  },

  createNoteFromMessage(message: Message, chatId: string, customTitle?: string): Note {
    const note: Note = {
      id: 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      title: customTitle || `🔒 Secret Note from Chat`,
      content: message.text,
      sourceMessageId: message.id,
      sourceChatId: chatId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.saveNote(note);
    return note;
  },

  createNoteFromContent(title: string, content: string): Note {
    const note: Note = {
      id: 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      title: title,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.saveNote(note);
    return note;
  }
};
