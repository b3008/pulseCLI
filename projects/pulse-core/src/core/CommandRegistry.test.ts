import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CommandRegistry } from './CommandRegistry';

describe('CommandRegistry', () => {
  let registry: CommandRegistry;

  beforeEach(() => {
    registry = new CommandRegistry({
      history: { persist: false },
    });
  });

  describe('addCommand', () => {
    it('should register a command', () => {
      const cmd = registry.addCommand('test', 'Test command', 'testing');

      expect(cmd.name).toBe('test');
      expect(cmd.description).toBe('Test command');
      expect(cmd.category).toBe('testing');
    });

    it('should make command available via getCommand', () => {
      registry.addCommand('test', 'Test command', 'testing');

      const cmd = registry.getCommand('test');
      expect(cmd).toBeDefined();
      expect(cmd?.name).toBe('test');
    });

    it('should organize commands by category', () => {
      registry.addCommand('cmd1', 'Command 1', 'catA');
      registry.addCommand('cmd2', 'Command 2', 'catA');
      registry.addCommand('cmd3', 'Command 3', 'catB');

      const categories = registry.getCategories();

      expect(categories.get('catA')).toHaveLength(2);
      expect(categories.get('catB')).toHaveLength(1);
    });

    it('should allow method chaining', () => {
      const cmd = registry
        .addCommand('test', 'Test', 'testing')
        .option('-v, --verbose', 'Verbose output')
        .action((_args, _cmd, resolve) => resolve('done'));

      expect(cmd.options).toHaveLength(1);
    });
  });

  describe('removeCommand', () => {
    it('should remove existing command', () => {
      registry.addCommand('test', 'Test command', 'testing');

      const removed = registry.removeCommand('test');

      expect(removed).toBe(true);
      expect(registry.hasCommand('test')).toBe(false);
    });

    it('should return false for non-existent command', () => {
      const removed = registry.removeCommand('nonexistent');

      expect(removed).toBe(false);
    });

    it('should remove from category', () => {
      registry.addCommand('test', 'Test', 'testing');
      registry.removeCommand('test');

      const categories = registry.getCategories();
      expect(categories.has('testing')).toBe(false);
    });
  });

  describe('hasCommand', () => {
    it('should return true for existing command', () => {
      registry.addCommand('test', 'Test', 'testing');

      expect(registry.hasCommand('test')).toBe(true);
    });

    it('should return false for non-existent command', () => {
      expect(registry.hasCommand('nonexistent')).toBe(false);
    });
  });

  describe('parseCommand', () => {
    it('should parse registered command', () => {
      registry.addCommand('greet <name>', 'Greet', 'utils');

      const result = registry.parseCommand('greet World');

      expect(result.command?.name).toBe('greet');
      expect(result.args['name']).toBe('World');
    });

    it('should return null command for unknown', () => {
      const result = registry.parseCommand('unknown');

      expect(result.command).toBeNull();
    });
  });

  describe('executeCommand', () => {
    it('should execute command and return result', async () => {
      registry
        .addCommand('echo <text>', 'Echo text', 'utils')
        .action((args, _cmd, resolve) => {
          resolve(args.text);
        });

      const result = await registry.executeCommand('echo hello');

      expect(result).toBe('hello');
    });

    it('should add command to history by default', async () => {
      registry
        .addCommand('test', 'Test', 'testing')
        .action((_args, _cmd, resolve) => resolve('ok'));

      await registry.executeCommand('test');

      expect(registry.history.getAll()).toContain('test');
    });

    it('should not add to history when disabled', async () => {
      registry
        .addCommand('test', 'Test', 'testing')
        .action((_args, _cmd, resolve) => resolve('ok'));

      await registry.executeCommand('test', { addToHistory: false });

      expect(registry.history.getAll()).not.toContain('test');
    });

    it('should merge additional args', async () => {
      let receivedArgs: Record<string, unknown> = {};
      registry
        .addCommand('test', 'Test', 'testing')
        .action((args, _cmd, resolve) => {
          receivedArgs = args;
          resolve('ok');
        });

      await registry.executeCommand('test', {
        additionalArgs: { extra: 'value' },
      });

      expect(receivedArgs['extra']).toBe('value');
    });

    it('should call unknown command handler', async () => {
      const handler = vi.fn((_cmd, resolve) => resolve('handled'));
      registry.onUnknownCommand(handler);

      const result = await registry.executeCommand('unknown');

      expect(handler).toHaveBeenCalled();
      expect(result).toBe('handled');
    });

    it('should throw for unknown command without handler', async () => {
      await expect(registry.executeCommand('unknown')).rejects.toThrow(
        'Unknown command: unknown'
      );
    });
  });

  describe('event handling', () => {
    it('should emit execute event', async () => {
      registry
        .addCommand('test', 'Test', 'testing')
        .action((_args, _cmd, resolve) => resolve('ok'));

      const handler = vi.fn();
      registry.on('execute', handler);

      await registry.executeCommand('test');

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'execute',
          command: 'test',
        })
      );
    });

    it('should emit complete event', async () => {
      registry
        .addCommand('test', 'Test', 'testing')
        .action((_args, _cmd, resolve) => resolve('result'));

      const handler = vi.fn();
      registry.on('complete', handler);

      await registry.executeCommand('test');

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'complete',
          command: 'test',
          result: 'result',
        })
      );
    });

    it('should emit error event', async () => {
      registry
        .addCommand('fail', 'Fail', 'testing')
        .action(() => {
          throw new Error('Failed');
        });

      const handler = vi.fn();
      registry.on('error', handler);

      await expect(registry.executeCommand('fail')).rejects.toThrow();

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          command: 'fail',
        })
      );
    });

    it('should return unsubscribe function', async () => {
      registry
        .addCommand('test', 'Test', 'testing')
        .action((_args, _cmd, resolve) => resolve('ok'));

      const handler = vi.fn();
      const unsubscribe = registry.on('execute', handler);

      unsubscribe();
      await registry.executeCommand('test');

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('getAutofillSuggestions', () => {
    beforeEach(() => {
      registry.addCommand('help', 'Help', 'help');
      registry.addCommand('history', 'History', 'help');
      registry.addCommand('greet', 'Greet', 'utils');
    });

    it('should return matching commands', () => {
      const suggestions = registry.getAutofillSuggestions('h');

      expect(suggestions).toContain('help');
      expect(suggestions).toContain('history');
    });

    it('should not include non-matching commands', () => {
      const suggestions = registry.getAutofillSuggestions('h');

      expect(suggestions).not.toContain('greet');
    });
  });

  describe('generateHelp', () => {
    it('should generate help text', () => {
      registry.addCommand('test', 'Test command', 'testing')
        .option('-v, --verbose', 'Verbose output');

      const help = registry.generateHelp();

      expect(help).toContain('testing');
      expect(help).toContain('test');
      expect(help).toContain('Test command');
      expect(help).toContain('--verbose');
    });

    it('should exclude unlisted category', () => {
      registry.addCommand('hidden', 'Hidden command', 'unlisted');

      const help = registry.generateHelp();

      expect(help).not.toContain('unlisted');
      expect(help).not.toContain('hidden');
    });
  });

  describe('getCommands', () => {
    it('should return a copy of commands', () => {
      registry.addCommand('test', 'Test', 'testing');

      const commands = registry.getCommands();
      commands.delete('test');

      expect(registry.hasCommand('test')).toBe(true);
    });
  });

  describe('getCategories', () => {
    it('should return a copy of categories', () => {
      registry.addCommand('test', 'Test', 'testing');

      const categories = registry.getCategories();
      categories.delete('testing');

      expect(registry.getCategories().has('testing')).toBe(true);
    });
  });
});
