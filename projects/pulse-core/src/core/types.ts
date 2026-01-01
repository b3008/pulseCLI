/**
 * Core type definitions for PulseCLI
 */

/**
 * Callback function type for command execution
 */
export type CommandCallback = (
  args: Record<string, unknown>,
  commandString: string,
  resolve: (value?: unknown) => void,
  reject: (reason?: unknown) => void
) => void | Promise<unknown>;

/**
 * Callback for handling unrecognized commands
 */
export type UnknownCommandCallback = (
  commandString: string,
  resolve: (value?: unknown) => void,
  reject: (reason?: unknown) => void
) => void;

/**
 * Result of parsing a command string
 */
export interface ParseResult {
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
export interface ExecuteOptions {
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
export interface CommandEvent {
  type: 'execute' | 'complete' | 'error';
  command: string;
  result?: unknown;
  error?: Error;
  timestamp: number;
}

/**
 * Storage adapter interface for persistence
 */
export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

/**
 * Command definition for fluent API
 */
export interface Command {
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
export interface Option {
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
export interface CommandRegistryInterface {
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
export interface CommandHistoryInterface {
  add(command: string): void;
  getPrevious(): string | undefined;
  getNext(): string | undefined;
  getAll(): string[];
  clear(): void;
  readonly length: number;
  readonly currentIndex: number;
}
