/**
 * React integration for PulseTerminal
 *
 * @example
 * // Declarative commands array (recommended)
 * import { PulseTerminal } from '@b3008/pulse-cli-core/react';
 *
 * function App() {
 *   return (
 *     <PulseTerminal
 *       prompt="$"
 *       commands={[
 *         {
 *           command: 'hello',
 *           description: 'Say hello',
 *           category: 'demo',
 *           action: (args, cmd, resolve) => resolve('Hello!'),
 *         },
 *         {
 *           command: 'greet <name>',
 *           description: 'Greet someone',
 *           category: 'demo',
 *           options: [{ flags: '-l, --loud', description: 'Shout' }],
 *           action: (args, cmd, resolve) => {
 *             let msg = `Hello, ${args.name}!`;
 *             if (args.options.loud) msg = msg.toUpperCase();
 *             resolve(msg);
 *           },
 *         },
 *       ]}
 *     />
 *   );
 * }
 */

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
} from "react";
import type { CommandRegistry } from "../core/CommandRegistry";
import type { Command, CommandCallback } from "../core/types";
import type { PulseTheme, ThemePreset } from "../components/BaseComponent";
import { PulseTerminal as PulseTerminalElement } from "../components/PulseTerminal";

// ============================================================================
// Types
// ============================================================================

/**
 * Option definition for a command
 */
export interface OptionDefinition {
  /** Flag definition (e.g., '-l, --loud' or '--name <value>') */
  flags: string;
  /** Description of the option */
  description: string;
}

/**
 * Declarative command definition
 */
export interface CommandDefinition {
  /** Command name and positional args (e.g., 'greet <name>' or 'add <a> <b>') */
  command: string;
  /** Human-readable description */
  description: string;
  /** Category for grouping (default: 'general') */
  category?: string;
  /** Command options/flags */
  options?: OptionDefinition[];
  /** Action handler */
  action: CommandCallback;
}

// ============================================================================
// Context
// ============================================================================

const PulseRegistryContext = createContext<CommandRegistry | null>(null);

/**
 * Hook to access the CommandRegistry from within a PulseTerminal component.
 * Returns null until the terminal is ready.
 *
 * @example
 * function MyCommands() {
 *   const registry = usePulseRegistry();
 *
 *   useEffect(() => {
 *     if (registry) {
 *       registry.addCommand('hello', 'Say hello', 'demo')
 *         .action((args, cmd, resolve) => resolve('Hello!'));
 *     }
 *   }, [registry]);
 *
 *   return null;
 * }
 */
export function usePulseRegistry(): CommandRegistry | null {
  return useContext(PulseRegistryContext);
}

// ============================================================================
// PulseTerminal Component
// ============================================================================

/**
 * Props for the PulseTerminal React component
 */
export interface PulseTerminalProps {
  /** Command prompt string */
  prompt?: string;
  /** Welcome message displayed on load */
  welcome?: string;
  /** Maximum number of output panels to keep */
  maxOutputs?: number;
  /** Theme name (built-in: 'dark', 'light', 'high-contrast', 'primal', or custom registered) */
  theme?: ThemePreset | (string & {});
  /** Custom theme object (takes precedence over theme name) */
  customTheme?: Partial<PulseTheme>;
  /** Declarative array of commands to register */
  commands?: CommandDefinition[];
  /** Callback fired when the terminal is ready (after commands are registered) */
  onReady?: (registry: CommandRegistry) => void;
  /** Child components (can use usePulseRegistry hook) */
  children?: ReactNode;
  /** Additional class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * React component wrapper for pulse-terminal web component.
 *
 * Handles all ref management internally and provides the registry
 * via context to child components.
 *
 * @example
 * // Declarative commands (recommended)
 * <PulseTerminal
 *   prompt="$"
 *   welcome="Welcome!"
 *   commands={[
 *     {
 *       command: 'hello',
 *       description: 'Say hello',
 *       action: (args, cmd, resolve) => resolve('Hello!'),
 *     },
 *     {
 *       command: 'greet <name>',
 *       description: 'Greet someone',
 *       category: 'demo',
 *       options: [{ flags: '-l, --loud', description: 'Shout' }],
 *       action: (args, cmd, resolve) => resolve(`Hello, ${args.name}!`),
 *     },
 *   ]}
 * />
 */
export const PulseTerminal = forwardRef<
  HTMLElement & { registry: CommandRegistry },
  PulseTerminalProps
>(function PulseTerminal(
  {
    prompt,
    welcome,
    maxOutputs,
    theme,
    customTheme,
    commands,
    onReady,
    children,
    className,
    style,
  },
  forwardedRef
) {
  const internalRef = useRef<HTMLElement & { registry: CommandRegistry }>(null);
  const [registry, setRegistry] = useState<CommandRegistry | null>(null);

  // Store callbacks in refs to avoid re-running effect
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const commandsRef = useRef(commands);
  commandsRef.current = commands;

  // Register custom theme if provided
  const customThemeNameRef = useRef<string | null>(null);
  useEffect(() => {
    if (!customTheme) return;

    // Generate unique theme name for this instance
    const themeName = `__react_custom_${Math.random().toString(36).slice(2)}`;
    PulseTerminalElement.registerTheme(themeName, customTheme);
    customThemeNameRef.current = themeName;

    // Apply theme to terminal
    const terminal = internalRef.current as HTMLElement & {
      setTheme?: (name: string) => void;
    };
    if (terminal?.setTheme) {
      terminal.setTheme(themeName);
    }

    return () => {
      // Cleanup: unregister theme on unmount
      if (customThemeNameRef.current) {
        PulseTerminalElement.unregisterTheme(customThemeNameRef.current);
      }
    };
  }, [customTheme]);

  useEffect(() => {
    const terminal = internalRef.current;
    if (!terminal) return;

    const handleReady = () => {
      const reg = terminal.registry;
      if (!reg) return;

      // Register declarative commands
      if (commandsRef.current) {
        for (const def of commandsRef.current) {
          const cmd = reg.addCommand(
            def.command,
            def.description,
            def.category ?? "general"
          );

          // Add options if defined
          if (def.options) {
            for (const opt of def.options) {
              cmd.option(opt.flags, opt.description);
            }
          }

          // Set action
          cmd.action(def.action);
        }
      }

      setRegistry(reg);

      // Call onReady after commands are registered
      if (onReadyRef.current) {
        onReadyRef.current(reg);
      }
    };

    terminal.addEventListener("ready", handleReady);

    // Check if already ready
    if (terminal.registry) {
      handleReady();
    }

    return () => {
      terminal.removeEventListener("ready", handleReady);
    };
  }, []);

  // Merge refs if forwardedRef is provided
  const setRefs = useCallback(
    (element: (HTMLElement & { registry: CommandRegistry }) | null) => {
      (internalRef as React.MutableRefObject<typeof element>).current = element;

      if (typeof forwardedRef === "function") {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    },
    [forwardedRef]
  );

  return (
    <PulseRegistryContext.Provider value={registry}>
      <pulse-terminal
        ref={setRefs}
        prompt={prompt}
        welcome={welcome}
        max-outputs={maxOutputs}
        theme={customTheme ? customThemeNameRef.current ?? undefined : theme}
        className={className}
        style={style}
      />
      {children}
    </PulseRegistryContext.Provider>
  );
});

// ============================================================================
// usePulseTerminal Hook (for advanced use cases)
// ============================================================================

/**
 * Options for usePulseTerminal hook
 */
export interface UsePulseTerminalOptions {
  /**
   * Callback fired when the terminal is ready.
   * Use this to register commands or perform other setup.
   */
  onReady?: (registry: CommandRegistry) => void;
}

/**
 * Return type for usePulseTerminal hook
 */
export interface UsePulseTerminalResult {
  /**
   * Ref to attach to the pulse-terminal element
   */
  terminalRef: React.RefObject<HTMLElement & { registry: CommandRegistry }>;

  /**
   * The command registry instance (null until ready)
   */
  registry: CommandRegistry | null;

  /**
   * Whether the terminal is ready
   */
  isReady: boolean;

  /**
   * Add a new command using the fluent API.
   * Returns null if called before the terminal is ready.
   */
  addCommand: (
    commandString: string,
    description: string,
    category?: string
  ) => Command | null;
}

/**
 * React hook for integrating with PulseTerminal (advanced use cases).
 *
 * For most cases, prefer using the `<PulseTerminal>` component instead.
 * This hook is useful when you need direct control over the terminal element.
 *
 * @param options - Configuration options
 * @returns Terminal ref, registry, and helper functions
 *
 * @example
 * const { terminalRef, isReady, addCommand } = usePulseTerminal({
 *   onReady: (registry) => {
 *     registry.addCommand('greet <name>', 'Greet someone', 'demo')
 *       .action((args, cmd, resolve) => resolve(`Hello, ${args.name}!`));
 *   }
 * });
 *
 * return <pulse-terminal ref={terminalRef} />;
 */
export function usePulseTerminal(
  options: UsePulseTerminalOptions = {}
): UsePulseTerminalResult {
  const terminalRef = useRef<HTMLElement & { registry: CommandRegistry }>(null);
  const [registry, setRegistry] = useState<CommandRegistry | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Store options in ref to avoid re-running effect on every render
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

      // Call onReady callback
      if (optionsRef.current.onReady) {
        optionsRef.current.onReady(reg);
      }
    };

    // Listen for ready event
    terminal.addEventListener("ready", handleReady);

    // Check if already ready (component might have mounted after terminal initialized)
    if (terminal.registry) {
      handleReady();
    }

    return () => {
      terminal.removeEventListener("ready", handleReady);
    };
  }, []);

  /**
   * Add a command using the fluent API
   */
  const addCommand = useCallback(
    (
      commandString: string,
      description: string,
      category: string = "general"
    ): Command | null => {
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
    addCommand,
  };
}
