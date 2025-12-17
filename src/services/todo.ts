import type { Todo } from "@/components/todo";

export type TodoStatus = Todo["status"];
export type TodoFilter = "all" | TodoStatus;

const TODO_STORAGE_KEY = "todocn.todos";

function isBrowser() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID() as string;
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createTodo(todos: Todo[], name: string): Todo[] {
  const trimmed = name.trim();
  if (!trimmed) return todos;

  const normalized = trimmed.toLowerCase();
  const todoExisted = todos.some(
    (todo) => todo.name.trim().toLowerCase() === normalized
  );
  if (todoExisted) return todos;

  const nextTodo: Todo = {
    id: generateId(),
    name: trimmed,
    status: "pending",
  };

  return [nextTodo, ...todos];
}

export function editTodo(
  todos: Todo[],
  id: string,
  updates: Partial<Pick<Todo, "name" | "status">>
): Todo[] {
  return todos.map((todo) =>
    todo.id === id
      ? {
          ...todo,
          ...updates,
          name: updates.name !== undefined ? updates.name.trim() : todo.name,
        }
      : todo
  );
}

export function deleteTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter((todo) => todo.id !== id);
}

export function filterTodo(todos: Todo[], filter: TodoFilter): Todo[] {
  if (filter === "all") return todos;
  return todos.filter((todo) => todo.status === filter);
}

export function loadTodos(): Todo[] {
  if (!isBrowser()) return [];

  const stored = window.localStorage.getItem(TODO_STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as Todo[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

export function clearSelectedTodos(
  todos: Todo[],
  selectedIds: string[]
): Todo[] {
  if (!selectedIds.length) return todos;
  const selectedSet = new Set(selectedIds);
  return todos.filter((todo) => !selectedSet.has(todo.id));
}
