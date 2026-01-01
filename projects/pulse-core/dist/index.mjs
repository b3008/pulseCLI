import {
  CommandHistory,
  CommandOption,
  CommandParser,
  CommandRegistry,
  PulseCommand,
  PulseTerminal
} from "./chunk-4UN3EZOE.mjs";
import {
  PulseCommandLine
} from "./chunk-44FZ76F7.mjs";
import {
  PulseCommandOutput
} from "./chunk-7EW2XGVE.mjs";
import {
  PULSE_CSS_VARS,
  PULSE_THEMES,
  PulseBaseComponent,
  __publicField,
  darkTheme,
  getBaseStyles,
  highContrastTheme,
  lightTheme,
  themeToCSS
} from "./chunk-ZF76DJ4G.mjs";

// src/storage/StorageAdapters.ts
var MemoryStorageAdapter = class {
  constructor() {
    __publicField(this, "store", /* @__PURE__ */ new Map());
  }
  async get(key) {
    return this.store.get(key) ?? null;
  }
  async set(key, value) {
    this.store.set(key, value);
  }
  async remove(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
};
var LocalStorageAdapter = class {
  constructor(prefix = "pulse-cli") {
    __publicField(this, "prefix");
    this.prefix = prefix;
  }
  getKey(key) {
    return `${this.prefix}:${key}`;
  }
  async get(key) {
    try {
      return localStorage.getItem(this.getKey(key));
    } catch {
      return null;
    }
  }
  async set(key, value) {
    try {
      localStorage.setItem(this.getKey(key), value);
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  }
  async remove(key) {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch {
    }
  }
};
var SessionStorageAdapter = class {
  constructor(prefix = "pulse-cli") {
    __publicField(this, "prefix");
    this.prefix = prefix;
  }
  getKey(key) {
    return `${this.prefix}:${key}`;
  }
  async get(key) {
    try {
      return sessionStorage.getItem(this.getKey(key));
    } catch {
      return null;
    }
  }
  async set(key, value) {
    try {
      sessionStorage.setItem(this.getKey(key), value);
    } catch (error) {
      console.warn("Failed to save to sessionStorage:", error);
    }
  }
  async remove(key) {
    try {
      sessionStorage.removeItem(this.getKey(key));
    } catch {
    }
  }
};
function createStorageAdapter(prefix = "pulse-cli") {
  if (typeof localStorage !== "undefined") {
    try {
      const testKey = `${prefix}:test`;
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return new LocalStorageAdapter(prefix);
    } catch {
    }
  }
  return new MemoryStorageAdapter();
}

// src/utils/helpers.ts
function escapeHtml(text) {
  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] ?? char);
}
function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").toLowerCase();
}
function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
function uniqueId(prefix = "pulse") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function supportsCustomElements() {
  return isBrowser() && typeof customElements !== "undefined";
}
function waitFor(condition, timeout = 5e3, interval = 100) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error("Condition not met within timeout"));
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  });
}
function formatDuration(ms) {
  if (ms < 1e3) return `${ms}ms`;
  if (ms < 6e4) return `${(ms / 1e3).toFixed(1)}s`;
  const minutes = Math.floor(ms / 6e4);
  const seconds = (ms % 6e4 / 1e3).toFixed(0);
  return `${minutes}m ${seconds}s`;
}
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

// src/index.ts
var VERSION = "0.1.0";
function defineElements() {
  import("./CommandLine-JE445Z25.mjs");
  import("./CommandOutput-SWOK5AIT.mjs");
  import("./PulseTerminal-TQV2GJ2L.mjs");
}
export {
  CommandHistory,
  CommandOption,
  CommandParser,
  CommandRegistry,
  LocalStorageAdapter,
  MemoryStorageAdapter,
  PULSE_CSS_VARS,
  PULSE_THEMES,
  PulseBaseComponent,
  PulseCommand,
  PulseCommandLine,
  PulseCommandOutput,
  PulseTerminal,
  SessionStorageAdapter,
  VERSION,
  camelToKebab,
  createStorageAdapter,
  darkTheme,
  debounce,
  deepClone,
  defineElements,
  escapeHtml,
  formatDuration,
  getBaseStyles,
  highContrastTheme,
  isBrowser,
  kebabToCamel,
  lightTheme,
  supportsCustomElements,
  themeToCSS,
  throttle,
  uniqueId,
  waitFor
};
