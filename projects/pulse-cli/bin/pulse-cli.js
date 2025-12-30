#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const command = process.argv[2];

if (command === 'init') {
  initPulseCLI();
} else {
  console.log('Usage: pulse-cli init');
  console.log('  init - Initialize a basic PulseCLI example in your project');
  process.exit(1);
}

function initPulseCLI() {
  const targetDir = process.cwd();
  const srcDir = path.join(targetDir, 'src');
  const appDir = path.join(srcDir, 'app');

  // Check if src directory exists
  if (!fs.existsSync(srcDir)) {
    console.log('Creating src directory...');
    fs.mkdirSync(srcDir, { recursive: true });
  }

  if (!fs.existsSync(appDir)) {
    console.log('Creating src/app directory...');
    fs.mkdirSync(appDir, { recursive: true });
  }

  // Create app.component.ts
  const appComponentTs = `import { Component, ViewChild, OnInit } from '@angular/core';
import { PulseCLIComponent } from 'pulse-cli';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [PulseCLIComponent]
})
export class AppComponent implements OnInit {
  title = 'My PulseCLI App';

  @ViewChild('pulse', { read: PulseCLIComponent, static: true }) pulse: PulseCLIComponent;

  ngOnInit() {
    // Register custom commands here
    this.pulse.commandRegistry.addCommand("hello", "Say hello", "")
      .action((args, commandString, resolve, reject) => {
        resolve({ message: 'Hello from PulseCLI!' });
      });

    this.pulse.commandRegistry.addCommand("echo", "Echo your input", "<message>")
      .action((args, commandString, resolve, reject) => {
        resolve({ message: args.join(' ') });
      });
  }
}
`;

  // Create app.component.html
  const appComponentHtml = `<lib-pulseCLI #pulse disable tabindex="-1"></lib-pulseCLI>
`;

  // Create app.component.scss
  const appComponentScss = `// Add your custom styles here
`;

  // Create about component directory
  const aboutDir = path.join(appDir, 'about');
  if (!fs.existsSync(aboutDir)) {
    fs.mkdirSync(aboutDir, { recursive: true });
  }

  // Create about.component.ts
  const aboutComponentTs = `import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true
})
export class AboutComponent {
  title = 'About PulseCLI';
}
`;

  // Create about.component.html
  const aboutComponentHtml = `<div class="about-container">
  <h1>{{ title }}</h1>
  <p>This is a basic example of using PulseCLI in your Angular application.</p>
  <p>Type 'help' in the terminal to see available commands.</p>
</div>
`;

  // Create about.component.scss
  const aboutComponentScss = `.about-container {
  padding: 20px;

  h1 {
    color: #333;
    margin-bottom: 10px;
  }

  p {
    margin: 10px 0;
    line-height: 1.6;
  }
}
`;

  // Write files
  const files = [
    { path: path.join(appDir, 'app.component.ts'), content: appComponentTs },
    { path: path.join(appDir, 'app.component.html'), content: appComponentHtml },
    { path: path.join(appDir, 'app.component.scss'), content: appComponentScss },
    { path: path.join(aboutDir, 'about.component.ts'), content: aboutComponentTs },
    { path: path.join(aboutDir, 'about.component.html'), content: aboutComponentHtml },
    { path: path.join(aboutDir, 'about.component.scss'), content: aboutComponentScss }
  ];

  files.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log(`⚠️  Skipping ${path.relative(targetDir, file.path)} (already exists)`);
    } else {
      fs.writeFileSync(file.path, file.content);
      console.log(`✓ Created ${path.relative(targetDir, file.path)}`);
    }
  });

  console.log('\n✨ PulseCLI initialization complete!');
  console.log('\nNext steps:');
  console.log('1. Make sure you have pulse-cli installed: npm install pulse-cli');
  console.log('2. Import the generated components in your Angular application');
  console.log('3. Run your Angular dev server: ng serve');
  console.log('\nFor more information, visit: https://github.com/yourusername/pulseCLI');
}
