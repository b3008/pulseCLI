/**
 * Core type definitions for PulseCLI
 */
/**
 * Callback function type for command execution
 */
type CommandCallback = (args: Record<string, unknown>, commandString: string, resolve: (value?: unknown) => void, reject: (reason?: unknown) => void) => void | Promise<unknown>;
/**
 * Callback for handling unrecognized commands
 */
type UnknownCommandCallback = (commandString: string, resolve: (value?: unknown) => void, reject: (reason?: unknown) => void) => void;
/**
 * Result of parsing a command string
 */
interface ParseResult {
    /** The matched command object, or null if not found */
    command: Command | null;
    /** Parsed positional arguments */
    args: Record<string, unknown>;
    /** Parsed options/flags */
    options: Record<string, unknown>;
    /** The original command string */
    commandString: string;
}
/**
 * Configuration options for command execution
 */
interface ExecuteOptions {
    /** Whether to add this command to history */
    addToHistory?: boolean;
    /** Additional arguments to pass to the command */
    additionalArgs?: Record<string, unknown>;
    /** Additional options to pass to the command */
    additionalOptions?: Record<string, unknown>;
}
/**
 * Event emitted when a command is executed
 */
interface CommandEvent {
    type: 'execute' | 'complete' | 'error';
    command: string;
    result?: unknown;
    error?: Error;
    timestamp: number;
}
/**
 * Storage adapter interface for persistence
 */
interface StorageAdapter {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}
/**
 * Command definition for fluent API
 */
interface Command {
    readonly name: string;
    readonly description: string;
    readonly positionalArgs: string[];
    readonly options: Option[];
    readonly category: string;
    option(flags: string, description: string): Command;
    action(callback: CommandCallback): Command;
    execute(args: Record<string, unknown>, commandString: string): Promise<unknown>;
}
/**
 * Command option/flag definition
 */
interface Option {
    readonly flags: string;
    readonly short: string | null;
    readonly long: string | null;
    readonly description: string;
    readonly required: boolean;
    readonly optional: boolean;
    readonly isBoolean: boolean;
    name(): string;
    matches(arg: string): boolean;
}
/**
 * Command registry interface
 */
interface CommandRegistryInterface {
    addCommand(commandString: string, description: string, category: string): Command;
    parseCommand(commandString: string): ParseResult;
    executeCommand(commandString: string, options?: ExecuteOptions): Promise<unknown>;
    getAutofillSuggestions(partial: string): string[];
    getCommands(): Map<string, Command>;
    getCategories(): Map<string, Command[]>;
    onUnknownCommand(callback: UnknownCommandCallback): void;
}
/**
 * Command history interface
 */
interface CommandHistoryInterface {
    add(command: string): void;
    getPrevious(): string | undefined;
    getNext(): string | undefined;
    getAll(): string[];
    clear(): void;
    readonly length: number;
    readonly currentIndex: number;
}

/**
 * Parses command strings into structured data
 *
 * Handles:
 * - Command name matching
 * - Positional arguments
 * - Short (-v) and long (--verbose) options
 * - Option values (--output file.txt)
 * - Quoted strings ("hello world")
 * - Multiple values for the same option
 */
declare class CommandParser {
    /**
     * Parse a command string against a registry of commands
     *
     * @param commandString - The raw command input
     * @param commands - Map of registered commands
     * @returns ParseResult with matched command and parsed args
     */
    parse(commandString: string, commands: Map<string, Command>): ParseResult;
    /**
     * Create an empty parse result
     */
    private createEmptyResult;
    /**
     * Extract quoted strings and replace with placeholders
     */
    private extractQuotedStrings;
    /**
     * Split command string into command/args portion and options portion
     */
    private splitCommandAndOptions;
    /**
     * Find a matching command from the registry
     */
    private findCommand;
    /**
     * Parse positional arguments
     */
    private parsePositionalArgs;
    /**
     * Parse command options
     */
    private parseOptions;
    /**
     * Restore a quoted string from its placeholder
     */
    private restoreQuotedString;
    /**
     * Get autocomplete suggestions for a partial command
     */
    getAutocompleteSuggestions(partial: string, commands: Map<string, Command>): string[];
}

/**
 * Configuration options for CommandHistory
 */
interface CommandHistoryOptions {
    /** Maximum number of commands to keep in history */
    maxSize?: number;
    /** Storage key for persisting history */
    storageKey?: string;
    /** Custom storage adapter */
    storage?: StorageAdapter;
    /** Whether to persist history */
    persist?: boolean;
}
/**
 * Manages command history with navigation and persistence
 *
 * @example
 * const history = new CommandHistory({ maxSize: 100, persist: true });
 * history.add('help');
 * history.add('list users');
 *
 * console.log(history.getPrevious()); // 'list users'
 * console.log(history.getPrevious()); // 'help'
 * console.log(history.getNext());     // 'list users'
 */
declare class CommandHistory implements CommandHistoryInterface {
    private history;
    private index;
    private readonly maxSize;
    private readonly storageKey;
    private readonly storage;
    private readonly persist;
    constructor(options?: CommandHistoryOptions);
    /**
     * Load history from storage
     */
    private load;
    /**
     * Save history to storage
     */
    private save;
    /**
     * Add a command to history
     *
     * @param command - The command string to add
     */
    add(command: string): void;
    /**
     * Get the previous command in history (navigate up)
     *
     * @returns The previous command or undefined if at the beginning
     */
    getPrevious(): string | undefined;
    /**
     * Get the next command in history (navigate down)
     *
     * @returns The next command or undefined if at the end
     */
    getNext(): string | undefined;
    /**
     * Get all commands in history
     */
    getAll(): string[];
    /**
     * Clear all history
     */
    clear(): void;
    /**
     * Reset navigation index to the end
     */
    resetIndex(): void;
    /**
     * Search history for commands matching a pattern
     *
     * @param pattern - String or RegExp to match
     * @returns Array of matching commands
     */
    search(pattern: string | RegExp): string[];
    /**
     * Get the number of commands in history
     */
    get length(): number;
    /**
     * Get the current navigation index
     */
    get currentIndex(): number;
}

/**
 * Event emitter for command events
 */
type EventHandler = (event: CommandEvent) => void;
/**
 * Configuration options for CommandRegistry
 */
interface CommandRegistryOptions {
    /** Options for command history */
    history?: CommandHistoryOptions;
}
/**
 * Central registry for command management and execution
 *
 * @example
 * const registry = new CommandRegistry();
 *
 * registry.addCommand('greet <name>', 'Greet someone', 'utils')
 *   .option('-l, --loud', 'Use uppercase')
 *   .action((args, cmdStr, resolve) => {
 *     let msg = `Hello, ${args.name}!`;
 *     if (args.options.loud) msg = msg.toUpperCase();
 *     resolve(msg);
 *   });
 *
 * await registry.executeCommand('greet World --loud');
 */
declare class CommandRegistry implements CommandRegistryInterface {
    private commands;
    private categories;
    private unknownCommandHandler;
    private eventHandlers;
    readonly parser: CommandParser;
    readonly history: CommandHistory;
    constructor(options?: CommandRegistryOptions);
    /**
     * Register a new command
     *
     * @param commandString - Command name and positional args (e.g., 'greet <name>')
     * @param description - Human-readable description
     * @param category - Category for grouping commands
     * @returns The created command for chaining
     */
    addCommand(commandString: string, description: string, category?: string): Command;
    /**
     * Remove a command by name
     *
     * @param name - The command name to remove
     * @returns true if command was removed, false if not found
     */
    removeCommand(name: string): boolean;
    /**
     * Parse a command string without executing it
     *
     * @param commandString - The command to parse
     * @returns ParseResult with matched command and arguments
     */
    parseCommand(commandString: string): ParseResult;
    /**
     * Execute a command string
     *
     * @param commandString - The command to execute
     * @param options - Execution options
     * @returns Promise resolving to command result
     */
    executeCommand(commandString: string, options?: ExecuteOptions): Promise<unknown>;
    /**
     * Handle an unknown command
     */
    private handleUnknownCommand;
    /**
     * Get autocomplete suggestions for a partial command
     *
     * @param partial - Partial command input
     * @returns Array of matching command names
     */
    getAutofillSuggestions(partial: string): string[];
    /**
     * Set handler for unknown commands
     *
     * @param callback - Handler function for unknown commands
     */
    onUnknownCommand(callback: UnknownCommandCallback): void;
    /**
     * Get all registered commands
     */
    getCommands(): Map<string, Command>;
    /**
     * Get a specific command by name
     */
    getCommand(name: string): Command | undefined;
    /**
     * Get all categories with their commands
     */
    getCategories(): Map<string, Command[]>;
    /**
     * Check if a command exists
     */
    hasCommand(name: string): boolean;
    /**
     * Subscribe to command events
     *
     * @param type - Event type to listen for
     * @param handler - Event handler function
     * @returns Unsubscribe function
     */
    on(type: CommandEvent['type'], handler: EventHandler): () => void;
    /**
     * Emit a command event
     */
    private emit;
    /**
     * Generate help text for all commands
     */
    generateHelp(): string;
}

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
 * Base class for PulseCLI Web Components
 *
 * Provides common functionality for all components:
 * - Shadow DOM encapsulation
 * - Style injection
 * - Event helper methods
 */
declare abstract class PulseBaseComponent extends HTMLElement {
    protected shadow: ShadowRoot;
    constructor();
    /**
     * Called when element is added to DOM
     */
    connectedCallback(): void;
    /**
     * Called when element is removed from DOM
     */
    disconnectedCallback(): void;
    /**
     * Render the component (must be implemented by subclasses)
     */
    protected abstract render(): void;
    /**
     * Set up event listeners (override in subclasses)
     */
    protected setupEventListeners(): void;
    /**
     * Cleanup when component is removed (override in subclasses)
     */
    protected cleanup(): void;
    /**
     * Create and inject a style element
     */
    protected injectStyles(css: string): void;
    /**
     * Emit a custom event
     */
    protected emit<T>(eventName: string, detail: T): void;
    /**
     * Query an element within shadow DOM
     */
    protected $(selector: string): Element | null;
    /**
     * Query all elements within shadow DOM
     */
    protected $$(selector: string): NodeListOf<Element>;
    /**
     * Get attribute with default value
     */
    protected getAttr(name: string, defaultValue?: string): string;
    /**
     * Get boolean attribute
     */
    protected getBoolAttr(name: string): boolean;
    /**
     * Get numeric attribute
     */
    protected getNumAttr(name: string, defaultValue?: number): number;
}
/**
 * CSS custom properties (CSS variables) used by PulseCLI components
 */
declare const PULSE_CSS_VARS: {
    readonly '--pulse-bg': "#1a1a2e";
    readonly '--pulse-bg-secondary': "#16213e";
    readonly '--pulse-text': "#eee";
    readonly '--pulse-text-muted': "#888";
    readonly '--pulse-accent': "#00d4ff";
    readonly '--pulse-accent-hover': "#00b8e6";
    readonly '--pulse-error': "#ff4757";
    readonly '--pulse-success': "#2ed573";
    readonly '--pulse-warning': "#ffa502";
    readonly '--pulse-border': "#333";
    readonly '--pulse-font-family': "'Fira Code', 'Monaco', 'Consolas', monospace";
    readonly '--pulse-font-size': "14px";
    readonly '--pulse-line-height': "1.5";
    readonly '--pulse-spacing-xs': "4px";
    readonly '--pulse-spacing-sm': "8px";
    readonly '--pulse-spacing-md': "16px";
    readonly '--pulse-spacing-lg': "24px";
    readonly '--pulse-radius': "4px";
    readonly '--pulse-transition': "0.2s ease";
};
/**
 * Generate base CSS with custom properties
 */
declare function getBaseStyles(): string;

/**
 * Events emitted by pulse-command-output
 */
interface CommandOutputEvents {
    /** Emitted when close button is clicked */
    'pulse-close': {
        id: string;
    };
    /** Emitted when header is clicked */
    'pulse-focus': {
        id: string;
    };
    /** Emitted when drag starts */
    'pulse-drag-start': {
        id: string;
        event: MouseEvent;
    };
    /** Emitted when drag ends */
    'pulse-drag-end': {
        id: string;
        event: MouseEvent;
    };
}
/**
 * Command output card component
 *
 * @element pulse-command-output
 *
 * @attr {string} command - The command that produced this output
 * @attr {boolean} closeable - Whether to show close button
 * @attr {boolean} draggable - Whether the card can be dragged
 *
 * @slot - Default slot for output content
 * @slot header-actions - Additional header action buttons
 *
 * @fires pulse-close - When close button is clicked
 * @fires pulse-focus - When header is clicked
 * @fires pulse-drag-start - When drag begins
 * @fires pulse-drag-end - When drag ends
 *
 * @example
 * <pulse-command-output command="list users" closeable>
 *   <div>User 1</div>
 *   <div>User 2</div>
 * </pulse-command-output>
 */
declare class PulseCommandOutput extends PulseBaseComponent {
    static get observedAttributes(): string[];
    private static idCounter;
    private readonly instanceId;
    private isDragging;
    constructor();
    /**
     * Get the unique ID of this output instance
     */
    get id(): string;
    /**
     * Set the output content as HTML
     */
    setContent(html: string): void;
    /**
     * Set the output content as text (escaped)
     */
    setTextContent(text: string): void;
    /**
     * Append content to the output
     */
    appendContent(html: string): void;
    /**
     * Clear the output content
     */
    clearContent(): void;
    protected render(): void;
    protected setupEventListeners(): void;
    private handleHeaderClick;
    private handleClose;
    private handleDragStart;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private getStyles;
}

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
 * Events emitted by pulse-terminal
 */
interface PulseTerminalEvents {
    /** Emitted when a command is executed */
    'pulse-command': {
        command: string;
        result?: unknown;
        error?: Error;
    };
    /** Emitted when terminal is ready */
    'pulse-ready': {
        registry: CommandRegistry;
    };
}
/**
 * Main terminal component that combines command line and output
 *
 * @element pulse-terminal
 *
 * @attr {string} prompt - The prompt symbol (default: '>')
 * @attr {string} welcome - Welcome message to display
 * @attr {number} max-outputs - Maximum number of outputs to keep
 *
 * @fires pulse-command - When a command is executed
 * @fires pulse-ready - When terminal is initialized
 *
 * @example
 * <pulse-terminal
 *   prompt="$"
 *   welcome="Welcome to PulseCLI. Type 'help' for available commands."
 * ></pulse-terminal>
 *
 * <script>
 *   const terminal = document.querySelector('pulse-terminal');
 *   terminal.registry.addCommand('hello', 'Say hello', 'demo')
 *     .action((args, cmd, resolve) => resolve('Hello, World!'));
 * </script>
 */
declare class PulseTerminal extends PulseBaseComponent {
    static get observedAttributes(): string[];
    /** The command registry for this terminal */
    readonly registry: CommandRegistry;
    private commandLine;
    private outputContainer;
    private outputs;
    constructor();
    /**
     * Register built-in commands
     */
    private registerBuiltinCommands;
    /**
     * Execute a command programmatically
     */
    execute(command: string): Promise<unknown>;
    /**
     * Add output to the terminal
     */
    addOutput(content: string, command?: string): PulseCommandOutput;
    /**
     * Clear all outputs
     */
    clearOutputs(): void;
    /**
     * Focus the command line input
     */
    focus(): void;
    protected render(): void;
    protected setupEventListeners(): void;
    private handleCommand;
    private removeOutput;
    private enforceMaxOutputs;
    private scrollToBottom;
    private formatOutput;
    private escapeHtml;
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

export { type Command, type CommandCallback, type CommandEvent, CommandHistory, type CommandHistoryInterface, type CommandHistoryOptions, type CommandLineEvents, CommandOption, type CommandOutputEvents, CommandParser, CommandRegistry, type CommandRegistryInterface, type CommandRegistryOptions, type ExecuteOptions, LocalStorageAdapter, MemoryStorageAdapter, type Option, PULSE_CSS_VARS, type ParseResult, PulseBaseComponent, PulseCommand, PulseCommandLine, PulseCommandOutput, PulseTerminal, type PulseTerminalEvents, SessionStorageAdapter, type StorageAdapter, type UnknownCommandCallback, VERSION, camelToKebab, createStorageAdapter, debounce, deepClone, defineElements, escapeHtml, formatDuration, getBaseStyles, isBrowser, kebabToCamel, supportsCustomElements, throttle, uniqueId, waitFor };
