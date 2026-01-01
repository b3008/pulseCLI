var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/components/BaseComponent.ts
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
  "--pulse-bg": "#1a1a2e",
  "--pulse-bg-secondary": "#16213e",
  "--pulse-text": "#eee",
  "--pulse-text-muted": "#888",
  "--pulse-accent": "#00d4ff",
  "--pulse-accent-hover": "#00b8e6",
  "--pulse-error": "#ff4757",
  "--pulse-success": "#2ed573",
  "--pulse-warning": "#ffa502",
  "--pulse-border": "#333",
  // Typography
  "--pulse-font-family": "'Fira Code', 'Monaco', 'Consolas', monospace",
  "--pulse-font-size": "14px",
  "--pulse-line-height": "1.5",
  // Spacing
  "--pulse-spacing-xs": "4px",
  "--pulse-spacing-sm": "8px",
  "--pulse-spacing-md": "16px",
  "--pulse-spacing-lg": "24px",
  // Border radius
  "--pulse-radius": "4px",
  // Transitions
  "--pulse-transition": "0.2s ease"
};
function getBaseStyles() {
  return `
    :host {
      ${Object.entries(PULSE_CSS_VARS).map(([key, value]) => `${key}: ${value};`).join("\n      ")}
    }

    * {
      box-sizing: border-box;
    }
  `;
}

export {
  __publicField,
  PulseBaseComponent,
  PULSE_CSS_VARS,
  getBaseStyles
};
