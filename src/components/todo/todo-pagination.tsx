"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type TodoPaginationProps = {
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  selectedCount: number;
  totalCount: number;
};

const TodoPagination = ({
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  selectedCount,
  totalCount,
}: TodoPaginationProps) => {
  return (
    <div className="mt-3 flex flex-col items-center">
      {selectedCount > 0 && (
        <div className="text-muted-foreground mr-1 w-full text-right text-sm">
          {selectedCount} of {totalCount} {totalCount === 1 ? "todo" : "todos"}{" "}
          selected
        </div>
      )}
      <Pagination className="w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault();
                if (canPreviousPage) {
                  onPreviousPage();
                }
              }}
              className={cn(
                !canPreviousPage && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault();
                if (canNextPage) {
                  onNextPage();
                }
              }}
              className={cn(!canNextPage && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TodoPagination;
