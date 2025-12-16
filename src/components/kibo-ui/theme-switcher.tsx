"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTheme } from "@/context/theme-provider";

const themes = [
  {
    key: "system",
    icon: Monitor,
    label: "System theme",
  },
  {
    key: "light",
    icon: Sun,
    label: "Light theme",
  },
  {
    key: "dark",
    icon: Moon,
    label: "Dark theme",
  },
];

export type ThemeSwitcherProps = {
  value?: "light" | "dark" | "system";
  onChange?: (theme: "light" | "dark" | "system") => void;
  defaultValue?: "light" | "dark" | "system";
  className?: string;
};

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-background ring-border relative isolate flex h-8 rounded-full p-1 ring-1",
        className
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <Button
            aria-label={label}
            variant="ghost"
            className="relative h-6 w-6 rounded-full"
            key={key}
            onClick={() => setTheme(key as "light" | "dark" | "system")}
          >
            {isActive && (
              <motion.div
                className="bg-secondary absolute inset-0 rounded-full border"
                layoutId="activeTheme"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <Icon
              className={cn(
                "relative z-10 m-auto h-4 w-4",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </Button>
        );
      })}
    </div>
  );
};
