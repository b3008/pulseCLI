import { describe, it, expect, vi } from 'vitest';
import {
  escapeHtml,
  camelToKebab,
  kebabToCamel,
  debounce,
  throttle,
  uniqueId,
  formatDuration,
  deepClone,
} from './helpers';

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    expect(escapeHtml('"test"')).toBe('&quot;test&quot;');
    expect(escapeHtml("'test'")).toBe('&#39;test&#39;');
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('should return same string if no special characters', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });

  it('should handle empty string', () => {
    expect(escapeHtml('')).toBe('');
  });
});

describe('camelToKebab', () => {
  it('should convert camelCase to kebab-case', () => {
    expect(camelToKebab('camelCase')).toBe('camel-case');
    expect(camelToKebab('somePropertyName')).toBe('some-property-name');
    expect(camelToKebab('HTMLElement')).toBe('html-element');
  });

  it('should handle already lowercase strings', () => {
    expect(camelToKebab('lowercase')).toBe('lowercase');
  });

  it('should handle single word', () => {
    expect(camelToKebab('word')).toBe('word');
  });
});

describe('kebabToCamel', () => {
  it('should convert kebab-case to camelCase', () => {
    expect(kebabToCamel('kebab-case')).toBe('kebabCase');
    expect(kebabToCamel('some-property-name')).toBe('somePropertyName');
  });

  it('should handle single word', () => {
    expect(kebabToCamel('word')).toBe('word');
  });

  it('should handle empty string', () => {
    expect(kebabToCamel('')).toBe('');
  });
});

describe('debounce', () => {
  it('should delay function execution', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should reset timer on subsequent calls', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should pass arguments to debounced function', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');

    vi.useRealTimers();
  });
});

describe('throttle', () => {
  it('should execute immediately on first call', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should block subsequent calls within limit', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should allow call after limit expires', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    vi.advanceTimersByTime(100);
    throttled();

    expect(fn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});

describe('uniqueId', () => {
  it('should generate unique IDs', () => {
    const id1 = uniqueId();
    const id2 = uniqueId();

    expect(id1).not.toBe(id2);
  });

  it('should use prefix', () => {
    const id = uniqueId('test');

    expect(id.startsWith('test-')).toBe(true);
  });

  it('should default to pulse prefix', () => {
    const id = uniqueId();

    expect(id.startsWith('pulse-')).toBe(true);
  });
});

describe('formatDuration', () => {
  it('should format milliseconds', () => {
    expect(formatDuration(500)).toBe('500ms');
    expect(formatDuration(0)).toBe('0ms');
    expect(formatDuration(999)).toBe('999ms');
  });

  it('should format seconds', () => {
    expect(formatDuration(1000)).toBe('1.0s');
    expect(formatDuration(1500)).toBe('1.5s');
    expect(formatDuration(59999)).toBe('60.0s');
  });

  it('should format minutes and seconds', () => {
    expect(formatDuration(60000)).toBe('1m 0s');
    expect(formatDuration(90000)).toBe('1m 30s');
    expect(formatDuration(125000)).toBe('2m 5s');
  });
});

describe('deepClone', () => {
  it('should clone primitive values', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('string')).toBe('string');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  it('should clone arrays', () => {
    const original = [1, 2, [3, 4]];
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[2]).not.toBe(original[2]);
  });

  it('should clone objects', () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
  });

  it('should clone nested structures', () => {
    const original = {
      array: [1, { nested: true }],
      object: { deep: { value: 42 } },
    };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned.array[1]).not.toBe(original.array[1]);
    expect(cloned.object.deep).not.toBe(original.object.deep);
  });

  it('should not clone functions', () => {
    const fn = () => 42;
    expect(deepClone(fn)).toBe(fn);
  });
});
