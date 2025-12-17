import { ThemeSwitcher } from "./components/kibo-ui/theme-switcher";
import TodoApp from "./components/todo/todo-app";
import { ThemeProvider } from "./context/theme-provider";

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <section className="fixed top-6 right-8 z-50">
        <ThemeSwitcher className="scale-120" />
      </section>
      <section className="flex h-screen w-screen items-start justify-center">
        <TodoApp className="mt-32" />
      </section>
    </ThemeProvider>
  );
}

export default App;
