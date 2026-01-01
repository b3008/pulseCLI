/**
 * Base class for PulseCLI Web Components
 *
 * Provides common functionality for all components:
 * - Shadow DOM encapsulation
 * - Style injection
 * - Event helper methods
 */
export abstract class PulseBaseComponent extends HTMLElement {
  protected shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  /**
   * Called when element is added to DOM
   */
  connectedCallback(): void {
    this.render();
    this.setupEventListeners();
  }

  /**
   * Called when element is removed from DOM
   */
  disconnectedCallback(): void {
    this.cleanup();
  }

  /**
   * Render the component (must be implemented by subclasses)
   */
  protected abstract render(): void;

  /**
   * Set up event listeners (override in subclasses)
   */
  protected setupEventListeners(): void {
    // Override in subclasses
  }

  /**
   * Cleanup when component is removed (override in subclasses)
   */
  protected cleanup(): void {
    // Override in subclasses
  }

  /**
   * Create and inject a style element
   */
  protected injectStyles(css: string): void {
    const style = document.createElement('style');
    style.textContent = css;
    this.shadow.appendChild(style);
  }

  /**
   * Emit a custom event
   */
  protected emit<T>(eventName: string, detail: T): void {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true, // Allows event to cross shadow DOM boundary
      })
    );
  }

  /**
   * Query an element within shadow DOM
   */
  protected $(selector: string): Element | null {
    return this.shadow.querySelector(selector);
  }

  /**
   * Query all elements within shadow DOM
   */
  protected $$(selector: string): NodeListOf<Element> {
    return this.shadow.querySelectorAll(selector);
  }

  /**
   * Get attribute with default value
   */
  protected getAttr(name: string, defaultValue: string = ''): string {
    return this.getAttribute(name) ?? defaultValue;
  }

  /**
   * Get boolean attribute
   */
  protected getBoolAttr(name: string): boolean {
    return this.hasAttribute(name);
  }

  /**
   * Get numeric attribute
   */
  protected getNumAttr(name: string, defaultValue: number = 0): number {
    const value = this.getAttribute(name);
    if (value === null) return defaultValue;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  }
}

/**
 * CSS custom properties (CSS variables) used by PulseCLI components
 */
export const PULSE_CSS_VARS = {
  // Colors
  '--pulse-bg': '#1a1a2e',
  '--pulse-bg-secondary': '#16213e',
  '--pulse-text': '#eee',
  '--pulse-text-muted': '#888',
  '--pulse-accent': '#00d4ff',
  '--pulse-accent-hover': '#00b8e6',
  '--pulse-error': '#ff4757',
  '--pulse-success': '#2ed573',
  '--pulse-warning': '#ffa502',
  '--pulse-border': '#333',

  // Typography
  '--pulse-font-family': "'Fira Code', 'Monaco', 'Consolas', monospace",
  '--pulse-font-size': '14px',
  '--pulse-line-height': '1.5',

  // Spacing
  '--pulse-spacing-xs': '4px',
  '--pulse-spacing-sm': '8px',
  '--pulse-spacing-md': '16px',
  '--pulse-spacing-lg': '24px',

  // Border radius
  '--pulse-radius': '4px',

  // Transitions
  '--pulse-transition': '0.2s ease',
} as const;

/**
 * Generate base CSS with custom properties
 */
export function getBaseStyles(): string {
  return `
    :host {
      ${Object.entries(PULSE_CSS_VARS)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n      ')}
    }

    * {
      box-sizing: border-box;
    }
  `;
}
