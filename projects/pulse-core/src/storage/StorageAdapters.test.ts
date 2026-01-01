import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryStorageAdapter } from './StorageAdapters';

describe('MemoryStorageAdapter', () => {
  let storage: MemoryStorageAdapter;

  beforeEach(() => {
    storage = new MemoryStorageAdapter();
  });

  describe('set and get', () => {
    it('should store and retrieve values', async () => {
      await storage.set('key', 'value');
      const result = await storage.get('key');

      expect(result).toBe('value');
    });

    it('should return null for non-existent keys', async () => {
      const result = await storage.get('nonexistent');

      expect(result).toBeNull();
    });

    it('should overwrite existing values', async () => {
      await storage.set('key', 'value1');
      await storage.set('key', 'value2');
      const result = await storage.get('key');

      expect(result).toBe('value2');
    });
  });

  describe('remove', () => {
    it('should remove existing key', async () => {
      await storage.set('key', 'value');
      await storage.remove('key');
      const result = await storage.get('key');

      expect(result).toBeNull();
    });

    it('should not throw for non-existent key', async () => {
      await expect(storage.remove('nonexistent')).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    it('should remove all keys', async () => {
      await storage.set('key1', 'value1');
      await storage.set('key2', 'value2');

      storage.clear();

      expect(await storage.get('key1')).toBeNull();
      expect(await storage.get('key2')).toBeNull();
    });
  });
});
