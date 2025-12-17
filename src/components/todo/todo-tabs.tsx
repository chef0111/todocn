import type { TodoFilter } from "@/services/todo";

import { AnimatedTab } from "../ui/animated-tab";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

type TodoTabsProps = {
  value: TodoFilter;
  onValueChange: (value: TodoFilter) => void;
};

const TodoTabs = ({ value, onValueChange }: TodoTabsProps) => {
  return (
    <Tabs
      value={value}
      defaultValue={tabs[0].value}
      onValueChange={onValueChange}
      className="mt-6 w-full"
    >
      <TabsList className="w-full">
        <AnimatedTab
          defaultValue={tabs[0].value}
          value={value}
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.3,
          }}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              data-id={tab.value}
              className="data-active:border-transparent! data-active:bg-transparent! data-active:shadow-none!"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </AnimatedTab>
      </TabsList>
    </Tabs>
  );
};

export default TodoTabs;
