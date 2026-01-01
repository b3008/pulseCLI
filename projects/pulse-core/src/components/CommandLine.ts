import { PulseBaseComponent, getBaseStyles } from './BaseComponent';
import type { CommandRegistry } from '../core/CommandRegistry';

/**
 * Events emitted by pulse-command-line
 */
export interface CommandLineEvents {
  /** Emitted when a command is submitted */
  'pulse-submit': { command: string };
  /** Emitted when input value changes */
  'pulse-change': { value: string };
  /** Emitted when autocomplete suggestions are available */
  'pulse-suggestions': { suggestions: string[] };
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
export class PulseCommandLine extends PulseBaseComponent {
  static get observedAttributes(): string[] {
    return ['prompt', 'placeholder', 'disabled'];
  }

  private input: HTMLInputElement | null = null;
  private registry: CommandRegistry | null = null;
  private suggestionIndex = -1;
  private currentSuggestions: string[] = [];

  /**
   * Connect this command line to a registry for autocomplete
   */
  setRegistry(registry: CommandRegistry): void {
    this.registry = registry;
  }

  /**
   * Get the current input value
   */
  get value(): string {
    return this.input?.value ?? '';
  }

  /**
   * Set the input value
   */
  set value(val: string) {
    if (this.input) {
      this.input.value = val;
    }
  }

  /**
   * Focus the input element
   */
  focus(): void {
    this.input?.focus();
  }

  /**
   * Clear the input
   */
  clear(): void {
    if (this.input) {
      this.input.value = '';
      this.currentSuggestions = [];
      this.suggestionIndex = -1;
    }
  }

  protected render(): void {
    const prompt = this.getAttr('prompt', '>');
    const placeholder = this.getAttr('placeholder', 'Enter command...');
    const disabled = this.getBoolAttr('disabled');

    this.injectStyles(this.getStyles());

    const container = document.createElement('div');
    container.className = 'command-line';
    container.setAttribute('part', 'command-line');

    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.setAttribute('part', 'prompt');
    promptSpan.textContent = prompt;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input';
    input.setAttribute('part', 'input');
    input.placeholder = placeholder;
    input.disabled = disabled;
    input.spellcheck = false;
    input.autocomplete = 'off';

    container.appendChild(promptSpan);
    container.appendChild(input);
    this.shadow.appendChild(container);

    this.input = input;

    if (this.getBoolAttr('autofocus')) {
      requestAnimationFrame(() => this.focus());
    }
  }

  protected setupEventListeners(): void {
    if (!this.input) return;

    this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.input.addEventListener('input', this.handleInput.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        this.handleSubmit();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.navigateHistory(-1);
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.navigateHistory(1);
        break;

      case 'Tab':
        event.preventDefault();
        this.handleAutocomplete();
        break;

      case 'Escape':
        this.clear();
        break;
    }
  }

  private handleInput(): void {
    const value = this.value;
    this.emit('pulse-change', { value });
    this.updateSuggestions();
  }

  private handleSubmit(): void {
    const command = this.value.trim();
    if (!command) return;

    this.emit('pulse-submit', { command });
    this.clear();
  }

  private navigateHistory(direction: -1 | 1): void {
    if (!this.registry) return;

    const historyValue = direction === -1
      ? this.registry.history.getPrevious()
      : this.registry.history.getNext();

    if (historyValue !== undefined) {
      this.value = historyValue;
      // Move cursor to end
      requestAnimationFrame(() => {
        if (this.input) {
          this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
        }
      });
    } else if (direction === 1) {
      this.clear();
    }
  }

  private updateSuggestions(): void {
    if (!this.registry) return;

    const value = this.value;
    this.currentSuggestions = value
      ? this.registry.getAutofillSuggestions(value)
      : [];
    this.suggestionIndex = -1;

    this.emit('pulse-suggestions', { suggestions: this.currentSuggestions });
  }

  private handleAutocomplete(): void {
    if (this.currentSuggestions.length === 0) return;

    this.suggestionIndex = (this.suggestionIndex + 1) % this.currentSuggestions.length;
    const suggestion = this.currentSuggestions[this.suggestionIndex];

    if (suggestion) {
      this.value = suggestion + ' ';
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'prompt':
        const promptEl = this.$('.prompt');
        if (promptEl) promptEl.textContent = newValue;
        break;

      case 'placeholder':
        if (this.input) this.input.placeholder = newValue;
        break;

      case 'disabled':
        if (this.input) this.input.disabled = this.getBoolAttr('disabled');
        break;
    }
  }

  private getStyles(): string {
    return `
      ${getBaseStyles()}

      .command-line {
        display: flex;
        align-items: center;
        gap: var(--pulse-spacing-sm);
        padding: var(--pulse-spacing-sm) var(--pulse-spacing-md);
        background: var(--pulse-bg);
        border: 1px solid var(--pulse-border);
        border-radius: var(--pulse-radius);
        font-family: var(--pulse-font-family);
        font-size: var(--pulse-font-size);
      }

      .prompt {
        color: var(--pulse-accent);
        user-select: none;
        font-weight: bold;
      }

      .input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--pulse-text);
        font-family: inherit;
        font-size: inherit;
        line-height: var(--pulse-line-height);
        caret-color: var(--pulse-accent);
      }

      .input::placeholder {
        color: var(--pulse-text-muted);
      }

      .input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      :host([focused]) .command-line {
        border-color: var(--pulse-accent);
      }
    `;
  }
}

// Register the custom element
if (typeof customElements !== 'undefined' && !customElements.get('pulse-command-line')) {
  customElements.define('pulse-command-line', PulseCommandLine);
}
