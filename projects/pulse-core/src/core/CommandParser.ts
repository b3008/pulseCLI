import type { Command, ParseResult } from './types';

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
export class CommandParser {
  /**
   * Parse a command string against a registry of commands
   *
   * @param commandString - The raw command input
   * @param commands - Map of registered commands
   * @returns ParseResult with matched command and parsed args
   */
  parse(commandString: string, commands: Map<string, Command>): ParseResult {
    const trimmed = commandString.trim();

    if (!trimmed) {
      return this.createEmptyResult(commandString);
    }

    // Replace quoted strings with placeholders to simplify parsing
    const { processed, quotedStrings } = this.extractQuotedStrings(trimmed);

    // Separate options from the command/args portion
    const { commandPortion, optionsPortion } = this.splitCommandAndOptions(processed);

    // Find the matching command
    const { command, positionalValues } = this.findCommand(commandPortion, commands);

    if (!command) {
      return {
        command: null,
        args: {},
        options: {},
        commandString: trimmed,
      };
    }

    // Parse positional arguments
    const args = this.parsePositionalArgs(command, positionalValues, quotedStrings);

    // Parse options
    const options = this.parseOptions(command, optionsPortion, quotedStrings);

    // Include options in args for convenience
    args['options'] = options;

    return {
      command,
      args,
      options,
      commandString: trimmed,
    };
  }

  /**
   * Create an empty parse result
   */
  private createEmptyResult(commandString: string): ParseResult {
    return {
      command: null,
      args: {},
      options: {},
      commandString,
    };
  }

  /**
   * Extract quoted strings and replace with placeholders
   */
  private extractQuotedStrings(input: string): {
    processed: string;
    quotedStrings: Map<string, string>;
  } {
    const quotedStrings = new Map<string, string>();
    let processed = input;
    let counter = 0;

    // Match both single and double quoted strings
    const quotedRegex = /(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/g;
    let match: RegExpExecArray | null;

    while ((match = quotedRegex.exec(input)) !== null) {
      const placeholder = `__QUOTED_${counter}__`;
      const fullMatch = match[0];
      // Remove surrounding quotes
      const value = fullMatch.slice(1, -1);
      quotedStrings.set(placeholder, value);
      processed = processed.replace(fullMatch, placeholder);
      counter++;
    }

    return { processed, quotedStrings };
  }

  /**
   * Split command string into command/args portion and options portion
   */
  private splitCommandAndOptions(input: string): {
    commandPortion: string;
    optionsPortion: string;
  } {
    // Match space followed by either -x (short) or --xxx (long) option
    const optionStart = input.search(/\s--?[a-zA-Z]/);

    if (optionStart === -1) {
      return {
        commandPortion: input.trim(),
        optionsPortion: '',
      };
    }

    return {
      commandPortion: input.substring(0, optionStart).trim(),
      optionsPortion: input.substring(optionStart).trim(),
    };
  }

  /**
   * Find a matching command from the registry
   */
  private findCommand(
    commandPortion: string,
    commands: Map<string, Command>
  ): { command: Command | null; positionalValues: string[] } {
    const commandNames = Array.from(commands.keys()).sort();

    // Try to match the longest command name first
    for (const name of commandNames.sort((a, b) => b.length - a.length)) {
      if (commandPortion === name || commandPortion.startsWith(name + ' ')) {
        const rest = commandPortion.substring(name.length).trim();
        const positionalValues = rest
          ? rest.split(/\s+/).filter(s => s.length > 0)
          : [];

        return {
          command: commands.get(name) ?? null,
          positionalValues,
        };
      }
    }

    // Try prefix matching for autocomplete scenarios
    const candidates = commandNames.filter(name =>
      name.startsWith(commandPortion.split(' ')[0])
    );

    if (candidates.length === 1) {
      const name = candidates[0];
      const rest = commandPortion.substring(commandPortion.indexOf(' ')).trim();
      const positionalValues = rest
        ? rest.split(/\s+/).filter(s => s.length > 0)
        : [];

      return {
        command: commands.get(name) ?? null,
        positionalValues,
      };
    }

    return { command: null, positionalValues: [] };
  }

  /**
   * Parse positional arguments
   */
  private parsePositionalArgs(
    command: Command,
    values: string[],
    quotedStrings: Map<string, string>
  ): Record<string, unknown> {
    const args: Record<string, unknown> = {};

    command.positionalArgs.forEach((argDef, index) => {
      // Remove brackets from arg definition
      const argName = argDef.slice(1, -1);
      let value = values[index];

      if (value !== undefined) {
        // Restore quoted string if applicable
        value = this.restoreQuotedString(value, quotedStrings);
        args[argName] = value;
      }
    });

    return args;
  }

  /**
   * Parse command options
   */
  private parseOptions(
    command: Command,
    optionsPortion: string,
    quotedStrings: Map<string, string>
  ): Record<string, unknown> {
    if (!optionsPortion) {
      return {};
    }

    // Split by spaces, keeping track of which tokens are flags vs values
    const tokens = optionsPortion.split(/\s+/).filter(t => t.length > 0);
    const rawOptions = new Map<string, string[]>();

    let currentFlag: string | null = null;

    for (const token of tokens) {
      if (token.startsWith('-')) {
        // This is a flag - save any previous flag and start tracking this one
        if (currentFlag !== null) {
          // Previous flag had no value, ensure it exists in map
          if (!rawOptions.has(currentFlag)) {
            rawOptions.set(currentFlag, []);
          }
        }
        currentFlag = token;
        if (!rawOptions.has(currentFlag)) {
          rawOptions.set(currentFlag, []);
        }
      } else if (currentFlag !== null) {
        // This is a value for the current flag
        const existing = rawOptions.get(currentFlag) ?? [];
        existing.push(this.restoreQuotedString(token, quotedStrings));
        rawOptions.set(currentFlag, existing);
        currentFlag = null; // Reset after consuming value
      }
    }

    // Map raw options to command options
    const options: Record<string, unknown> = {};

    for (const opt of command.options) {
      const name = opt.name();
      let values: string[] = [];
      let flagFound = false;

      // Collect values from both short and long forms
      if (opt.short && rawOptions.has(opt.short)) {
        flagFound = true;
        values = values.concat(rawOptions.get(opt.short) ?? []);
      }
      if (opt.long && rawOptions.has(opt.long)) {
        flagFound = true;
        values = values.concat(rawOptions.get(opt.long) ?? []);
      }

      if (values.length > 0) {
        // Multiple values: keep as array; single value: unwrap
        options[name] = values.length === 1 ? values[0] : values;
      } else if (flagFound) {
        // Boolean flag (flag found but no values)
        options[name] = true;
      }
    }

    return options;
  }

  /**
   * Restore a quoted string from its placeholder
   */
  private restoreQuotedString(value: string, quotedStrings: Map<string, string>): string {
    if (quotedStrings.has(value)) {
      return quotedStrings.get(value)!;
    }
    return value;
  }

  /**
   * Get autocomplete suggestions for a partial command
   */
  getAutocompleteSuggestions(
    partial: string,
    commands: Map<string, Command>
  ): string[] {
    const trimmed = partial.trim().toLowerCase();
    if (!trimmed) {
      return Array.from(commands.keys()).sort();
    }

    return Array.from(commands.keys())
      .filter(name => name.toLowerCase().startsWith(trimmed))
      .sort();
  }
}
