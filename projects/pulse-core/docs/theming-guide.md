# Theming Guide for pulse-cli-core

This guide explains how to customize the visual appearance of pulse-cli-core components to match your project's design system.

## Overview

pulse-cli-core provides three levels of theming customization:

1. **Built-in theme presets** - Quick switching between dark, light, and high-contrast themes
2. **Custom theme registration** - Define your own named themes
3. **CSS Parts** - Fine-grained styling of individual component elements

## Built-in Themes

Three themes are included out of the box:

```typescript
import { PulseTerminal } from '@pulsecli/core';

// Via HTML attribute
<pulse-terminal theme="dark"></pulse-terminal>
<pulse-terminal theme="light"></pulse-terminal>
<pulse-terminal theme="high-contrast"></pulse-terminal>

// Via JavaScript
const terminal = document.querySelector('pulse-terminal');
terminal.setTheme('light');
```

## Creating Custom Themes

Use `PulseTerminal.registerTheme()` to define custom themes that integrate with your design system.

### Theme Properties

A theme can customize any of these properties:

| Property | Description | Example |
|----------|-------------|---------|
| `bg` | Primary background color | `#161616` |
| `bgSecondary` | Secondary/elevated background | `#262626` |
| `text` | Primary text color | `#f4f4f4` |
| `textMuted` | Secondary/muted text | `#8d8d8d` |
| `accent` | Primary accent color (prompt, links) | `#0f62fe` |
| `accentHover` | Accent hover state | `#0043ce` |
| `error` | Error state color | `#da1e28` |
| `success` | Success state color | `#24a148` |
| `warning` | Warning state color | `#f1c21b` |
| `border` | Border color | `#393939` |
| `fontFamily` | Font stack | `'IBM Plex Mono', monospace` |
| `fontSize` | Base font size | `14px` |
| `lineHeight` | Line height | `1.5` |
| `spacingXs` | Extra small spacing | `4px` |
| `spacingSm` | Small spacing | `8px` |
| `spacingMd` | Medium spacing | `16px` |
| `spacingLg` | Large spacing | `24px` |
| `radius` | Border radius | `0` |
| `transition` | Animation timing | `0.11s ease` |

---

## Case Study: IBM Carbon Design System Integration

This example demonstrates how to create a theme that aligns with [IBM's Carbon Design System](https://carbondesignsystem.com/), specifically the Gray 100 (g100) dark theme.

### Step 1: Install Dependencies

If you're using Carbon in your project, you likely already have the design tokens:

```bash
npm install @carbon/themes @carbon/type
```

### Step 2: Create the Carbon Theme

Register the theme before creating any terminal instances:

```typescript
import { PulseTerminal } from '@pulsecli/core';

// Register IBM Carbon g100 (Gray 100) dark theme
PulseTerminal.registerTheme('carbon', {
  // Core colors from Carbon g100 theme
  bg: '#161616',              // $background
  bgSecondary: '#262626',     // $layer-01
  text: '#f4f4f4',            // $text-primary
  textMuted: '#8d8d8d',       // $text-secondary

  // Interactive colors
  accent: '#0f62fe',          // $interactive / $link-primary
  accentHover: '#0043ce',     // $link-primary-hover

  // Support colors
  error: '#da1e28',           // $support-error
  success: '#24a148',         // $support-success
  warning: '#f1c21b',         // $support-warning

  // Border
  border: '#393939',          // $border-subtle-01

  // Typography - use IBM Plex Mono for terminal
  fontFamily: "'IBM Plex Mono', 'Menlo', 'Consolas', monospace",
  fontSize: '14px',
  lineHeight: '1.42857',      // Carbon's productive line height

  // Spacing - Carbon uses 16px base with 2px mini unit
  spacingXs: '4px',           // $spacing-02
  spacingSm: '8px',           // $spacing-03
  spacingMd: '16px',          // $spacing-05
  spacingLg: '24px',          // $spacing-06

  // Carbon uses minimal border radius for most components
  radius: '0',

  // Carbon's standard motion timing
  transition: '110ms cubic-bezier(0.2, 0, 0.38, 0.9)',
});
```

### Step 3: Use the Theme

```html
<!-- Via attribute -->
<pulse-terminal theme="carbon"></pulse-terminal>

<!-- Or via JavaScript -->
<script>
  const terminal = document.querySelector('pulse-terminal');
  terminal.setTheme('carbon');
</script>
```

### Step 4: Additional CSS Customization with Parts

For pixel-perfect Carbon integration, use CSS Parts to style specific elements:

```css
/* Import Carbon's IBM Plex Mono font */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap');

/* Style the terminal container */
pulse-terminal::part(terminal) {
  border: 1px solid #393939;
}

/* Style the command input to match Carbon's text input */
pulse-command-line::part(command-line) {
  background: #262626;
  border: none;
  border-bottom: 1px solid #6f6f6f;
  border-radius: 0;
  padding: 11px 16px;
}

pulse-command-line::part(command-line):focus-within {
  border-bottom-color: #0f62fe;
  outline: 2px solid #0f62fe;
  outline-offset: -2px;
}

/* Style the prompt to use Carbon's interactive blue */
pulse-command-line::part(prompt) {
  color: #78a9ff;  /* $link-inverse for better visibility */
  font-weight: 600;
}

/* Style output cards to match Carbon's tile component */
pulse-command-output::part(output-card) {
  background: #262626;
  border: none;
  border-radius: 0;
}

pulse-command-output::part(header) {
  background: #161616;
  border-bottom: 1px solid #393939;
  padding: 12px 16px;
}

pulse-command-output::part(close-button) {
  border-radius: 0;
}

pulse-command-output::part(close-button):hover {
  background: #da1e28;
}
```

### Complete Example

Here's a full working example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Carbon Terminal</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      background: #161616;
      font-family: 'IBM Plex Sans', sans-serif;
    }

    .container {
      max-width: 800px;
      margin: 48px auto;
      padding: 0 16px;
    }

    pulse-terminal {
      height: 400px;
      display: block;
    }

    /* Carbon-specific overrides */
    pulse-terminal::part(terminal) {
      border: 1px solid #393939;
    }

    pulse-command-line::part(command-line) {
      border-radius: 0;
      border-bottom: 1px solid #6f6f6f;
    }

    pulse-command-output::part(output-card) {
      border-radius: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <pulse-terminal
      theme="carbon"
      prompt="$"
      welcome="Welcome to the Carbon-styled terminal.">
    </pulse-terminal>
  </div>

  <script type="module">
    import { PulseTerminal } from '@pulsecli/core';

    // Register the Carbon theme BEFORE the component renders
    PulseTerminal.registerTheme('carbon', {
      bg: '#161616',
      bgSecondary: '#262626',
      text: '#f4f4f4',
      textMuted: '#8d8d8d',
      accent: '#0f62fe',
      accentHover: '#0043ce',
      error: '#da1e28',
      success: '#24a148',
      warning: '#f1c21b',
      border: '#393939',
      fontFamily: "'IBM Plex Mono', 'Menlo', monospace",
      fontSize: '14px',
      lineHeight: '1.42857',
      radius: '0',
      transition: '110ms cubic-bezier(0.2, 0, 0.38, 0.9)',
    });

    // Add custom commands
    const terminal = document.querySelector('pulse-terminal');
    terminal.registry.addCommand('hello', 'Say hello', 'demo')
      .action((args, cmd, resolve) => resolve('Hello from Carbon!'));
  </script>
</body>
</html>
```

---

## Using Carbon Tokens Directly

If you're already using `@carbon/themes` in your project, you can create the theme dynamically:

```typescript
import { g100 } from '@carbon/themes';
import { PulseTerminal } from '@pulsecli/core';

PulseTerminal.registerTheme('carbon', {
  bg: g100.background,
  bgSecondary: g100.layer01,
  text: g100.textPrimary,
  textMuted: g100.textSecondary,
  accent: g100.linkPrimary,
  accentHover: g100.linkPrimaryHover,
  error: g100.supportError,
  success: g100.supportSuccess,
  warning: g100.supportWarning,
  border: g100.borderSubtle01,
  fontFamily: "'IBM Plex Mono', monospace",
  radius: '0',
});
```

---

## CSS Parts Reference

All styleable parts exposed by pulse-cli-core components:

### pulse-terminal
| Part | Element |
|------|---------|
| `terminal` | Main container |
| `output-container` | Scrollable output area |

### pulse-command-line
| Part | Element |
|------|---------|
| `command-line` | Input container |
| `prompt` | Prompt symbol |
| `input` | Text input field |

### pulse-command-output
| Part | Element |
|------|---------|
| `output-card` | Card container |
| `header` | Card header |
| `command-text` | Command display text |
| `close-button` | Close button |
| `content` | Content area |

---

## Theme API Reference

### Static Methods

```typescript
// Register a custom theme
PulseTerminal.registerTheme(name: string, theme: Partial<PulseTheme>): void

// Remove a custom theme
PulseTerminal.unregisterTheme(name: string): boolean

// Get a theme by name (custom or built-in)
PulseTerminal.getThemeByName(name: string): PulseTheme | undefined

// List all available theme names
PulseTerminal.getThemeNames(): string[]
```

### Instance Methods

```typescript
// Set the terminal's theme
terminal.setTheme(name: string): void
terminal.setTheme(theme: Partial<PulseTheme>): void

// Get the current theme
terminal.getTheme(): PulseTheme
```

---

## Resources

- [Carbon Design System - Color Tokens](https://carbondesignsystem.com/elements/color/tokens/)
- [Carbon Design System - Themes](https://carbondesignsystem.com/elements/themes/overview/)
- [@carbon/themes npm package](https://www.npmjs.com/package/@carbon/themes)
