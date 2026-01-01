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

// Core classes
export { CommandRegistry } from './core/CommandRegistry';
export type { CommandRegistryOptions } from './core/CommandRegistry';

export { PulseCommand } from './core/Command';
export { CommandOption } from './core/Option';
export { CommandParser } from './core/CommandParser';
export { CommandHistory } from './core/CommandHistory';
export type { CommandHistoryOptions } from './core/CommandHistory';

// Types
export type {
  Command,
  Option,
  ParseResult,
  ExecuteOptions,
  CommandCallback,
  UnknownCommandCallback,
  CommandEvent,
  StorageAdapter,
  CommandRegistryInterface,
  CommandHistoryInterface,
} from './core/types';

// Storage adapters
export {
  MemoryStorageAdapter,
  LocalStorageAdapter,
  SessionStorageAdapter,
  createStorageAdapter,
} from './storage/StorageAdapters';

// Web Components
export { PulseTerminal } from './components/PulseTerminal';
export type { PulseTerminalEvents } from './components/PulseTerminal';

export { PulseCommandLine } from './components/CommandLine';
export type { CommandLineEvents } from './components/CommandLine';

export { PulseCommandOutput } from './components/CommandOutput';
export type { CommandOutputEvents } from './components/CommandOutput';

export { PulseBaseComponent, PULSE_CSS_VARS, getBaseStyles } from './components/BaseComponent';

// Utilities
export {
  escapeHtml,
  camelToKebab,
  kebabToCamel,
  debounce,
  throttle,
  uniqueId,
  isBrowser,
  supportsCustomElements,
  waitFor,
  formatDuration,
  deepClone,
} from './utils/helpers';

/**
 * Library version
 */
export const VERSION = '0.1.0';

/**
 * Define all custom elements
 * Call this to ensure all web components are registered
 */
export function defineElements(): void {
  // Components auto-register on import, but this ensures they're loaded
  import('./components/CommandLine');
  import('./components/CommandOutput');
  import('./components/PulseTerminal');
}
