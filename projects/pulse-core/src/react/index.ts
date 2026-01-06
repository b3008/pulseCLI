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

// Main component, context hook, and types
export {
  PulseTerminal,
  usePulseRegistry,
  usePulseTerminal,
} from "./PulseTerminal.js";
export type {
  PulseTerminalProps,
  CommandDefinition,
  OptionDefinition,
  UsePulseTerminalOptions,
  UsePulseTerminalResult,
} from "./PulseTerminal.js";

// Re-export theming utilities
export { PulseTerminal as PulseTerminalElement } from "../components/PulseTerminal.js";
export type { PulseTheme } from "../components/BaseComponent.js";

/**
 * Register a custom theme globally.
 * Call this before rendering any PulseTerminal components.
 *
 * @example
 * import { registerTheme, PulseTerminal } from '@b3008/pulse-cli-core/react';
 *
 * // Register once at app startup
 * registerTheme('my-brand', {
 *   bg: '#0a0a0a',
 *   accent: '#ff6b6b',
 *   text: '#ffffff',
 * });
 *
 * // Use the theme
 * <PulseTerminal theme="my-brand" commands={[...]} />
 */
export { PulseTerminal as _PulseTerminalClass } from "../components/PulseTerminal.js";
import { PulseTerminal as PulseTerminalClass } from "../components/PulseTerminal.js";
import type { PulseTheme } from "../components/BaseComponent.js";

export function registerTheme(name: string, theme: Partial<PulseTheme>): void {
  PulseTerminalClass.registerTheme(name, theme);
}

export function unregisterTheme(name: string): boolean {
  return PulseTerminalClass.unregisterTheme(name);
}

export function getThemeNames(): string[] {
  return PulseTerminalClass.getThemeNames();
}
