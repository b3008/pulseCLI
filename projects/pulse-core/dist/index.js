"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/core/Option.ts
var CommandOption;
var init_Option = __esm({
  "src/core/Option.ts"() {
    "use strict";
    CommandOption = class {
      constructor(flags, description) {
        __publicField(this, "flags");
        __publicField(this, "short", null);
        __publicField(this, "long", null);
        __publicField(this, "description");
        __publicField(this, "required");
        __publicField(this, "optional");
        __publicField(this, "isBoolean");
        this.flags = flags;
        this.description = description;
        this.required = flags.includes("<");
        this.optional = flags.includes("[");
        this.isBoolean = !this.required && !this.optional;
        const flagParts = flags.split(/[,|\s]+/).filter((part) => part.startsWith("-"));
        for (const part of flagParts) {
          if (part.startsWith("--")) {
            this.long = part.split(/[\s<\[]/)[0];
          } else if (part.startsWith("-") && !part.startsWith("--")) {
            this.short = part.split(/[\s<\[]/)[0];
          }
        }
      }
      /**
       * Get the canonical name of this option (without dashes)
       */
      name() {
        if (this.long) {
          return this.long.replace(/^--/, "").replace(/^no-/, "");
        }
        if (this.short) {
          return this.short.replace(/^-/, "");
        }
        return "";
      }
      /**
       * Check if the given argument matches this option
       */
      matches(arg) {
        return arg === this.short || arg === this.long;
      }
      /**
       * Convert to a human-readable string representation
       */
      toString() {
        return `${this.flags}: ${this.description}`;
      }
    };
  }
});

// src/core/Command.ts
var PulseCommand;
var init_Command = __esm({
  "src/core/Command.ts"() {
    "use strict";
    init_Option();
    PulseCommand = class {
      constructor(commandString, description, category = "general") {
        __publicField(this, "name");
        __publicField(this, "description");
        __publicField(this, "category");
        __publicField(this, "positionalArgs", []);
        __publicField(this, "options", []);
        __publicField(this, "callback", null);
        __publicField(this, "commandString");
        this.commandString = commandString;
        this.description = description;
        this.category = category;
        const argPattern = /[<\[][\w]+[>\]]/g;
        const argStartIndex = this.findFirstArgIndex(commandString);
        this.name = commandString.substring(0, argStartIndex).trim();
        this.positionalArgs = commandString.match(argPattern) || [];
      }
      /**
       * Find the index where positional arguments begin
       */
      findFirstArgIndex(str) {
        const requiredIndex = str.indexOf("<");
        const optionalIndex = str.indexOf("[");
        if (requiredIndex === -1 && optionalIndex === -1) {
          return str.length;
        }
        if (requiredIndex === -1) return optionalIndex;
        if (optionalIndex === -1) return requiredIndex;
        return Math.min(requiredIndex, optionalIndex);
      }
      /**
       * Add an option/flag to this command
       *
       * @param flags - Option flags (e.g., '-v, --verbose' or '-o, --output <file>')
       * @param description - Description of the option
       * @returns this for method chaining
       */
      option(flags, description) {
        const opt = new CommandOption(flags, description);
        this.options.push(opt);
        return this;
      }
      /**
       * Set the action callback for this command
       *
       * @param callback - Function to execute when command is invoked
       * @returns this for method chaining
       */
      action(callback) {
        this.callback = callback;
        return this;
      }
      /**
       * Execute this command with the given arguments
       *
       * @param args - Parsed arguments including positional args and options
       * @param commandString - The original command string
       * @returns Promise that resolves with the command result
       */
      execute(args, commandString) {
        return new Promise((resolve, reject) => {
          if (!this.callback) {
            reject(new Error(`No action defined for command: ${this.name}`));
            return;
          }
          try {
            const result = this.callback(args, commandString, resolve, reject);
            if (result instanceof Promise) {
              result.catch(reject);
            }
          } catch (error) {
            reject(error);
          }
        });
      }
      /**
       * Get a usage example string for this command
       */
      getUsageExample() {
        const parts = [this.name];
        for (const arg of this.positionalArgs) {
          const argName = arg.slice(1, -1);
          parts.push(argName);
        }
        for (const opt of this.options) {
          if (opt.long) {
            const valueMatch = opt.flags.match(/[<\[][\w]+[>\]]/);
            const value = valueMatch ? ` ${valueMatch[0].slice(1, -1)}` : "";
            parts.push(`${opt.long}${value}`);
          }
        }
        return parts.join(" ");
      }
      /**
       * Get the argument name without brackets
       */
      getArgName(arg) {
        return arg.slice(1, -1);
      }
      /**
       * Check if an argument is required (uses < >)
       */
      isArgRequired(arg) {
        return arg.startsWith("<") && arg.endsWith(">");
      }
      /**
       * Convert to a human-readable string
       */
      toString() {
        return `${this.commandString}: ${this.description}`;
      }
    };
  }
});

// src/core/CommandParser.ts
var CommandParser;
var init_CommandParser = __esm({
  "src/core/CommandParser.ts"() {
    "use strict";
    CommandParser = class {
      /**
       * Parse a command string against a registry of commands
       *
       * @param commandString - The raw command input
       * @param commands - Map of registered commands
       * @returns ParseResult with matched command and parsed args
       */
      parse(commandString, commands) {
        const trimmed = commandString.trim();
        if (!trimmed) {
          return this.createEmptyResult(commandString);
        }
        const { processed, quotedStrings } = this.extractQuotedStrings(trimmed);
        const { commandPortion, optionsPortion } = this.splitCommandAndOptions(processed);
        const { command, positionalValues } = this.findCommand(commandPortion, commands);
        if (!command) {
          return {
            command: null,
            args: {},
            options: {},
            commandString: trimmed
          };
        }
        const args = this.parsePositionalArgs(command, positionalValues, quotedStrings);
        const options = this.parseOptions(command, optionsPortion, quotedStrings);
        args["options"] = options;
        return {
          command,
          args,
          options,
          commandString: trimmed
        };
      }
      /**
       * Create an empty parse result
       */
      createEmptyResult(commandString) {
        return {
          command: null,
          args: {},
          options: {},
          commandString
        };
      }
      /**
       * Extract quoted strings and replace with placeholders
       */
      extractQuotedStrings(input) {
        const quotedStrings = /* @__PURE__ */ new Map();
        let processed = input;
        let counter = 0;
        const quotedRegex = /(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/g;
        let match;
        while ((match = quotedRegex.exec(input)) !== null) {
          const placeholder = `__QUOTED_${counter}__`;
          const fullMatch = match[0];
          const value = fullMatch.slice(1, -1);
          quotedStrings.set(placeholder, value);
          processed = processed.replace(fullMatch, placeholder);
          counter++;
        }
        return { processed, quotedStrings };
      }
      /**
       * Split command string into command/args portion and options portion
       */
      splitCommandAndOptions(input) {
        const optionStart = input.search(/\s--?[a-zA-Z]/);
        if (optionStart === -1) {
          return {
            commandPortion: input.trim(),
            optionsPortion: ""
          };
        }
        return {
          commandPortion: input.substring(0, optionStart).trim(),
          optionsPortion: input.substring(optionStart).trim()
        };
      }
      /**
       * Find a matching command from the registry
       */
      findCommand(commandPortion, commands) {
        const commandNames = Array.from(commands.keys()).sort();
        for (const name of commandNames.sort((a, b) => b.length - a.length)) {
          if (commandPortion === name || commandPortion.startsWith(name + " ")) {
            const rest = commandPortion.substring(name.length).trim();
            const positionalValues = rest ? rest.split(/\s+/).filter((s) => s.length > 0) : [];
            return {
              command: commands.get(name) ?? null,
              positionalValues
            };
          }
        }
        const candidates = commandNames.filter(
          (name) => name.startsWith(commandPortion.split(" ")[0])
        );
        if (candidates.length === 1) {
          const name = candidates[0];
          const rest = commandPortion.substring(commandPortion.indexOf(" ")).trim();
          const positionalValues = rest ? rest.split(/\s+/).filter((s) => s.length > 0) : [];
          return {
            command: commands.get(name) ?? null,
            positionalValues
          };
        }
        return { command: null, positionalValues: [] };
      }
      /**
       * Parse positional arguments
       */
      parsePositionalArgs(command, values, quotedStrings) {
        const args = {};
        command.positionalArgs.forEach((argDef, index) => {
          const argName = argDef.slice(1, -1);
          let value = values[index];
          if (value !== void 0) {
            value = this.restoreQuotedString(value, quotedStrings);
            args[argName] = value;
          }
        });
        return args;
      }
      /**
       * Parse command options
       */
      parseOptions(command, optionsPortion, quotedStrings) {
        if (!optionsPortion) {
          return {};
        }
        const tokens = optionsPortion.split(/\s+/).filter((t) => t.length > 0);
        const rawOptions = /* @__PURE__ */ new Map();
        let currentFlag = null;
        for (const token of tokens) {
          if (token.startsWith("-")) {
            if (currentFlag !== null) {
              if (!rawOptions.has(currentFlag)) {
                rawOptions.set(currentFlag, []);
              }
            }
            currentFlag = token;
            if (!rawOptions.has(currentFlag)) {
              rawOptions.set(currentFlag, []);
            }
          } else if (currentFlag !== null) {
            const existing = rawOptions.get(currentFlag) ?? [];
            existing.push(this.restoreQuotedString(token, quotedStrings));
            rawOptions.set(currentFlag, existing);
            currentFlag = null;
          }
        }
        const options = {};
        for (const opt of command.options) {
          const name = opt.name();
          let values = [];
          let flagFound = false;
          if (opt.short && rawOptions.has(opt.short)) {
            flagFound = true;
            values = values.concat(rawOptions.get(opt.short) ?? []);
          }
          if (opt.long && rawOptions.has(opt.long)) {
            flagFound = true;
            values = values.concat(rawOptions.get(opt.long) ?? []);
          }
          if (values.length > 0) {
            options[name] = values.length === 1 ? values[0] : values;
          } else if (flagFound) {
            options[name] = true;
          }
        }
        return options;
      }
      /**
       * Restore a quoted string from its placeholder
       */
      restoreQuotedString(value, quotedStrings) {
        if (quotedStrings.has(value)) {
          return quotedStrings.get(value);
        }
        return value;
      }
      /**
       * Get autocomplete suggestions for a partial command
       */
      getAutocompleteSuggestions(partial, commands) {
        const trimmed = partial.trim().toLowerCase();
        if (!trimmed) {
          return Array.from(commands.keys()).sort();
        }
        return Array.from(commands.keys()).filter((name) => name.toLowerCase().startsWith(trimmed)).sort();
      }
    };
  }
});

// src/core/CommandHistory.ts
var DefaultStorageAdapter, CommandHistory;
var init_CommandHistory = __esm({
  "src/core/CommandHistory.ts"() {
    "use strict";
    DefaultStorageAdapter = class {
      constructor() {
        __publicField(this, "memoryStore", /* @__PURE__ */ new Map());
        __publicField(this, "useLocalStorage");
        this.useLocalStorage = typeof localStorage !== "undefined";
      }
      async get(key) {
        if (this.useLocalStorage) {
          return localStorage.getItem(key);
        }
        return this.memoryStore.get(key) ?? null;
      }
      async set(key, value) {
        if (this.useLocalStorage) {
          localStorage.setItem(key, value);
        } else {
          this.memoryStore.set(key, value);
        }
      }
      async remove(key) {
        if (this.useLocalStorage) {
          localStorage.removeItem(key);
        } else {
          this.memoryStore.delete(key);
        }
      }
    };
    CommandHistory = class {
      constructor(options = {}) {
        __publicField(this, "history", []);
        __publicField(this, "index", -1);
        __publicField(this, "maxSize");
        __publicField(this, "storageKey");
        __publicField(this, "storage");
        __publicField(this, "persist");
        this.maxSize = options.maxSize ?? 100;
        this.storageKey = options.storageKey ?? "pulse-cli-history";
        this.storage = options.storage ?? new DefaultStorageAdapter();
        this.persist = options.persist ?? true;
        if (this.persist) {
          this.load();
        }
      }
      /**
       * Load history from storage
       */
      async load() {
        try {
          const stored = await this.storage.get(this.storageKey);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              this.history = parsed.slice(-this.maxSize);
              this.index = this.history.length;
            }
          }
        } catch (error) {
          console.warn("Failed to load command history:", error);
        }
      }
      /**
       * Save history to storage
       */
      async save() {
        if (!this.persist) return;
        try {
          await this.storage.set(this.storageKey, JSON.stringify(this.history));
        } catch (error) {
          console.warn("Failed to save command history:", error);
        }
      }
      /**
       * Add a command to history
       *
       * @param command - The command string to add
       */
      add(command) {
        const trimmed = command.trim();
        if (!trimmed) return;
        if (this.history[this.history.length - 1] === trimmed) {
          this.index = this.history.length;
          return;
        }
        this.history.push(trimmed);
        if (this.history.length > this.maxSize) {
          this.history.shift();
        }
        this.index = this.history.length;
        this.save();
      }
      /**
       * Get the previous command in history (navigate up)
       *
       * @returns The previous command or undefined if at the beginning
       */
      getPrevious() {
        if (this.history.length === 0) return void 0;
        if (this.index > 0) {
          this.index--;
        }
        return this.history[this.index];
      }
      /**
       * Get the next command in history (navigate down)
       *
       * @returns The next command or undefined if at the end
       */
      getNext() {
        if (this.history.length === 0) return void 0;
        if (this.index < this.history.length - 1) {
          this.index++;
          return this.history[this.index];
        }
        this.index = this.history.length;
        return void 0;
      }
      /**
       * Get all commands in history
       */
      getAll() {
        return [...this.history];
      }
      /**
       * Clear all history
       */
      clear() {
        this.history = [];
        this.index = 0;
        this.save();
      }
      /**
       * Reset navigation index to the end
       */
      resetIndex() {
        this.index = this.history.length;
      }
      /**
       * Search history for commands matching a pattern
       *
       * @param pattern - String or RegExp to match
       * @returns Array of matching commands
       */
      search(pattern) {
        const regex = typeof pattern === "string" ? new RegExp(pattern, "i") : pattern;
        return this.history.filter((cmd) => regex.test(cmd));
      }
      /**
       * Get the number of commands in history
       */
      get length() {
        return this.history.length;
      }
      /**
       * Get the current navigation index
       */
      get currentIndex() {
        return this.index;
      }
    };
  }
});

// src/core/CommandRegistry.ts
var CommandRegistry;
var init_CommandRegistry = __esm({
  "src/core/CommandRegistry.ts"() {
    "use strict";
    init_Command();
    init_CommandParser();
    init_CommandHistory();
    CommandRegistry = class {
      constructor(options = {}) {
        __publicField(this, "commands", /* @__PURE__ */ new Map());
        __publicField(this, "categories", /* @__PURE__ */ new Map());
        __publicField(this, "unknownCommandHandler", null);
        __publicField(this, "eventHandlers", /* @__PURE__ */ new Map());
        __publicField(this, "parser");
        __publicField(this, "history");
        this.parser = new CommandParser();
        this.history = new CommandHistory(options.history);
      }
      /**
       * Register a new command
       *
       * @param commandString - Command name and positional args (e.g., 'greet <name>')
       * @param description - Human-readable description
       * @param category - Category for grouping commands
       * @returns The created command for chaining
       */
      addCommand(commandString, description, category = "general") {
        const command = new PulseCommand(commandString, description, category);
        this.commands.set(command.name, command);
        if (!this.categories.has(category)) {
          this.categories.set(category, []);
        }
        this.categories.get(category).push(command);
        return command;
      }
      /**
       * Remove a command by name
       *
       * @param name - The command name to remove
       * @returns true if command was removed, false if not found
       */
      removeCommand(name) {
        const command = this.commands.get(name);
        if (!command) return false;
        this.commands.delete(name);
        const categoryCommands = this.categories.get(command.category);
        if (categoryCommands) {
          const index = categoryCommands.indexOf(command);
          if (index !== -1) {
            categoryCommands.splice(index, 1);
          }
          if (categoryCommands.length === 0) {
            this.categories.delete(command.category);
          }
        }
        return true;
      }
      /**
       * Parse a command string without executing it
       *
       * @param commandString - The command to parse
       * @returns ParseResult with matched command and arguments
       */
      parseCommand(commandString) {
        return this.parser.parse(commandString, this.commands);
      }
      /**
       * Execute a command string
       *
       * @param commandString - The command to execute
       * @param options - Execution options
       * @returns Promise resolving to command result
       */
      async executeCommand(commandString, options = {}) {
        const { addToHistory = true, additionalArgs = {}, additionalOptions = {} } = options;
        if (addToHistory) {
          this.history.add(commandString);
        }
        const parseResult = this.parseCommand(commandString);
        this.emit({
          type: "execute",
          command: commandString,
          timestamp: Date.now()
        });
        if (!parseResult.command) {
          return this.handleUnknownCommand(commandString);
        }
        const finalArgs = { ...parseResult.args, ...additionalArgs };
        const finalOptions = { ...parseResult.options, ...additionalOptions };
        finalArgs["options"] = finalOptions;
        try {
          const result = await parseResult.command.execute(finalArgs, commandString);
          this.emit({
            type: "complete",
            command: commandString,
            result,
            timestamp: Date.now()
          });
          return result;
        } catch (error) {
          this.emit({
            type: "error",
            command: commandString,
            error: error instanceof Error ? error : new Error(String(error)),
            timestamp: Date.now()
          });
          throw error;
        }
      }
      /**
       * Handle an unknown command
       */
      handleUnknownCommand(commandString) {
        return new Promise((resolve, reject) => {
          if (this.unknownCommandHandler) {
            this.unknownCommandHandler(commandString, resolve, reject);
          } else {
            reject(new Error(`Unknown command: ${commandString.split(" ")[0]}`));
          }
        });
      }
      /**
       * Get autocomplete suggestions for a partial command
       *
       * @param partial - Partial command input
       * @returns Array of matching command names
       */
      getAutofillSuggestions(partial) {
        return this.parser.getAutocompleteSuggestions(partial, this.commands);
      }
      /**
       * Set handler for unknown commands
       *
       * @param callback - Handler function for unknown commands
       */
      onUnknownCommand(callback) {
        this.unknownCommandHandler = callback;
      }
      /**
       * Get all registered commands
       */
      getCommands() {
        return new Map(this.commands);
      }
      /**
       * Get a specific command by name
       */
      getCommand(name) {
        return this.commands.get(name);
      }
      /**
       * Get all categories with their commands
       */
      getCategories() {
        return new Map(
          Array.from(this.categories.entries()).map(([cat, cmds]) => [cat, [...cmds]])
        );
      }
      /**
       * Check if a command exists
       */
      hasCommand(name) {
        return this.commands.has(name);
      }
      /**
       * Subscribe to command events
       *
       * @param type - Event type to listen for
       * @param handler - Event handler function
       * @returns Unsubscribe function
       */
      on(type, handler) {
        if (!this.eventHandlers.has(type)) {
          this.eventHandlers.set(type, /* @__PURE__ */ new Set());
        }
        this.eventHandlers.get(type).add(handler);
        return () => {
          this.eventHandlers.get(type)?.delete(handler);
        };
      }
      /**
       * Emit a command event
       */
      emit(event) {
        const handlers = this.eventHandlers.get(event.type);
        if (handlers) {
          handlers.forEach((handler) => {
            try {
              handler(event);
            } catch (error) {
              console.error("Error in command event handler:", error);
            }
          });
        }
      }
      /**
       * Generate help text for all commands
       * Returns HTML with semantic classes for styling
       */
      generateHelp() {
        const parts = [
          '<div class="pulse-help">',
          '<h2 class="pulse-help-title">Available Commands</h2>'
        ];
        for (const [category, commands] of this.categories.entries()) {
          if (category === "unlisted") continue;
          parts.push(`<section class="pulse-help-category">`);
          parts.push(`<h3 class="pulse-help-category-name">${this.escapeHtml(category)}</h3>`);
          for (const cmd of commands) {
            const positionalArgs = cmd.positionalArgs.join(" ");
            const signature = positionalArgs ? `${cmd.name} ${positionalArgs}` : cmd.name;
            parts.push(`<div class="pulse-help-command">`);
            parts.push(`<code class="pulse-help-signature">${this.escapeHtml(signature)}</code>`);
            parts.push(`<p class="pulse-help-description">${this.escapeHtml(cmd.description)}</p>`);
            if (cmd.options.length > 0) {
              parts.push(`<div class="pulse-help-options">`);
              parts.push(`<span class="pulse-help-options-label">Options:</span>`);
              parts.push(`<ul class="pulse-help-options-list">`);
              for (const opt of cmd.options) {
                parts.push(`<li><code>${this.escapeHtml(opt.flags)}</code> ${this.escapeHtml(opt.description)}</li>`);
              }
              parts.push(`</ul>`);
              parts.push(`</div>`);
            }
            parts.push(`</div>`);
          }
          parts.push(`</section>`);
        }
        parts.push("</div>");
        return parts.join("");
      }
      /**
       * Escape HTML special characters
       */
      escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      }
    };
  }
});

// src/components/BaseComponent.ts
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
function getBaseStyles() {
  return `
    * {
      box-sizing: border-box;
    }
  `;
}
var darkTheme, lightTheme, highContrastTheme, primalTheme, PULSE_THEMES, PulseBaseComponent, PULSE_CSS_VARS;
var init_BaseComponent = __esm({
  "src/components/BaseComponent.ts"() {
    "use strict";
    darkTheme = {
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
    lightTheme = {
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
    highContrastTheme = {
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
    primalTheme = {
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
      transition: "0.15s ease"
    };
    PULSE_THEMES = {
      dark: darkTheme,
      light: lightTheme,
      "high-contrast": highContrastTheme,
      primal: primalTheme
    };
    PulseBaseComponent = class extends HTMLElement {
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
    PULSE_CSS_VARS = {
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
  }
});

// src/components/CommandLine.ts
var CommandLine_exports = {};
__export(CommandLine_exports, {
  PulseCommandLine: () => PulseCommandLine
});
var PulseCommandLine;
var init_CommandLine = __esm({
  "src/components/CommandLine.ts"() {
    "use strict";
    init_BaseComponent();
    PulseCommandLine = class extends PulseBaseComponent {
      constructor() {
        super(...arguments);
        __publicField(this, "input", null);
        __publicField(this, "registry", null);
        __publicField(this, "suggestionIndex", -1);
        __publicField(this, "currentSuggestions", []);
      }
      static get observedAttributes() {
        return ["prompt", "placeholder", "disabled"];
      }
      /**
       * Connect this command line to a registry for autocomplete
       */
      setRegistry(registry) {
        this.registry = registry;
      }
      /**
       * Get the current input value
       */
      get value() {
        return this.input?.value ?? "";
      }
      /**
       * Set the input value
       */
      set value(val) {
        if (this.input) {
          this.input.value = val;
        }
      }
      /**
       * Focus the input element
       */
      focus() {
        this.input?.focus();
      }
      /**
       * Clear the input
       */
      clear() {
        if (this.input) {
          this.input.value = "";
          this.currentSuggestions = [];
          this.suggestionIndex = -1;
        }
      }
      render() {
        const prompt = this.getAttr("prompt", ">");
        const placeholder = this.getAttr("placeholder", "Enter command...");
        const disabled = this.getBoolAttr("disabled");
        this.injectStyles(this.getStyles());
        const container = document.createElement("div");
        container.className = "command-line";
        container.setAttribute("part", "command-line");
        const promptSpan = document.createElement("span");
        promptSpan.className = "prompt";
        promptSpan.setAttribute("part", "prompt");
        promptSpan.textContent = prompt;
        const input = document.createElement("input");
        input.type = "text";
        input.className = "input";
        input.setAttribute("part", "input");
        input.placeholder = placeholder;
        input.disabled = disabled;
        input.spellcheck = false;
        input.autocomplete = "off";
        container.appendChild(promptSpan);
        container.appendChild(input);
        this.shadow.appendChild(container);
        this.input = input;
        if (this.getBoolAttr("autofocus")) {
          requestAnimationFrame(() => this.focus());
        }
      }
      setupEventListeners() {
        if (!this.input) return;
        this.input.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.input.addEventListener("input", this.handleInput.bind(this));
      }
      handleKeyDown(event) {
        switch (event.key) {
          case "Enter":
            this.handleSubmit();
            break;
          case "ArrowUp":
            event.preventDefault();
            this.navigateHistory(-1);
            break;
          case "ArrowDown":
            event.preventDefault();
            this.navigateHistory(1);
            break;
          case "Tab":
            event.preventDefault();
            this.handleAutocomplete();
            break;
          case "Escape":
            this.clear();
            break;
        }
      }
      handleInput() {
        const value = this.value;
        this.emit("pulse-change", { value });
        this.updateSuggestions();
      }
      handleSubmit() {
        const command = this.value.trim();
        if (!command) return;
        this.emit("pulse-submit", { command });
        this.clear();
      }
      navigateHistory(direction) {
        if (!this.registry) return;
        const historyValue = direction === -1 ? this.registry.history.getPrevious() : this.registry.history.getNext();
        if (historyValue !== void 0) {
          this.value = historyValue;
          requestAnimationFrame(() => {
            if (this.input) {
              this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
            }
          });
        } else if (direction === 1) {
          this.clear();
        }
      }
      updateSuggestions() {
        if (!this.registry) return;
        const value = this.value;
        this.currentSuggestions = value ? this.registry.getAutofillSuggestions(value) : [];
        this.suggestionIndex = -1;
        this.emit("pulse-suggestions", { suggestions: this.currentSuggestions });
      }
      handleAutocomplete() {
        if (this.currentSuggestions.length === 0) return;
        this.suggestionIndex = (this.suggestionIndex + 1) % this.currentSuggestions.length;
        const suggestion = this.currentSuggestions[this.suggestionIndex];
        if (suggestion) {
          this.value = suggestion + " ";
        }
      }
      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
          case "prompt":
            const promptEl = this.$(".prompt");
            if (promptEl) promptEl.textContent = newValue;
            break;
          case "placeholder":
            if (this.input) this.input.placeholder = newValue;
            break;
          case "disabled":
            if (this.input) this.input.disabled = this.getBoolAttr("disabled");
            break;
        }
      }
      getStyles() {
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
    };
    if (typeof customElements !== "undefined" && !customElements.get("pulse-command-line")) {
      customElements.define("pulse-command-line", PulseCommandLine);
    }
  }
});

// src/components/CommandOutput.ts
var CommandOutput_exports = {};
__export(CommandOutput_exports, {
  PulseCommandOutput: () => PulseCommandOutput
});
var _PulseCommandOutput, PulseCommandOutput;
var init_CommandOutput = __esm({
  "src/components/CommandOutput.ts"() {
    "use strict";
    init_BaseComponent();
    _PulseCommandOutput = class _PulseCommandOutput extends PulseBaseComponent {
      constructor() {
        super();
        __publicField(this, "instanceId");
        __publicField(this, "isDragging", false);
        this.instanceId = `pulse-output-${_PulseCommandOutput.idCounter++}`;
      }
      static get observedAttributes() {
        return ["command", "closeable", "draggable"];
      }
      /**
       * Get the unique ID of this output instance
       */
      get id() {
        return this.instanceId;
      }
      /**
       * Set the output content as HTML
       */
      setContent(html) {
        const content = this.$(".content");
        if (content) {
          content.innerHTML = html;
        }
      }
      /**
       * Set the output content as text (escaped)
       */
      setTextContent(text) {
        const content = this.$(".content");
        if (content) {
          content.textContent = text;
        }
      }
      /**
       * Append content to the output
       */
      appendContent(html) {
        const content = this.$(".content");
        if (content) {
          content.insertAdjacentHTML("beforeend", html);
        }
      }
      /**
       * Clear the output content
       */
      clearContent() {
        const content = this.$(".content");
        if (content) {
          content.innerHTML = "";
        }
      }
      render() {
        const command = this.getAttr("command", "");
        const closeable = this.getBoolAttr("closeable");
        const draggable = this.getBoolAttr("draggable");
        this.injectStyles(this.getStyles());
        const container = document.createElement("div");
        container.className = "output-card";
        container.setAttribute("part", "output-card");
        container.id = this.instanceId;
        const header = document.createElement("div");
        header.className = "header";
        header.setAttribute("part", "header");
        if (draggable) {
          header.classList.add("draggable");
        }
        const commandSpan = document.createElement("span");
        commandSpan.className = "command-text";
        commandSpan.setAttribute("part", "command-text");
        commandSpan.textContent = command;
        const actions = document.createElement("div");
        actions.className = "actions";
        const actionsSlot = document.createElement("slot");
        actionsSlot.name = "header-actions";
        actions.appendChild(actionsSlot);
        if (closeable) {
          const closeBtn = document.createElement("button");
          closeBtn.className = "close-btn";
          closeBtn.setAttribute("part", "close-button");
          closeBtn.innerHTML = "\xD7";
          closeBtn.title = "Close";
          closeBtn.setAttribute("aria-label", "Close");
          actions.appendChild(closeBtn);
        }
        header.appendChild(commandSpan);
        header.appendChild(actions);
        const content = document.createElement("div");
        content.className = "content";
        content.setAttribute("part", "content");
        const contentSlot = document.createElement("slot");
        content.appendChild(contentSlot);
        container.appendChild(header);
        container.appendChild(content);
        this.shadow.appendChild(container);
      }
      setupEventListeners() {
        const header = this.$(".header");
        const closeBtn = this.$(".close-btn");
        if (header) {
          header.addEventListener("click", this.handleHeaderClick.bind(this));
          if (this.getBoolAttr("draggable")) {
            header.addEventListener("mousedown", this.handleDragStart.bind(this));
          }
        }
        if (closeBtn) {
          closeBtn.addEventListener("click", this.handleClose.bind(this));
        }
      }
      handleHeaderClick(event) {
        if (event.target.classList.contains("close-btn")) {
          return;
        }
        this.emit("pulse-focus", { id: this.instanceId });
      }
      handleClose(event) {
        event.stopPropagation();
        this.emit("pulse-close", { id: this.instanceId });
      }
      handleDragStart(event) {
        if (event.button !== 0) return;
        this.isDragging = true;
        this.emit("pulse-drag-start", { id: this.instanceId, event });
        const handleDragEnd = (e) => {
          if (this.isDragging) {
            this.isDragging = false;
            this.emit("pulse-drag-end", { id: this.instanceId, event: e });
          }
          document.removeEventListener("mouseup", handleDragEnd);
        };
        document.addEventListener("mouseup", handleDragEnd);
      }
      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
          case "command":
            const commandEl = this.$(".command-text");
            if (commandEl) commandEl.textContent = newValue;
            break;
        }
      }
      getStyles() {
        return `
      ${getBaseStyles()}

      :host {
        display: block;
      }

      .output-card {
        background: var(--pulse-bg-secondary);
        border: 1px solid var(--pulse-border);
        border-radius: var(--pulse-radius);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--pulse-spacing-xs) var(--pulse-spacing-sm);
        background: var(--pulse-bg);
        border-bottom: 1px solid var(--pulse-border);
        min-height: 32px;
      }

      .header.draggable {
        cursor: grab;
      }

      .header.draggable:active {
        cursor: grabbing;
      }

      .command-text {
        color: var(--pulse-text-muted);
        font-family: var(--pulse-font-family);
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .actions {
        display: flex;
        align-items: center;
        gap: var(--pulse-spacing-xs);
      }

      .close-btn {
        background: transparent;
        border: none;
        color: var(--pulse-text-muted);
        font-size: 18px;
        line-height: 1;
        padding: 2px 6px;
        cursor: pointer;
        border-radius: var(--pulse-radius);
        transition: all var(--pulse-transition);
      }

      .close-btn:hover {
        background: var(--pulse-error);
        color: white;
      }

      .content {
        flex: 1;
        padding: var(--pulse-spacing-md);
        overflow: auto;
        font-family: var(--pulse-font-family);
        font-size: var(--pulse-font-size);
        line-height: var(--pulse-line-height);
        color: var(--pulse-text);
      }

      /* Scrollbar styling */
      .content::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .content::-webkit-scrollbar-track {
        background: var(--pulse-bg);
      }

      .content::-webkit-scrollbar-thumb {
        background: var(--pulse-border);
        border-radius: 4px;
      }

      .content::-webkit-scrollbar-thumb:hover {
        background: var(--pulse-text-muted);
      }

      /* Help output styling */
      .content .pulse-help {
        font-family: var(--pulse-font-family);
      }

      .content .pulse-help-title {
        margin: 0 0 var(--pulse-spacing-md) 0;
        font-size: 1.1em;
        color: var(--pulse-accent);
        font-weight: 600;
      }

      .content .pulse-help-category {
        margin-bottom: var(--pulse-spacing-md);
      }

      .content .pulse-help-category-name {
        margin: 0 0 var(--pulse-spacing-sm) 0;
        font-size: 0.95em;
        color: var(--pulse-text);
        font-weight: 500;
        text-transform: capitalize;
        border-bottom: 1px solid var(--pulse-border);
        padding-bottom: var(--pulse-spacing-xs);
      }

      .content .pulse-help-command {
        margin-bottom: var(--pulse-spacing-sm);
        padding-left: var(--pulse-spacing-sm);
      }

      .content .pulse-help-signature {
        color: var(--pulse-success);
        font-weight: 500;
        font-size: 0.95em;
      }

      .content .pulse-help-description {
        margin: var(--pulse-spacing-xs) 0 0 0;
        color: var(--pulse-text-muted);
        font-size: 0.9em;
      }

      .content .pulse-help-options {
        margin-top: var(--pulse-spacing-xs);
        padding-left: var(--pulse-spacing-sm);
      }

      .content .pulse-help-options-label {
        color: var(--pulse-text-muted);
        font-size: 0.85em;
        font-style: italic;
      }

      .content .pulse-help-options-list {
        margin: var(--pulse-spacing-xs) 0 0 0;
        padding-left: var(--pulse-spacing-md);
        list-style: none;
      }

      .content .pulse-help-options-list li {
        margin-bottom: 2px;
        font-size: 0.85em;
      }

      .content .pulse-help-options-list code {
        color: var(--pulse-warning);
        margin-right: var(--pulse-spacing-xs);
      }
    `;
      }
    };
    __publicField(_PulseCommandOutput, "idCounter", 0);
    PulseCommandOutput = _PulseCommandOutput;
    if (typeof customElements !== "undefined" && !customElements.get("pulse-command-output")) {
      customElements.define("pulse-command-output", PulseCommandOutput);
    }
  }
});

// src/components/PulseTerminal.ts
var PulseTerminal_exports = {};
__export(PulseTerminal_exports, {
  PulseTerminal: () => PulseTerminal
});
var _PulseTerminal, PulseTerminal;
var init_PulseTerminal = __esm({
  "src/components/PulseTerminal.ts"() {
    "use strict";
    init_BaseComponent();
    init_CommandRegistry();
    init_CommandLine();
    init_CommandOutput();
    _PulseTerminal = class _PulseTerminal extends PulseBaseComponent {
      constructor() {
        super();
        /** The command registry for this terminal */
        __publicField(this, "registry");
        __publicField(this, "commandLine", null);
        __publicField(this, "outputContainer", null);
        __publicField(this, "outputs", []);
        __publicField(this, "currentTheme", darkTheme);
        __publicField(this, "themeStyleEl", null);
        /** Counter for unique mount point IDs */
        __publicField(this, "mountCounter", 0);
        this.registry = new CommandRegistry();
        this.registerBuiltinCommands();
      }
      static get observedAttributes() {
        return ["prompt", "welcome", "max-outputs", "theme"];
      }
      /**
       * Register a custom theme globally
       * @param name - Unique name for the theme
       * @param theme - Partial theme object (merges with dark theme defaults)
       */
      static registerTheme(name, theme) {
        const fullTheme = { ...darkTheme, ...theme };
        _PulseTerminal.customThemes.set(name, fullTheme);
      }
      /**
       * Unregister a custom theme
       * @param name - Name of the theme to remove
       */
      static unregisterTheme(name) {
        return _PulseTerminal.customThemes.delete(name);
      }
      /**
       * Get a registered theme by name (checks custom themes first, then built-in)
       * @param name - Theme name
       */
      static getThemeByName(name) {
        return _PulseTerminal.customThemes.get(name) ?? PULSE_THEMES[name];
      }
      /**
       * Get all registered theme names (built-in + custom)
       */
      static getThemeNames() {
        return [...Object.keys(PULSE_THEMES), ..._PulseTerminal.customThemes.keys()];
      }
      /**
       * Register built-in commands
       */
      registerBuiltinCommands() {
        this.registry.addCommand("help", "Show available commands", "help").action((_args, _cmd, resolve) => {
          resolve(this.registry.generateHelp());
        });
        this.registry.addCommand("clear", "Clear terminal output", "help").action((_args, _cmd, resolve) => {
          this.clearOutputs();
          resolve(null);
        });
        this.registry.addCommand("history", "Show command history", "help").action((_args, _cmd, resolve) => {
          const history = this.registry.history.getAll();
          if (history.length === 0) {
            resolve("No command history");
          } else {
            resolve(history.map((cmd, i) => `${i + 1}. ${cmd}`).join("\n"));
          }
        });
      }
      /**
       * Execute a command programmatically
       */
      async execute(command) {
        return this.handleCommand(command);
      }
      /**
       * Set the terminal theme
       * @param theme - Theme name (built-in or custom) or a partial PulseTheme object
       */
      setTheme(theme) {
        let resolvedTheme;
        if (typeof theme === "string") {
          resolvedTheme = _PulseTerminal.getThemeByName(theme) ?? darkTheme;
        } else {
          resolvedTheme = { ...darkTheme, ...theme };
        }
        this.currentTheme = resolvedTheme;
        this.applyTheme(resolvedTheme);
      }
      /**
       * Get the current theme
       */
      getTheme() {
        return this.currentTheme;
      }
      /**
       * Apply theme by updating CSS variables
       */
      applyTheme(theme) {
        if (!this.themeStyleEl) {
          this.themeStyleEl = document.createElement("style");
          this.themeStyleEl.id = "pulse-theme";
          this.shadow.appendChild(this.themeStyleEl);
        }
        this.themeStyleEl.textContent = `:host { ${themeToCSS(theme)} }`;
      }
      /**
       * Add output to the terminal
       */
      addOutput(content, command = "") {
        const output = document.createElement("pulse-command-output");
        output.setAttribute("command", command);
        output.setAttribute("closeable", "");
        this.outputContainer?.appendChild(output);
        output.setContent(this.formatOutput(content));
        this.outputs.push(output);
        this.enforceMaxOutputs();
        this.scrollToBottom();
        return output;
      }
      /**
       * Create an output card with a mount point for rendering custom content (e.g., React components)
       * @param command - The command string to display in the output header
       * @returns The mount point element where you can render your content
       */
      createOutputMount(command = "") {
        const mountId = `pulse-mount-${++this.mountCounter}`;
        const output = document.createElement("pulse-command-output");
        output.setAttribute("command", command);
        output.setAttribute("closeable", "");
        this.outputContainer?.appendChild(output);
        output.setContent(`<div id="${mountId}" class="output-mount"></div>`);
        this.outputs.push(output);
        this.enforceMaxOutputs();
        this.scrollToBottom();
        const mountPoint = output.shadowRoot?.querySelector(`#${mountId}`);
        return mountPoint;
      }
      /**
       * Clear all outputs
       */
      clearOutputs() {
        this.outputs.forEach((output) => output.remove());
        this.outputs = [];
      }
      /**
       * Focus the command line input
       */
      focus() {
        this.commandLine?.focus();
      }
      render() {
        const prompt = this.getAttr("prompt", ">");
        const welcome = this.getAttr("welcome", "");
        const themeAttr = this.getAttr("theme", "");
        this.injectStyles(this.getStyles());
        const initialTheme = themeAttr && _PulseTerminal.getThemeByName(themeAttr) || "dark";
        this.setTheme(initialTheme);
        const container = document.createElement("div");
        container.className = "terminal";
        container.setAttribute("part", "terminal");
        const outputContainer = document.createElement("div");
        outputContainer.className = "output-container";
        outputContainer.setAttribute("part", "output-container");
        this.outputContainer = outputContainer;
        const commandLine = document.createElement("pulse-command-line");
        commandLine.setAttribute("prompt", prompt);
        commandLine.setAttribute("autofocus", "");
        commandLine.setRegistry(this.registry);
        this.commandLine = commandLine;
        container.appendChild(outputContainer);
        container.appendChild(commandLine);
        this.shadow.appendChild(container);
        if (welcome) {
          this.addOutput(welcome, "welcome");
        }
        this.emit("pulse-ready", { registry: this.registry });
      }
      setupEventListeners() {
        this.commandLine?.addEventListener("pulse-submit", ((event) => {
          this.handleCommand(event.detail.command);
        }));
        this.shadow.addEventListener("pulse-close", ((event) => {
          this.removeOutput(event.detail.id);
        }));
        this.shadow.addEventListener("click", (event) => {
          if (event.target.closest("pulse-command-output")) return;
          this.focus();
        });
      }
      async handleCommand(command) {
        try {
          const result = await this.registry.executeCommand(command);
          if (result !== null && result !== void 0) {
            const output = String(result);
            this.addOutput(output, command);
          }
          this.emit("pulse-command", { command, result });
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          const output = this.addOutput(
            `<span class="error">${this.escapeHtml(errorMessage)}</span>`,
            command
          );
          output.classList.add("error-output");
          this.emit("pulse-command", {
            command,
            error: error instanceof Error ? error : new Error(errorMessage)
          });
          throw error;
        }
      }
      removeOutput(id) {
        const index = this.outputs.findIndex((o) => o.id === id);
        if (index !== -1) {
          this.outputs[index].remove();
          this.outputs.splice(index, 1);
        }
      }
      enforceMaxOutputs() {
        const max = this.getNumAttr("max-outputs", 50);
        while (this.outputs.length > max) {
          const oldest = this.outputs.shift();
          oldest?.remove();
        }
      }
      scrollToBottom() {
        if (this.outputContainer) {
          this.outputContainer.scrollTop = this.outputContainer.scrollHeight;
        }
      }
      formatOutput(content) {
        if (content.includes("\n") && !content.includes("<")) {
          return `<pre>${this.escapeHtml(content)}</pre>`;
        }
        return content;
      }
      escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
      }
      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
          case "prompt":
            this.commandLine?.setAttribute("prompt", newValue);
            break;
          case "theme":
            if (newValue && _PulseTerminal.getThemeByName(newValue)) {
              this.setTheme(newValue);
            }
            break;
        }
      }
      getStyles() {
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
    };
    /** Registry of custom user-defined themes */
    __publicField(_PulseTerminal, "customThemes", /* @__PURE__ */ new Map());
    PulseTerminal = _PulseTerminal;
    if (typeof customElements !== "undefined" && !customElements.get("pulse-terminal")) {
      customElements.define("pulse-terminal", PulseTerminal);
    }
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CommandHistory: () => CommandHistory,
  CommandOption: () => CommandOption,
  CommandParser: () => CommandParser,
  CommandRegistry: () => CommandRegistry,
  LocalStorageAdapter: () => LocalStorageAdapter,
  MemoryStorageAdapter: () => MemoryStorageAdapter,
  PULSE_CSS_VARS: () => PULSE_CSS_VARS,
  PULSE_THEMES: () => PULSE_THEMES,
  PulseBaseComponent: () => PulseBaseComponent,
  PulseCommand: () => PulseCommand,
  PulseCommandLine: () => PulseCommandLine,
  PulseCommandOutput: () => PulseCommandOutput,
  PulseTerminal: () => PulseTerminal,
  SessionStorageAdapter: () => SessionStorageAdapter,
  VERSION: () => VERSION,
  camelToKebab: () => camelToKebab,
  createStorageAdapter: () => createStorageAdapter,
  darkTheme: () => darkTheme,
  debounce: () => debounce,
  deepClone: () => deepClone,
  defineElements: () => defineElements,
  escapeHtml: () => escapeHtml,
  formatDuration: () => formatDuration,
  getBaseStyles: () => getBaseStyles,
  highContrastTheme: () => highContrastTheme,
  isBrowser: () => isBrowser,
  kebabToCamel: () => kebabToCamel,
  lightTheme: () => lightTheme,
  primalTheme: () => primalTheme,
  supportsCustomElements: () => supportsCustomElements,
  themeToCSS: () => themeToCSS,
  throttle: () => throttle,
  uniqueId: () => uniqueId,
  waitFor: () => waitFor
});
module.exports = __toCommonJS(index_exports);
init_CommandRegistry();
init_Command();
init_Option();
init_CommandParser();
init_CommandHistory();

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

// src/index.ts
init_PulseTerminal();
init_CommandLine();
init_CommandOutput();
init_BaseComponent();

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
  Promise.resolve().then(() => init_CommandLine());
  Promise.resolve().then(() => init_CommandOutput());
  Promise.resolve().then(() => init_PulseTerminal());
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
  primalTheme,
  supportsCustomElements,
  themeToCSS,
  throttle,
  uniqueId,
  waitFor
});
