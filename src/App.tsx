import { ThemeProvider } from "./context/theme-provider";
import { ComponentExample } from "@/components/component-example";
import { ThemeSwitcher } from "./components/kibo-ui/theme-switcher";

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <section className="fixed top-6 right-6 z-50">
        <ThemeSwitcher className="scale-120" />
      </section>
      <ComponentExample />
    </ThemeProvider>
  );
}

export default App;
