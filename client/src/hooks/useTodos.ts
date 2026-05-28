import { useEffect, useState } from 'react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type DueDateStatus = 'overdue' | 'urgent' | 'warning' | 'normal';

export function getDueDateStatus(dueDate?: Date): DueDateStatus {
  if (!dueDate) return 'normal';
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const daysUntil = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntil < 0) return 'overdue';
  if (daysUntil === 0) return 'urgent';
  if (daysUntil <= 2) return 'warning';
  return 'normal';
}

export function getDaysUntil(dueDate?: Date): number | null {
  if (!dueDate) return null;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const STORAGE_KEY = 'todos';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTodos(parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        })));
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  const addTodo = (text: string, dueDate?: Date) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos([newTodo, ...todos]);
    return newTodo;
  };

  const updateTodo = (id: string, text: string, dueDate?: Date) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, text, dueDate, updatedAt: new Date() }
        : todo
    ));
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const getSortedTodos = () => {
    return [...todos].sort((a, b) => {
      // Incomplete tasks first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Tasks with due dates come first
      if ((a.dueDate ? 1 : 0) !== (b.dueDate ? 1 : 0)) {
        return (b.dueDate ? 1 : 0) - (a.dueDate ? 1 : 0);
      }
      
      // Sort by due date (earliest first)
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      
      // Sort by creation date (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  };

  return {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    getSortedTodos,
  };
}
