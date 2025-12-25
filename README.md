# PulseCLI

A powerful, terminal-inspired UI library for Angular that provides a flexible command-line interface with drag-and-drop panels for rapid prototyping and component development.



## Overview

Building interfaces for web applications can be complex and time-consuming, especially when multiple stakeholders are involved and the information architecture is still in flux. PulseCLI aims to help by providing a **stand-in-until-you-make-your-own-UI**, so that you can get components up and running without requiring you to settle on a final information architecture upfront.

## Key Features

- **Multi-Panel Interface**: Organize your UI into resizable, draggable panels
- **Command-Line System**: Each panel includes its own command line for executing commands with arguments
- **Drag-and-Drop**: Move command output cards between panels seamlessly
- **Command History**: Navigate through previously executed commands
- **Markdown Support**: Render command output with markdown formatting using Showdown
- **Modern UI**: Built with PrimeNG components and Aura theme
- **Extensible**: Register custom commands through the CommandRegistry service

## Technology Stack

- **Angular 19**: Modern standalone component architecture
- **PrimeNG 19**: Professional UI component library with Aura theme
- **TypeScript 5.6**: Type-safe development
- **RxJS 7**: Reactive programming
- **Showdown**: Markdown to HTML conversion

## Architecture

The core components include:

- **PulseCLIComponent**: Main container managing panels and layout
- **CommandLineComponent**: Input interface for executing commands
- **CommandOutputComponent**: Displays command execution results
- **CommandRegistryService**: Central service for registering and executing commands

### Command System

Commands are registered through the `CommandRegistryService` and can be executed via the command line interface. The system supports:

- Command parsing with arguments
- Command history navigation
- Asynchronous command execution
- Markdown rendering in output
- Custom command registration

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change source files.

## Building

Build the project for production:

```bash
npm run build
```

Deploy to GitHub Pages:

```bash
npm run deploy
```

This builds the project and outputs to the `docs/` directory with the base href set to `/pulseCLI/`.

## Testing

Run unit tests:

```bash
npm test
```

Generate code coverage:

```bash
npm run coverage
```

## Usage Example

```typescript
import { Component } from '@angular/core';
import { PulseCLIComponent } from 'pulse-cli';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PulseCLIComponent],
  template: '<lib-pulseCLI></lib-pulseCLI>'
})
export class AppComponent {}
```

### Registering Custom Commands

```typescript
import { CommandRegistryService } from 'pulse-cli';

constructor(private commandRegistry: CommandRegistryService) {
  this.commandRegistry.addCommand({
    name: 'mycommand',
    execute: (args: string[]) => {
      // Your command logic here
      return 'Command executed!';
    },
    description: 'My custom command'
  });
}
```

## Project Structure

```
pulseCLI/
├── projects/pulse-cli/          # Library source
│   └── src/lib/
│       ├── pulse-cli.component/ # Main component
│       ├── components/          # UI components
│       └── services/            # Core services
├── src/                         # Demo application
├── docs/                        # GitHub Pages deployment
└── package.json
```

## Recent Updates

### Angular 19 Migration (December 2024)

- Migrated from Angular 10 to Angular 19
- Converted to standalone component architecture
- Updated all dependencies to latest versions
- Removed deprecated packages (TSLint, Protractor, Codelyzer)
- Fixed Sass deprecation warnings (migrated from `@import` to `@use`)

### PrimeNG Integration

- Integrated PrimeNG 19 with Aura theme preset
- Converted toolbar buttons to PrimeNG Button components
- Added vertical Toolbar component for panel controls
- Configured dark mode support
- Added PrimeIcons for enhanced UI

## Browser Support

Modern browsers supporting ES2022:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

