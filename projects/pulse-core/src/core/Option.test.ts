import { describe, it, expect } from 'vitest';
import { CommandOption } from './Option';

describe('CommandOption', () => {
  describe('constructor', () => {
    it('should parse short flag', () => {
      const opt = new CommandOption('-v', 'Verbose output');

      expect(opt.short).toBe('-v');
      expect(opt.long).toBeNull();
      expect(opt.description).toBe('Verbose output');
    });

    it('should parse long flag', () => {
      const opt = new CommandOption('--verbose', 'Verbose output');

      expect(opt.short).toBeNull();
      expect(opt.long).toBe('--verbose');
    });

    it('should parse both short and long flags with comma', () => {
      const opt = new CommandOption('-v, --verbose', 'Verbose output');

      expect(opt.short).toBe('-v');
      expect(opt.long).toBe('--verbose');
    });

    it('should parse both short and long flags with pipe', () => {
      const opt = new CommandOption('-v | --verbose', 'Verbose output');

      expect(opt.short).toBe('-v');
      expect(opt.long).toBe('--verbose');
    });

    it('should detect required value indicator', () => {
      const opt = new CommandOption('-o, --output <file>', 'Output file');

      expect(opt.required).toBe(true);
      expect(opt.optional).toBe(false);
      expect(opt.isBoolean).toBe(false);
    });

    it('should detect optional value indicator', () => {
      const opt = new CommandOption('-c, --config [path]', 'Config path');

      expect(opt.required).toBe(false);
      expect(opt.optional).toBe(true);
      expect(opt.isBoolean).toBe(false);
    });

    it('should detect boolean flag', () => {
      const opt = new CommandOption('-v, --verbose', 'Verbose output');

      expect(opt.required).toBe(false);
      expect(opt.optional).toBe(false);
      expect(opt.isBoolean).toBe(true);
    });
  });

  describe('name', () => {
    it('should return long option name without dashes', () => {
      const opt = new CommandOption('-v, --verbose', 'Verbose output');

      expect(opt.name()).toBe('verbose');
    });

    it('should return short option name without dash if no long option', () => {
      const opt = new CommandOption('-v', 'Verbose output');

      expect(opt.name()).toBe('v');
    });

    it('should strip no- prefix from negated options', () => {
      const opt = new CommandOption('--no-cache', 'Disable caching');

      expect(opt.name()).toBe('cache');
    });
  });

  describe('matches', () => {
    it('should match short flag', () => {
      const opt = new CommandOption('-v, --verbose', 'Verbose output');

      expect(opt.matches('-v')).toBe(true);
      expect(opt.matches('-x')).toBe(false);
    });

    it('should match long flag', () => {
      const opt = new CommandOption('-v, --verbose', 'Verbose output');

      expect(opt.matches('--verbose')).toBe(true);
      expect(opt.matches('--debug')).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return formatted string representation', () => {
      const opt = new CommandOption('-v, --verbose', 'Verbose output');

      expect(opt.toString()).toBe('-v, --verbose: Verbose output');
    });
  });
});
