import { ClipboardList } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyTodo() {
  return (
    <Empty className="p-6">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ClipboardList />
        </EmptyMedia>
        <EmptyTitle>No Todos Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any todos yet. Get started by adding your
          first todo.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
