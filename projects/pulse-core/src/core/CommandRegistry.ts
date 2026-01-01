import type {
  Command,
  CommandRegistryInterface,
  ParseResult,
  ExecuteOptions,
  UnknownCommandCallback,
  CommandEvent,
} from './types';
import { PulseCommand } from './Command';
import { CommandParser } from './CommandParser';
import { CommandHistory, type CommandHistoryOptions } from './CommandHistory';

/**
 * Event emitter for command events
 */
type EventHandler = (event: CommandEvent) => void;

/**
 * Configuration options for CommandRegistry
 */
export interface CommandRegistryOptions {
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
export class CommandRegistry implements CommandRegistryInterface {
  private commands = new Map<string, Command>();
  private categories = new Map<string, Command[]>();
  private unknownCommandHandler: UnknownCommandCallback | null = null;
  private eventHandlers = new Map<string, Set<EventHandler>>();

  readonly parser: CommandParser;
  readonly history: CommandHistory;

  constructor(options: CommandRegistryOptions = {}) {
    this.parser = new CommandParser();
    this.history = new CommandHistory(options.history);
  }

  /**
   * Register a new command
   *
   * @param commandString - Command name and positional args (e.g., 'greet <name>')
   * @param description - Human-readable description
   * @param category - Category for grouping commands
   * @returns The created command for chaining
   */
  addCommand(commandString: string, description: string, category: string = 'general'): Command {
    const command = new PulseCommand(commandString, description, category);

    // Store by name for lookup
    this.commands.set(command.name, command);

    // Organize by category
    if (!this.categories.has(category)) {
      this.categories.set(category, []);
    }
    this.categories.get(category)!.push(command);

    return command;
  }

  /**
   * Remove a command by name
   *
   * @param name - The command name to remove
   * @returns true if command was removed, false if not found
   */
  removeCommand(name: string): boolean {
    const command = this.commands.get(name);
    if (!command) return false;

    this.commands.delete(name);

    // Remove from category
    const categoryCommands = this.categories.get(command.category);
    if (categoryCommands) {
      const index = categoryCommands.indexOf(command);
      if (index !== -1) {
        categoryCommands.splice(index, 1);
      }
      if (categoryCommands.length === 0) {
        this.categories.delete(command.category);
      }
    }

    return true;
  }

  /**
   * Parse a command string without executing it
   *
   * @param commandString - The command to parse
   * @returns ParseResult with matched command and arguments
   */
  parseCommand(commandString: string): ParseResult {
    return this.parser.parse(commandString, this.commands);
  }

  /**
   * Execute a command string
   *
   * @param commandString - The command to execute
   * @param options - Execution options
   * @returns Promise resolving to command result
   */
  async executeCommand(commandString: string, options: ExecuteOptions = {}): Promise<unknown> {
    const { addToHistory = true, additionalArgs = {}, additionalOptions = {} } = options;

    // Add to history if requested
    if (addToHistory) {
      this.history.add(commandString);
    }

    // Parse the command
    const parseResult = this.parseCommand(commandString);

    // Emit execute event
    this.emit({
      type: 'execute',
      command: commandString,
      timestamp: Date.now(),
    });

    // Handle unknown command
    if (!parseResult.command) {
      return this.handleUnknownCommand(commandString);
    }

    // Merge additional args and options
    const finalArgs = { ...parseResult.args, ...additionalArgs };
    const finalOptions = { ...parseResult.options, ...additionalOptions };
    finalArgs['options'] = finalOptions;

    try {
      const result = await parseResult.command.execute(finalArgs, commandString);

      // Emit complete event
      this.emit({
        type: 'complete',
        command: commandString,
        result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      // Emit error event
      this.emit({
        type: 'error',
        command: commandString,
        error: error instanceof Error ? error : new Error(String(error)),
        timestamp: Date.now(),
      });

      throw error;
    }
  }

  /**
   * Handle an unknown command
   */
  private handleUnknownCommand(commandString: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (this.unknownCommandHandler) {
        this.unknownCommandHandler(commandString, resolve, reject);
      } else {
        reject(new Error(`Unknown command: ${commandString.split(' ')[0]}`));
      }
    });
  }

  /**
   * Get autocomplete suggestions for a partial command
   *
   * @param partial - Partial command input
   * @returns Array of matching command names
   */
  getAutofillSuggestions(partial: string): string[] {
    return this.parser.getAutocompleteSuggestions(partial, this.commands);
  }

  /**
   * Set handler for unknown commands
   *
   * @param callback - Handler function for unknown commands
   */
  onUnknownCommand(callback: UnknownCommandCallback): void {
    this.unknownCommandHandler = callback;
  }

  /**
   * Get all registered commands
   */
  getCommands(): Map<string, Command> {
    return new Map(this.commands);
  }

  /**
   * Get a specific command by name
   */
  getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  /**
   * Get all categories with their commands
   */
  getCategories(): Map<string, Command[]> {
    return new Map(
      Array.from(this.categories.entries()).map(([cat, cmds]) => [cat, [...cmds]])
    );
  }

  /**
   * Check if a command exists
   */
  hasCommand(name: string): boolean {
    return this.commands.has(name);
  }

  /**
   * Subscribe to command events
   *
   * @param type - Event type to listen for
   * @param handler - Event handler function
   * @returns Unsubscribe function
   */
  on(type: CommandEvent['type'], handler: EventHandler): () => void {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, new Set());
    }
    this.eventHandlers.get(type)!.add(handler);

    return () => {
      this.eventHandlers.get(type)?.delete(handler);
    };
  }

  /**
   * Emit a command event
   */
  private emit(event: CommandEvent): void {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error('Error in command event handler:', error);
        }
      });
    }
  }

  /**
   * Generate help text for all commands
   */
  generateHelp(): string {
    const lines: string[] = ['Available Commands:', ''];

    for (const [category, commands] of this.categories.entries()) {
      if (category === 'unlisted') continue;

      lines.push(`## ${category}`);
      lines.push('');

      for (const cmd of commands) {
        const positionalArgs = cmd.positionalArgs.join(' ');
        const signature = positionalArgs
          ? `${cmd.name} ${positionalArgs}`
          : cmd.name;

        lines.push(`  ${signature}`);
        lines.push(`    ${cmd.description}`);

        if (cmd.options.length > 0) {
          lines.push('    Options:');
          for (const opt of cmd.options) {
            lines.push(`      ${opt.flags}  ${opt.description}`);
          }
        }
        lines.push('');
      }
    }

    return lines.join('\n');
  }
}
