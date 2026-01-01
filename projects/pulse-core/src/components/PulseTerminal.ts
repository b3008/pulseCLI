import {
  PulseBaseComponent,
  getBaseStyles,
  themeToCSS,
  darkTheme,
  PULSE_THEMES,
  type PulseTheme,
} from './BaseComponent';
import { CommandRegistry } from '../core/CommandRegistry';
import type { PulseCommandLine } from './CommandLine';
import type { PulseCommandOutput } from './CommandOutput';

// Ensure dependencies are registered
import './CommandLine';
import './CommandOutput';

/**
 * Events emitted by pulse-terminal
 */
export interface PulseTerminalEvents {
  /** Emitted when a command is executed */
  'pulse-command': { command: string; result?: unknown; error?: Error };
  /** Emitted when terminal is ready */
  'pulse-ready': { registry: CommandRegistry };
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
export class PulseTerminal extends PulseBaseComponent {
  static get observedAttributes(): string[] {
    return ['prompt', 'welcome', 'max-outputs', 'theme'];
  }

  /** Registry of custom user-defined themes */
  private static customThemes = new Map<string, PulseTheme>();

  /**
   * Register a custom theme globally
   * @param name - Unique name for the theme
   * @param theme - Partial theme object (merges with dark theme defaults)
   */
  static registerTheme(name: string, theme: Partial<PulseTheme>): void {
    const fullTheme: PulseTheme = { ...darkTheme, ...theme };
    PulseTerminal.customThemes.set(name, fullTheme);
  }

  /**
   * Unregister a custom theme
   * @param name - Name of the theme to remove
   */
  static unregisterTheme(name: string): boolean {
    return PulseTerminal.customThemes.delete(name);
  }

  /**
   * Get a registered theme by name (checks custom themes first, then built-in)
   * @param name - Theme name
   */
  static getThemeByName(name: string): PulseTheme | undefined {
    return PulseTerminal.customThemes.get(name) ??
      (PULSE_THEMES as Record<string, PulseTheme>)[name];
  }

  /**
   * Get all registered theme names (built-in + custom)
   */
  static getThemeNames(): string[] {
    return [...Object.keys(PULSE_THEMES), ...PulseTerminal.customThemes.keys()];
  }

  /** The command registry for this terminal */
  readonly registry: CommandRegistry;

  private commandLine: PulseCommandLine | null = null;
  private outputContainer: HTMLElement | null = null;
  private outputs: PulseCommandOutput[] = [];
  private currentTheme: PulseTheme = darkTheme;
  private themeStyleEl: HTMLStyleElement | null = null;

  constructor() {
    super();
    this.registry = new CommandRegistry();
    this.registerBuiltinCommands();
  }

  /**
   * Register built-in commands
   */
  private registerBuiltinCommands(): void {
    // Help command
    this.registry.addCommand('help', 'Show available commands', 'help')
      .action((_args, _cmd, resolve) => {
        resolve(this.registry.generateHelp());
      });

    // Clear command
    this.registry.addCommand('clear', 'Clear terminal output', 'help')
      .action((_args, _cmd, resolve) => {
        this.clearOutputs();
        resolve(null);
      });

    // History command
    this.registry.addCommand('history', 'Show command history', 'help')
      .action((_args, _cmd, resolve) => {
        const history = this.registry.history.getAll();
        if (history.length === 0) {
          resolve('No command history');
        } else {
          resolve(history.map((cmd, i) => `${i + 1}. ${cmd}`).join('\n'));
        }
      });
  }

  /**
   * Execute a command programmatically
   */
  async execute(command: string): Promise<unknown> {
    return this.handleCommand(command);
  }

  /**
   * Set the terminal theme
   * @param theme - Theme name (built-in or custom) or a partial PulseTheme object
   */
  setTheme(theme: string | Partial<PulseTheme>): void {
    let resolvedTheme: PulseTheme;

    if (typeof theme === 'string') {
      resolvedTheme = PulseTerminal.getThemeByName(theme) ?? darkTheme;
    } else {
      // Merge partial theme with defaults
      resolvedTheme = { ...darkTheme, ...theme };
    }

    this.currentTheme = resolvedTheme;
    this.applyTheme(resolvedTheme);
  }

  /**
   * Get the current theme
   */
  getTheme(): PulseTheme {
    return this.currentTheme;
  }

  /**
   * Apply theme by updating CSS variables
   */
  private applyTheme(theme: PulseTheme): void {
    if (!this.themeStyleEl) {
      this.themeStyleEl = document.createElement('style');
      this.themeStyleEl.id = 'pulse-theme';
      this.shadow.appendChild(this.themeStyleEl);
    }

    this.themeStyleEl.textContent = `:host { ${themeToCSS(theme)} }`;
  }

  /**
   * Add output to the terminal
   */
  addOutput(content: string, command: string = ''): PulseCommandOutput {
    const output = document.createElement('pulse-command-output') as PulseCommandOutput;
    output.setAttribute('command', command);
    output.setAttribute('closeable', '');

    this.outputContainer?.appendChild(output);
    output.setContent(this.formatOutput(content));

    this.outputs.push(output);
    this.enforceMaxOutputs();
    this.scrollToBottom();

    return output;
  }

  /** Counter for unique mount point IDs */
  private mountCounter = 0;

  /**
   * Create an output card with a mount point for rendering custom content (e.g., React components)
   * @param command - The command string to display in the output header
   * @returns The mount point element where you can render your content
   */
  createOutputMount(command: string = ''): HTMLElement {
    const mountId = `pulse-mount-${++this.mountCounter}`;
    const output = document.createElement('pulse-command-output') as PulseCommandOutput;
    output.setAttribute('command', command);
    output.setAttribute('closeable', '');

    this.outputContainer?.appendChild(output);
    output.setContent(`<div id="${mountId}" class="output-mount"></div>`);

    this.outputs.push(output);
    this.enforceMaxOutputs();
    this.scrollToBottom();

    // Return the mount point from inside the shadow DOM
    const mountPoint = output.shadowRoot?.querySelector(`#${mountId}`) as HTMLElement;
    return mountPoint;
  }

  /**
   * Clear all outputs
   */
  clearOutputs(): void {
    this.outputs.forEach(output => output.remove());
    this.outputs = [];
  }

  /**
   * Focus the command line input
   */
  focus(): void {
    this.commandLine?.focus();
  }

  protected render(): void {
    const prompt = this.getAttr('prompt', '>');
    const welcome = this.getAttr('welcome', '');
    const themeAttr = this.getAttr('theme', '');

    this.injectStyles(this.getStyles());

    // Apply initial theme if specified
    if (themeAttr && PulseTerminal.getThemeByName(themeAttr)) {
      this.setTheme(themeAttr);
    }

    const container = document.createElement('div');
    container.className = 'terminal';
    container.setAttribute('part', 'terminal');

    // Output container
    const outputContainer = document.createElement('div');
    outputContainer.className = 'output-container';
    outputContainer.setAttribute('part', 'output-container');
    this.outputContainer = outputContainer;

    // Command line
    const commandLine = document.createElement('pulse-command-line') as PulseCommandLine;
    commandLine.setAttribute('prompt', prompt);
    commandLine.setAttribute('autofocus', '');
    commandLine.setRegistry(this.registry);
    this.commandLine = commandLine;

    container.appendChild(outputContainer);
    container.appendChild(commandLine);
    this.shadow.appendChild(container);

    // Show welcome message
    if (welcome) {
      this.addOutput(welcome, 'welcome');
    }

    // Emit ready event
    this.emit('pulse-ready', { registry: this.registry });
  }

  protected setupEventListeners(): void {
    this.commandLine?.addEventListener('pulse-submit', ((event: CustomEvent) => {
      this.handleCommand(event.detail.command);
    }) as EventListener);

    // Handle output close events
    this.shadow.addEventListener('pulse-close', ((event: CustomEvent) => {
      this.removeOutput(event.detail.id);
    }) as EventListener);

    // Click anywhere to focus command line
    this.shadow.addEventListener('click', (event) => {
      if ((event.target as Element).closest('pulse-command-output')) return;
      this.focus();
    });
  }

  private async handleCommand(command: string): Promise<unknown> {
    try {
      const result = await this.registry.executeCommand(command);

      // Don't add output for commands that return null (like clear)
      if (result !== null && result !== undefined) {
        const output = String(result);
        this.addOutput(output, command);
      }

      this.emit('pulse-command', { command, result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const output = this.addOutput(
        `<span class="error">${this.escapeHtml(errorMessage)}</span>`,
        command
      );
      output.classList.add('error-output');

      this.emit('pulse-command', {
        command,
        error: error instanceof Error ? error : new Error(errorMessage),
      });

      throw error;
    }
  }

  private removeOutput(id: string): void {
    const index = this.outputs.findIndex(o => o.id === id);
    if (index !== -1) {
      this.outputs[index].remove();
      this.outputs.splice(index, 1);
    }
  }

  private enforceMaxOutputs(): void {
    const max = this.getNumAttr('max-outputs', 50);
    while (this.outputs.length > max) {
      const oldest = this.outputs.shift();
      oldest?.remove();
    }
  }

  private scrollToBottom(): void {
    if (this.outputContainer) {
      this.outputContainer.scrollTop = this.outputContainer.scrollHeight;
    }
  }

  private formatOutput(content: string): string {
    // If content looks like it might be pre-formatted, wrap in pre
    if (content.includes('\n') && !content.includes('<')) {
      return `<pre>${this.escapeHtml(content)}</pre>`;
    }
    return content;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'prompt':
        this.commandLine?.setAttribute('prompt', newValue);
        break;
      case 'theme':
        if (newValue && PulseTerminal.getThemeByName(newValue)) {
          this.setTheme(newValue);
        }
        break;
    }
  }

  private getStyles(): string {
    return `
      ${getBaseStyles()}

      :host {
        display: block;
        height: 100%;
      }

      .terminal {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--pulse-bg);
        font-family: var(--pulse-font-family);
      }

      .output-container {
        flex: 1;
        overflow-y: auto;
        padding: var(--pulse-spacing-md);
        display: flex;
        flex-direction: column;
        gap: var(--pulse-spacing-md);
      }

      /* Scrollbar styling */
      .output-container::-webkit-scrollbar {
        width: 8px;
      }

      .output-container::-webkit-scrollbar-track {
        background: var(--pulse-bg-secondary);
      }

      .output-container::-webkit-scrollbar-thumb {
        background: var(--pulse-border);
        border-radius: 4px;
      }

      .output-container::-webkit-scrollbar-thumb:hover {
        background: var(--pulse-text-muted);
      }

      pulse-command-line {
        border-top: 1px solid var(--pulse-border);
      }

      pulse-command-output {
        animation: slideIn 0.2s ease-out;
      }

      pulse-command-output.error-output {
        --pulse-border: var(--pulse-error);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .error {
        color: var(--pulse-error);
      }
    `;
  }
}

// Register the custom element
if (typeof customElements !== 'undefined' && !customElements.get('pulse-terminal')) {
  customElements.define('pulse-terminal', PulseTerminal);
}
