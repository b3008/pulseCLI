/**
 * Theme configuration for PulseCLI components
 */
export interface PulseTheme {
  // Colors
  bg: string;
  bgSecondary: string;
  text: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  error: string;
  success: string;
  warning: string;
  border: string;

  // Typography
  fontFamily: string;
  fontSize: string;
  lineHeight: string;

  // Spacing
  spacingXs: string;
  spacingSm: string;
  spacingMd: string;
  spacingLg: string;

  // Other
  radius: string;
  transition: string;
}

/**
 * Dark theme (default)
 */
export const darkTheme: PulseTheme = {
  bg: "#1a1a2e",
  bgSecondary: "#16213e",
  text: "#eee",
  textMuted: "#888",
  accent: "#00d4ff",
  accentHover: "#00b8e6",
  error: "#ff4757",
  success: "#2ed573",
  warning: "#ffa502",
  border: "#333",
  fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
  fontSize: "14px",
  lineHeight: "1.5",
  spacingXs: "4px",
  spacingSm: "8px",
  spacingMd: "16px",
  spacingLg: "24px",
  radius: "4px",
  transition: "0.2s ease",
};

/**
 * Light theme
 */
export const lightTheme: PulseTheme = {
  bg: "#ffffff",
  bgSecondary: "#f5f5f5",
  text: "#1a1a2e",
  textMuted: "#666666",
  accent: "#0066cc",
  accentHover: "#0052a3",
  error: "#dc3545",
  success: "#28a745",
  warning: "#ffc107",
  border: "#dddddd",
  fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
  fontSize: "14px",
  lineHeight: "1.5",
  spacingXs: "4px",
  spacingSm: "8px",
  spacingMd: "16px",
  spacingLg: "24px",
  radius: "4px",
  transition: "0.2s ease",
};

/**
 * High contrast theme for accessibility
 */
export const highContrastTheme: PulseTheme = {
  bg: "#000000",
  bgSecondary: "#111111",
  text: "#ffffff",
  textMuted: "#cccccc",
  accent: "#ffff00",
  accentHover: "#ffcc00",
  error: "#ff6666",
  success: "#66ff66",
  warning: "#ffcc00",
  border: "#ffffff",
  fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
  fontSize: "14px",
  lineHeight: "1.5",
  spacingXs: "4px",
  spacingSm: "8px",
  spacingMd: "16px",
  spacingLg: "24px",
  radius: "4px",
  transition: "0.2s ease",
};

/**
 * Primal theme - Clean, modern design inspired by PrimeNG
 * Features a light background with deep navy accents
 */
export const primalTheme: PulseTheme = {
  bg: "#ffffff",
  bgSecondary: "#f8fafc",
  text: "#1e293b",
  textMuted: "#64748b",
  accent: "#1f2b5b",
  accentHover: "#2d3a6e",
  error: "#f87171",
  success: "#22c55e",
  warning: "#f59e0b",
  border: "#e2e8f0",
  fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
  fontSize: "14px",
  lineHeight: "1.5",
  spacingXs: "4px",
  spacingSm: "8px",
  spacingMd: "16px",
  spacingLg: "24px",
  radius: "8px",
  transition: "0.15s ease",
};

/**
 * All available theme presets
 */
export const PULSE_THEMES = {
  dark: darkTheme,
  light: lightTheme,
  "high-contrast": highContrastTheme,
  primal: primalTheme,
} as const;

export type ThemePreset = keyof typeof PULSE_THEMES;

/**
 * Convert a theme object to CSS variable declarations
 */
export function themeToCSS(theme: PulseTheme): string {
  return `
    --pulse-bg: ${theme.bg};
    --pulse-bg-secondary: ${theme.bgSecondary};
    --pulse-text: ${theme.text};
    --pulse-text-muted: ${theme.textMuted};
    --pulse-accent: ${theme.accent};
    --pulse-accent-hover: ${theme.accentHover};
    --pulse-error: ${theme.error};
    --pulse-success: ${theme.success};
    --pulse-warning: ${theme.warning};
    --pulse-border: ${theme.border};
    --pulse-font-family: ${theme.fontFamily};
    --pulse-font-size: ${theme.fontSize};
    --pulse-line-height: ${theme.lineHeight};
    --pulse-spacing-xs: ${theme.spacingXs};
    --pulse-spacing-sm: ${theme.spacingSm};
    --pulse-spacing-md: ${theme.spacingMd};
    --pulse-spacing-lg: ${theme.spacingLg};
    --pulse-radius: ${theme.radius};
    --pulse-transition: ${theme.transition};
  `;
}

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
    this.shadow = this.attachShadow({ mode: "open" });
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
    const style = document.createElement("style");
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
  protected getAttr(name: string, defaultValue: string = ""): string {
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
 * @deprecated Use PULSE_THEMES and themeToCSS instead
 */
export const PULSE_CSS_VARS = {
  // Colors
  "--pulse-bg": darkTheme.bg,
  "--pulse-bg-secondary": darkTheme.bgSecondary,
  "--pulse-text": darkTheme.text,
  "--pulse-text-muted": darkTheme.textMuted,
  "--pulse-accent": darkTheme.accent,
  "--pulse-accent-hover": darkTheme.accentHover,
  "--pulse-error": darkTheme.error,
  "--pulse-success": darkTheme.success,
  "--pulse-warning": darkTheme.warning,
  "--pulse-border": darkTheme.border,

  // Typography
  "--pulse-font-family": darkTheme.fontFamily,
  "--pulse-font-size": darkTheme.fontSize,
  "--pulse-line-height": darkTheme.lineHeight,

  // Spacing
  "--pulse-spacing-xs": darkTheme.spacingXs,
  "--pulse-spacing-sm": darkTheme.spacingSm,
  "--pulse-spacing-md": darkTheme.spacingMd,
  "--pulse-spacing-lg": darkTheme.spacingLg,

  // Border radius
  "--pulse-radius": darkTheme.radius,

  // Transitions
  "--pulse-transition": darkTheme.transition,
} as const;

/**
 * Generate base CSS (without theme - theme is applied separately)
 */
export function getBaseStyles(): string {
  return `
    * {
      box-sizing: border-box;
    }
  `;
}
