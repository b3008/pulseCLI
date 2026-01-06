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
     * Returns HTML with semantic classes for styling
     */
    generateHelp(): string;
    /**
     * Escape HTML special characters
     */
    private escapeHtml;
}

/**
 * Theme configuration for PulseCLI components
 */
interface PulseTheme {
    bg: string;
    bgSecondary: string;
    text: string;
    textMuted: string;
    accent: string;
    accentHover: string;
    error: string;
    success: string;
    warning: string;
    border: string;
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    spacingXs: string;
    spacingSm: string;
    spacingMd: string;
    spacingLg: string;
    radius: string;
    transition: string;
}
/**
 * Dark theme (default)
 */
declare const darkTheme: PulseTheme;
/**
 * Light theme
 */
declare const lightTheme: PulseTheme;
/**
 * High contrast theme for accessibility
 */
declare const highContrastTheme: PulseTheme;
/**
 * Primal theme - Clean, modern design inspired by PrimeNG
 * Features a light background with deep navy accents
 */
declare const primalTheme: PulseTheme;
/**
 * All available theme presets
 */
declare const PULSE_THEMES: {
    readonly dark: PulseTheme;
    readonly light: PulseTheme;
    readonly "high-contrast": PulseTheme;
    readonly primal: PulseTheme;
};
type ThemePreset = keyof typeof PULSE_THEMES;
/**
 * Convert a theme object to CSS variable declarations
 */
declare function themeToCSS(theme: PulseTheme): string;
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
 * @deprecated Use PULSE_THEMES and themeToCSS instead
 */
declare const PULSE_CSS_VARS: {
    readonly "--pulse-bg": string;
    readonly "--pulse-bg-secondary": string;
    readonly "--pulse-text": string;
    readonly "--pulse-text-muted": string;
    readonly "--pulse-accent": string;
    readonly "--pulse-accent-hover": string;
    readonly "--pulse-error": string;
    readonly "--pulse-success": string;
    readonly "--pulse-warning": string;
    readonly "--pulse-border": string;
    readonly "--pulse-font-family": string;
    readonly "--pulse-font-size": string;
    readonly "--pulse-line-height": string;
    readonly "--pulse-spacing-xs": string;
    readonly "--pulse-spacing-sm": string;
    readonly "--pulse-spacing-md": string;
    readonly "--pulse-spacing-lg": string;
    readonly "--pulse-radius": string;
    readonly "--pulse-transition": string;
};
/**
 * Generate base CSS (without theme - theme is applied separately)
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
    /** Registry of custom user-defined themes */
    private static customThemes;
    /**
     * Register a custom theme globally
     * @param name - Unique name for the theme
     * @param theme - Partial theme object (merges with dark theme defaults)
     */
    static registerTheme(name: string, theme: Partial<PulseTheme>): void;
    /**
     * Unregister a custom theme
     * @param name - Name of the theme to remove
     */
    static unregisterTheme(name: string): boolean;
    /**
     * Get a registered theme by name (checks custom themes first, then built-in)
     * @param name - Theme name
     */
    static getThemeByName(name: string): PulseTheme | undefined;
    /**
     * Get all registered theme names (built-in + custom)
     */
    static getThemeNames(): string[];
    /** The command registry for this terminal */
    readonly registry: CommandRegistry;
    private commandLine;
    private outputContainer;
    private outputs;
    private currentTheme;
    private themeStyleEl;
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
     * Set the terminal theme
     * @param theme - Theme name (built-in or custom) or a partial PulseTheme object
     */
    setTheme(theme: string | Partial<PulseTheme>): void;
    /**
     * Get the current theme
     */
    getTheme(): PulseTheme;
    /**
     * Apply theme by updating CSS variables
     */
    private applyTheme;
    /**
     * Add output to the terminal
     */
    addOutput(content: string, command?: string): PulseCommandOutput;
    /** Counter for unique mount point IDs */
    private mountCounter;
    /**
     * Create an output card with a mount point for rendering custom content (e.g., React components)
     * @param command - The command string to display in the output header
     * @returns The mount point element where you can render your content
     */
    createOutputMount(command?: string): HTMLElement;
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

export { type Command as C, type ExecuteOptions as E, type Option as O, PulseBaseComponent as P, type StorageAdapter as S, type ThemePreset as T, type UnknownCommandCallback as U, type CommandCallback as a, CommandRegistry as b, type CommandRegistryOptions as c, CommandParser as d, CommandHistory as e, type CommandHistoryOptions as f, type ParseResult as g, type CommandEvent as h, type CommandRegistryInterface as i, type CommandHistoryInterface as j, PulseTerminal as k, type PulseTerminalEvents as l, PulseCommandOutput as m, type CommandOutputEvents as n, PULSE_CSS_VARS as o, getBaseStyles as p, darkTheme as q, lightTheme as r, highContrastTheme as s, primalTheme as t, PULSE_THEMES as u, themeToCSS as v, type PulseTheme as w };
