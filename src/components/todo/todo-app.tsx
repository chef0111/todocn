import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import {
  clearSelectedTodos,
  createTodo,
  deleteTodo,
  editTodo,
  filterTodo,
  loadTodos,
  saveTodos,
  type TodoFilter,
} from "@/services/todo";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { type Todo, TodoForm, TodoTable, TodoTabs } from "./";

interface TodoAppProps {
  className?: string;
}

const TodoApp = ({ className }: TodoAppProps) => {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionResetKey, setSelectionResetKey] = useState(0);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const handleCreate = (name: string) => {
    setTodos((prev) => createTodo(prev, name));
  };

  const handleEdit = (todo: Todo) => {
    const nextName = window.prompt("Edit todo", todo.name);
    if (nextName === null) return;
    setTodos((prev) => editTodo(prev, todo.id, { name: nextName }));
  };

  const handleDelete = (todoId: string) => {
    setTodos((prev) => deleteTodo(prev, todoId));
  };

  const handleStatusChange = (todoId: string, status: Todo["status"]) => {
    setTodos((prev) => editTodo(prev, todoId, { status }));
  };

  const handleClearSelected = () => {
    if (selectedIds.length === 0) return;
    setTodos((prev) => clearSelectedTodos(prev, selectedIds));
    setSelectedIds([]);
    setSelectionResetKey((key) => key + 1);
  };

  const visibleTodos = useMemo(
    () => filterTodo(todos, filter),
    [todos, filter]
  );

  return (
    <Card className={cn("w-[80vw] max-w-xl md:w-[60vw] xl:w-full", className)}>
      <CardHeader className="text-center">
        <CardTitle className="font-bold lg:text-2xl">Todo List</CardTitle>
        <CardDescription>Manage your todos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TodoForm onCreate={handleCreate} existingTodos={todos} />
        <TodoTabs value={filter} onValueChange={setFilter} />
        <TodoTable
          data={visibleTodos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onSelectionChange={setSelectedIds}
          selectionResetKey={selectionResetKey}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-muted-foreground px-1 text-[16px]">
          {visibleTodos.length} {visibleTodos.length === 1 ? "todo" : "todos"}
        </span>
        <Button
          variant="destructive"
          onClick={handleClearSelected}
          disabled={selectedIds.length === 0}
        >
          Clear selected
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TodoApp;
