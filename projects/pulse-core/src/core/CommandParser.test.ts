import { describe, it, expect, beforeEach } from 'vitest';
import { CommandParser } from './CommandParser';
import { PulseCommand } from './Command';
import type { Command } from './types';

describe('CommandParser', () => {
  let parser: CommandParser;
  let commands: Map<string, Command>;

  beforeEach(() => {
    parser = new CommandParser();
    commands = new Map();

    // Register test commands
    const greet = new PulseCommand('greet <name>', 'Greet someone', 'utils')
      .option('-l, --loud', 'Use uppercase')
      .option('-t, --times <count>', 'Repeat count');
    commands.set('greet', greet);

    const list = new PulseCommand('list users', 'List all users', 'admin')
      .option('-a, --all', 'Include inactive');
    commands.set('list users', list);

    const help = new PulseCommand('help', 'Show help', 'general');
    commands.set('help', help);

    const move = new PulseCommand('move <src> <dest>', 'Move files', 'files')
      .option('-f, --force', 'Force overwrite')
      .option('-v, --verbose', 'Verbose output');
    commands.set('move', move);
  });

  describe('parse', () => {
    it('should parse simple command', () => {
      const result = parser.parse('help', commands);

      expect(result.command).not.toBeNull();
      expect(result.command?.name).toBe('help');
      expect(result.commandString).toBe('help');
    });

    it('should parse command with positional argument', () => {
      const result = parser.parse('greet World', commands);

      expect(result.command?.name).toBe('greet');
      expect(result.args['name']).toBe('World');
    });

    it('should parse command with multiple positional arguments', () => {
      const result = parser.parse('move /src /dest', commands);

      expect(result.args['src']).toBe('/src');
      expect(result.args['dest']).toBe('/dest');
    });

    it('should parse multi-word command', () => {
      const result = parser.parse('list users', commands);

      expect(result.command?.name).toBe('list users');
    });

    it('should parse multi-word command with options', () => {
      const result = parser.parse('list users --all', commands);

      expect(result.command?.name).toBe('list users');
      expect(result.options['all']).toBe(true);
    });

    it('should handle unknown commands', () => {
      const result = parser.parse('unknown command', commands);

      expect(result.command).toBeNull();
    });

    it('should handle empty input', () => {
      const result = parser.parse('', commands);

      expect(result.command).toBeNull();
    });

    it('should handle whitespace-only input', () => {
      const result = parser.parse('   ', commands);

      expect(result.command).toBeNull();
    });
  });

  describe('options parsing', () => {
    it('should parse boolean short option', () => {
      const result = parser.parse('greet World -l', commands);

      expect(result.options['loud']).toBe(true);
    });

    it('should parse boolean long option', () => {
      const result = parser.parse('greet World --loud', commands);

      expect(result.options['loud']).toBe(true);
    });

    it('should parse option with value', () => {
      const result = parser.parse('greet World --times 3', commands);

      expect(result.options['times']).toBe('3');
    });

    it('should parse multiple options', () => {
      const result = parser.parse('move /src /dest --force --verbose', commands);

      expect(result.options['force']).toBe(true);
      expect(result.options['verbose']).toBe(true);
    });

    it('should parse mixed short and long options', () => {
      const result = parser.parse('greet World -l --times 5', commands);

      expect(result.options['loud']).toBe(true);
      expect(result.options['times']).toBe('5');
    });
  });

  describe('quoted strings', () => {
    it('should parse double-quoted arguments', () => {
      const result = parser.parse('greet "Hello World"', commands);

      expect(result.args['name']).toBe('Hello World');
    });

    it('should parse single-quoted arguments', () => {
      const result = parser.parse("greet 'Hello World'", commands);

      expect(result.args['name']).toBe('Hello World');
    });

    it('should parse quoted option values', () => {
      const result = parser.parse('greet Test --times "10"', commands);

      expect(result.options['times']).toBe('10');
    });

    it('should handle quotes within arguments', () => {
      const result = parser.parse('greet "John Doe"', commands);

      expect(result.args['name']).toBe('John Doe');
    });
  });

  describe('options in args', () => {
    it('should include options object in args', () => {
      const result = parser.parse('greet World --loud', commands);

      expect(result.args['options']).toEqual({ loud: true });
    });
  });

  describe('getAutocompleteSuggestions', () => {
    it('should return all commands for empty input', () => {
      const suggestions = parser.getAutocompleteSuggestions('', commands);

      expect(suggestions).toContain('greet');
      expect(suggestions).toContain('help');
      expect(suggestions).toContain('list users');
    });

    it('should filter by prefix', () => {
      const suggestions = parser.getAutocompleteSuggestions('gr', commands);

      expect(suggestions).toEqual(['greet']);
    });

    it('should be case-insensitive', () => {
      const suggestions = parser.getAutocompleteSuggestions('GR', commands);

      expect(suggestions).toEqual(['greet']);
    });

    it('should return sorted suggestions', () => {
      const suggestions = parser.getAutocompleteSuggestions('', commands);

      const sorted = [...suggestions].sort();
      expect(suggestions).toEqual(sorted);
    });

    it('should return empty array for no matches', () => {
      const suggestions = parser.getAutocompleteSuggestions('xyz', commands);

      expect(suggestions).toEqual([]);
    });
  });
});
