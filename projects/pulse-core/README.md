# @b3008/pulse-cli-core

Framework-agnostic core library for PulseCLI - a powerful, terminal-style command interface for web applications.

[![Tests](https://img.shields.io/badge/tests-135%20passing-brightgreen.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- 🎯 **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JavaScript
- 🧩 **Web Components** - Built-in terminal UI using standards-based Custom Elements
- 📦 **Zero Dependencies** - Core library has no runtime dependencies
- 🔧 **TypeScript First** - Fully typed API with excellent IDE support
- 🎨 **Customizable** - CSS custom properties for theming
- 📝 **Command Parsing** - Rich command-line parsing with options and arguments
- 💾 **History Management** - Built-in command history with persistence
- ⚡ **Lightweight** - Small bundle size, tree-shakeable

## Installation

```bash
npm install @b3008/pulse-cli-core
```

## Quick Start

### Using Web Components

The easiest way to get started is with the built-in Web Components:

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@b3008/pulse-cli-core';

    // Get reference to terminal
    const terminal = document.querySelector('pulse-terminal');

    // Wait for terminal to be ready
    terminal.addEventListener('pulse-ready', (event) => {
      const { registry } = event.detail;

      // Register a custom command
      registry.addCommand('greet <name>', 'Greet someone', 'demo')
        .option('-l, --loud', 'Use uppercase')
        .action((args, cmd, resolve) => {
          let message = `Hello, ${args.name}!`;
          if (args.options.loud) {
            message = message.toUpperCase();
          }
          resolve(message);
        });
    });
  </script>
</head>
<body>
  <pulse-terminal
    prompt="$"
    welcome="Welcome to PulseCLI! Type 'help' for available commands."
  ></pulse-terminal>
</body>
</html>
```

### Using with React

#### Quick Start (Recommended)

The easiest way to use PulseCLI in React is with the `PulseTerminal` component and declarative `commands` prop:

```tsx
import { PulseTerminal } from '@b3008/pulse-cli-core/react';

function App() {
  return (
    <PulseTerminal
      prompt="$"
      welcome="Welcome! Type 'help' for available commands."
      theme="dark"
      commands={[
        {
          command: 'hello',
          description: 'Say hello',
          category: 'demo',
          action: (args, cmd, resolve) => resolve('Hello, World!'),
        },
        {
          command: 'greet <name>',
          description: 'Greet someone by name',
          category: 'demo',
          options: [{ flags: '-l, --loud', description: 'Use uppercase' }],
          action: (args, cmd, resolve) => {
            let msg = `Hello, ${args.name}!`;
            if (args.options.loud) msg = msg.toUpperCase();
            resolve(msg);
          },
        },
      ]}
    />
  );
}
```

That's it! No refs, no `useEffect`, no event listeners needed.

#### TypeScript Setup

For TypeScript support, add the JSX type definitions. In your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@b3008/pulse-cli-core/jsx"]
  }
}
```

Or add a triple-slash reference in a `.d.ts` file:

```typescript
/// <reference types="@b3008/pulse-cli-core/jsx" />
```

#### Theming

Use built-in themes or create custom ones:

```tsx
import { PulseTerminal, registerTheme } from '@b3008/pulse-cli-core/react';

// Built-in themes: 'dark', 'light', 'high-contrast'
<PulseTerminal theme="light" commands={[...]} />

// Inline custom theme (per-component)
<PulseTerminal
  customTheme={{
    bg: '#1a1a2e',
    accent: '#e94560',
    text: '#eaeaea',
  }}
  commands={[...]}
/>

// Register a reusable named theme
registerTheme('my-brand', {
  bg: '#0a0a0a',
  accent: '#ff6b6b',
  text: '#ffffff',
  fontFamily: '"Fira Code", monospace',
});

<PulseTerminal theme="my-brand" commands={[...]} />
```

See the [Theming Guide](docs/theming-guide.md) for all available theme properties.

#### Advanced: Context Hook

For commands in child components, use the `usePulseRegistry` hook:

```tsx
import { PulseTerminal, usePulseRegistry } from '@b3008/pulse-cli-core/react';
import { useEffect } from 'react';

function MyCommands() {
  const registry = usePulseRegistry();

  useEffect(() => {
    if (!registry) return;

    const cmd = registry.addCommand('fetch-data', 'Fetch remote data', 'api')
      .action(async (args, cmd, resolve, reject) => {
        try {
          const data = await fetch('/api/data').then(r => r.json());
          resolve(JSON.stringify(data, null, 2));
        } catch (e) {
          reject(e);
        }
      });

    return () => registry.removeCommand('fetch-data');
  }, [registry]);

  return null;
}

function App() {
  return (
    <PulseTerminal prompt="$" commands={[...]}>
      <MyCommands />
    </PulseTerminal>
  );
}
```

#### Advanced: Direct Hook Usage

For full control, use the `usePulseTerminal` hook:

```tsx
import { usePulseTerminal } from '@b3008/pulse-cli-core/react';
import '@b3008/pulse-cli-core'; // Import web components

function Terminal() {
  const { terminalRef, registry, isReady } = usePulseTerminal({
    onReady: (registry) => {
      registry.addCommand('hello', 'Say hello', 'demo')
        .action((args, cmd, resolve) => resolve('Hello!'));
    }
  });

  return <pulse-terminal ref={terminalRef} prompt=">" />;
}
```

#### Rendering React Components in Output

Use `createOutputMount()` to render React components in command output:

```tsx
import { createRoot } from 'react-dom/client';

function DataTable({ data }: { data: Array<{ name: string; value: string }> }) {
  return (
    <table style={{ width: '100%' }}>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ padding: '8px' }}>{row.name}</td>
            <td style={{ padding: '8px' }}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// In your command action:
action: (args, cmd, resolve) => {
  const mountPoint = terminal.createOutputMount(cmd);
  const root = createRoot(mountPoint);
  root.render(
    <DataTable data={[
      { name: 'CPU', value: '45%' },
      { name: 'Memory', value: '2.1 GB' },
    ]} />
  );
  resolve(null);
}
```

### Headless Usage (No UI)

Use just the command registry without any UI:

```typescript
import { CommandRegistry } from '@b3008/pulse-cli-core';

const registry = new CommandRegistry();

// Register commands
registry.addCommand('deploy <env>', 'Deploy to environment', 'ops')
  .option('-f, --force', 'Force deployment')
  .option('-v, --verbose', 'Verbose output')
  .action(async (args, cmd, resolve, reject) => {
    try {
      console.log(`Deploying to ${args.env}...`);
      if (args.options.force) {
        console.log('Force flag enabled');
      }
      // Your deployment logic here
      resolve('Deployment complete!');
    } catch (error) {
      reject(error);
    }
  });

// Execute commands
const result = await registry.executeCommand('deploy production --force');
console.log(result); // "Deployment complete!"
```

## Core Concepts

### Commands

Commands are registered with a name, description, and category:

```typescript
registry.addCommand('command-name <required> [optional]', 'Description', 'category')
  .option('-s, --short <value>', 'Option description')
  .action((args, commandString, resolve, reject) => {
    // Command implementation
    resolve(result);
  });
```

**Positional Arguments:**
- `<required>` - Required argument
- `[optional]` - Optional argument

**Options:**
- `-s, --short` - Boolean flag
- `-o, --output <file>` - Option with required value
- `-c, --config [path]` - Option with optional value

### Command History

Command history is automatically managed and persisted:

```typescript
const registry = new CommandRegistry({
  history: {
    maxSize: 100,        // Maximum number of commands to keep
    persist: true,       // Persist to storage
    storageKey: 'my-cli-history'
  }
});

// Navigate history
registry.history.getPrevious(); // Get previous command
registry.history.getNext();     // Get next command
registry.history.search('git'); // Search history
registry.history.clear();       // Clear all history
```

### Storage Adapters

Choose how command history is persisted:

```typescript
import {
  LocalStorageAdapter,    // Browser localStorage
  SessionStorageAdapter,  // Browser sessionStorage
  MemoryStorageAdapter    // In-memory (no persistence)
} from '@b3008/pulse-cli-core';

const registry = new CommandRegistry({
  history: {
    storage: new LocalStorageAdapter('my-app'),
    persist: true
  }
});
```

### Event Handling

Listen to command lifecycle events:

```typescript
registry.on('execute', (event) => {
  console.log(`Executing: ${event.command}`);
});

registry.on('complete', (event) => {
  console.log(`Completed: ${event.command}`, event.result);
});

registry.on('error', (event) => {
  console.error(`Error in: ${event.command}`, event.error);
});
```

## Web Components API

### `<pulse-terminal>`

Main terminal component that combines input and output.

**Attributes:**
- `prompt` - Prompt symbol (default: `>`)
- `welcome` - Welcome message to display
- `max-outputs` - Maximum number of output cards to keep (default: 50)
- `theme` - Theme name: `dark`, `light`, `high-contrast`, or custom registered

**Properties:**
- `registry` - CommandRegistry instance

**Methods:**
- `execute(command: string)` - Execute a command programmatically
- `addOutput(content: string, command?: string)` - Add output card
- `clearOutputs()` - Clear all output
- `setTheme(name: string)` - Change theme at runtime
- `focus()` - Focus the command input

**Static Methods:**
- `PulseTerminal.registerTheme(name, theme)` - Register a custom theme
- `PulseTerminal.unregisterTheme(name)` - Remove a custom theme
- `PulseTerminal.getThemeNames()` - Get all available theme names

**Events:**
- `pulse-ready` - Emitted when terminal is initialized
- `pulse-command` - Emitted when a command is executed

### `<pulse-command-line>`

Command input component.

**Attributes:**
- `prompt` - Prompt symbol
- `placeholder` - Input placeholder text
- `disabled` - Whether input is disabled
- `autofocus` - Auto-focus on mount

**Methods:**
- `setRegistry(registry)` - Connect to a command registry
- `focus()` - Focus the input
- `clear()` - Clear the input

**Events:**
- `pulse-submit` - When command is submitted
- `pulse-change` - When input value changes
- `pulse-suggestions` - When autocomplete suggestions change

### `<pulse-command-output>`

Output card component.

**Attributes:**
- `command` - The command that produced this output
- `closeable` - Show close button
- `draggable` - Enable drag functionality

**Methods:**
- `setContent(html)` - Set content as HTML
- `setTextContent(text)` - Set content as text
- `clearContent()` - Clear content

**Events:**
- `pulse-close` - When close button clicked
- `pulse-focus` - When card is clicked

## Theming

Customize appearance with CSS custom properties:

```css
pulse-terminal {
  /* Colors */
  --pulse-bg: #1a1a2e;
  --pulse-bg-secondary: #16213e;
  --pulse-text: #eee;
  --pulse-text-muted: #888;
  --pulse-accent: #00d4ff;
  --pulse-error: #ff4757;
  --pulse-success: #2ed573;

  /* Typography */
  --pulse-font-family: 'Fira Code', monospace;
  --pulse-font-size: 14px;
  --pulse-line-height: 1.5;

  /* Spacing */
  --pulse-spacing-md: 16px;
  --pulse-radius: 4px;
}
```

## Advanced Usage

### Multi-word Commands

```typescript
registry.addCommand('git commit <message>', 'Git commit', 'git')
  .option('-m, --amend', 'Amend previous commit')
  .action((args, cmd, resolve) => {
    // Handle git commit
  });

// Execute: "git commit 'Initial commit' --amend"
```

### Command with Multiple Options

```typescript
registry.addCommand('search <query>', 'Search', 'tools')
  .option('-t, --type <type>', 'Filter by type')
  .option('-s, --sort <field>', 'Sort field')
  .option('-l, --limit <count>', 'Result limit')
  .action((args, cmd, resolve) => {
    const { query, options } = args;
    // options.type, options.sort, options.limit
  });
```

### Async Commands

```typescript
registry.addCommand('fetch <url>', 'Fetch data', 'network')
  .action(async (args, cmd, resolve, reject) => {
    try {
      const response = await fetch(args.url);
      const data = await response.json();
      resolve(JSON.stringify(data, null, 2));
    } catch (error) {
      reject(error);
    }
  });
```

### Custom Unknown Command Handler

```typescript
registry.onUnknownCommand((command, resolve, reject) => {
  // Try to suggest similar commands
  const suggestions = registry.getAutofillSuggestions(command);

  if (suggestions.length > 0) {
    resolve(`Unknown command. Did you mean: ${suggestions.join(', ')}?`);
  } else {
    resolve(`Unknown command: ${command}`);
  }
});
```

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type {
  Command,
  CommandCallback,
  ParseResult,
  ExecuteOptions,
  CommandEvent
} from '@b3008/pulse-cli-core';

const callback: CommandCallback = (args, cmd, resolve, reject) => {
  // Fully typed
  const name: unknown = args.name;
  resolve('Done');
};
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires support for:
- ES2020
- Custom Elements
- Shadow DOM

## Testing

The package includes 135+ tests covering all functionality:

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Building

```bash
npm run build    # Build library
npm run dev      # Development mode with watch
```

## License

MIT © Nikolaos Batalas

## Contributing

Contributions welcome! This package is framework-agnostic and designed to work everywhere.

---

Part of the [PulseCLI](https://github.com/b3008/pulseCLI) project.
