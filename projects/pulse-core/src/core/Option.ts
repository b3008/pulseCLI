import type { Option as OptionInterface } from './types';

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
export class CommandOption implements OptionInterface {
  readonly flags: string;
  readonly short: string | null = null;
  readonly long: string | null = null;
  readonly description: string;
  readonly required: boolean;
  readonly optional: boolean;
  readonly isBoolean: boolean;

  constructor(flags: string, description: string) {
    this.flags = flags;
    this.description = description;

    // Check for required (<>) or optional ([]) value indicators
    this.required = flags.includes('<');
    this.optional = flags.includes('[');
    this.isBoolean = !this.required && !this.optional;

    // Parse flag parts (separated by comma, pipe, or space)
    const flagParts = flags.split(/[,|\s]+/).filter(part => part.startsWith('-'));

    for (const part of flagParts) {
      if (part.startsWith('--')) {
        this.long = part.split(/[\s<\[]/)[0]; // Stop at space or value indicator
      } else if (part.startsWith('-') && !part.startsWith('--')) {
        this.short = part.split(/[\s<\[]/)[0];
      }
    }
  }

  /**
   * Get the canonical name of this option (without dashes)
   */
  name(): string {
    if (this.long) {
      return this.long.replace(/^--/, '').replace(/^no-/, '');
    }
    if (this.short) {
      return this.short.replace(/^-/, '');
    }
    return '';
  }

  /**
   * Check if the given argument matches this option
   */
  matches(arg: string): boolean {
    return arg === this.short || arg === this.long;
  }

  /**
   * Convert to a human-readable string representation
   */
  toString(): string {
    return `${this.flags}: ${this.description}`;
  }
}
