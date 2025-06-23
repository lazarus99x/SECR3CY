
import { useState, useEffect } from 'react';
import { Note } from '@/types/chat';
import { chatStorage } from '@/utils/chatStorage';
import { exportUtils } from '@/utils/exportUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Save } from 'lucide-react';

interface NoteEditorProps {
  noteId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const NoteEditor = ({ noteId, isOpen, onClose, onSave }: NoteEditorProps) => {
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && noteId) {
      const notes = chatStorage.getAllNotes();
      const foundNote = notes.find(n => n.id === noteId);
      if (foundNote) {
        setNote(foundNote);
        setTitle(foundNote.title);
        setContent(foundNote.content);
      }
    }
  }, [noteId, isOpen]);

  const handleSave = async () => {
    if (!note) return;
    
    setIsSaving(true);
    try {
      const updatedNote: Note = {
        ...note,
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
        updatedAt: new Date()
      };
      
      chatStorage.saveNote(updatedNote);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = (format: 'txt' | 'pdf' | 'word') => {
    if (!note) return;
    
    const exportNote = {
      ...note,
      title: title.trim() || 'Untitled Note',
      content: content.trim()
    };
    
    switch (format) {
      case 'txt':
        exportUtils.downloadAsText(exportNote);
        break;
      case 'pdf':
        exportUtils.downloadAsPDF(exportNote);
        break;
      case 'word':
        exportUtils.downloadAsWord(exportNote);
        break;
    }
  };

  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-y-auto">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter note content..."
              className="mt-1 min-h-[300px] resize-none"
            />
          </div>
          
          <div className="text-xs text-muted-foreground">
            Created: {note.createdAt.toLocaleString()}
            {note.updatedAt.getTime() !== note.createdAt.getTime() && (
              <> • Updated: {note.updatedAt.toLocaleString()}</>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('txt')}
              className="flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              TXT
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('word')}
              className="flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              DOC
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1"
            >
              <Save className="w-3 h-3" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
