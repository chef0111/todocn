"use client";

import { AnimatePresence, motion, type Transition } from "motion/react";
import { Children, cloneElement, type ReactElement, useId } from "react";

import { cn } from "@/lib/utils";

export type AnimatedTabProps = {
  children:
    | ReactElement<{ "data-id": string }>[]
    | ReactElement<{ "data-id": string }>;
  defaultValue?: string;
  value?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
};

const defaultTransition: Transition = {
  type: "spring",
  bounce: 0.2,
  duration: 0.3,
};

export function AnimatedTab({
  children,
  value,
  onValueChange,
  className,
  transition = defaultTransition,
  enableHover = false,
}: AnimatedTabProps) {
  const uniqueId = useId();
  const activeId = value ?? null;

  const handleSetActiveId = (id: string | null) => {
    if (onValueChange) {
      onValueChange(id);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Children.map(children, (child: any, index) => {
    const id = child.props["data-id"] ?? child.props.value;
    const isActive = activeId === id;

    const interactionProps = enableHover
      ? {
          onMouseEnter: () => handleSetActiveId(id),
          onMouseLeave: () => handleSetActiveId(null),
        }
      : {};

    return cloneElement(
      child,
      {
        key: id ?? index,
        className: cn("relative inline-flex", child.props.className),
        "data-checked": isActive ? "true" : "false",
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              layoutId={`background-${uniqueId}`}
              className={cn(
                "absolute inset-0 z-0 rounded-md",
                "bg-background dark:bg-input/30",
                "border-input border",
                "shadow-sm",
                "group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:bg-transparent",
                "group-data-[variant=line]/tabs-list:shadow-none",
                className
              )}
              transition={transition}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
        <div className="relative z-1">{child.props.children}</div>
      </>
    );
  });
}
