import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DueDatePicker } from '@/components/DueDatePicker';

interface TodoInputProps {
  onAdd: (text: string, dueDate?: Date) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim(), dueDate);
      setInput('');
      setDueDate(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-3">
      <div className="flex gap-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-full px-6 py-3 text-lg border-2 border-[oklch(0.92_0.01_70)] focus:border-[oklch(0.65_0.18_25)] transition-colors duration-200"
        />
        <Button
          type="submit"
          className="btn-primary-playful flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </Button>
      </div>
      <div className="flex gap-3">
        <DueDatePicker value={dueDate} onChange={setDueDate} />
      </div>
    </form>
  );
}
