var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/components/BaseComponent.ts
var darkTheme = {
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
  transition: "0.2s ease"
};
var lightTheme = {
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
  transition: "0.2s ease"
};
var highContrastTheme = {
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
  transition: "0.2s ease"
};
var PULSE_THEMES = {
  dark: darkTheme,
  light: lightTheme,
  "high-contrast": highContrastTheme
};
function themeToCSS(theme) {
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
var PulseBaseComponent = class extends HTMLElement {
  constructor() {
    super();
    __publicField(this, "shadow");
    this.shadow = this.attachShadow({ mode: "open" });
  }
  /**
   * Called when element is added to DOM
   */
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  /**
   * Called when element is removed from DOM
   */
  disconnectedCallback() {
    this.cleanup();
  }
  /**
   * Set up event listeners (override in subclasses)
   */
  setupEventListeners() {
  }
  /**
   * Cleanup when component is removed (override in subclasses)
   */
  cleanup() {
  }
  /**
   * Create and inject a style element
   */
  injectStyles(css) {
    const style = document.createElement("style");
    style.textContent = css;
    this.shadow.appendChild(style);
  }
  /**
   * Emit a custom event
   */
  emit(eventName, detail) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true
        // Allows event to cross shadow DOM boundary
      })
    );
  }
  /**
   * Query an element within shadow DOM
   */
  $(selector) {
    return this.shadow.querySelector(selector);
  }
  /**
   * Query all elements within shadow DOM
   */
  $$(selector) {
    return this.shadow.querySelectorAll(selector);
  }
  /**
   * Get attribute with default value
   */
  getAttr(name, defaultValue = "") {
    return this.getAttribute(name) ?? defaultValue;
  }
  /**
   * Get boolean attribute
   */
  getBoolAttr(name) {
    return this.hasAttribute(name);
  }
  /**
   * Get numeric attribute
   */
  getNumAttr(name, defaultValue = 0) {
    const value = this.getAttribute(name);
    if (value === null) return defaultValue;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  }
};
var PULSE_CSS_VARS = {
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
  "--pulse-transition": darkTheme.transition
};
function getBaseStyles(theme = darkTheme) {
  return `
    :host {
      ${themeToCSS(theme)}
    }

    * {
      box-sizing: border-box;
    }
  `;
}

export {
  __publicField,
  darkTheme,
  lightTheme,
  highContrastTheme,
  PULSE_THEMES,
  themeToCSS,
  PulseBaseComponent,
  PULSE_CSS_VARS,
  getBaseStyles
};
