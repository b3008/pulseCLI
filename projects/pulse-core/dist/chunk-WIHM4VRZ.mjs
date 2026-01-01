import {
  PulseBaseComponent,
  __publicField,
  getBaseStyles
} from "./chunk-LT3FAKWS.mjs";

// src/components/CommandOutput.ts
var _PulseCommandOutput = class _PulseCommandOutput extends PulseBaseComponent {
  constructor() {
    super();
    __publicField(this, "instanceId");
    __publicField(this, "isDragging", false);
    this.instanceId = `pulse-output-${_PulseCommandOutput.idCounter++}`;
  }
  static get observedAttributes() {
    return ["command", "closeable", "draggable"];
  }
  /**
   * Get the unique ID of this output instance
   */
  get id() {
    return this.instanceId;
  }
  /**
   * Set the output content as HTML
   */
  setContent(html) {
    const content = this.$(".content");
    if (content) {
      content.innerHTML = html;
    }
  }
  /**
   * Set the output content as text (escaped)
   */
  setTextContent(text) {
    const content = this.$(".content");
    if (content) {
      content.textContent = text;
    }
  }
  /**
   * Append content to the output
   */
  appendContent(html) {
    const content = this.$(".content");
    if (content) {
      content.insertAdjacentHTML("beforeend", html);
    }
  }
  /**
   * Clear the output content
   */
  clearContent() {
    const content = this.$(".content");
    if (content) {
      content.innerHTML = "";
    }
  }
  render() {
    const command = this.getAttr("command", "");
    const closeable = this.getBoolAttr("closeable");
    const draggable = this.getBoolAttr("draggable");
    this.injectStyles(this.getStyles());
    const container = document.createElement("div");
    container.className = "output-card";
    container.id = this.instanceId;
    const header = document.createElement("div");
    header.className = "header";
    if (draggable) {
      header.classList.add("draggable");
    }
    const commandSpan = document.createElement("span");
    commandSpan.className = "command-text";
    commandSpan.textContent = command;
    const actions = document.createElement("div");
    actions.className = "actions";
    const actionsSlot = document.createElement("slot");
    actionsSlot.name = "header-actions";
    actions.appendChild(actionsSlot);
    if (closeable) {
      const closeBtn = document.createElement("button");
      closeBtn.className = "close-btn";
      closeBtn.innerHTML = "\xD7";
      closeBtn.title = "Close";
      closeBtn.setAttribute("aria-label", "Close");
      actions.appendChild(closeBtn);
    }
    header.appendChild(commandSpan);
    header.appendChild(actions);
    const content = document.createElement("div");
    content.className = "content";
    const contentSlot = document.createElement("slot");
    content.appendChild(contentSlot);
    container.appendChild(header);
    container.appendChild(content);
    this.shadow.appendChild(container);
  }
  setupEventListeners() {
    const header = this.$(".header");
    const closeBtn = this.$(".close-btn");
    if (header) {
      header.addEventListener("click", this.handleHeaderClick.bind(this));
      if (this.getBoolAttr("draggable")) {
        header.addEventListener("mousedown", this.handleDragStart.bind(this));
      }
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", this.handleClose.bind(this));
    }
  }
  handleHeaderClick(event) {
    if (event.target.classList.contains("close-btn")) {
      return;
    }
    this.emit("pulse-focus", { id: this.instanceId });
  }
  handleClose(event) {
    event.stopPropagation();
    this.emit("pulse-close", { id: this.instanceId });
  }
  handleDragStart(event) {
    if (event.button !== 0) return;
    this.isDragging = true;
    this.emit("pulse-drag-start", { id: this.instanceId, event });
    const handleDragEnd = (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        this.emit("pulse-drag-end", { id: this.instanceId, event: e });
      }
      document.removeEventListener("mouseup", handleDragEnd);
    };
    document.addEventListener("mouseup", handleDragEnd);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (name) {
      case "command":
        const commandEl = this.$(".command-text");
        if (commandEl) commandEl.textContent = newValue;
        break;
    }
  }
  getStyles() {
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
};
__publicField(_PulseCommandOutput, "idCounter", 0);
var PulseCommandOutput = _PulseCommandOutput;
if (typeof customElements !== "undefined" && !customElements.get("pulse-command-output")) {
  customElements.define("pulse-command-output", PulseCommandOutput);
}

export {
  PulseCommandOutput
};
