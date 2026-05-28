import { Calendar, AlertCircle, Clock } from 'lucide-react';
import { getDueDateStatus, getDaysUntil, type DueDateStatus } from '@/hooks/useTodos';

interface DueDateBadgeProps {
  dueDate?: Date;
  completed?: boolean;
}

export function DueDateBadge({ dueDate, completed }: DueDateBadgeProps) {
  if (!dueDate) return null;

  const status = getDueDateStatus(dueDate);
  const daysUntil = getDaysUntil(dueDate);

  if (completed) {
    return (
      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[oklch(0.72_0.12_120)]/20 text-[oklch(0.72_0.12_120)] text-sm font-medium">
        <Calendar className="w-3 h-3" />
        <span>{dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
    );
  }

  const statusStyles: Record<DueDateStatus, { bg: string; text: string; icon: React.ReactNode }> = {
    overdue: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: <AlertCircle className="w-3 h-3" />,
    },
    urgent: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      icon: <AlertCircle className="w-3 h-3" />,
    },
    warning: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      icon: <Clock className="w-3 h-3" />,
    },
    normal: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: <Calendar className="w-3 h-3" />,
    },
  };

  const style = statusStyles[status];

  const getLabel = () => {
    if (status === 'overdue') {
      return `${Math.abs(daysUntil || 0)}d overdue`;
    }
    if (status === 'urgent') {
      return 'Today!';
    }
    if (status === 'warning') {
      return `${daysUntil}d left`;
    }
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${style.bg} ${style.text} text-sm font-medium animate-pulse-subtle`}>
      {style.icon}
      <span>{getLabel()}</span>
    </div>
  );
}
