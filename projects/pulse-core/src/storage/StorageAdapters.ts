import type { StorageAdapter } from '../core/types';

/**
 * In-memory storage adapter for environments without localStorage
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

/**
 * localStorage-based storage adapter for browser environments
 */
export class LocalStorageAdapter implements StorageAdapter {
  private readonly prefix: string;

  constructor(prefix: string = 'pulse-cli') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(this.getKey(key));
    } catch {
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(this.getKey(key), value);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch {
      // Ignore removal errors
    }
  }
}

/**
 * sessionStorage-based storage adapter for browser environments
 */
export class SessionStorageAdapter implements StorageAdapter {
  private readonly prefix: string;

  constructor(prefix: string = 'pulse-cli') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<string | null> {
    try {
      return sessionStorage.getItem(this.getKey(key));
    } catch {
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      sessionStorage.setItem(this.getKey(key), value);
    } catch (error) {
      console.warn('Failed to save to sessionStorage:', error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      sessionStorage.removeItem(this.getKey(key));
    } catch {
      // Ignore removal errors
    }
  }
}

/**
 * Automatically select the best available storage adapter
 */
export function createStorageAdapter(prefix: string = 'pulse-cli'): StorageAdapter {
  if (typeof localStorage !== 'undefined') {
    try {
      // Test if localStorage is accessible
      const testKey = `${prefix}:test`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return new LocalStorageAdapter(prefix);
    } catch {
      // localStorage not available
    }
  }

  return new MemoryStorageAdapter();
}
