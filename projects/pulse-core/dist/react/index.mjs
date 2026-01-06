import {
  PulseTerminal
} from "../chunk-K3LBWEWX.mjs";
import "../chunk-25L2WE4L.mjs";
import "../chunk-6MO5RI4U.mjs";
import "../chunk-E2RYDWUH.mjs";

// src/react/PulseTerminal.tsx
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
  forwardRef
} from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var PulseRegistryContext = createContext(null);
function usePulseRegistry() {
  return useContext(PulseRegistryContext);
}
var PulseTerminal2 = forwardRef(function PulseTerminal3({
  prompt,
  welcome,
  maxOutputs,
  theme,
  customTheme,
  commands,
  onReady,
  children,
  className,
  style
}, forwardedRef) {
  const internalRef = useRef(null);
  const [registry, setRegistry] = useState(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const commandsRef = useRef(commands);
  commandsRef.current = commands;
  const customThemeNameRef = useRef(null);
  useEffect(() => {
    if (!customTheme) return;
    const themeName = `__react_custom_${Math.random().toString(36).slice(2)}`;
    PulseTerminal.registerTheme(themeName, customTheme);
    customThemeNameRef.current = themeName;
    const terminal = internalRef.current;
    if (terminal?.setTheme) {
      terminal.setTheme(themeName);
    }
    return () => {
      if (customThemeNameRef.current) {
        PulseTerminal.unregisterTheme(customThemeNameRef.current);
      }
    };
  }, [customTheme]);
  useEffect(() => {
    const terminal = internalRef.current;
    if (!terminal) return;
    const handleReady = () => {
      const reg = terminal.registry;
      if (!reg) return;
      if (commandsRef.current) {
        for (const def of commandsRef.current) {
          const cmd = reg.addCommand(
            def.command,
            def.description,
            def.category ?? "general"
          );
          if (def.options) {
            for (const opt of def.options) {
              cmd.option(opt.flags, opt.description);
            }
          }
          cmd.action(def.action);
        }
      }
      setRegistry(reg);
      if (onReadyRef.current) {
        onReadyRef.current(reg);
      }
    };
    terminal.addEventListener("ready", handleReady);
    if (terminal.registry) {
      handleReady();
    }
    return () => {
      terminal.removeEventListener("ready", handleReady);
    };
  }, []);
  const setRefs = useCallback(
    (element) => {
      internalRef.current = element;
      if (typeof forwardedRef === "function") {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    },
    [forwardedRef]
  );
  return /* @__PURE__ */ jsxs(PulseRegistryContext.Provider, { value: registry, children: [
    /* @__PURE__ */ jsx(
      "pulse-terminal",
      {
        ref: setRefs,
        prompt,
        welcome,
        "max-outputs": maxOutputs,
        theme: customTheme ? customThemeNameRef.current ?? void 0 : theme,
        className,
        style
      }
    ),
    children
  ] });
});
function usePulseTerminal(options = {}) {
  const terminalRef = useRef(null);
  const [registry, setRegistry] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;
    const handleReady = () => {
      const reg = terminal.registry;
      if (!reg) return;
      setRegistry(reg);
      setIsReady(true);
      if (optionsRef.current.onReady) {
        optionsRef.current.onReady(reg);
      }
    };
    terminal.addEventListener("ready", handleReady);
    if (terminal.registry) {
      handleReady();
    }
    return () => {
      terminal.removeEventListener("ready", handleReady);
    };
  }, []);
  const addCommand = useCallback(
    (commandString, description, category = "general") => {
      if (registry) {
        return registry.addCommand(commandString, description, category);
      }
      return null;
    },
    [registry]
  );
  return {
    terminalRef,
    registry,
    isReady,
    addCommand
  };
}

// src/react/index.ts
function registerTheme(name, theme) {
  PulseTerminal.registerTheme(name, theme);
}
function unregisterTheme(name) {
  return PulseTerminal.unregisterTheme(name);
}
function getThemeNames() {
  return PulseTerminal.getThemeNames();
}
export {
  PulseTerminal2 as PulseTerminal,
  PulseTerminal as PulseTerminalElement,
  PulseTerminal as _PulseTerminalClass,
  getThemeNames,
  registerTheme,
  unregisterTheme,
  usePulseRegistry,
  usePulseTerminal
};
