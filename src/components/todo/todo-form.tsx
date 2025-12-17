import { zodResolver } from "@hookform/resolvers/zod";
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
  existingTodos: Todo[];
};

const TodoForm = ({ onCreate, existingTodos }: TodoFormProps) => {
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = (data: TodoFormValues) => {
    const normalized = data.content.trim().toLowerCase();
    const todoExisted = existingTodos.some(
      (todo) => todo.name.trim().toLowerCase() === normalized
    );

    if (todoExisted) {
      form.setError("content", {
        type: "manual",
        message: "Todo already exists",
      });
      return;
    }

    onCreate(data.content);
    form.reset();
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
                placeholder="Add a new todo"
                aria-invalid={fieldState.invalid}
                className="grow"
              />
              <Button type="submit">Add</Button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
};
export default TodoForm;
