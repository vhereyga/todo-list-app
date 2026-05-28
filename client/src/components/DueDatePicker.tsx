import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DueDatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  label?: string;
}

export function DueDatePicker({ value, onChange, label = 'Due Date' }: DueDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      onChange(date);
    } else {
      onChange(undefined);
    }
  };

  const handleClear = () => {
    onChange(undefined);
    setIsOpen(false);
  };

  const displayDate = value ? value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'No date';

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start text-left rounded-full border-2 border-[oklch(0.92_0.01_70)] hover:border-[oklch(0.65_0.18_25)] transition-colors"
      >
        <Calendar className="w-4 h-4 mr-2 text-[oklch(0.75_0.15_60)]" />
        <span className="flex-1">{displayDate}</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 bg-white rounded-2xl shadow-lg p-4 z-50 w-full">
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
          <Input
            type="date"
            value={formatDate(value)}
            onChange={handleDateChange}
            className="w-full rounded-lg border-2 border-[oklch(0.92_0.01_70)] focus:border-[oklch(0.65_0.18_25)]"
          />
          <div className="flex gap-2 mt-3">
            {value && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleClear}
                className="flex-1 rounded-full text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-full bg-[oklch(0.65_0.18_25)] text-white hover:bg-[oklch(0.60_0.18_25)]"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
