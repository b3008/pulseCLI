/**
 * TypeScript declarations for custom elements in React/JSX
 *
 * Usage: Add to your project's types or import in a .d.ts file:
 *   import '@b3008/pulse-cli-core/jsx';
 *
 * Or add a triple-slash reference:
 *   /// <reference types="@b3008/pulse-cli-core/jsx" />
 */

import type * as React from "react";
import type { CommandRegistry } from "./src/core/CommandRegistry";

/** Built-in theme presets */
type ThemePreset = "dark" | "light" | "high-contrast" | "primal";

// For React 17+ with "jsx": "react-jsx" (automatic runtime)
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "pulse-terminal": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          prompt?: string;
          welcome?: string;
          "max-outputs"?: number;
          theme?: ThemePreset | (string & {});
          ref?: React.Ref<HTMLElement & { registry: CommandRegistry }>;
        },
        HTMLElement
      >;

      "pulse-command-line": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          prompt?: string;
          placeholder?: string;
          disabled?: boolean;
          autofocus?: boolean;
          ref?: React.Ref<HTMLElement>;
        },
        HTMLElement
      >;

      "pulse-command-output": React.DetailedHTMLProps<
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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "pulse-terminal": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          prompt?: string;
          welcome?: string;
          "max-outputs"?: number;
          theme?: ThemePreset | (string & {});
        },
        HTMLElement
      >;

      "pulse-command-line": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          prompt?: string;
          placeholder?: string;
          disabled?: boolean;
          autofocus?: boolean;
          ref?: React.Ref<HTMLElement>;
        },
        HTMLElement
      >;

      "pulse-command-output": React.DetailedHTMLProps<
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
declare module "@vue/runtime-dom" {
  export interface GlobalComponents {
    "pulse-terminal": {
      prompt?: string;
      welcome?: string;
      "max-outputs"?: number;
      theme?: ThemePreset | (string & {});
    };

    "pulse-command-line": {
      prompt?: string;
      placeholder?: string;
      disabled?: boolean;
      autofocus?: boolean;
    };

    "pulse-command-output": {
      command?: string;
      closeable?: boolean;
      draggable?: boolean;
    };
  }
}

export {};
