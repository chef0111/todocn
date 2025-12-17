"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { EmptyTodo } from "./";

export type Todo = {
  id: string;
  name: string;
  status: "pending" | "completed";
};

const statusLabels: Record<Todo["status"], string> = {
  pending: "Pending",
  completed: "Completed",
};

type TodoTableProps = {
  data: Todo[];
  onEdit?: (todo: Todo) => void;
  onDelete?: (todoId: string) => void;
  onStatusChange?: (todoId: string, status: Todo["status"]) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectionResetKey?: number;
};

const createColumns = (
  onEdit?: (todo: Todo) => void,
  onDelete?: (todoId: string) => void,
  onStatusChange?: (todoId: string, status: Todo["status"]) => void
): ColumnDef<Todo>[] => [
  {
    id: "select",
    header: ({ table }) => {
      const isAllSelected = table.getIsAllPageRowsSelected();
      const isSomeSelected = table.getIsSomePageRowsSelected();
      return (
        <Checkbox
          checked={isAllSelected || (isSomeSelected ? true : false)}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="mr-1 rounded-[5px]"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mr-1 rounded-[5px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="w-60 grow truncate font-medium text-wrap" title={name}>
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const todo = row.original;
      return (
        <Select
          value={todo.status}
          onValueChange={(value) => {
            if (value && value !== null) {
              onStatusChange?.(todo.id, value as Todo["status"]);
            }
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue>{statusLabels[todo.status]}</SelectValue>
          </SelectTrigger>
          <SelectContent side="inline-start" className="w-full min-w-32 p-1">
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const todo = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit?.(todo)}
            className="group rounded-lg hover:bg-blue-500/20! active:scale-90"
            aria-label="Edit todo"
          >
            <Edit className="size-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete?.(todo.id)}
            className="group hover:bg-destructive/20! rounded-lg active:scale-90"
            aria-label="Delete todo"
          >
            <Trash2 className="text-destructive size-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function TodoTable({
  data,
  onEdit,
  onDelete,
  onStatusChange,
  onSelectionChange,
  selectionResetKey,
}: TodoTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(
    () => createColumns(onEdit, onDelete, onStatusChange),
    [onEdit, onDelete, onStatusChange]
  );

  const memoizedData = useMemo(() => data, [data]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: memoizedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    if (selectionResetKey === undefined) return;
    setRowSelection({});
  }, [selectionResetKey]);

  useEffect(() => {
    if (!onSelectionChange) return;

    const selectedRows = table.getSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original.id);
    onSelectionChange(ids);
  }, [onSelectionChange, rowSelection, table]);

  const selectedTodosCount = table.getFilteredRowModel().rows.length;
  const selectedFilteredTodosCount =
    table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const nameColumn = header.column.id === "name";
                  const statusColumn = header.column.id === "status";
                  const actionsColumn = header.column.id === "actions";
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "font-bold",
                        nameColumn && "w-68 grow",
                        statusColumn && "w-37.5",
                        actionsColumn && "w-22.5"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <EmptyTodo />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedFilteredTodosCount > 0 && (
        <div className="text-muted-foreground flex items-center justify-end space-x-2 pt-2 text-sm">
          {selectedFilteredTodosCount} of {selectedTodosCount}{" "}
          {selectedTodosCount === 1 ? "todo" : "todos"} selected
        </div>
      )}
    </div>
  );
}
