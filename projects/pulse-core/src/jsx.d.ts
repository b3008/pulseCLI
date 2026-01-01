/**
 * TypeScript declarations for custom elements in React/JSX
 */

import type { CommandRegistry } from './core/CommandRegistry';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'pulse-terminal': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          prompt?: string;
          welcome?: string;
          'max-outputs'?: number;
          ref?: React.Ref<HTMLElement & { registry: CommandRegistry }>;
        },
        HTMLElement
      >;

      'pulse-command-line': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          prompt?: string;
          placeholder?: string;
          disabled?: boolean;
          autofocus?: boolean;
          ref?: React.Ref<HTMLElement>;
        },
        HTMLElement
      >;

      'pulse-command-output': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          command?: string;
          closeable?: boolean;
          draggable?: boolean;
          ref?: React.Ref<HTMLElement>;
        },
        HTMLElement
      >;
    }
  }
}

// Vue 3 types
declare module '@vue/runtime-dom' {
  export interface GlobalComponents {
    'pulse-terminal': {
      prompt?: string;
      welcome?: string;
      'max-outputs'?: number;
    };

    'pulse-command-line': {
      prompt?: string;
      placeholder?: string;
      disabled?: boolean;
      autofocus?: boolean;
    };

    'pulse-command-output': {
      command?: string;
      closeable?: boolean;
      draggable?: boolean;
    };
  }
}

export {};
