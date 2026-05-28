import { useTodos } from '@/hooks/useTodos';
import { TodoInput } from '@/components/TodoInput';
import { TodoItem } from '@/components/TodoItem';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle2 } from 'lucide-react';

/**
 * Warm & Playful Productivity Design
 * - Soft cream background with warm coral accents
 * - Rounded shapes and playful interactions
 * - Encouraging micro-interactions on task completion
 * - Due date visual warnings for urgent tasks
 */
export default function Home() {
  const {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    getSortedTodos,
  } = useTodos();

  const sortedTodos = getSortedTodos();
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[oklch(0.98_0.002_70)] to-[oklch(0.95_0.005_70)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[oklch(0.92_0.01_70)] border-t-[oklch(0.65_0.18_25)] animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.98_0.002_70)] to-[oklch(0.95_0.005_70)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-2">
            My Tasks
          </h1>
          <p className="text-muted-foreground text-lg">
            {completedCount} of {totalCount} completed
          </p>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mb-8 bg-white rounded-full p-1 shadow-md">
            <div
              className="h-2 bg-gradient-to-r from-[oklch(0.65_0.18_25)] to-[oklch(0.72_0.12_120)] rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Input Section */}
        <TodoInput onAdd={addTodo} />

        {/* Tasks List */}
        <div className="space-y-3 mb-8">
          {sortedTodos.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle2 className="w-16 h-16 text-[oklch(0.72_0.12_120)] mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                No tasks yet. Add one to get started!
              </p>
            </div>
          ) : (
            sortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={updateTodo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>

        {/* Footer Actions */}
        {completedCount > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={clearCompleted}
              variant="outline"
              className="rounded-full border-2 border-[oklch(0.92_0.01_70)] hover:bg-red-50 text-red-600 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Completed ({completedCount})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
