import { PulseBaseComponent, getBaseStyles } from './BaseComponent';

/**
 * Events emitted by pulse-command-output
 */
export interface CommandOutputEvents {
  /** Emitted when close button is clicked */
  'pulse-close': { id: string };
  /** Emitted when header is clicked */
  'pulse-focus': { id: string };
  /** Emitted when drag starts */
  'pulse-drag-start': { id: string; event: MouseEvent };
  /** Emitted when drag ends */
  'pulse-drag-end': { id: string; event: MouseEvent };
}

/**
 * Command output card component
 *
 * @element pulse-command-output
 *
 * @attr {string} command - The command that produced this output
 * @attr {boolean} closeable - Whether to show close button
 * @attr {boolean} draggable - Whether the card can be dragged
 *
 * @slot - Default slot for output content
 * @slot header-actions - Additional header action buttons
 *
 * @fires pulse-close - When close button is clicked
 * @fires pulse-focus - When header is clicked
 * @fires pulse-drag-start - When drag begins
 * @fires pulse-drag-end - When drag ends
 *
 * @example
 * <pulse-command-output command="list users" closeable>
 *   <div>User 1</div>
 *   <div>User 2</div>
 * </pulse-command-output>
 */
export class PulseCommandOutput extends PulseBaseComponent {
  static get observedAttributes(): string[] {
    return ['command', 'closeable', 'draggable'];
  }

  private static idCounter = 0;
  private readonly instanceId: string;
  private isDragging = false;

  constructor() {
    super();
    this.instanceId = `pulse-output-${PulseCommandOutput.idCounter++}`;
  }

  /**
   * Get the unique ID of this output instance
   */
  get id(): string {
    return this.instanceId;
  }

  /**
   * Set the output content as HTML
   */
  setContent(html: string): void {
    const content = this.$('.content');
    if (content) {
      content.innerHTML = html;
    }
  }

  /**
   * Set the output content as text (escaped)
   */
  setTextContent(text: string): void {
    const content = this.$('.content');
    if (content) {
      content.textContent = text;
    }
  }

  /**
   * Append content to the output
   */
  appendContent(html: string): void {
    const content = this.$('.content');
    if (content) {
      content.insertAdjacentHTML('beforeend', html);
    }
  }

  /**
   * Clear the output content
   */
  clearContent(): void {
    const content = this.$('.content');
    if (content) {
      content.innerHTML = '';
    }
  }

  protected render(): void {
    const command = this.getAttr('command', '');
    const closeable = this.getBoolAttr('closeable');
    const draggable = this.getBoolAttr('draggable');

    this.injectStyles(this.getStyles());

    const container = document.createElement('div');
    container.className = 'output-card';
    container.id = this.instanceId;

    // Header
    const header = document.createElement('div');
    header.className = 'header';
    if (draggable) {
      header.classList.add('draggable');
    }

    const commandSpan = document.createElement('span');
    commandSpan.className = 'command-text';
    commandSpan.textContent = command;

    const actions = document.createElement('div');
    actions.className = 'actions';

    // Slot for custom actions
    const actionsSlot = document.createElement('slot');
    actionsSlot.name = 'header-actions';
    actions.appendChild(actionsSlot);

    if (closeable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '×';
      closeBtn.title = 'Close';
      closeBtn.setAttribute('aria-label', 'Close');
      actions.appendChild(closeBtn);
    }

    header.appendChild(commandSpan);
    header.appendChild(actions);

    // Content
    const content = document.createElement('div');
    content.className = 'content';

    // Default slot for content
    const contentSlot = document.createElement('slot');
    content.appendChild(contentSlot);

    container.appendChild(header);
    container.appendChild(content);
    this.shadow.appendChild(container);
  }

  protected setupEventListeners(): void {
    const header = this.$('.header');
    const closeBtn = this.$('.close-btn');

    if (header) {
      header.addEventListener('click', this.handleHeaderClick.bind(this));

      if (this.getBoolAttr('draggable')) {
        header.addEventListener('mousedown', this.handleDragStart.bind(this) as EventListener);
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', this.handleClose.bind(this));
    }
  }

  private handleHeaderClick(event: Event): void {
    // Don't emit focus if clicking close button
    if ((event.target as Element).classList.contains('close-btn')) {
      return;
    }
    this.emit('pulse-focus', { id: this.instanceId });
  }

  private handleClose(event: Event): void {
    event.stopPropagation();
    this.emit('pulse-close', { id: this.instanceId });
  }

  private handleDragStart(event: MouseEvent): void {
    // Only start drag on left mouse button
    if (event.button !== 0) return;

    this.isDragging = true;
    this.emit('pulse-drag-start', { id: this.instanceId, event });

    const handleDragEnd = (e: MouseEvent) => {
      if (this.isDragging) {
        this.isDragging = false;
        this.emit('pulse-drag-end', { id: this.instanceId, event: e });
      }
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mouseup', handleDragEnd);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'command':
        const commandEl = this.$('.command-text');
        if (commandEl) commandEl.textContent = newValue;
        break;
    }
  }

  private getStyles(): string {
    return `
      ${getBaseStyles()}

      :host {
        display: block;
      }

      .output-card {
        background: var(--pulse-bg-secondary);
        border: 1px solid var(--pulse-border);
        border-radius: var(--pulse-radius);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--pulse-spacing-xs) var(--pulse-spacing-sm);
        background: var(--pulse-bg);
        border-bottom: 1px solid var(--pulse-border);
        min-height: 32px;
      }

      .header.draggable {
        cursor: grab;
      }

      .header.draggable:active {
        cursor: grabbing;
      }

      .command-text {
        color: var(--pulse-text-muted);
        font-family: var(--pulse-font-family);
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .actions {
        display: flex;
        align-items: center;
        gap: var(--pulse-spacing-xs);
      }

      .close-btn {
        background: transparent;
        border: none;
        color: var(--pulse-text-muted);
        font-size: 18px;
        line-height: 1;
        padding: 2px 6px;
        cursor: pointer;
        border-radius: var(--pulse-radius);
        transition: all var(--pulse-transition);
      }

      .close-btn:hover {
        background: var(--pulse-error);
        color: white;
      }

      .content {
        flex: 1;
        padding: var(--pulse-spacing-md);
        overflow: auto;
        font-family: var(--pulse-font-family);
        font-size: var(--pulse-font-size);
        line-height: var(--pulse-line-height);
        color: var(--pulse-text);
      }

      /* Scrollbar styling */
      .content::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .content::-webkit-scrollbar-track {
        background: var(--pulse-bg);
      }

      .content::-webkit-scrollbar-thumb {
        background: var(--pulse-border);
        border-radius: 4px;
      }

      .content::-webkit-scrollbar-thumb:hover {
        background: var(--pulse-text-muted);
      }
    `;
  }
}

// Register the custom element
if (typeof customElements !== 'undefined' && !customElements.get('pulse-command-output')) {
  customElements.define('pulse-command-output', PulseCommandOutput);
}
