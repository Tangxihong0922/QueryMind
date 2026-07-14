import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { vannaDesignTokens } from '../styles/vanna-design-tokens.js';
import { QueryMindApiClient, ChatStreamChunk } from '../services/api-client.js';
import { ComponentManager, RichComponent } from './rich-component-system.js';
import './querymind-status-bar.js';
import './querymind-progress-tracker.js';
import './rich-card.js';
import './rich-task-list.js';
import './rich-progress-bar.js';
import './plotly-chart.js';
import './schema-management-page.js';
import './schema-retrieve-settings.js';
import type { SchemaRetrieveSettingsValues } from './schema-retrieve-settings.js';

@customElement('querymind-chat')
export class QueryMindChat extends LitElement {
  static styles = [
    vannaDesignTokens,
    css`
      *, *::before, *::after {
        box-sizing: border-box;
      }

      :host {
        display: block;
        font-family: var(--vanna-font-family-default);
        --chat-primary: var(--vanna-accent-primary-default);
        --chat-primary-stronger: var(--vanna-accent-primary-stronger);
        --chat-primary-foreground: rgb(255, 255, 255);
        --chat-accent-soft: var(--vanna-accent-primary-subtle);
        --chat-outline: var(--vanna-outline-default);
        --chat-surface: var(--vanna-background-root);
        --chat-muted: var(--vanna-background-default);
        --chat-muted-stronger: var(--vanna-background-higher);
        max-width: 1024px;
        margin: 0 auto;
        background: var(--vanna-background-root);
        border: 1px solid var(--vanna-outline-dimmer);
        border-radius: var(--vanna-border-radius-2xl);
        box-shadow: var(--vanna-shadow-xl);
        overflow: hidden;
        transition: box-shadow var(--vanna-duration-300) ease, transform var(--vanna-duration-300) ease;
        position: relative;
      }

      :host([workspace-mode]) {
        max-width: none;
        margin: 0;
        border: none;
        border-radius: 0;
        box-shadow: none;
        background: transparent;
      }

      :host(:hover) {
        box-shadow: var(--vanna-shadow-2xl);
        transform: translateY(-2px);
      }

      :host([workspace-mode]):hover {
        box-shadow: none;
        transform: none;
      }

      :host([theme="dark"]) {
        --chat-primary: var(--vanna-accent-primary-default);
        --chat-primary-stronger: var(--vanna-accent-primary-stronger);
        --chat-primary-foreground: rgb(255, 255, 255);
        --chat-accent-soft: var(--vanna-accent-primary-subtle);
        --chat-outline: var(--vanna-outline-default);
        --chat-surface: var(--vanna-background-higher);
        --chat-muted: var(--vanna-background-default);
        --chat-muted-stronger: var(--vanna-background-highest);
        background: var(--vanna-background-higher);
        border-color: var(--vanna-outline-default);
      }

      :host(.maximized) {
        position: fixed;
        top: var(--vanna-space-6);
        left: var(--vanna-space-6);
        right: var(--vanna-space-6);
        bottom: var(--vanna-space-6);
        max-width: none;
        width: auto;
        margin: 0;
        z-index: var(--vanna-z-modal);
        border-radius: var(--vanna-border-radius-xl);
        transform: none;
        box-shadow: var(--vanna-shadow-2xl);
      }

      :host(.maximized):hover {
        transform: none;
      }

      :host(.minimized) {
        position: fixed !important;
        bottom: var(--vanna-space-6) !important;
        right: var(--vanna-space-6) !important;
        width: 64px !important;
        height: 64px !important;
        max-width: none !important;
        margin: 0 !important;
        z-index: var(--vanna-z-modal) !important;
        border-radius: var(--vanna-border-radius-full) !important;
        cursor: pointer !important;
        background: linear-gradient(135deg, var(--chat-primary-stronger), var(--chat-primary)) !important;
        border: 2px solid rgba(255, 255, 255, 0.9) !important;
        box-shadow: var(--vanna-shadow-xl) !important;
        overflow: hidden !important;
      }

      :host(.minimized):hover {
        transform: scale(1.05);
        box-shadow: var(--vanna-shadow-2xl) !important;
      }

      :host(.minimized) .chat-layout {
        display: none;
      }

      .minimized-icon {
        display: none;
      }

      :host(.minimized) .minimized-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--chat-primary-foreground);
        font-size: 24px;
        transition: transform var(--vanna-duration-200) ease;
      }

      :host(.minimized) .minimized-icon:hover {
        transform: scale(1.1);
      }

      :host(.minimized) .minimized-icon svg {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }

      .chat-layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 300px;
        height: 600px;
        max-height: 80vh;
        background: var(--chat-muted);
      }

      :host([workspace-mode]) .chat-layout {
        grid-template-columns: minmax(0, 1fr) 300px;
        height: 100%;
        max-height: none;
        min-height: 0;
        border-radius: 24px;
      }

      :host(.maximized) .chat-layout {
        height: calc(100vh - 48px);
        max-height: calc(100vh - 48px);
      }

      .chat-layout.compact {
        grid-template-columns: 1fr;
      }

      .chat-main {
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--chat-outline);
        background: var(--chat-surface);
        min-height: 0;
      }

      .chat-layout.compact .chat-main {
        border-right: none;
      }

      .chat-header {
        padding: var(--vanna-space-6) var(--vanna-space-7);
        background: linear-gradient(135deg, var(--chat-primary) 0%, var(--chat-primary-stronger) 100%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        flex-direction: column;
        gap: var(--vanna-space-4);
        color: var(--chat-primary-foreground);
        position: relative;
        overflow: hidden;
      }

      .chat-header::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
        opacity: 0.6;
        pointer-events: none;
      }

      :host([theme="dark"]) .chat-header {
        border-bottom-color: rgba(255, 255, 255, 0.1);
      }

      .header-top {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: var(--vanna-space-4);
        width: 100%;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: var(--vanna-space-4);
        min-width: 0;
        flex: 1;
      }

      .header-top-actions {
        display: inline-flex;
        align-items: center;
        gap: var(--vanna-space-2);
        margin-left: auto;
      }

      .chat-avatar {
        width: 44px;
        height: 44px;
        border-radius: var(--vanna-border-radius-lg);
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        display: grid;
        place-items: center;
        font-weight: 600;
        font-size: 16px;
        letter-spacing: 0.02em;
        color: var(--chat-primary-foreground);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .header-text {
        display: flex;
        flex-direction: column;
        gap: var(--vanna-space-1);
        min-width: 0;
      }

      .chat-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.01em;
        color: var(--chat-primary-foreground);
      }

      .chat-subtitle {
        font-size: 13px;
        letter-spacing: 0.01em;
        opacity: 0.9;
        font-weight: 400;
      }

      :host([theme="dark"]) .chat-subtitle {
        opacity: 0.78;
      }

      .window-controls {
        display: inline-flex;
        gap: var(--vanna-space-2);
      }

      .header-tool-memory-toggle {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.16);
        background: rgba(255, 255, 255, 0.1);
        color: var(--chat-primary-foreground);
        backdrop-filter: blur(8px);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
      }

      .header-tool-memory-toggle-label {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .header-tool-memory-toggle-label strong {
        font-size: 12px;
        font-weight: 700;
        line-height: 1.2;
      }

      .header-tool-memory-toggle-label span {
        font-size: 11px;
        opacity: 0.86;
      }

      .header-tool-memory-switch {
        position: relative;
        width: 42px;
        height: 24px;
        flex: 0 0 auto;
        border-radius: 999px;
        border: none;
        background: rgba(255, 255, 255, 0.2);
        cursor: pointer;
        transition: background var(--vanna-duration-200) ease, box-shadow var(--vanna-duration-200) ease;
      }

      .header-tool-memory-switch::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
        transition: transform var(--vanna-duration-200) ease;
      }

      .header-tool-memory-switch[aria-checked="true"] {
        background: rgba(34, 197, 94, 0.65);
      }

      .header-tool-memory-switch[aria-checked="true"]::after {
        transform: translateX(18px);
      }

      .header-tool-memory-switch:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.85);
        outline-offset: 2px;
      }

      :host([theme="dark"]) .header-tool-memory-toggle {
        border-color: rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.06);
      }

      :host([workspace-mode]) .window-controls {
        display: none;
      }

      .window-control-btn {
        width: 32px;
        height: 32px;
        border-radius: var(--vanna-border-radius-lg);
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.1);
        color: var(--chat-primary-foreground);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all var(--vanna-duration-200) ease;
        backdrop-filter: blur(8px);
        position: relative;
        overflow: hidden;
      }

      .window-control-btn::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
        opacity: 0;
        transition: opacity var(--vanna-duration-200) ease;
      }

      .window-control-btn:hover {
        transform: translateY(-1px) scale(1.05);
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 
          0 8px 25px -8px rgba(0, 0, 0, 0.3),
          0 0 0 1px rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
      }

      .window-control-btn:hover::before {
        opacity: 1;
      }

      .window-control-btn:active {
        transform: translateY(0) scale(0.95);
      }

      .window-control-btn.minimize:hover {
        background: rgba(255, 193, 7, 0.2);
        color: #ffc107;
        box-shadow: 
          0 8px 25px -8px rgba(255, 193, 7, 0.4),
          0 0 0 1px rgba(255, 193, 7, 0.3);
      }

      .window-control-btn.maximize:hover,
      .window-control-btn.restore:hover {
        background: rgba(40, 167, 69, 0.2);
        color: #28a745;
        box-shadow: 
          0 8px 25px -8px rgba(40, 167, 69, 0.4),
          0 0 0 1px rgba(40, 167, 69, 0.3);
      }

      .window-control-btn svg {
        width: 16px;
        height: 16px;
        transition: transform var(--vanna-duration-150) ease;
      }

      .window-control-btn:hover svg {
        transform: scale(1.1);
      }

      :host([theme="dark"]) .window-control-btn {
        border-color: rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
      }

      :host([theme="dark"]) .window-control-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.25);
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: var(--vanna-space-6) var(--vanna-space-6) var(--vanna-space-5);
        background: linear-gradient(180deg, var(--chat-muted) 0%, var(--chat-surface) 70%);
        scroll-behavior: smooth;
        display: flex;
        flex-direction: column;
        gap: var(--vanna-space-4);
        min-height: 0;
        max-height: 100%;
        position: relative;
      }

      .chat-messages::-webkit-scrollbar {
        width: 6px;
      }

      .chat-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .chat-messages::-webkit-scrollbar-thumb {
        background: var(--vanna-outline-default);
        border-radius: var(--vanna-border-radius-full);
        border: 1px solid var(--vanna-background-root);
      }

      .chat-messages::-webkit-scrollbar-thumb:hover {
        background: var(--vanna-outline-hover);
      }

      :host([theme="dark"]) .chat-messages {
        background: radial-gradient(circle at top, rgba(99, 102, 241, 0.12), transparent 55%), var(--chat-surface);
      }

      :host([theme="dark"]) .chat-messages::-webkit-scrollbar-thumb {
        background: var(--vanna-outline-default);
        border-color: var(--vanna-background-higher);
      }

      /* Scroll indicator when there's content above */
      .chat-messages::before {
        content: '';
        position: sticky;
        top: 0;
        display: block;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--vanna-accent-primary-default), transparent);
        opacity: 0;
        transition: opacity var(--vanna-duration-300) ease;
        z-index: 10;
        margin: 0 var(--vanna-space-4) var(--vanna-space-2);
      }

      .chat-messages.has-scroll::before {
        opacity: 0.5;
      }

      .rich-components-container {
        display: flex;
        flex-direction: column;
        gap: var(--vanna-space-4);
      }

      .rich-component-wrapper {
        margin: var(--vanna-space-2) 0;
        animation: fade-in-up 0.3s ease-out;
      }

      .unknown-component {
        background: var(--vanna-background-higher);
        border: 1px solid var(--vanna-outline-default);
        border-radius: var(--vanna-border-radius-md);
        padding: var(--vanna-space-4);
        font-family: var(--vanna-font-family-mono);
        font-size: 12px;
      }

      .unknown-component p {
        margin: 0 0 var(--vanna-space-2) 0;
        color: var(--vanna-foreground-dimmer);
      }

      .unknown-component pre {
        margin: 0;
        color: var(--vanna-foreground-dimmest);
        overflow-x: auto;
      }

      .chat-input-area {
        padding: var(--vanna-space-5) var(--vanna-space-6) var(--vanna-space-6);
        background: var(--chat-surface);
        border-top: 1px solid var(--chat-outline);
        display: flex;
        flex-direction: column;
        gap: var(--vanna-space-4);
        flex-shrink: 0; /* Prevent input area from shrinking */
      }

      :host([workspace-mode]) .chat-input-area {
        border-radius: 0 0 24px 24px;
      }

      :host([theme="dark"]) .chat-input-area {
        border-top-color: rgba(148, 163, 184, 0.22);
      }

      .chat-input-container {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--vanna-space-2);
        padding: 6px 8px 6px 18px;
        border-radius: 999px;
        background: var(--chat-muted);
        border: 1px solid var(--chat-muted-stronger);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
        transition: border-color var(--vanna-duration-200) ease, box-shadow var(--vanna-duration-200) ease, background var(--vanna-duration-200) ease;
      }

      .chat-input-container:focus-within {
        border-color: var(--chat-primary);
        box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.85);
        background: rgba(255, 255, 255, 0.95);
      }

      :host([theme="dark"]) .chat-input-container {
        background: rgba(15, 23, 42, 0.65);
        border-color: rgba(100, 116, 139, 0.45);
        box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.18);
      }

      :host([theme="dark"]) .chat-input-container:focus-within {
        border-color: rgba(129, 140, 248, 0.55);
        box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.45), inset 0 1px 0 rgba(148, 163, 184, 0.25);
        background: rgba(30, 41, 59, 0.88);
      }

      .message-input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 15px;
        font-family: var(--vanna-font-family-default);
        line-height: 1.5;
        color: var(--vanna-foreground-default);
        resize: none;
        min-height: 48px;
        max-height: 140px;
        padding: 12px 0;
        outline: none;
      }

      :host([theme="dark"]) .message-input {
        color: rgba(226, 232, 240, 0.95);
      }

      .message-input::placeholder {
        color: rgba(71, 85, 105, 0.8);
      }

      :host([theme="dark"]) .message-input::placeholder {
        color: rgba(148, 163, 184, 0.65);
      }

      .message-input:focus {
        outline: none;
      }

      .message-input:disabled {
        color: rgba(148, 163, 184, 0.65);
        cursor: not-allowed;
      }

      .command-suggestions {
        position: absolute;
        left: 18px;
        right: 68px;
        bottom: calc(100% + 10px);
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid rgba(2, 61, 96, 0.12);
        box-shadow: 0 18px 40px rgba(2, 61, 96, 0.18);
        z-index: 20;
        animation: command-pop 140ms ease-out;
      }

      :host([theme="dark"]) .command-suggestions {
        background: rgba(15, 23, 42, 0.98);
        border-color: rgba(148, 163, 184, 0.22);
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.45);
      }

      @keyframes command-pop {
        from {
          opacity: 0;
          transform: translateY(4px) scale(0.98);
        }

        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .command-suggestions-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 0 4px 4px;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: rgba(2, 61, 96, 0.65);
      }

      :host([theme="dark"]) .command-suggestions-header {
        color: rgba(226, 232, 240, 0.62);
      }

      .command-suggestion {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        border: 1px solid transparent;
        border-radius: 14px;
        padding: 10px 12px;
        background: transparent;
        color: inherit;
        text-align: left;
        cursor: pointer;
        transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
      }

      .command-suggestion:hover,
      .command-suggestion.active {
        background: rgba(21, 168, 168, 0.12);
        border-color: rgba(21, 168, 168, 0.2);
        transform: translateY(-1px);
      }

      .command-suggestion-code {
        font-family: var(--vanna-font-family-mono);
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--chat-primary-stronger);
      }

      :host([theme="dark"]) .command-suggestion-code {
        color: #7dd3fc;
      }

      .command-suggestion-description {
        font-size: 0.8rem;
        line-height: 1.45;
        color: rgba(2, 61, 96, 0.75);
      }

      :host([theme="dark"]) .command-suggestion-description {
        color: rgba(226, 232, 240, 0.75);
      }

      :host([theme="dark"]) .message-input:disabled {
        color: rgba(100, 116, 139, 0.55);
      }

      .send-button {
        width: 48px;
        height: 48px;
        border-radius: 999px;
        border: none;
        background: linear-gradient(135deg, var(--chat-primary-stronger), var(--chat-primary));
        color: var(--chat-primary-foreground);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform var(--vanna-duration-200) ease, box-shadow var(--vanna-duration-200) ease, filter var(--vanna-duration-200) ease;
        box-shadow: 0 18px 38px -24px rgba(79, 70, 229, 0.8);
      }

      .send-button:hover {
        transform: translateY(-1px) scale(1.02);
        box-shadow: 0 25px 45px -24px rgba(79, 70, 229, 0.85);
      }

      .send-button:active {
        transform: translateY(0) scale(0.98);
      }

      .send-button:disabled {
        background: rgba(148, 163, 184, 0.35);
        color: rgba(71, 85, 105, 0.7);
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .send-button svg {
        width: 18px;
        height: 18px;
      }

      .sidebar {
        background: linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.02) 100%);
        padding: var(--vanna-space-6);
        display: flex;
        flex-direction: column;
        gap: var(--vanna-space-4);
        overflow-y: auto;
        overflow-x: hidden;
        min-height: 0;
      }

      .sidebar::-webkit-scrollbar {
        width: 6px;
      }

      .sidebar::-webkit-scrollbar-track {
        background: transparent;
      }

      .sidebar::-webkit-scrollbar-thumb {
        background: var(--vanna-outline-default);
        border-radius: var(--vanna-border-radius-full);
      }

      :host([theme="dark"]) .sidebar {
        background: linear-gradient(180deg, rgba(79, 70, 229, 0.22) 0%, rgba(15, 23, 42, 0.45) 100%);
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: var(--vanna-foreground-dimmer);
        padding: var(--vanna-space-12) var(--vanna-space-8);
        margin: var(--vanna-space-8) var(--vanna-space-6);
        font-size: 15px;
        font-weight: 500;
        line-height: 1.6;
        background: linear-gradient(135deg, 
          rgba(255, 255, 255, 0.95) 0%, 
          rgba(248, 250, 252, 0.9) 50%,
          rgba(241, 245, 249, 0.85) 100%);
        border-radius: var(--vanna-border-radius-2xl);
        border: 2px dashed var(--vanna-accent-primary-default);
        box-shadow: 
          var(--vanna-shadow-sm),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(8px);
        transition: all var(--vanna-duration-300) ease;
      }

      .empty-state:hover {
        border-color: var(--vanna-accent-primary-stronger);
        transform: translateY(-2px);
        box-shadow: 
          var(--vanna-shadow-lg),
          inset 0 1px 0 rgba(255, 255, 255, 0.9);
      }

      :host([theme="dark"]) .empty-state {
        color: var(--vanna-foreground-dimmer);
        background: linear-gradient(135deg, 
          rgba(24, 29, 39, 0.95) 0%, 
          rgba(31, 39, 51, 0.9) 50%,
          rgba(17, 21, 28, 0.85) 100%);
        border-color: var(--vanna-accent-primary-default);
        box-shadow: 
          var(--vanna-shadow-md),
          inset 0 1px 0 rgba(129, 140, 248, 0.2);
      }

      :host([theme="dark"]) .empty-state:hover {
        border-color: var(--vanna-accent-primary-hover);
        box-shadow: 
          var(--vanna-shadow-xl),
          inset 0 1px 0 rgba(129, 140, 248, 0.3);
      }

      .empty-state-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto var(--vanna-space-6);
        opacity: 0.7;
        color: var(--vanna-accent-primary-default);
        filter: drop-shadow(0 2px 4px rgba(79, 70, 229, 0.2));
      }

      .empty-state-text {
        font-size: 16px;
        font-weight: 600;
        color: var(--vanna-foreground-default);
        margin-bottom: var(--vanna-space-2);
      }

      .empty-state-subtitle {
        font-size: 14px;
        color: var(--vanna-foreground-dimmest);
        opacity: 0.8;
        font-weight: 400;
      }

      /* Sidebar buttons */
      .sidebar-btn {
        display: flex;
        align-items: center;
        gap: var(--vanna-space-2);
        padding: var(--vanna-space-3) var(--vanna-space-4);
        background: var(--vanna-background-root);
        border: 1px solid var(--vanna-outline-default);
        border-radius: var(--vanna-border-radius-md);
        color: var(--vanna-foreground-default);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all var(--vanna-duration-200) ease;
        width: 100%;
      }

      .sidebar-btn:hover {
        background: var(--vanna-background-higher);
        border-color: var(--vanna-accent-primary-default);
        color: var(--vanna-accent-primary-default);
      }

      :host([theme="dark"]) .sidebar-btn {
        background: var(--vanna-background-default);
        border-color: var(--vanna-outline-dimmer);
        color: var(--vanna-foreground-default);
      }

      :host([theme="dark"]) .sidebar-btn:hover {
        background: var(--vanna-background-higher);
        border-color: var(--vanna-accent-primary-default);
        color: var(--vanna-accent-primary-default);
      }

      /* Schema Management Modal */
      .schema-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: var(--vanna-space-6);
      }

      .schema-modal-content {
        background: var(--vanna-background-root);
        border-radius: var(--vanna-border-radius-xl);
        box-shadow: var(--vanna-shadow-2xl);
        width: 100%;
        max-width: 1200px;
        height: 80vh;
        max-height: 800px;
        overflow: hidden;
      }

      @media (max-width: 880px) {
        .chat-layout,
        :host([workspace-mode]) .chat-layout {
          grid-template-columns: 1fr;
          height: min(600px, 85vh);
          max-height: 85vh;
        }

        .sidebar {
          display: none;
        }

        .chat-main {
          border-right: none;
        }
      }

      @media (max-width: 600px) {
        :host {
          border-radius: var(--vanna-border-radius-xl);
        }

        .chat-layout {
          height: min(500px, 80vh);
          max-height: 80vh;
        }

        .chat-header {
          border-bottom-width: 0;
          padding: var(--vanna-space-5) var(--vanna-space-5) var(--vanna-space-4);
        }

        .chat-messages {
          padding: var(--vanna-space-4) var(--vanna-space-4);
        }

        .empty-state {
          padding: var(--vanna-space-10) var(--vanna-space-6);
          margin: var(--vanna-space-6) var(--vanna-space-4);
          font-size: 14px;
        }

        .empty-state-text {
          font-size: 15px;
        }

        .empty-state-icon {
          width: 56px;
          height: 56px;
          margin-bottom: var(--vanna-space-5);
        }

        .chat-input-area {
          padding: var(--vanna-space-4) var(--vanna-space-4) var(--vanna-space-5);
        }
      }
    `
  ];

  @property() title = 'QueryMind Chat';
  @property() placeholder = 'Ask me anything...';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) showProgress = true;
  @property({ type: Boolean }) allowMinimize = true;
  @property({ reflect: true }) theme = 'light';
  @property({ attribute: 'api-base' }) apiBaseUrl = '';
  @property({ attribute: 'sse-endpoint' }) sseEndpoint = '/api/querymind/v1/chat_sse';
  @property({ attribute: 'ws-endpoint' }) wsEndpoint = '/api/querymind/v1/chat_websocket';
  @property({ attribute: 'poll-endpoint' }) pollEndpoint = '/api/querymind/v1/chat_poll';
  @property() subtitle = '';
  @property() startingState: 'normal' | 'maximized' | 'minimized' = 'normal';
  @property({ type: Array }) userGroups: string[] = [];
  @property({ attribute: 'conversation-id' }) conversationIdAttr = '';
  @property({ type: Boolean, attribute: 'suppress-starter-ui' }) suppressStarterUi = false;
  @property({ type: Boolean, attribute: 'tool-memory-session-isolated' }) toolMemorySessionIsolatedAttr = false;

  @state() private currentMessage = '';
  @state() private status: 'idle' | 'working' | 'error' | 'success' = 'idle';
  @state() private statusMessage = '';
  @state() private statusDetail = '';
  @state() private showSchemaManagement = false;
  @state() private showCommandSuggestions = false;
  @state() private selectedCommandIndex = 0;
  private _windowState: 'normal' | 'maximized' | 'minimized' = 'normal';

  private readonly commandSuggestions = [
    {
      command: '/help',
      description: 'Show available commands and quick help.',
      insertText: '/help'
    },
    {
      command: '/status',
      description: 'Check system and setup status.',
      insertText: '/status'
    },
    {
      command: '/memories',
      description: 'View recent memories and admin context.',
      insertText: '/memories'
    },
    {
      command: '/recent_memories',
      description: 'Alias for /memories.',
      insertText: '/recent_memories'
    },
    {
      command: '/delete [id]',
      description: 'Delete a memory by its ID.',
      insertText: '/delete '
    },
    {
      command: '/init_schema [force]',
      description: 'Initialize schema memory, optionally with force.',
      insertText: '/init_schema '
    },
    {
      command: '/schema_list',
      description: 'List schema tables with completeness status.',
      insertText: '/schema_list'
    },
    {
      command: '/schema_detail <table>',
      description: 'Open the detail view for a specific table.',
      insertText: '/schema_detail '
    },
    {
      command: '/schema_enrich [table]',
      description: 'Run AI enrichment for one table or all incomplete ones.',
      insertText: '/schema_enrich '
    }
  ];

  private getRequestMetadata(): Record<string, any> {
    return {
      tool_memory_session_isolated: this.toolMemorySessionIsolatedAttr,
    };
  }

  @property({ reflect: false })
  get windowState() {
    return this._windowState;
  }

  set windowState(value: 'normal' | 'maximized' | 'minimized') {
    console.log('windowState setter called with:', value);
    console.trace('Call stack:');
    const oldValue = this._windowState;
    this._windowState = value;
    this.requestUpdate('windowState', oldValue);
  }

  private apiClient!: QueryMindApiClient;
  private conversationId: string;
  private activeConversationId: string;
  private componentManager: ComponentManager | null = null;
  private componentObserver: MutationObserver | null = null;

  constructor() {
    super();
    // Note: Don't create apiClient here - attributes haven't been set yet!
    // It will be created lazily in getApiClient() or firstUpdated()
    this.conversationId = this.generateId();
    this.activeConversationId = this.conversationId;
  }

  /**
   * Ensure API client is created/updated with current endpoint values
   */
  private ensureApiClient() {
    // Always recreate to ensure we have the latest endpoint values
    console.log('[VannaChat] Creating API client with:', {
      baseUrl: this.apiBaseUrl,
      sseEndpoint: this.sseEndpoint,
      wsEndpoint: this.wsEndpoint,
      pollEndpoint: this.pollEndpoint
    });

    this.apiClient = new QueryMindApiClient({
      baseUrl: this.apiBaseUrl,
      sseEndpoint: this.sseEndpoint,
      wsEndpoint: this.wsEndpoint,
      pollEndpoint: this.pollEndpoint
    });
  }

  firstUpdated() {
    // Create API client now that attributes have been set
    this.ensureApiClient();

    if (this.conversationIdAttr) {
      this.activeConversationId = this.conversationIdAttr;
    }

    // Initialize component manager with rich components container (fallback)
    const richContainer = this.shadowRoot?.querySelector('.rich-components-container') as HTMLElement;
    if (richContainer) {
      this.componentManager = new ComponentManager(richContainer);
      
      // Watch for changes in the rich components container to manage empty state
      this.componentObserver = new MutationObserver(() => {
        // Update empty state visibility
        this.updateEmptyState();
      });
      
      this.componentObserver.observe(richContainer, {
        childList: true,
        subtree: true,
        attributes: false
      });
    }

    // Set initial window state from startingState property
    if (this.startingState !== 'normal') {
      this._windowState = this.startingState;
    }

    // Set initial CSS class
    this.classList.add(this._windowState);

    // Request starter UI from backend
    if (!this.suppressStarterUi) {
      this.requestStarterUI();
    }
  }

  /**
   * Request starter UI (buttons, welcome messages) from backend
   */
  private async requestStarterUI(): Promise<void> {
    try {
      const request = {
        message: "",
        conversation_id: this.activeConversationId,
        request_id: this.generateId(),
        metadata: {
          starter_ui_request: true,
          ...this.getRequestMetadata(),
        }
      };

      // Stream the starter UI response
      await this.handleStreamingResponse(request);
    } catch (error) {
      console.error('Error requesting starter UI:', error);
      // Fail silently - starter UI is optional
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Clean up mutation observer
    if (this.componentObserver) {
      this.componentObserver.disconnect();
      this.componentObserver = null;
    }
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    // Update host classes based on window state
    if (changedProperties.has('windowState')) {
      console.log('windowState changed to:', this._windowState);
      this.classList.remove('normal', 'maximized', 'minimized');
      this.classList.add(this._windowState);
      console.log('Applied CSS classes:', this.className);
    }
  }

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.currentMessage = input.value;
    this.updateCommandSuggestions(input.value);
  }

  private handleKeyPress(e: KeyboardEvent) {
    if (this.showCommandSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.moveCommandSelection(1);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.moveCommandSelection(-1);
        return;
      }

      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        this.acceptSelectedCommand();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        this.hideCommandSuggestions();
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Send a message programmatically (can be called from buttons or external code)
   * Returns a Promise that resolves with success status
   */
  sendMessage(messageText?: string): Promise<boolean> {
    console.log('sendMessage called with:', messageText);

    // Use provided message or fall back to current input
    // Check if messageText is actually a string (not an event object)
    const textToSend = (typeof messageText === 'string') ? messageText : this.currentMessage;

    console.log('Will send:', textToSend);

    if (!textToSend.trim() || this.disabled) {
      console.log('Message empty or disabled, not sending');
      return Promise.resolve(false);
    }

    return this._sendMessageInternal(textToSend);
  }

  private async _sendMessageInternal(messageText: string): Promise<boolean> {
    console.log('_sendMessageInternal called with:', messageText);

    // Auto-maximize window when user sends a message (if not already maximized or minimized)
    if (!this.hasAttribute('workspace-mode') && this.windowState !== 'maximized' && this.windowState !== 'minimized') {
      this.maximizeWindow();
    }

    // Create user message as a rich component and send to ComponentManager
    const userRichComponent: RichComponent = {
      id: `user-message-${Date.now()}`,
      type: 'user-message',
      lifecycle: 'create',
      data: {
        content: messageText,
        sender: 'user'
      },
      children: [],
      timestamp: new Date().toISOString(),
      visible: true,
      interactive: false
    };

    // Add user message to ComponentManager for chronological ordering
    if (this.componentManager) {
      const update = {
        operation: 'create' as const,
        target_id: userRichComponent.id,
        component: userRichComponent,
        timestamp: userRichComponent.timestamp
      };
      this.componentManager.processUpdate(update);
    }

    // Update empty state after a brief delay to let ComponentManager render
    setTimeout(() => this.updateEmptyState(), 0);

    console.log('Added user message as rich component to ComponentManager:', userRichComponent);

    // Update the view
    this.requestUpdate();

    // Update status to working (initial frontend status before backend responds)
    this.setStatus('working', 'Sending message...', '');

    // Clear input only if we're sending from the input field
    if (messageText === this.currentMessage) {
      this.currentMessage = '';
      const input = this.shadowRoot?.querySelector('.message-input') as HTMLTextAreaElement;
      if (input) {
        input.value = '';
        input.style.height = 'auto';
      }
    }

    // Dispatch event for external listeners
    this.dispatchEvent(new CustomEvent('message-sent', {
      detail: { message: { content: messageText, type: 'user' } },
      bubbles: true,
      composed: true
    }));

    try {
      // Create the request
      const request = {
        message: messageText,
        conversation_id: this.activeConversationId,
        request_id: this.generateId(),
        metadata: this.getRequestMetadata(),
      };

      // Stream the response
      await this.handleStreamingResponse(request);

      this.dispatchEvent(new CustomEvent('conversation-updated', {
        detail: { conversationId: this.activeConversationId },
        bubbles: true,
        composed: true
      }));
      return true; // Success

    } catch (error) {
      console.error('Error sending message:', error);
      this.setStatus('error', 'Failed to send message', error instanceof Error ? error.message : 'Unknown error');

      // Add error message
      this.addMessage(
        `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'assistant'
      );
      return false; // Failure
    }
  }

  private getTitleInitials(): string {
    const title = (this.title || '').trim();
    if (!title) {
      return 'VA';
    }

    const parts = title.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase() || 'V';
    }

    const first = parts[0].charAt(0);
    const last = parts[parts.length - 1].charAt(0);
    const initials = `${first}${last}`.toUpperCase();
    return initials || 'VA';
  }

  private minimizeWindow(e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    console.log('minimizeWindow called, current state:', this._windowState);
    this.windowState = 'minimized';
    console.log('minimizeWindow set state to:', this._windowState);
    this.dispatchEvent(new CustomEvent('window-state-changed', {
      detail: { state: 'minimized' },
      bubbles: true,
      composed: true
    }));
  }

  private maximizeWindow(e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.windowState = 'maximized';
    this.dispatchEvent(new CustomEvent('window-state-changed', {
      detail: { state: 'maximized' },
      bubbles: true,
      composed: true
    }));
  }

  private restoreWindow(e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.windowState = 'normal';
    this.dispatchEvent(new CustomEvent('window-state-changed', {
      detail: { state: 'normal' },
      bubbles: true,
      composed: true
    }));
  }

  private _openSchemaManagement() {
    this.showSchemaManagement = true;
  }

  private _closeSchemaManagement() {
    this.showSchemaManagement = false;
  }

  private updateCommandSuggestions(value: string) {
    const cursorValue = value ?? '';
    const trimmed = cursorValue.trimStart();
    if (!trimmed.startsWith('/')) {
      this.hideCommandSuggestions();
      return;
    }

    const query = trimmed.slice(1).toLowerCase();
    const suggestions = this.commandSuggestions.filter((item) =>
      item.command.toLowerCase().startsWith(`/${query}`)
    );

    this.showCommandSuggestions = suggestions.length > 0;
    this.selectedCommandIndex = 0;
    this.requestUpdate();
  }

  private moveCommandSelection(delta: number) {
    const suggestions = this.getVisibleCommandSuggestions();
    if (!suggestions.length) return;
    const nextIndex = (this.selectedCommandIndex + delta + suggestions.length) % suggestions.length;
    this.selectedCommandIndex = nextIndex;
    this.requestUpdate();
  }

  private acceptSelectedCommand() {
    const suggestions = this.getVisibleCommandSuggestions();
    const selected = suggestions[this.selectedCommandIndex];
    if (!selected) return;

    this.currentMessage = selected.insertText;
    const input = this.shadowRoot?.querySelector('.message-input') as HTMLTextAreaElement | null;
    if (input) {
      input.value = selected.insertText;
      input.focus();
      input.setSelectionRange(selected.insertText.length, selected.insertText.length);
    }
    this.hideCommandSuggestions();
  }

  private hideCommandSuggestions() {
    this.showCommandSuggestions = false;
    this.selectedCommandIndex = 0;
  }

  private getVisibleCommandSuggestions() {
    const trimmed = (this.currentMessage || '').trimStart();
    if (!trimmed.startsWith('/')) {
      return [];
    }
    const query = trimmed.slice(1).toLowerCase();
    return this.commandSuggestions.filter((item) =>
      item.command.toLowerCase().startsWith(`/${query}`)
    );
  }


  addMessage(content: string, type: 'user' | 'assistant') {
    // Create message as a rich component and send to ComponentManager
    const richComponent: RichComponent = {
      id: `${type}-message-${Date.now()}`,
      type: `${type}-message`,
      lifecycle: 'create',
      data: {
        content: content,
        sender: type
      },
      children: [],
      timestamp: new Date().toISOString(),
      visible: true,
      interactive: false
    };

    if (this.componentManager) {
      const update = {
        operation: 'create' as const,
        target_id: richComponent.id,
        component: richComponent,
        timestamp: richComponent.timestamp
      };
      this.componentManager.processUpdate(update);
    }
  }

  setStatus(status: typeof this.status, message: string, detail?: string) {
    this.status = status;
    this.statusMessage = message;
    this.statusDetail = detail || '';
  }

  clearStatus() {
    this.statusMessage = '';
    this.statusDetail = '';
    this.status = 'idle';
  }

  getProgressTracker(): HTMLElement | null {
    return this.shadowRoot?.querySelector('querymind-progress-tracker') || null;
  }

  private async handleStreamingResponse(request: any) {
    // Ensure API client exists and is up to date
    if (!this.apiClient || this.apiClient.baseUrl !== this.apiBaseUrl) {
      this.ensureApiClient();
    }

    // Note: Status bar updates are now controlled by backend via StatusBarUpdateComponent
    // Frontend only shows initial "Sending message..." status (set in _sendMessageInternal)
    // and handles connection errors below

    try {
      // Use SSE streaming by default
      const stream = this.apiClient.streamChat(request);

      for await (const chunk of stream) {
        await this.processChunk(chunk);
      }

      // Backend is responsible for final status via StatusBarUpdateComponent
      // No frontend status clearing here

    } catch (error) {
      console.warn('SSE streaming failed, falling back to polling:', error);

      try {
        // Fallback to polling - show user we're retrying
        this.setStatus('working', 'Connection issue, retrying...', 'Using fallback method');
        const response = await this.apiClient.sendPollMessage(request);

        for (const chunk of response.chunks) {
          await this.processChunk(chunk);
        }

        // Backend is responsible for final status via StatusBarUpdateComponent

      } catch (pollError) {
        // Only set error status if polling also fails (connection error)
        this.setStatus('error', 'Connection failed', 'Unable to reach server');
        throw pollError;
      }
    }
  }

  private async processChunk(chunk: ChatStreamChunk) {
    // Dispatch chunk event for external listeners
    this.dispatchEvent(new CustomEvent('chunk-received', {
      detail: { chunk },
      bubbles: true,
      composed: true
    }));

    console.log('Processing chunk:', chunk); // Debug log

    // Handle rich components via ComponentManager
    if (chunk.rich && this.componentManager) {
      console.log('Processing rich component via ComponentManager:', chunk.rich); // Debug log
      
      if (chunk.rich.id && chunk.rich.lifecycle) {
        // Standard rich component with lifecycle
        const component = chunk.rich as RichComponent;
        const update = {
          operation: chunk.rich.lifecycle as any,
          target_id: chunk.rich.id,
          component: component,
          timestamp: new Date().toISOString()
        };
        this.componentManager.processUpdate(update);
      } else if (chunk.rich.type === 'component_update') {
        // Component update format
        this.componentManager.processUpdate(chunk.rich as any);
      } else {
        // Generic rich component
        const component = chunk.rich as RichComponent;
        const update = {
          operation: 'create' as const,
          target_id: component.id || `component-${Date.now()}`,
          component: component,
          timestamp: new Date().toISOString()
        };
        this.componentManager.processUpdate(update);
      }
      
      return;
    }

    // Update progress tracker for legacy components (keep for backward compatibility)
    const progressTracker = this.getProgressTracker();
    if (progressTracker && 'addStep' in progressTracker) {
      (progressTracker as any).addStep({
        id: `chunk-${Date.now()}`,
        title: this.getChunkTitle(chunk),
        status: 'completed',
        timestamp: chunk.timestamp
      });
    }

    // Handle different chunk types (legacy components)
    const componentType = chunk.rich?.type;
    switch (componentType) {
      case 'text':
        // Text chunks are handled in the main loop
        break;

      case 'thinking':
        // Legacy: Status bar updates now handled by backend via StatusBarUpdateComponent
        // This case is kept for backward compatibility but doesn't update status
        break;

      case 'tool_execution':
        // Legacy: Status bar updates now handled by backend via StatusBarUpdateComponent
        // This case is kept for backward compatibility but doesn't update status
        break;

      case 'error':
        throw new Error(chunk.rich.data?.message || 'Unknown error from agent');

      default:
        // Handle other component types as needed
        console.log('Received chunk:', componentType, chunk.rich);
    }
  }


  private getChunkTitle(chunk: ChatStreamChunk): string {
    const componentType = chunk.rich?.type;
    switch (componentType) {
      case 'text':
        return 'Generating response';
      case 'thinking':
        return 'Thinking';
      case 'tool_execution':
        return `Tool: ${chunk.rich.data?.tool_name || 'Unknown'}`;
      default:
        return `Processing ${componentType || 'component'}`;
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Update the API base URL and recreate the client
   */
  updateApiBaseUrl(baseUrl: string) {
    this.apiBaseUrl = baseUrl;
    this.ensureApiClient();
  }

  /**
   * Replace the current conversation with history loaded from backend.
   * This is used by the outer workspace shell when resuming a chat.
   */
  async loadConversation(conversationId: string): Promise<void> {
    if (!conversationId) {
      throw new Error('conversationId is required');
    }

    const conversation = await this.getApiClient().getConversation(conversationId);
    this.conversationIdAttr = conversationId;
    this.activeConversationId = conversationId;
    this.setAttribute('conversation-id', conversationId);

    this.clearMessages();
    this.clearStatus();
    this.currentMessage = '';

    const input = this.shadowRoot?.querySelector('.message-input') as HTMLTextAreaElement | null;
    if (input) {
      input.value = '';
      input.style.height = 'auto';
    }

    const messages = conversation.messages || [];
    for (const message of messages) {
      const content = (message.content || '').trim();
      if (!content) {
        continue;
      }

      if (message.role === 'user') {
        this.addMessage(content, 'user');
      } else if (message.role === 'assistant') {
        this.addMessage(content, 'assistant');
      }
    }

    this.requestUpdate();
  }

  /**
   * Reset the component to a fresh conversation.
   */
  async startNewConversation(conversationId?: string): Promise<void> {
    this.clearMessages();
    this.clearStatus();
    this.activeConversationId = conversationId || this.generateId();
    this.conversationIdAttr = this.activeConversationId;
    this.setAttribute('conversation-id', this.activeConversationId);
    this.currentMessage = '';

    const input = this.shadowRoot?.querySelector('.message-input') as HTMLTextAreaElement | null;
    if (input) {
      input.value = '';
      input.style.height = 'auto';
    }

    this.requestUpdate();

    if (!this.suppressStarterUi) {
      await this.requestStarterUI();
    }
  }

  /**
   * Get the API client instance for direct access
   */
  getApiClient(): QueryMindApiClient {
    if (!this.apiClient) {
      this.ensureApiClient();
    }
    return this.apiClient;
  }

  /**
   * Set custom headers for authentication or other purposes
   */
  setCustomHeaders(headers: Record<string, string>) {
    this.apiClient.setCustomHeaders(headers);
  }

  /**
   * Update empty state visibility based on whether there are components
   */
  private updateEmptyState() {
    const emptyState = this.shadowRoot?.querySelector('#empty-state') as HTMLElement;
    const richContainer = this.shadowRoot?.querySelector('.rich-components-container') as HTMLElement;
    
    if (emptyState && richContainer) {
      // Show empty state if rich container has no children
      const hasContent = richContainer.children.length > 0;
      emptyState.style.display = hasContent ? 'none' : 'flex';
    }
  }

  /**
   * Update scroll indicator based on scroll position
   */
  private updateScrollIndicator() {
    const messagesContainer = this.shadowRoot?.querySelector('.chat-messages');
    if (!messagesContainer) return;
    
    // Check if there's content scrolled above
    const hasScrolledContent = messagesContainer.scrollTop > 10;
    
    // Update scroll indicator class
    messagesContainer.classList.toggle('has-scroll', hasScrolledContent);
  }

  /**
   * Scroll to the top of the last message/component that was added
   * This always scrolls regardless of current scroll position
   */
  scrollToLastMessage() {
    const messagesContainer = this.shadowRoot?.querySelector('.chat-messages');
    const richContainer = this.shadowRoot?.querySelector('.rich-components-container');
    
    if (!messagesContainer || !richContainer) return;

    // Get the last child element (the most recently added component)
    const lastComponent = richContainer.lastElementChild as HTMLElement;
    if (!lastComponent) return;

    // Scroll so the top of the last component is visible
    lastComponent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Update scroll indicator after scrolling
    setTimeout(() => this.updateScrollIndicator(), 100);
  }

  /**
   * Clear all messages (useful for testing)
   */
  clearMessages() {
    if (this.componentManager) {
      this.componentManager.clear();
    }
    this.updateEmptyState();
    this.requestUpdate();
  }

  /**
   * Add multiple messages at once (useful for testing scrolling)
   */
  addTestMessages(count: number = 10) {
    for (let i = 1; i <= count; i++) {
      setTimeout(() => {
        const type = i % 2 === 0 ? 'assistant' : 'user';
        const content = `This is test message number ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
        this.addMessage(content, type);
      }, i * 100); // Stagger the messages to simulate real timing
    }
  }

  render() {
    return html`
      <!-- Minimized icon - shown only when minimized via CSS and allowMinimize is true -->
      ${this.allowMinimize ? html`
        <div class="minimized-icon" @click=${this.restoreWindow}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </div>
      ` : ''}

      <!-- Main chat interface -->
      <div class="chat-layout ${this.showProgress ? '' : 'compact'}">
        <div class="chat-main">
          <div class="chat-header">
            <div class="header-top">
              <div class="header-left">
                <div class="chat-avatar" aria-hidden="true">${this.getTitleInitials()}</div>
                <div class="header-text">
                  <h2 class="chat-title">${this.title}</h2>
                </div>
              </div>
              <div class="header-top-actions">
                <div class="header-tool-memory-toggle" title="Tool memory scope">
                  <div class="header-tool-memory-toggle-label">
                    <strong>Tool Memory</strong>
                    <span>${this.toolMemorySessionIsolatedAttr ? 'Session isolated' : 'Cross-session'}</span>
                  </div>
                  <button
                    class="header-tool-memory-switch"
                    type="button"
                    role="switch"
                    aria-checked=${this.toolMemorySessionIsolatedAttr ? 'true' : 'false'}
                    aria-label="Toggle tool memory session isolation"
                    @click=${() => {
                      this.toolMemorySessionIsolatedAttr = !this.toolMemorySessionIsolatedAttr;
                      this.requestUpdate();
                    }}>
                  </button>
                </div>
                <div class="window-controls">
                  ${this.allowMinimize ? html`
                    <button
                      class="window-control-btn minimize"
                      @click=${this.minimizeWindow}
                      title="Minimize">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 12h14v2H5z"/>
                      </svg>
                    </button>
                  ` : ''}
                  ${this.windowState === 'maximized' ? html`
                    <button
                      class="window-control-btn restore"
                      @click=${this.restoreWindow}
                      title="Restore">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 8v2h2V8h6v6h-2v2h4V6H8zm-2 4v8h8v-2H8v-6H6z"/>
                      </svg>
                    </button>
                  ` : html`
                    <button
                      class="window-control-btn maximize"
                      @click=${this.maximizeWindow}
                      title="Maximize">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 5v14h14V5H5zm2 2h10v10H7V7z"/>
                      </svg>
                    </button>
                  `}
                </div>
              </div>
            </div>
          </div>

          <div class="chat-messages">
            <!-- Empty state - shown when no components exist -->
            <div class="empty-state" id="empty-state">
              <div class="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </div>
              <div class="empty-state-text">Start a conversation</div>
              <div class="empty-state-subtitle">Type your message below to begin chatting</div>
            </div>

            <!-- Rich Components Container - all content renders here via ComponentManager -->
            <div class="rich-components-container"></div>
          </div>

          <div class="chat-input-area">
            <querymind-status-bar
              .status=${this.status}
              .message=${this.statusMessage}
              .detail=${this.statusDetail}
              theme=${this.theme}>
            </querymind-status-bar>

            <div class="chat-input-container">
              ${this.showCommandSuggestions ? html`
                <div class="command-suggestions" role="listbox" aria-label="Command suggestions">
                  <div class="command-suggestions-header">
                    <span>Commands</span>
                    <span>Tab to insert</span>
                  </div>
                  ${this.getVisibleCommandSuggestions().map((item, index) => html`
                    <button
                      class="command-suggestion ${index === this.selectedCommandIndex ? 'active' : ''}"
                      type="button"
                      role="option"
                      aria-selected=${index === this.selectedCommandIndex}
                      @click=${() => {
                        this.currentMessage = item.insertText;
                        const input = this.shadowRoot?.querySelector('.message-input') as HTMLTextAreaElement | null;
                        if (input) {
                          input.value = item.insertText;
                          input.focus();
                          input.setSelectionRange(item.insertText.length, item.insertText.length);
                        }
                        this.hideCommandSuggestions();
                      }}>
                      <span class="command-suggestion-code">${item.command}</span>
                      <span class="command-suggestion-description">${item.description}</span>
                    </button>
                  `)}
                </div>
              ` : ''}
              <textarea
                class="message-input"
                .placeholder=${this.placeholder}
                .disabled=${this.disabled}
                @input=${this.handleInput}
                @keydown=${this.handleKeyPress}
                @blur=${() => setTimeout(() => this.hideCommandSuggestions(), 120)}
                rows="1"
              ></textarea>
              <button
                class="send-button"
                type="button"
                aria-label="Send message"
                .disabled=${this.disabled || !this.currentMessage.trim()}
                @click=${this.sendMessage}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        ${this.showProgress ? html`
          <div class="sidebar">
            <button
              class="sidebar-btn"
              @click=${this._openSchemaManagement}
              title="Schema Management">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
              Schema Management
            </button>
            <querymind-progress-tracker theme=${this.theme}></querymind-progress-tracker>
          </div>
        ` : ''}
      </div>

      <!-- Schema Management Modal -->
      ${this.showSchemaManagement ? html`
        <div class="schema-modal-overlay" @click=${this._closeSchemaManagement}>
          <div class="schema-modal-content" @click=${(e: Event) => e.stopPropagation()}>
            <schema-management-page
              .apiClient=${this.apiClient}
              .userGroups=${this.userGroups || []}
              @close=${this._closeSchemaManagement}>
            </schema-management-page>
          </div>
        </div>
      ` : ''}
    `;
  }
}
