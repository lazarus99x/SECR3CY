
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastMessageAt: Date;
  isPinned: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  sourceMessageId?: string;
  sourceChatId?: string;
  createdAt: Date;
  updatedAt: Date;
}
