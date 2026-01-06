import * as react from 'react';
import { ReactNode } from 'react';
import { T as ThemePreset, w as PulseTheme, a as CommandCallback, b as CommandRegistry, C as Command } from '../PulseTerminal-DknUlsPt.js';
export { k as PulseTerminalElement, k as _PulseTerminalClass } from '../PulseTerminal-DknUlsPt.js';

/**
 * Option definition for a command
 */
interface OptionDefinition {
    /** Flag definition (e.g., '-l, --loud' or '--name <value>') */
    flags: string;
    /** Description of the option */
    description: string;
}
/**
 * Declarative command definition
 */
interface CommandDefinition {
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
declare function usePulseRegistry(): CommandRegistry | null;
/**
 * Props for the PulseTerminal React component
 */
interface PulseTerminalProps {
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
declare const PulseTerminal: react.ForwardRefExoticComponent<PulseTerminalProps & react.RefAttributes<HTMLElement & {
    registry: CommandRegistry;
}>>;
/**
 * Options for usePulseTerminal hook
 */
interface UsePulseTerminalOptions {
    /**
     * Callback fired when the terminal is ready.
     * Use this to register commands or perform other setup.
     */
    onReady?: (registry: CommandRegistry) => void;
}
/**
 * Return type for usePulseTerminal hook
 */
interface UsePulseTerminalResult {
    /**
     * Ref to attach to the pulse-terminal element
     */
    terminalRef: React.RefObject<HTMLElement & {
        registry: CommandRegistry;
    }>;
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
    addCommand: (commandString: string, description: string, category?: string) => Command | null;
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
declare function usePulseTerminal(options?: UsePulseTerminalOptions): UsePulseTerminalResult;

/**
 * React integration for PulseCLI
 *
 * @packageDocumentation
 *
 * @example
 * // Declarative commands with theming
 * import { PulseTerminal } from '@b3008/pulse-cli-core/react';
 *
 * function App() {
 *   return (
 *     <PulseTerminal
 *       prompt="$"
 *       theme="dark"
 *       commands={[
 *         {
 *           command: 'hello',
 *           description: 'Say hello',
 *           action: (args, cmd, resolve) => resolve('Hello!'),
 *         },
 *       ]}
 *     />
 *   );
 * }
 *
 * @example
 * // Custom inline theme
 * import { PulseTerminal } from '@b3008/pulse-cli-core/react';
 *
 * function App() {
 *   return (
 *     <PulseTerminal
 *       prompt=">"
 *       customTheme={{
 *         bg: '#1a1a2e',
 *         accent: '#e94560',
 *         text: '#eaeaea',
 *       }}
 *       commands={[...]}
 *     />
 *   );
 * }
 */

declare function registerTheme(name: string, theme: Partial<PulseTheme>): void;
declare function unregisterTheme(name: string): boolean;
declare function getThemeNames(): string[];

export { type CommandDefinition, type OptionDefinition, PulseTerminal, type PulseTerminalProps, PulseTheme, type UsePulseTerminalOptions, type UsePulseTerminalResult, getThemeNames, registerTheme, unregisterTheme, usePulseRegistry, usePulseTerminal };
