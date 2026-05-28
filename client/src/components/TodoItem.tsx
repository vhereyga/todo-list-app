import { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DueDatePicker } from '@/components/DueDatePicker';
import { DueDateBadge } from '@/components/DueDateBadge';
import { getDueDateStatus } from '@/hooks/useTodos';
import type { Todo } from '@/hooks/useTodos';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, text: string, dueDate?: Date) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onUpdate, onToggle, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText.trim(), editDueDate);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDueDate(todo.dueDate);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const dueDateStatus = getDueDateStatus(todo.dueDate);
  const isUrgent = !todo.completed && (dueDateStatus === 'overdue' || dueDateStatus === 'urgent');

  if (isEditing) {
    return (
      <div className={`task-card flex flex-col gap-3 animate-in fade-in duration-200 ${
        isUrgent ? 'border-l-red-500 bg-red-50/30' : ''
      }`}>
        <div className="flex items-center gap-3">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-white rounded-lg"
            placeholder="Edit your task..."
          />
        </div>
        <div className="flex gap-3">
          <DueDatePicker value={editDueDate} onChange={setEditDueDate} label="Due Date" />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={handleSave}
            className="bg-[oklch(0.65_0.18_25)] hover:bg-[oklch(0.60_0.18_25)] rounded-full"
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`task-card flex items-center gap-3 group transition-all duration-200 ${
        todo.completed ? 'completed' : ''
      } ${isUrgent ? 'border-l-red-500 bg-gradient-to-r from-red-50/50 to-transparent' : ''} animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="rounded-full w-6 h-6"
      />
      
      <div className="flex-1 min-w-0">
        <span
          className={`block text-lg transition-all duration-200 ${
            todo.completed
              ? 'line-through text-muted-foreground'
              : 'text-foreground'
          }`}
        >
          {todo.text}
        </span>
        {todo.dueDate && (
          <div className="mt-2">
            <DueDateBadge dueDate={todo.dueDate} completed={todo.completed} />
          </div>
        )}
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="rounded-full hover:bg-[oklch(0.75_0.15_60)]/20"
        >
          <Edit2 className="w-4 h-4 text-[oklch(0.75_0.15_60)]" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(todo.id)}
          className="rounded-full hover:bg-red-100"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
