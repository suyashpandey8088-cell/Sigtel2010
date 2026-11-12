"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "sigtel:theme";
const DEFAULT_THEME: Theme = "light";

interface ThemeApi {
  /** the theme actually in effect */
  theme: Theme;
  /** the visitor's own choice, which a forced route does not overwrite */
  preferred: Theme;
  /** false until storage has been read */
  resolved: boolean;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  /** pin a route to one theme without changing the stored preference */
  forceTheme: (theme: Theme | null) => void;
}

const ThemeContext = createContext<ThemeApi>({
  theme: DEFAULT_THEME,
  preferred: DEFAULT_THEME,
  resolved: false,
  setTheme: () => {},
  toggle: () => {},
  forceTheme: () => {},
});

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

/**
 * Theme state shared by the header toggle and the route gates.
 *
 * The attribute on <html> is set by an inline script in the root layout before
 * first paint (no flash of the wrong theme), so this provider only has to keep
 * React's view of the value in sync and write choices back to storage.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preferred, setPreferred] = useState<Theme>(DEFAULT_THEME);
  const [forced, setForced] = useState<Theme | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const current = document.documentElement.dataset.theme;
    setPreferred(
      stored === "dark" || stored === "light"
        ? stored
        : current === "dark"
          ? "dark"
          : DEFAULT_THEME,
    );
    setResolved(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setPreferred(next);
    setForced(null);
    apply(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // private mode — the choice simply does not persist
    }
  }, []);

  const forceTheme = useCallback((next: Theme | null) => {
    setForced(next);
  }, []);

  const theme = forced ?? preferred;

  useEffect(() => {
    apply(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, preferred, resolved, setTheme, toggle, forceTheme }),
    [theme, preferred, resolved, setTheme, toggle, forceTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * The pre-paint script, inlined in the root layout. Runs before the first
 * frame so there is never a flash of the wrong theme, and works with the
 * client bundle blocked.
 */
export const themeScript = `(function(){try{
  var stored = localStorage.getItem("${STORAGE_KEY}");
  var theme = stored === "dark" || stored === "light" ? stored : "${DEFAULT_THEME}";
  var root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}catch(e){document.documentElement.dataset.theme="${DEFAULT_THEME}";}})();`;
