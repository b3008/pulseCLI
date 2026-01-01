import { describe, it, expect, vi } from 'vitest';
import { PulseCommand } from './Command';

describe('PulseCommand', () => {
  describe('constructor', () => {
    it('should parse simple command name', () => {
      const cmd = new PulseCommand('help', 'Show help', 'general');

      expect(cmd.name).toBe('help');
      expect(cmd.description).toBe('Show help');
      expect(cmd.category).toBe('general');
      expect(cmd.positionalArgs).toEqual([]);
    });

    it('should parse command with required argument', () => {
      const cmd = new PulseCommand('greet <name>', 'Greet someone', 'utils');

      expect(cmd.name).toBe('greet');
      expect(cmd.positionalArgs).toEqual(['<name>']);
    });

    it('should parse command with optional argument', () => {
      const cmd = new PulseCommand('greet [name]', 'Greet someone', 'utils');

      expect(cmd.name).toBe('greet');
      expect(cmd.positionalArgs).toEqual(['[name]']);
    });

    it('should parse command with multiple arguments', () => {
      const cmd = new PulseCommand(
        'move <source> <dest> [options]',
        'Move files',
        'files'
      );

      expect(cmd.name).toBe('move');
      expect(cmd.positionalArgs).toEqual(['<source>', '<dest>', '[options]']);
    });

    it('should parse multi-word command name', () => {
      const cmd = new PulseCommand('list users <filter>', 'List users', 'admin');

      expect(cmd.name).toBe('list users');
      expect(cmd.positionalArgs).toEqual(['<filter>']);
    });

    it('should default category to general', () => {
      const cmd = new PulseCommand('test', 'Test command');

      expect(cmd.category).toBe('general');
    });
  });

  describe('option', () => {
    it('should add option and return this for chaining', () => {
      const cmd = new PulseCommand('build', 'Build project', 'build');
      const result = cmd.option('-v, --verbose', 'Verbose output');

      expect(result).toBe(cmd);
      expect(cmd.options).toHaveLength(1);
      expect(cmd.options[0].name()).toBe('verbose');
    });

    it('should support multiple options', () => {
      const cmd = new PulseCommand('build', 'Build project', 'build')
        .option('-v, --verbose', 'Verbose output')
        .option('-o, --output <dir>', 'Output directory')
        .option('-w, --watch', 'Watch mode');

      expect(cmd.options).toHaveLength(3);
    });
  });

  describe('action', () => {
    it('should set callback and return this for chaining', () => {
      const callback = vi.fn();
      const cmd = new PulseCommand('test', 'Test', 'test');
      const result = cmd.action(callback);

      expect(result).toBe(cmd);
    });
  });

  describe('execute', () => {
    it('should execute callback with args', async () => {
      const cmd = new PulseCommand('greet <name>', 'Greet someone', 'utils')
        .action((args, cmdStr, resolve) => {
          resolve(`Hello, ${args.name}!`);
        });

      const result = await cmd.execute({ name: 'World', options: {} }, 'greet World');

      expect(result).toBe('Hello, World!');
    });

    it('should handle async actions', async () => {
      const cmd = new PulseCommand('delay', 'Delayed action', 'test')
        .action(async (_args, _cmdStr, resolve) => {
          await new Promise(r => setTimeout(r, 10));
          resolve('done');
        });

      const result = await cmd.execute({ options: {} }, 'delay');

      expect(result).toBe('done');
    });

    it('should reject when no action defined', async () => {
      const cmd = new PulseCommand('empty', 'No action', 'test');

      await expect(cmd.execute({}, 'empty')).rejects.toThrow(
        'No action defined for command: empty'
      );
    });

    it('should handle callback errors', async () => {
      const cmd = new PulseCommand('fail', 'Failing command', 'test')
        .action(() => {
          throw new Error('Command failed');
        });

      await expect(cmd.execute({}, 'fail')).rejects.toThrow('Command failed');
    });

    it('should handle callback rejection', async () => {
      const cmd = new PulseCommand('reject', 'Rejecting command', 'test')
        .action((_args, _cmdStr, _resolve, reject) => {
          reject(new Error('Rejected'));
        });

      await expect(cmd.execute({}, 'reject')).rejects.toThrow('Rejected');
    });
  });

  describe('getUsageExample', () => {
    it('should generate usage for simple command', () => {
      const cmd = new PulseCommand('help', 'Show help', 'help');

      expect(cmd.getUsageExample()).toBe('help');
    });

    it('should include positional arguments', () => {
      const cmd = new PulseCommand('greet <name> [message]', 'Greet', 'utils');

      expect(cmd.getUsageExample()).toBe('greet name message');
    });

    it('should include options', () => {
      const cmd = new PulseCommand('build', 'Build', 'build')
        .option('-o, --output <dir>', 'Output directory')
        .option('-v, --verbose', 'Verbose');

      const usage = cmd.getUsageExample();

      expect(usage).toContain('--output dir');
      expect(usage).toContain('--verbose');
    });
  });

  describe('getArgName', () => {
    it('should remove brackets from argument', () => {
      const cmd = new PulseCommand('test <arg>', 'Test', 'test');

      expect(cmd.getArgName('<arg>')).toBe('arg');
      expect(cmd.getArgName('[optional]')).toBe('optional');
    });
  });

  describe('isArgRequired', () => {
    it('should detect required arguments', () => {
      const cmd = new PulseCommand('test', 'Test', 'test');

      expect(cmd.isArgRequired('<required>')).toBe(true);
      expect(cmd.isArgRequired('[optional]')).toBe(false);
    });
  });
});
