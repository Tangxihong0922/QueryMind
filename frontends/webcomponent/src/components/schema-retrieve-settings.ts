import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { vannaDesignTokens } from '../styles/vanna-design-tokens.js';

export interface SchemaRetrieveSettingsValues {
  limit: number;
  similarity_threshold: number;
}

@customElement('schema-retrieve-settings')
export class SchemaRetrieveSettings extends LitElement {
  static styles = [
    vannaDesignTokens,
    css`
      :host {
        display: inline-block;
        position: relative;
        font-family: var(--vanna-font-family-default);
      }

      /* Toggle Button */
      .settings-toggle-btn {
        padding: 6px 12px;
        border-radius: var(--vanna-border-radius-md);
        background: var(--vanna-background-higher);
        border: 1px solid var(--vanna-outline-default);
        cursor: pointer;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--vanna-foreground-default);
        transition: all var(--vanna-duration-150) ease;
      }

      .settings-toggle-btn:hover {
        background: var(--vanna-background-highest);
        border-color: var(--vanna-accent-primary-default);
      }

      .settings-toggle-btn.active {
        background: var(--vanna-accent-primary-subtle);
        border-color: var(--vanna-accent-primary-default);
      }

      .settings-toggle-btn .indicator {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--vanna-accent-primary-default);
      }

      /* Settings Card */
      .settings-card {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: 300px;
        background: var(--vanna-background-root);
        border: 1px solid var(--vanna-outline-default);
        border-radius: var(--vanna-border-radius-lg);
        box-shadow: var(--vanna-shadow-xl);
        z-index: 100;
        animation: slideDown 200ms ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--vanna-space-3) var(--vanna-space-4);
        border-bottom: 1px solid var(--vanna-outline-dimmer);
      }

      .card-title {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--vanna-foreground-default);
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--vanna-foreground-dimmer);
        padding: 0;
        line-height: 1;
      }

      .close-btn:hover {
        color: var(--vanna-foreground-default);
      }

      .card-body {
        padding: var(--vanna-space-4);
      }

      /* Form Groups */
      .form-group {
        margin-bottom: var(--vanna-space-4);
      }

      .form-group:last-child {
        margin-bottom: 0;
      }

      .form-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--vanna-foreground-dimmer);
        margin-bottom: var(--vanna-space-2);
      }

      .form-label .value-display {
        font-weight: 600;
        color: var(--vanna-accent-primary-default);
      }

      .form-hint {
        font-size: 0.7rem;
        color: var(--vanna-foreground-dimmer);
        margin-top: 4px;
      }

      /* Number Input */
      .number-input {
        width: 100%;
        padding: var(--vanna-space-2) var(--vanna-space-3);
        background: var(--vanna-background-default);
        border: 1px solid var(--vanna-outline-default);
        border-radius: var(--vanna-border-radius-md);
        color: var(--vanna-foreground-default);
        font-size: 0.9rem;
        font-family: inherit;
        text-align: center;
      }

      .number-input:focus {
        outline: none;
        border-color: var(--vanna-accent-primary-default);
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
      }

      /* Range/Slider */
      .slider-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 6px;
        background: var(--vanna-background-higher);
        border-radius: 3px;
        outline: none;
      }

      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background: var(--vanna-accent-primary-default);
        border-radius: 50%;
        cursor: pointer;
        transition: transform var(--vanna-duration-150) ease;
      }

      .slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
      }

      .slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: var(--vanna-accent-primary-default);
        border-radius: 50%;
        cursor: pointer;
        border: none;
      }

      .range-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        color: var(--vanna-foreground-dimmer);
      }

      /* Card Footer */
      .card-footer {
        display: flex;
        gap: var(--vanna-space-2);
        padding: var(--vanna-space-3) var(--vanna-space-4);
        border-top: 1px solid var(--vanna-outline-dimmer);
        background: var(--vanna-background-default);
        border-radius: 0 0 var(--vanna-border-radius-lg) var(--vanna-border-radius-lg);
      }

      .btn {
        flex: 1;
        padding: var(--vanna-space-2) var(--vanna-space-3);
        border-radius: var(--vanna-border-radius-md);
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all var(--vanna-duration-150) ease;
        border: 1px solid;
      }

      .btn-secondary {
        background: var(--vanna-background-root);
        border-color: var(--vanna-outline-default);
        color: var(--vanna-foreground-default);
      }

      .btn-secondary:hover {
        background: var(--vanna-background-higher);
      }

      .btn-primary {
        background: var(--vanna-accent-primary-default);
        border-color: var(--vanna-accent-primary-default);
        color: white;
      }

      .btn-primary:hover {
        background: var(--vanna-accent-primary-stronger);
      }
    `
  ];

  @state() private expanded = false;
  @state() private settings: SchemaRetrieveSettingsValues = {
    limit: 10,
    similarity_threshold: 0.7
  };

  // Default values for reset
  private readonly defaultSettings: SchemaRetrieveSettingsValues = {
    limit: 10,
    similarity_threshold: 0.7
  };

  private _toggleExpanded() {
    this.expanded = !this.expanded;
  }

  private _updateLimit(value: string) {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 50) {
      this.settings = { ...this.settings, limit: num };
    }
  }

  private _updateSimilarity(value: number) {
    this.settings = { ...this.settings, similarity_threshold: value };
  }

  private _resetDefaults() {
    this.settings = { ...this.defaultSettings };
  }

  private _applySettings() {
    this.expanded = false;
    this.dispatchEvent(new CustomEvent('settings-changed', {
      detail: { settings: this.getSettings() },
      bubbles: true,
      composed: true
    }));
  }

  getSettings(): SchemaRetrieveSettingsValues {
    return { ...this.settings };
  }

  render() {
    const hasChanges = 
      this.settings.limit !== this.defaultSettings.limit ||
      this.settings.similarity_threshold !== this.defaultSettings.similarity_threshold;

    return html`
      <button 
        class="settings-toggle-btn ${this.expanded ? 'active' : ''}"
        @click=${this._toggleExpanded}
        title="Schema Retrieve Settings"
      >
        <span>⚙️</span>
        <span>Settings</span>
        ${hasChanges && !this.expanded ? html`<span class="indicator"></span>` : ''}
      </button>

      ${this.expanded ? html`
        <div class="settings-card">
          <div class="card-header">
            <h3 class="card-title">Schema Retrieve Settings</h3>
            <button class="close-btn" @click=${this._toggleExpanded}>×</button>
          </div>
          
          <div class="card-body">
            <!-- Limit -->
            <div class="form-group">
              <label class="form-label">
                <span>Limit</span>
                <span class="value-display">${this.settings.limit}</span>
              </label>
              <input 
                type="number" 
                class="number-input"
                min="1" 
                max="50"
                .value=${String(this.settings.limit)}
                @change=${(e: Event) => this._updateLimit((e.target as HTMLInputElement).value)}
              >
              <div class="form-hint">Number of tables to return (1-50)</div>
            </div>

            <!-- Similarity Threshold -->
            <div class="form-group">
              <label class="form-label">
                <span>Similarity Threshold</span>
                <span class="value-display">${this.settings.similarity_threshold.toFixed(2)}</span>
              </label>
              <div class="slider-container">
                <input 
                  type="range" 
                  class="slider"
                  min="0" 
                  max="1" 
                  step="0.01"
                  .value=${String(this.settings.similarity_threshold)}
                  @input=${(e: Event) => this._updateSimilarity(parseFloat((e.target as HTMLInputElement).value))}
                >
                <div class="range-labels">
                  <span>0.0 (More results)</span>
                  <span>1.0 (Exact match)</span>
                </div>
              </div>
            </div>

          </div>

          <div class="card-footer">
            <button class="btn btn-secondary" @click=${this._resetDefaults}>
              Reset
            </button>
            <button class="btn btn-primary" @click=${this._applySettings}>
              Apply
            </button>
          </div>
        </div>
      ` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schema-retrieve-settings': SchemaRetrieveSettings;
  }
}
