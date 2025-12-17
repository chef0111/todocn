import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import type { Todo } from "./";

const TodoSchema = z.object({
  content: z
    .string()
    .min(1)
    .max(50, { message: "Todo must be less than 50 characters" }),
});

type TodoFormValues = z.infer<typeof TodoSchema>;

type TodoFormProps = {
  onCreate: (name: string) => void;
  onEdit: (id: string, name: string) => void;
  onCancelEdit: () => void;
  existingTodos: Todo[];
  editingTodo: Todo | null;
};

const TodoForm = ({
  onCreate,
  onEdit,
  onCancelEdit,
  existingTodos,
  editingTodo,
}: TodoFormProps) => {
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      content: "",
    },
  });

  const isEditing = !!editingTodo;

  useEffect(() => {
    if (editingTodo) {
      form.reset({ content: editingTodo.name });
    } else {
      form.reset({ content: "" });
    }
  }, [editingTodo, form]);

  const handleSubmit = (data: TodoFormValues) => {
    const normalized = data.content.trim().toLowerCase();
    const todoExisted = existingTodos.some(
      (todo) =>
        todo.name.trim().toLowerCase() === normalized &&
        (!editingTodo || todo.id !== editingTodo.id)
    );

    if (todoExisted) {
      form.setError("content", {
        type: "manual",
        message: "Todo already exists",
      });
      return;
    }

    if (isEditing && editingTodo) {
      onEdit(editingTodo.id, data.content);
      form.reset({ content: "" });
      return;
    }

    onCreate(data.content);
    form.reset();
  };

  const handleCancel = () => {
    form.reset({ content: "" });
    onCancelEdit();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        control={form.control}
        name="content"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <Input
                {...field}
                type="text"
                placeholder={isEditing ? "Edit todo" : "Add a new todo"}
                aria-invalid={fieldState.invalid}
                className="grow"
              />
              <div className="flex items-center gap-2">
                {isEditing && (
                  <Button type="button" variant="ghost" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
                <Button type="submit">{isEditing ? "Save" : "Add"}</Button>
              </div>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
};
export default TodoForm;
