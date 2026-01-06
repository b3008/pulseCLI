import { C as Command, O as Option, a as CommandCallback, S as StorageAdapter, P as PulseBaseComponent, b as CommandRegistry } from './PulseTerminal-DknUlsPt.mjs';
export { h as CommandEvent, e as CommandHistory, j as CommandHistoryInterface, f as CommandHistoryOptions, n as CommandOutputEvents, d as CommandParser, i as CommandRegistryInterface, c as CommandRegistryOptions, E as ExecuteOptions, o as PULSE_CSS_VARS, u as PULSE_THEMES, g as ParseResult, m as PulseCommandOutput, k as PulseTerminal, l as PulseTerminalEvents, w as PulseTheme, T as ThemePreset, U as UnknownCommandCallback, q as darkTheme, p as getBaseStyles, s as highContrastTheme, r as lightTheme, t as primalTheme, v as themeToCSS } from './PulseTerminal-DknUlsPt.mjs';

/**
 * Represents a CLI command with positional arguments, options, and an action
 *
 * @example
 * const cmd = new PulseCommand('greet <name> [greeting]', 'Greet someone', 'utils')
 *   .option('-l, --loud', 'Use uppercase')
 *   .option('-t, --times <count>', 'Repeat count')
 *   .action((args, cmdString, resolve, reject) => {
 *     const greeting = args.greeting || 'Hello';
 *     let message = `${greeting}, ${args.name}!`;
 *     if (args.options.loud) message = message.toUpperCase();
 *     resolve(message);
 *   });
 */
declare class PulseCommand implements Command {
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly positionalArgs: string[];
    readonly options: Option[];
    private callback;
    private readonly commandString;
    constructor(commandString: string, description: string, category?: string);
    /**
     * Find the index where positional arguments begin
     */
    private findFirstArgIndex;
    /**
     * Add an option/flag to this command
     *
     * @param flags - Option flags (e.g., '-v, --verbose' or '-o, --output <file>')
     * @param description - Description of the option
     * @returns this for method chaining
     */
    option(flags: string, description: string): this;
    /**
     * Set the action callback for this command
     *
     * @param callback - Function to execute when command is invoked
     * @returns this for method chaining
     */
    action(callback: CommandCallback): this;
    /**
     * Execute this command with the given arguments
     *
     * @param args - Parsed arguments including positional args and options
     * @param commandString - The original command string
     * @returns Promise that resolves with the command result
     */
    execute(args: Record<string, unknown>, commandString: string): Promise<unknown>;
    /**
     * Get a usage example string for this command
     */
    getUsageExample(): string;
    /**
     * Get the argument name without brackets
     */
    getArgName(arg: string): string;
    /**
     * Check if an argument is required (uses < >)
     */
    isArgRequired(arg: string): boolean;
    /**
     * Convert to a human-readable string
     */
    toString(): string;
}

/**
 * Represents a command-line option/flag
 *
 * @example
 * // Boolean flag
 * new CommandOption('-v, --verbose', 'Enable verbose output')
 *
 * // Option with required value
 * new CommandOption('-o, --output <file>', 'Output file path')
 *
 * // Option with optional value
 * new CommandOption('-c, --config [path]', 'Config file path')
 */
declare class CommandOption implements Option {
    readonly flags: string;
    readonly short: string | null;
    readonly long: string | null;
    readonly description: string;
    readonly required: boolean;
    readonly optional: boolean;
    readonly isBoolean: boolean;
    constructor(flags: string, description: string);
    /**
     * Get the canonical name of this option (without dashes)
     */
    name(): string;
    /**
     * Check if the given argument matches this option
     */
    matches(arg: string): boolean;
    /**
     * Convert to a human-readable string representation
     */
    toString(): string;
}

/**
 * In-memory storage adapter for environments without localStorage
 */
declare class MemoryStorageAdapter implements StorageAdapter {
    private store;
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): void;
}
/**
 * localStorage-based storage adapter for browser environments
 */
declare class LocalStorageAdapter implements StorageAdapter {
    private readonly prefix;
    constructor(prefix?: string);
    private getKey;
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}
/**
 * sessionStorage-based storage adapter for browser environments
 */
declare class SessionStorageAdapter implements StorageAdapter {
    private readonly prefix;
    constructor(prefix?: string);
    private getKey;
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}
/**
 * Automatically select the best available storage adapter
 */
declare function createStorageAdapter(prefix?: string): StorageAdapter;

/**
 * Events emitted by pulse-command-line
 */
interface CommandLineEvents {
    /** Emitted when a command is submitted */
    'pulse-submit': {
        command: string;
    };
    /** Emitted when input value changes */
    'pulse-change': {
        value: string;
    };
    /** Emitted when autocomplete suggestions are available */
    'pulse-suggestions': {
        suggestions: string[];
    };
}
/**
 * Command line input component
 *
 * @element pulse-command-line
 *
 * @attr {string} prompt - The prompt symbol (default: '>')
 * @attr {string} placeholder - Input placeholder text
 * @attr {boolean} disabled - Whether input is disabled
 * @attr {boolean} autofocus - Whether to focus on mount
 *
 * @fires pulse-submit - When command is submitted (Enter)
 * @fires pulse-change - When input value changes
 * @fires pulse-suggestions - When autocomplete suggestions change
 *
 * @example
 * <pulse-command-line
 *   prompt="$"
 *   placeholder="Type a command..."
 *   autofocus
 * ></pulse-command-line>
 */
declare class PulseCommandLine extends PulseBaseComponent {
    static get observedAttributes(): string[];
    private input;
    private registry;
    private suggestionIndex;
    private currentSuggestions;
    /**
     * Connect this command line to a registry for autocomplete
     */
    setRegistry(registry: CommandRegistry): void;
    /**
     * Get the current input value
     */
    get value(): string;
    /**
     * Set the input value
     */
    set value(val: string);
    /**
     * Focus the input element
     */
    focus(): void;
    /**
     * Clear the input
     */
    clear(): void;
    protected render(): void;
    protected setupEventListeners(): void;
    private handleKeyDown;
    private handleInput;
    private handleSubmit;
    private navigateHistory;
    private updateSuggestions;
    private handleAutocomplete;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private getStyles;
}

/**
 * Utility helper functions for PulseCLI
 */
/**
 * Escape HTML special characters
 */
declare function escapeHtml(text: string): string;
/**
 * Convert camelCase to kebab-case
 * Handles consecutive uppercase letters (e.g., HTMLElement -> html-element)
 */
declare function camelToKebab(str: string): string;
/**
 * Convert kebab-case to camelCase
 */
declare function kebabToCamel(str: string): string;
/**
 * Debounce a function
 */
declare function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void;
/**
 * Throttle a function
 */
declare function throttle<T extends (...args: unknown[]) => unknown>(fn: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Generate a unique ID
 */
declare function uniqueId(prefix?: string): string;
/**
 * Check if running in a browser environment
 */
declare function isBrowser(): boolean;
/**
 * Check if Custom Elements are supported
 */
declare function supportsCustomElements(): boolean;
/**
 * Wait for a condition to be true
 */
declare function waitFor(condition: () => boolean, timeout?: number, interval?: number): Promise<void>;
/**
 * Format a duration in milliseconds to a human-readable string
 */
declare function formatDuration(ms: number): string;
/**
 * Deep clone an object
 */
declare function deepClone<T>(obj: T): T;

/**
 * PulseCLI Core - Framework-agnostic terminal UI library
 *
 * @packageDocumentation
 *
 * @example
 * // Using with Web Components
 * import '@pulsecli/core';
 *
 * const terminal = document.querySelector('pulse-terminal');
 * terminal.registry.addCommand('hello', 'Say hello', 'demo')
 *   .action((args, cmd, resolve) => resolve('Hello, World!'));
 *
 * @example
 * // Using programmatically (headless)
 * import { CommandRegistry } from '@pulsecli/core';
 *
 * const registry = new CommandRegistry();
 * registry.addCommand('greet <name>', 'Greet someone', 'utils')
 *   .action((args, cmd, resolve) => resolve(`Hello, ${args.name}!`));
 *
 * await registry.executeCommand('greet World');
 */

/**
 * Library version
 */
declare const VERSION = "0.1.0";
/**
 * Define all custom elements
 * Call this to ensure all web components are registered
 */
declare function defineElements(): void;

export { Command, CommandCallback, type CommandLineEvents, CommandOption, CommandRegistry, LocalStorageAdapter, MemoryStorageAdapter, Option, PulseBaseComponent, PulseCommand, PulseCommandLine, SessionStorageAdapter, StorageAdapter, VERSION, camelToKebab, createStorageAdapter, debounce, deepClone, defineElements, escapeHtml, formatDuration, isBrowser, kebabToCamel, supportsCustomElements, throttle, uniqueId, waitFor };
