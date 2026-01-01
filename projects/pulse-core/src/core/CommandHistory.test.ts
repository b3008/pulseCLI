import { describe, it, expect, beforeEach } from 'vitest';
import { CommandHistory } from './CommandHistory';
import { MemoryStorageAdapter } from '../storage/StorageAdapters';

describe('CommandHistory', () => {
  let history: CommandHistory;

  beforeEach(() => {
    history = new CommandHistory({
      persist: false,
      storage: new MemoryStorageAdapter(),
    });
  });

  describe('add', () => {
    it('should add commands to history', () => {
      history.add('command1');
      history.add('command2');

      expect(history.getAll()).toEqual(['command1', 'command2']);
    });

    it('should trim whitespace from commands', () => {
      history.add('  command  ');

      expect(history.getAll()).toEqual(['command']);
    });

    it('should ignore empty commands', () => {
      history.add('');
      history.add('   ');

      expect(history.length).toBe(0);
    });

    it('should avoid duplicate consecutive entries', () => {
      history.add('command');
      history.add('command');
      history.add('command');

      expect(history.getAll()).toEqual(['command']);
    });

    it('should allow non-consecutive duplicates', () => {
      history.add('command1');
      history.add('command2');
      history.add('command1');

      expect(history.getAll()).toEqual(['command1', 'command2', 'command1']);
    });

    it('should enforce max size', () => {
      const smallHistory = new CommandHistory({
        maxSize: 3,
        persist: false,
      });

      smallHistory.add('cmd1');
      smallHistory.add('cmd2');
      smallHistory.add('cmd3');
      smallHistory.add('cmd4');

      expect(smallHistory.getAll()).toEqual(['cmd2', 'cmd3', 'cmd4']);
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      history.add('first');
      history.add('second');
      history.add('third');
    });

    it('should navigate backwards through history', () => {
      expect(history.getPrevious()).toBe('third');
      expect(history.getPrevious()).toBe('second');
      expect(history.getPrevious()).toBe('first');
    });

    it('should stay at beginning when navigating past first', () => {
      history.getPrevious(); // third
      history.getPrevious(); // second
      history.getPrevious(); // first
      history.getPrevious(); // still first

      expect(history.currentIndex).toBe(0);
    });

    it('should navigate forwards through history', () => {
      history.getPrevious(); // third
      history.getPrevious(); // second

      expect(history.getNext()).toBe('third');
    });

    it('should return undefined when at end', () => {
      expect(history.getNext()).toBeUndefined();
    });

    it('should reset index when adding new command', () => {
      history.getPrevious(); // third
      history.getPrevious(); // second

      history.add('new');

      expect(history.getPrevious()).toBe('new');
    });

    it('should return undefined for empty history', () => {
      const emptyHistory = new CommandHistory({ persist: false });

      expect(emptyHistory.getPrevious()).toBeUndefined();
      expect(emptyHistory.getNext()).toBeUndefined();
    });
  });

  describe('resetIndex', () => {
    it('should reset navigation to end', () => {
      history.add('first');
      history.add('second');

      history.getPrevious(); // second
      history.getPrevious(); // first
      history.resetIndex();

      expect(history.getPrevious()).toBe('second');
    });
  });

  describe('search', () => {
    beforeEach(() => {
      history.add('git status');
      history.add('git commit -m "test"');
      history.add('npm install');
      history.add('git push');
    });

    it('should search with string pattern', () => {
      const results = history.search('git');

      expect(results).toEqual([
        'git status',
        'git commit -m "test"',
        'git push',
      ]);
    });

    it('should search with regex pattern', () => {
      const results = history.search(/^git/);

      expect(results).toEqual([
        'git status',
        'git commit -m "test"',
        'git push',
      ]);
    });

    it('should be case insensitive for string patterns', () => {
      const results = history.search('GIT');

      expect(results).toHaveLength(3);
    });

    it('should return empty array for no matches', () => {
      const results = history.search('docker');

      expect(results).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should clear all history', () => {
      history.add('cmd1');
      history.add('cmd2');

      history.clear();

      expect(history.length).toBe(0);
      expect(history.getAll()).toEqual([]);
    });
  });

  describe('length', () => {
    it('should return correct length', () => {
      expect(history.length).toBe(0);

      history.add('cmd1');
      expect(history.length).toBe(1);

      history.add('cmd2');
      expect(history.length).toBe(2);
    });
  });

  describe('currentIndex', () => {
    it('should track current navigation position', () => {
      history.add('cmd1');
      history.add('cmd2');
      history.add('cmd3');

      expect(history.currentIndex).toBe(3);

      history.getPrevious();
      expect(history.currentIndex).toBe(2);

      history.getPrevious();
      expect(history.currentIndex).toBe(1);

      history.getNext();
      expect(history.currentIndex).toBe(2);
    });
  });

  describe('getAll', () => {
    it('should return a copy of history', () => {
      history.add('cmd1');
      history.add('cmd2');

      const all = history.getAll();
      all.push('cmd3');

      expect(history.length).toBe(2);
    });
  });
});
