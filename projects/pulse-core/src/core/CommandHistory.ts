import type { CommandHistoryInterface, StorageAdapter } from './types';

/**
 * Default storage adapter using localStorage (browser) or in-memory (Node.js)
 */
class DefaultStorageAdapter implements StorageAdapter {
  private memoryStore = new Map<string, string>();
  private readonly useLocalStorage: boolean;

  constructor() {
    this.useLocalStorage = typeof localStorage !== 'undefined';
  }

  async get(key: string): Promise<string | null> {
    if (this.useLocalStorage) {
      return localStorage.getItem(key);
    }
    return this.memoryStore.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    if (this.useLocalStorage) {
      localStorage.setItem(key, value);
    } else {
      this.memoryStore.set(key, value);
    }
  }

  async remove(key: string): Promise<void> {
    if (this.useLocalStorage) {
      localStorage.removeItem(key);
    } else {
      this.memoryStore.delete(key);
    }
  }
}

/**
 * Configuration options for CommandHistory
 */
export interface CommandHistoryOptions {
  /** Maximum number of commands to keep in history */
  maxSize?: number;
  /** Storage key for persisting history */
  storageKey?: string;
  /** Custom storage adapter */
  storage?: StorageAdapter;
  /** Whether to persist history */
  persist?: boolean;
}

/**
 * Manages command history with navigation and persistence
 *
 * @example
 * const history = new CommandHistory({ maxSize: 100, persist: true });
 * history.add('help');
 * history.add('list users');
 *
 * console.log(history.getPrevious()); // 'list users'
 * console.log(history.getPrevious()); // 'help'
 * console.log(history.getNext());     // 'list users'
 */
export class CommandHistory implements CommandHistoryInterface {
  private history: string[] = [];
  private index = -1;
  private readonly maxSize: number;
  private readonly storageKey: string;
  private readonly storage: StorageAdapter;
  private readonly persist: boolean;

  constructor(options: CommandHistoryOptions = {}) {
    this.maxSize = options.maxSize ?? 100;
    this.storageKey = options.storageKey ?? 'pulse-cli-history';
    this.storage = options.storage ?? new DefaultStorageAdapter();
    this.persist = options.persist ?? true;

    // Load history asynchronously
    if (this.persist) {
      this.load();
    }
  }

  /**
   * Load history from storage
   */
  private async load(): Promise<void> {
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
      console.warn('Failed to load command history:', error);
    }
  }

  /**
   * Save history to storage
   */
  private async save(): Promise<void> {
    if (!this.persist) return;

    try {
      await this.storage.set(this.storageKey, JSON.stringify(this.history));
    } catch (error) {
      console.warn('Failed to save command history:', error);
    }
  }

  /**
   * Add a command to history
   *
   * @param command - The command string to add
   */
  add(command: string): void {
    const trimmed = command.trim();
    if (!trimmed) return;

    // Avoid duplicate consecutive entries
    if (this.history[this.history.length - 1] === trimmed) {
      this.index = this.history.length;
      return;
    }

    this.history.push(trimmed);

    // Enforce max size
    if (this.history.length > this.maxSize) {
      this.history.shift();
    }

    // Reset index to end
    this.index = this.history.length;

    this.save();
  }

  /**
   * Get the previous command in history (navigate up)
   *
   * @returns The previous command or undefined if at the beginning
   */
  getPrevious(): string | undefined {
    if (this.history.length === 0) return undefined;

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
  getNext(): string | undefined {
    if (this.history.length === 0) return undefined;

    if (this.index < this.history.length - 1) {
      this.index++;
      return this.history[this.index];
    }

    // Return undefined when going past the end (allows clearing input)
    this.index = this.history.length;
    return undefined;
  }

  /**
   * Get all commands in history
   */
  getAll(): string[] {
    return [...this.history];
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = [];
    this.index = 0;
    this.save();
  }

  /**
   * Reset navigation index to the end
   */
  resetIndex(): void {
    this.index = this.history.length;
  }

  /**
   * Search history for commands matching a pattern
   *
   * @param pattern - String or RegExp to match
   * @returns Array of matching commands
   */
  search(pattern: string | RegExp): string[] {
    const regex = typeof pattern === 'string'
      ? new RegExp(pattern, 'i')
      : pattern;

    return this.history.filter(cmd => regex.test(cmd));
  }

  /**
   * Get the number of commands in history
   */
  get length(): number {
    return this.history.length;
  }

  /**
   * Get the current navigation index
   */
  get currentIndex(): number {
    return this.index;
  }
}
