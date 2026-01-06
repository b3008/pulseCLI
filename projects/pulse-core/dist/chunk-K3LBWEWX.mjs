import {
  PULSE_THEMES,
  PulseBaseComponent,
  __publicField,
  darkTheme,
  getBaseStyles,
  themeToCSS
} from "./chunk-E2RYDWUH.mjs";

// src/core/Option.ts
var CommandOption = class {
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

// src/core/Command.ts
var PulseCommand = class {
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

// src/core/CommandParser.ts
var CommandParser = class {
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

// src/core/CommandHistory.ts
var DefaultStorageAdapter = class {
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
var CommandHistory = class {
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

// src/core/CommandRegistry.ts
var CommandRegistry = class {
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

// src/components/PulseTerminal.ts
var _PulseTerminal = class _PulseTerminal extends PulseBaseComponent {
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
var PulseTerminal = _PulseTerminal;
if (typeof customElements !== "undefined" && !customElements.get("pulse-terminal")) {
  customElements.define("pulse-terminal", PulseTerminal);
}

export {
  CommandOption,
  PulseCommand,
  CommandParser,
  CommandHistory,
  CommandRegistry,
  PulseTerminal
};
