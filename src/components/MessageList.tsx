import { MessageBubble } from "@/components/MessageBubble";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  theme: "light" | "dark";
  currentChatId: string;
  currentChatTitle: string;
  onNotesUpdate?: () => void;
}

export const MessageList = ({
  messages,
  isLoading,
  theme,
  currentChatId,
  currentChatTitle,
  onNotesUpdate,
}: MessageListProps) => {
  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-2 sm:p-4 max-w-4xl mx-auto w-full">
        <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-6">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              theme={theme}
              currentChatId={currentChatId}
              currentChatTitle={currentChatTitle}
              onNotesUpdate={onNotesUpdate}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start items-start gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full animate-bounce"></div>
              </div>
              <LoadingIndicator />
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
