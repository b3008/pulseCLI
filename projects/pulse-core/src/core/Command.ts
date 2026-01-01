import type { Command as CommandInterface, CommandCallback, Option } from './types';
import { CommandOption } from './Option';

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
export class PulseCommand implements CommandInterface {
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly positionalArgs: string[] = [];
  readonly options: Option[] = [];

  private callback: CommandCallback | null = null;
  private readonly commandString: string;

  constructor(commandString: string, description: string, category: string = 'general') {
    this.commandString = commandString;
    this.description = description;
    this.category = category;

    // Parse command name and positional arguments
    // Format: "command-name <required> [optional]"
    const argPattern = /[<\[][\w]+[>\]]/g;
    const argStartIndex = this.findFirstArgIndex(commandString);

    this.name = commandString.substring(0, argStartIndex).trim();
    this.positionalArgs = commandString.match(argPattern) || [];
  }

  /**
   * Find the index where positional arguments begin
   */
  private findFirstArgIndex(str: string): number {
    const requiredIndex = str.indexOf('<');
    const optionalIndex = str.indexOf('[');

    if (requiredIndex === -1 && optionalIndex === -1) {
      return str.length;
    }
    if (requiredIndex === -1) return optionalIndex;
    if (optionalIndex === -1) return requiredIndex;
    return Math.min(requiredIndex, optionalIndex);
  }

  /**
   * Add an option/flag to this command
   *
   * @param flags - Option flags (e.g., '-v, --verbose' or '-o, --output <file>')
   * @param description - Description of the option
   * @returns this for method chaining
   */
  option(flags: string, description: string): this {
    const opt = new CommandOption(flags, description);
    this.options.push(opt);
    return this;
  }

  /**
   * Set the action callback for this command
   *
   * @param callback - Function to execute when command is invoked
   * @returns this for method chaining
   */
  action(callback: CommandCallback): this {
    this.callback = callback;
    return this;
  }

  /**
   * Execute this command with the given arguments
   *
   * @param args - Parsed arguments including positional args and options
   * @param commandString - The original command string
   * @returns Promise that resolves with the command result
   */
  execute(args: Record<string, unknown>, commandString: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.callback) {
        reject(new Error(`No action defined for command: ${this.name}`));
        return;
      }

      try {
        const result = this.callback(args, commandString, resolve, reject);
        // If callback returns a promise, handle it
        if (result instanceof Promise) {
          result.catch(reject);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get a usage example string for this command
   */
  getUsageExample(): string {
    const parts = [this.name];

    // Add positional arguments
    for (const arg of this.positionalArgs) {
      const argName = arg.slice(1, -1); // Remove brackets
      parts.push(argName);
    }

    // Add options
    for (const opt of this.options) {
      if (opt.long) {
        const valueMatch = opt.flags.match(/[<\[][\w]+[>\]]/);
        const value = valueMatch ? ` ${valueMatch[0].slice(1, -1)}` : '';
        parts.push(`${opt.long}${value}`);
      }
    }

    return parts.join(' ');
  }

  /**
   * Get the argument name without brackets
   */
  getArgName(arg: string): string {
    return arg.slice(1, -1);
  }

  /**
   * Check if an argument is required (uses < >)
   */
  isArgRequired(arg: string): boolean {
    return arg.startsWith('<') && arg.endsWith('>');
  }

  /**
   * Convert to a human-readable string
   */
  toString(): string {
    return `${this.commandString}: ${this.description}`;
  }
}
