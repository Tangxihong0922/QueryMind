import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { vannaDesignTokens } from '../styles/vanna-design-tokens.js';
import {
  QueryMindApiClient,
  type SchemaEnrichResponse,
  type SchemaEnrichResult,
} from '../services/api-client.js';

export interface SchemaTable {
  table_name: string;
  schema_name: string;
  full_name: string;
  domain: string;
  description: string;
  completeness_score: number;
  field_count: number;
  complete_field_count: number;
  is_complete: boolean;
  status_icon: string;
}

export interface FieldMetadata {
  field_name: string;
  data_type: string;
  is_nullable: boolean;
  is_primary_key: boolean;
  is_foreign_key: boolean;
  business_meaning: string;
  is_missing_meaning: boolean;
}

export interface SchemaTableDetail {
  table_name: string;
  schema_name: string;
  business_context: {
    domain: string;
    description: string;
    keywords: string[];
  };
  fields: FieldMetadata[];
  foreign_keys: Array<{
    from_field: string;
    to_table: string;
    to_field: string;
    description: string;
  }>;
  completeness: {
    score: number;
    missing_fields: string[];
  };
}

export interface TableChange {
  table_full_name: string;
  changes: {
    domain?: string;
    description?: string;
    keywords?: string;
    field_meanings?: Record<string, string>;
  };
}

@customElement('schema-management-page')
export class SchemaManagementPage extends LitElement {
  static styles = [
    vannaDesignTokens,
    css`
      :host {
        display: block;
        font-family: var(--vanna-font-family-default);
        height: 100%;
        overflow: hidden;
      }

      .page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--vanna-background-root);
      }

      /* Header */
      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--vanna-space-4) var(--vanna-space-5);
        background: var(--vanna-background-higher);
        border-bottom: 1px solid var(--vanna-outline-default);
      }

      .page-title {
        display: flex;
        align-items: center;
        gap: var(--vanna-space-3);
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--vanna-foreground-default);
      }

      .page-title-icon {
        font-size: 1.5rem;
      }

      .header-actions {
        display: flex;
        gap: var(--vanna-space-3);
      }

      .btn {
        padding: var(--vanna-space-2) var(--vanna-space-4);
        border-radius: var(--vanna-border-radius-md);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all var(--vanna-duration-200) ease;
        display: flex;
        align-items: center;
        gap: var(--vanna-space-2);
        border: 1px solid;
      }

      .btn-primary {
        background: var(--vanna-accent-primary-default);
        border-color: var(--vanna-accent-primary-default);
        color: white;
      }

      .btn-primary:hover {
        background: var(--vanna-accent-primary-stronger);
      }

      .btn-secondary {
        background: var(--vanna-background-default);
        border-color: var(--vanna-outline-default);
        color: var(--vanna-foreground-default);
      }

      .btn-secondary:hover {
        background: var(--vanna-background-higher);
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Content */
      .page-content {
        flex: 1;
        overflow: hidden;
        display: flex;
      }

      /* Sidebar */
      .sidebar {
        width: 360px;
        border-right: 1px solid var(--vanna-outline-default);
        display: flex;
        flex-direction: column;
        background: var(--vanna-background-default);
      }

      .sidebar-header {
        padding: var(--vanna-space-4);
        border-bottom: 1px solid var(--vanna-outline-dimmer);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--vanna-space-2);
      }

      .stat-card {
        padding: var(--vanna-space-3);
        background: var(--vanna-background-root);
        border-radius: var(--vanna-border-radius-md);
        text-align: center;
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--vanna-foreground-default);
      }

      .stat-label {
        font-size: 0.7rem;
        color: var(--vanna-foreground-dimmer);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .stat-card.complete .stat-value {
        color: var(--vanna-accent-positive-default);
      }

      .stat-card.warning .stat-value {
        color: var(--vanna-accent-warning-default);
      }

      /* Search */
      .search-box {
        padding: var(--vanna-space-3);
        border-bottom: 1px solid var(--vanna-outline-dimmer);
      }

      .search-input {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        display: block;
        padding: var(--vanna-space-2) var(--vanna-space-3);
        background: var(--vanna-background-root);
        border: 1px solid var(--vanna-outline-default);
        border-radius: var(--vanna-border-radius-md);
        color: var(--vanna-foreground-default);
        font-size: 0.875rem;
      }

      .search-input:focus {
        outline: none;
        border-color: var(--vanna-accent-primary-default);
      }

      /* Table List */
      .table-list {
        flex: 1;
        overflow-y: auto;
      }

      .table-item {
        padding: var(--vanna-space-3) var(--vanna-space-4);
        border-bottom: 1px solid var(--vanna-outline-dimmer);
        cursor: pointer;
        transition: background var(--vanna-duration-150) ease;
        display: flex;
        align-items: flex-start;
        gap: var(--vanna-space-3);
      }

      .table-item:hover {
        background: var(--vanna-background-higher);
      }

      .table-item.selected {
        background: var(--vanna-accent-primary-subtle);
        border-left: 3px solid var(--vanna-accent-primary-default);
      }

      .table-item-header {
        display: flex;
        align-items: center;
        gap: var(--vanna-space-2);
        margin-bottom: var(--vanna-space-1);
        min-width: 0;
      }

      .table-item-checkbox {
        margin-top: 2px;
        flex: 0 0 auto;
      }

      .table-item-body {
        flex: 1;
        min-width: 0;
        cursor: pointer;
      }

      .table-item-icon {
        font-size: 1rem;
      }

      .table-item-name {
        font-weight: 500;
        color: var(--vanna-foreground-default);
        flex: 1;
      }

      .table-item-score {
        font-size: 0.75rem;
        padding: 2px 6px;
        border-radius: var(--vanna-border-radius-sm);
        font-weight: 600;
      }

      .table-item-score.high {
        background: rgba(16, 185, 129, 0.15);
        color: var(--vanna-accent-positive-default);
      }

      .table-item-score.medium {
        background: rgba(245, 158, 11, 0.15);
        color: var(--vanna-accent-warning-default);
      }

      .table-item-score.low {
        background: rgba(239, 68, 68, 0.15);
        color: var(--vanna-accent-negative-default);
      }

      .table-item-domain {
        font-size: 0.8rem;
        color: var(--vanna-foreground-dimmer);
      }

      /* Detail Panel */
      .detail-panel {
        flex: 1;
        overflow-y: auto;
        padding: var(--vanna-space-5);
      }

      .operation-banner {
        margin: var(--vanna-space-4) var(--vanna-space-5) 0;
        padding: var(--vanna-space-3) var(--vanna-space-4);
        border-radius: var(--vanna-border-radius-md);
        border: 1px solid rgba(245, 158, 11, 0.45);
        background: rgba(245, 158, 11, 0.12);
        color: var(--vanna-foreground-default);
        display: flex;
        align-items: flex-start;
        gap: var(--vanna-space-3);
      }

      .operation-banner-icon {
        font-size: 1rem;
        line-height: 1.25rem;
        flex: 0 0 auto;
      }

      .operation-banner-title {
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 2px;
      }

      .operation-banner-text {
        font-size: 0.85rem;
        color: var(--vanna-foreground-dimmer);
        word-break: break-word;
      }

      .detail-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--vanna-foreground-dimmer);
        text-align: center;
      }

      .detail-empty-icon {
        font-size: 4rem;
        margin-bottom: var(--vanna-space-4);
        opacity: 0.5;
      }

      .detail-header {
        margin-bottom: var(--vanna-space-5);
        padding-bottom: var(--vanna-space-4);
        border-bottom: 1px solid var(--vanna-outline-dimmer);
      }

      .detail-title {
        display: flex;
        align-items: center;
        gap: var(--vanna-space-3);
        margin: 0 0 var(--vanna-space-3) 0;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .detail-title code {
        background: var(--vanna-background-root);
        padding: var(--vanna-space-1) var(--vanna-space-2);
        border-radius: var(--vanna-border-radius-sm);
        font-family: var(--vanna-font-family-mono);
      }

      .detail-score-badge {
        padding: var(--vanna-space-1) var(--vanna-space-3);
        border-radius: var(--vanna-border-radius-full);
        font-size: 0.75rem;
        font-weight: 600;
      }

      .detail-score-badge.high {
        background: rgba(16, 185, 129, 0.15);
        color: var(--vanna-accent-positive-default);
      }

      .detail-score-badge.medium {
        background: rgba(245, 158, 11, 0.15);
        color: var(--vanna-accent-warning-default);
      }

      .detail-score-badge.low {
        background: rgba(239, 68, 68, 0.15);
        color: var(--vanna-accent-negative-default);
      }

      /* Forms */
      .form-section {
        margin-bottom: var(--vanna-space-5);
      }

      .form-section-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--vanna-foreground-default);
        margin-bottom: var(--vanna-space-3);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .form-group {
        margin-bottom: var(--vanna-space-4);
      }

      .form-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--vanna-foreground-dimmer);
        margin-bottom: var(--vanna-space-2);
      }

      .form-input {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        padding: var(--vanna-space-3);
        background: var(--vanna-background-default);
        border: 1px solid var(--vanna-outline-default);
        border-radius: var(--vanna-border-radius-md);
        color: var(--vanna-foreground-default);
        font-size: 0.9rem;
        font-family: inherit;
      }

      .form-input:focus {
        outline: none;
        border-color: var(--vanna-accent-primary-default);
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
      }

      textarea.form-input {
        min-height: 80px;
        resize: vertical;
      }

      /* Fields Table */
      .fields-table-container {
        border: 1px solid var(--vanna-outline-default);
        border-radius: var(--vanna-border-radius-md);
        overflow: hidden;
      }

      .fields-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }

      .fields-table th {
        background: var(--vanna-background-higher);
        padding: var(--vanna-space-3);
        text-align: left;
        font-weight: 600;
        color: var(--vanna-foreground-dimmer);
        border-bottom: 1px solid var(--vanna-outline-default);
        font-size: 0.75rem;
        text-transform: uppercase;
      }

      .fields-table td {
        padding: var(--vanna-space-2) var(--vanna-space-3);
        border-bottom: 1px solid var(--vanna-outline-dimmer);
        vertical-align: middle;
      }

      .fields-table tr:last-child td {
        border-bottom: none;
      }

      .fields-table tr.modified {
        background: rgba(99, 102, 241, 0.05);
      }

      .field-name {
        font-family: var(--vanna-font-family-mono);
        display: flex;
        align-items: center;
        gap: var(--vanna-space-2);
      }

      .field-name code {
        background: var(--vanna-background-root);
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 0.8rem;
      }

      .pk-badge, .fk-badge {
        padding: 1px 4px;
        border-radius: 3px;
        font-size: 0.65rem;
        font-weight: 700;
      }

      .pk-badge {
        background: rgba(239, 68, 68, 0.15);
        color: var(--vanna-accent-negative-default);
      }

      .fk-badge {
        background: rgba(59, 130, 246, 0.15);
        color: rgb(37, 99, 235);
      }

      .field-type {
        font-family: var(--vanna-font-family-mono);
        color: var(--vanna-foreground-dimmer);
        font-size: 0.8rem;
      }

      .field-meaning-input {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        padding: var(--vanna-space-2);
        background: var(--vanna-background-default);
        border: 1px solid var(--vanna-outline-default);
        border-radius: var(--vanna-border-radius-sm);
        color: var(--vanna-foreground-default);
        font-size: 0.85rem;
      }

      .field-meaning-input:focus {
        outline: none;
        border-color: var(--vanna-accent-primary-default);
      }

      .field-meaning-input.modified {
        border-color: var(--vanna-accent-primary-default);
        background: rgba(99, 102, 241, 0.1);
      }

      .field-meaning-input.missing {
        border-color: var(--vanna-accent-warning-default);
      }

      .field-meaning-input.missing::placeholder {
        color: var(--vanna-accent-warning-default);
      }

      /* Dirty indicator */
      .dirty-badge {
        position: fixed;
        bottom: var(--vanna-space-5);
        right: var(--vanna-space-5);
        padding: var(--vanna-space-3) var(--vanna-space-4);
        background: var(--vanna-accent-primary-default);
        color: white;
        border-radius: var(--vanna-border-radius-lg);
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: var(--vanna-space-2);
        box-shadow: var(--vanna-shadow-lg);
        cursor: pointer;
        transition: all var(--vanna-duration-200) ease;
      }

      .dirty-badge:hover {
        transform: translateY(-2px);
        box-shadow: var(--vanna-shadow-xl);
      }

      .selection-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--vanna-space-3);
        padding: var(--vanna-space-3) var(--vanna-space-4);
        border-bottom: 1px solid var(--vanna-outline-dimmer);
        background: var(--vanna-background-higher);
      }

      .selection-bar-left {
        display: flex;
        align-items: center;
        gap: var(--vanna-space-2);
        color: var(--vanna-foreground-dimmer);
        font-size: 0.875rem;
      }

      .selection-bar-actions {
        display: flex;
        gap: var(--vanna-space-2);
      }

      /* Loading */
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--vanna-foreground-dimmer);
      }

      .spinner {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `
  ];

  @property({ type: String }) apiUrl = '';
  @property({ type: Object }) apiClient: QueryMindApiClient | null = null;
  @property({ type: Array }) userGroups: string[] = [];

  @state() private tables: SchemaTable[] = [];
  @state() private selectedTable: string | null = null;
  @state() private tableDetail: SchemaTableDetail | null = null;
  @state() private loading = false;
  @state() private saving = false;
  @state() private enriching = false;
  @state() private searchQuery = '';
  @state() private selectedTables: Set<string> = new Set();
  @state() private dirtyChanges: Map<string, TableChange> = new Map();
  @state() private operationError: string | null = null;
  @state() private deleting = false;
  @state() private statistics = {
    total: 0,
    complete: 0,
    partial: 0,
    incomplete: 0
  };
  @state() private permissionDenied = false;
  @state() private permissionError = '';

  connectedCallback() {
    super.connectedCallback();
    this._checkPermission();
  }

  private _checkPermission() {
    // Check if user has admin group
    const groups = this.userGroups || [];
    if (!groups.includes('admin')) {
      this.permissionDenied = true;
      this.permissionError = 'Admin access required for Schema Management';
      return;
    }
    // User has permission, load tables
    this._loadTables();
  }

  private async _loadTables() {
    if (!this.apiClient) return;

    this.loading = true;
    try {
      const response = await this.apiClient.getTables();
      this.tables = response.tables || [];
      this._updateStatistics(response.statistics);
    } catch (error: any) {
      console.error('Failed to load tables:', error);
      // Check if it's a permission error (403)
      if (error.message && error.message.includes('403')) {
        this.permissionDenied = true;
        this.permissionError = 'Admin access required for Schema Management';
      }
    } finally {
      this.loading = false;
    }
  }

  private _updateStatistics(serverStats?: {
    total_tables?: number;
    complete_tables?: number;
    partial_tables?: number;
    incomplete_tables?: number;
  }) {
    if (serverStats) {
      this.statistics = {
        total: serverStats.total_tables ?? this.tables.length,
        complete: serverStats.complete_tables ?? 0,
        partial: serverStats.partial_tables ?? 0,
        incomplete: serverStats.incomplete_tables ?? 0
      };
      return;
    }

    this.statistics = {
      total: this.tables.length,
      complete: this.tables.filter(t => t.completeness_score >= 0.8).length,
      partial: this.tables.filter(t => t.completeness_score >= 0.5 && t.completeness_score < 0.8).length,
      incomplete: this.tables.filter(t => t.completeness_score < 0.5).length
    };
  }

  private async _selectTable(fullName: string, forceRefresh = false) {
    if (this.selectedTable === fullName && !forceRefresh) return;
    this.selectedTable = fullName;
    this.loading = true;

    try {
      const response = await this.apiClient!.getTableDetail(fullName);
      this.tableDetail = response;
      this.operationError = null;
    } catch (error) {
      console.error('Failed to load table detail:', error);
      this.operationError = this._formatError(error, 'Failed to load table details');
    } finally {
      this.loading = false;
    }
  }

  private _toggleTableSelection(fullName: string, checked: boolean) {
    const next = new Set(this.selectedTables);
    if (checked) {
      next.add(fullName);
    } else {
      next.delete(fullName);
    }
    this.selectedTables = next;
    this.requestUpdate();
  }

  private _clearSelection() {
    this.selectedTables = new Set();
    this.requestUpdate();
  }

  private async _deleteSelectedTables() {
    if (!this.apiClient || this.selectedTables.size === 0 || this.deleting) return;

    const targets = Array.from(this.selectedTables);
    const confirmed = window.confirm(
      `Delete ${targets.length} selected table(s) from schema memory? This will remove both vector and graph entries.`
    );
    if (!confirmed) return;

    this.deleting = true;
    this.operationError = null;
    try {
      const response = await this.apiClient.deleteSchemaTables(targets);
      const deleted = new Set(response.deleted || targets);

      for (const fullName of deleted) {
        this.dirtyChanges.delete(fullName);
      }

      if (this.selectedTable && deleted.has(this.selectedTable)) {
        this.selectedTable = null;
        this.tableDetail = null;
      }

      this._clearSelection();
      await this._loadTables();

      if (this.selectedTable) {
        await this._selectTable(this.selectedTable, true);
      }
      this.operationError = null;
    } catch (error) {
      console.error('Failed to delete tables:', error);
      this.operationError = this._formatError(error, 'Failed to delete selected tables');
    } finally {
      this.deleting = false;
    }
  }

  private _handleContextChange(field: string, value: string) {
    if (!this.tableDetail || !this.selectedTable) return;

    const change = this.dirtyChanges.get(this.selectedTable) || {
      table_full_name: this.selectedTable,
      changes: {}
    };

    if (field === 'domain') {
      change.changes.domain = value;
    } else if (field === 'description') {
      change.changes.description = value;
    } else if (field === 'keywords') {
      change.changes.keywords = value;
    }

    this.dirtyChanges.set(this.selectedTable, change);
    this._applyDraftToTableDetail((draft) => {
      if (field === 'domain') {
        draft.business_context.domain = value;
      } else if (field === 'description') {
        draft.business_context.description = value;
      } else if (field === 'keywords') {
        draft.business_context.keywords = value
          .split(',')
          .map(keyword => keyword.trim())
          .filter(Boolean);
      }
    });
    this.requestUpdate();
  }

  private _handleFieldMeaningChange(fieldName: string, meaning: string) {
    if (!this.tableDetail || !this.selectedTable) return;

    const change = this.dirtyChanges.get(this.selectedTable) || {
      table_full_name: this.selectedTable,
      changes: {}
    };

    if (!change.changes.field_meanings) {
      change.changes.field_meanings = {};
    }
    change.changes.field_meanings[fieldName] = meaning;

    this.dirtyChanges.set(this.selectedTable, change);
    this._applyDraftToTableDetail((draft) => {
      draft.fields = draft.fields.map(field =>
        field.field_name === fieldName
          ? {
              ...field,
              business_meaning: meaning,
              is_missing_meaning: !meaning.trim(),
            }
          : field
      );
    });
    this.requestUpdate();
  }

  private _recalculateCompleteness(detail: SchemaTableDetail) {
    const domain = detail.business_context.domain?.trim() || '';
    const description = detail.business_context.description?.trim() || '';
    const keywords = (detail.business_context.keywords || [])
      .map(keyword => keyword.trim())
      .filter(Boolean);
    const fields = detail.fields || [];

    const domainComplete = !!domain && domain !== 'public' && domain !== 'Unknown';
    const descriptionComplete = description.length > 10;
    const fieldsWithMeaning = fields.filter(field => (field.business_meaning || '').trim()).length;
    const fieldScore = fields.length > 0 ? fieldsWithMeaning / fields.length : 0;
    const keywordsComplete = keywords.length >= 2;

    const score =
      (domainComplete ? 0.15 : 0) +
      (descriptionComplete ? 0.25 : 0) +
      (fieldScore * 0.40) +
      (keywordsComplete ? 0.20 : 0);

    const missingFields: string[] = [];
    if (!domainComplete) missingFields.push('domain');
    if (!descriptionComplete) missingFields.push('description');
    if (!keywordsComplete) missingFields.push('keywords');
    fields.forEach(field => {
      if (!(field.business_meaning || '').trim()) {
        missingFields.push(`field:${field.field_name}`);
      }
    });

    return {
      score,
      missing_fields: missingFields,
    };
  }

  private _applyDraftToTableDetail(updater: (draft: SchemaTableDetail) => void) {
    if (!this.tableDetail) return;

    const draft: SchemaTableDetail = {
      ...this.tableDetail,
      business_context: {
        ...this.tableDetail.business_context,
        keywords: [...(this.tableDetail.business_context.keywords || [])],
      },
      fields: this.tableDetail.fields.map(field => ({ ...field })),
      foreign_keys: this.tableDetail.foreign_keys.map(fk => ({ ...fk })),
      completeness: {
        ...this.tableDetail.completeness,
        missing_fields: [...(this.tableDetail.completeness.missing_fields || [])],
      },
    };

    updater(draft);
    draft.completeness = this._recalculateCompleteness(draft);
    this.tableDetail = draft;
    this._syncTableListFromDetail(draft);
  }

  private _syncTableListFromDetail(detail: SchemaTableDetail) {
    if (!this.selectedTable) return;

    const fieldsWithMeaning = detail.fields.filter(field => (field.business_meaning || '').trim()).length;
    const score = detail.completeness.score;
    const isComplete = score >= 0.9;

    this.tables = this.tables.map(table => {
      if (table.full_name !== this.selectedTable) {
        return table;
      }

      return {
        ...table,
        domain: detail.business_context.domain || table.domain,
        description: detail.business_context.description || table.description,
        completeness_score: score,
        field_count: detail.fields.length,
        complete_field_count: fieldsWithMeaning,
        is_complete: isComplete,
        status_icon: isComplete ? '✅' : '⚠️',
      };
    });
  }

  private async _saveChanges() {
    if (this.dirtyChanges.size === 0) return;

    this.saving = true;
    this.operationError = null;
    try {
      for (const change of this.dirtyChanges.values()) {
        await this.apiClient?.updateSchemaMetadata(change.table_full_name, {
          domain: change.changes.domain,
          description: change.changes.description,
          keywords: change.changes.keywords
            ?.split(',')
            .map(k => k.trim())
            .filter(Boolean),
          field_meanings: change.changes.field_meanings
        });
      }
      this.dirtyChanges.clear();
      // Reload current table
      if (this.selectedTable) {
        await this._selectTable(this.selectedTable, true);
      }
      await this._loadTables();
    } catch (error) {
      console.error('Failed to save changes:', error);
      this.operationError = this._formatError(error, 'Failed to save schema changes');
    } finally {
      this.saving = false;
    }
  }

  private async _aiEnrich() {
    if (!this.selectedTable || !this.apiClient || this.enriching) return;

    this.enriching = true;
    this.operationError = null;
    try {
      const response = await this.apiClient.enrichSchema(this.selectedTable);
      this._applyEnrichmentResult(response);
    } catch (error) {
      console.error('Failed to enrich schema:', error);
      this.operationError = this._formatError(error, 'Failed to enrich schema');
    } finally {
      this.enriching = false;
    }
  }

  private _applyEnrichmentResult(response: SchemaEnrichResponse) {
    if (!this.selectedTable || !this.tableDetail) return;

    const result = response.results?.find(item => item.table_name === this.tableDetail?.table_name)
      || response.results?.[0];

    if (!result || result.success === false) {
      this.operationError = result?.error || 'Schema enrichment did not return usable results';
      return;
    }

    this._applyDraftToTableDetail((draft) => {
      if (result.domain !== undefined) {
        draft.business_context.domain = result.domain || '';
      }
      if (result.description !== undefined) {
        draft.business_context.description = result.description || '';
      }
      if (result.keywords !== undefined) {
        draft.business_context.keywords = result.keywords || [];
      }

      if (result.field_meanings) {
        draft.fields = draft.fields.map(field => {
          const meaning = result.field_meanings?.[field.field_name];
          if (meaning === undefined) {
            return field;
          }
          return {
            ...field,
            business_meaning: meaning,
            is_missing_meaning: !meaning.trim(),
          };
        });
      }
    });

    const change = this.dirtyChanges.get(this.selectedTable) || {
      table_full_name: this.selectedTable,
      changes: {},
    };
    if (result.domain !== undefined) {
      change.changes.domain = result.domain || '';
    }
    if (result.description !== undefined) {
      change.changes.description = result.description || '';
    }
    if (result.keywords !== undefined) {
      change.changes.keywords = (result.keywords || []).join(', ');
    }
    if (result.field_meanings) {
      change.changes.field_meanings = {
        ...(change.changes.field_meanings || {}),
        ...result.field_meanings,
      };
    }
    this.dirtyChanges.set(this.selectedTable, change);
    this.requestUpdate();
  }

  private _formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      return error.message || fallback;
    }
    if (typeof error === 'string' && error.trim()) {
      return error;
    }
    try {
      return JSON.stringify(error);
    } catch {
      return fallback;
    }
  }

  private _getFilteredTables(): SchemaTable[] {
    if (!this.searchQuery) return this.tables;
    const query = this.searchQuery.toLowerCase();
    return this.tables.filter(t =>
      t.table_name.toLowerCase().includes(query) ||
      t.domain.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query)
    );
  }

  private _getScoreClass(score: number): string {
    if (score >= 0.8) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  private _getChangedFields(): Set<string> {
    if (!this.selectedTable) return new Set();
    const change = this.dirtyChanges.get(this.selectedTable);
    if (!change?.changes.field_meanings) return new Set();
    return new Set(Object.keys(change.changes.field_meanings));
  }

  private _hasTableChanges(): boolean {
    if (!this.selectedTable) return false;
    const change = this.dirtyChanges.get(this.selectedTable);
    return !!(change && (change.changes.domain || change.changes.description || change.changes.keywords));
  }

  private _close() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  render() {
    // Permission denied view
    if (this.permissionDenied) {
      return html`
        <div class="page-container">
          <header class="page-header">
            <h1 class="page-title">
              <span class="page-title-icon">📊</span>
              Schema Management
            </h1>
            <div class="header-actions">
              <button class="btn btn-secondary" @click=${this._close}>
                ← Back
              </button>
            </div>
          </header>
          <div class="detail-panel">
            <div class="detail-empty">
              <div class="detail-empty-icon">🔒</div>
              <p><strong>Access Denied</strong></p>
              <p>${this.permissionError || 'Admin access required for Schema Management'}</p>
              <p style="font-size: 0.9rem; margin-top: 1rem; color: var(--vanna-foreground-dimmest);">
                Please contact your administrator if you believe you should have access.
              </p>
            </div>
          </div>
        </div>
      `;
    }

    const filteredTables = this._getFilteredTables();
    const changedFields = this._getChangedFields();
    const selectedCount = this.selectedTables.size;

    return html`
      <div class="page-container">
        <header class="page-header">
          <h1 class="page-title">
            <span class="page-title-icon">📊</span>
            Schema Management
          </h1>
          <div class="header-actions">
            <button class="btn btn-secondary" @click=${this._close}>
              ← Back
            </button>
          </div>
        </header>

        ${this.operationError ? html`
          <div class="operation-banner" role="alert">
            <span class="operation-banner-icon">⚠️</span>
            <div>
              <div class="operation-banner-title">Schema operation failed</div>
              <div class="operation-banner-text">${this.operationError}</div>
            </div>
          </div>
        ` : ''}

        <div class="page-content">
          <aside class="sidebar">
            <div class="sidebar-header">
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">${this.statistics.total}</div>
                  <div class="stat-label">Total</div>
                </div>
                <div class="stat-card complete">
                  <div class="stat-value">${this.statistics.complete}</div>
                  <div class="stat-label">Complete</div>
                </div>
                <div class="stat-card warning">
                  <div class="stat-value">${this.statistics.partial}</div>
                  <div class="stat-label">Partial</div>
                </div>
                <div class="stat-card warning">
                  <div class="stat-value">${this.statistics.incomplete}</div>
                  <div class="stat-label">Incomplete</div>
                </div>
              </div>
            </div>

            <div class="search-box">
              <input
                type="text"
                class="search-input"
                placeholder="Search tables..."
                .value=${this.searchQuery}
                @input=${(e: InputEvent) => this.searchQuery = (e.target as HTMLInputElement).value}
              >
            </div>

            ${selectedCount > 0 ? html`
              <div class="selection-bar">
                <div class="selection-bar-left">
                  <strong>${selectedCount}</strong> selected
                </div>
                <div class="selection-bar-actions">
                  <button class="btn btn-secondary" ?disabled=${this.deleting} @click=${this._clearSelection}>
                    Clear
                  </button>
                  <button class="btn btn-secondary" ?disabled=${this.deleting} @click=${this._deleteSelectedTables}>
                    ${this.deleting ? 'Deleting...' : 'Delete Selected'}
                  </button>
                </div>
              </div>
            ` : ''}

            <div class="table-list">
              ${filteredTables.map(table => html`
                <div
                  class="table-item ${this.selectedTable === table.full_name ? 'selected' : ''}"
                >
                  <input
                    type="checkbox"
                    class="table-item-checkbox"
                    .checked=${this.selectedTables.has(table.full_name)}
                    @change=${(e: Event) => this._toggleTableSelection(table.full_name, (e.target as HTMLInputElement).checked)}
                  >
                  <div class="table-item-body" @click=${() => this._selectTable(table.full_name)}>
                    <div class="table-item-header">
                      <span class="table-item-icon">${table.status_icon}</span>
                      <span class="table-item-name">${table.table_name}</span>
                      <span class="table-item-score ${this._getScoreClass(table.completeness_score)}">
                        ${Math.round(table.completeness_score * 100)}%
                      </span>
                    </div>
                    <div class="table-item-domain">${table.domain || 'No domain'}</div>
                  </div>
                </div>
              `)}
            </div>
          </aside>

          <main class="detail-panel">
            ${this.loading ? html`
              <div class="loading">
                <span class="spinner">⏳</span> Loading...
              </div>
            ` : this.tableDetail ? html`
              <div class="detail-header">
                <h2 class="detail-title">
                  <code>${this.tableDetail.schema_name}.${this.tableDetail.table_name}</code>
                  <span class="detail-score-badge ${this._getScoreClass(this.tableDetail.completeness.score)}">
                    ${Math.round(this.tableDetail.completeness.score * 100)}% Complete
                  </span>
                </h2>
              </div>

              <div class="form-section">
                <h3 class="form-section-title">Business Context</h3>
                <div class="form-group">
                  <label class="form-label">Domain</label>
                  <input
                    type="text"
                    class="form-input"
                    .value=${this.tableDetail.business_context.domain}
                    placeholder="e.g., Customer, Sales, Inventory"
                    @input=${(e: InputEvent) => this._handleContextChange('domain', (e.target as HTMLInputElement).value)}
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea
                    class="form-input"
                    placeholder="What is this table used for?"
                    @input=${(e: InputEvent) => this._handleContextChange('description', (e.target as HTMLTextAreaElement).value)}
                    .value=${this.tableDetail.business_context.description}
                  ></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Keywords</label>
                  <input
                    type="text"
                    class="form-input"
                    .value=${this.tableDetail.business_context.keywords?.join(', ') || ''}
                    placeholder="customer, order, purchase"
                    @input=${(e: InputEvent) => this._handleContextChange('keywords', (e.target as HTMLInputElement).value)}
                  >
                </div>
              </div>

              <div class="form-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--vanna-space-3);">
                  <h3 class="form-section-title" style="margin: 0;">Fields (${this.tableDetail.fields.length})</h3>
                  <button class="btn btn-primary" ?disabled=${this.loading || this.saving || this.enriching} @click=${this._aiEnrich}>
                    ${this.enriching ? '⏳ Enriching...' : '🤖 AI Enrich'}
                  </button>
                </div>
                <div class="fields-table-container">
                  <table class="fields-table">
                    <thead>
                      <tr>
                        <th>Column</th>
                        <th>Type</th>
                        <th>Business Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.tableDetail.fields.map(field => html`
                        <tr class="${changedFields.has(field.field_name) ? 'modified' : ''}">
                          <td>
                            <div class="field-name">
                              <code>${field.field_name}</code>
                              ${field.is_primary_key ? html`<span class="pk-badge">PK</span>` : ''}
                              ${field.is_foreign_key ? html`<span class="fk-badge">FK</span>` : ''}
                            </div>
                          </td>
                          <td class="field-type">${field.data_type}</td>
                          <td>
                            <input
                              type="text"
                              class="field-meaning-input ${changedFields.has(field.field_name) ? 'modified' : ''} ${field.is_missing_meaning ? 'missing' : ''}"
                              .value=${field.business_meaning || ''}
                              placeholder="${field.is_missing_meaning ? 'Missing - please describe' : 'Enter meaning...'}"
                              @input=${(e: InputEvent) => this._handleFieldMeaningChange(field.field_name, (e.target as HTMLInputElement).value)}
                            >
                          </td>
                        </tr>
                      `)}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : html`
              <div class="detail-empty">
                <div class="detail-empty-icon">📋</div>
                <p>Select a table from the list to view and edit its schema metadata</p>
              </div>
            `}
          </main>
        </div>

        ${this.dirtyChanges.size > 0 ? html`
          <div class="dirty-badge" @click=${this._saveChanges}>
            💾 Save ${this.dirtyChanges.size} change${this.dirtyChanges.size > 1 ? 's' : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schema-management-page': SchemaManagementPage;
  }
}
