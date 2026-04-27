/**
 * API client for communicating with QueryMind Agents backend
 */

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  user_id?: string;
  request_id?: string;
  metadata?: Record<string, any>;
}

export interface ChatStreamChunk {
  rich: Record<string, any>;
  simple?: Record<string, any>;
  conversation_id: string;
  request_id: string;
  timestamp: number;
}

export interface ChatResponse {
  chunks: ChatStreamChunk[];
  conversation_id: string;
  request_id: string;
  total_chunks: number;
}

export interface SchemaEnrichResult {
  table_name: string;
  domain?: string | null;
  description?: string | null;
  keywords?: string[];
  field_meanings?: Record<string, string>;
  success?: boolean;
  error?: string | null;
}

export interface SchemaEnrichResponse {
  success: boolean;
  message: string;
  total?: number;
  successful?: number;
  failed?: number;
  results?: SchemaEnrichResult[];
  detail?: string;
}

export interface SchemaDeleteResponse {
  success: boolean;
  message: string;
  full_name?: string;
  deleted?: string[];
  failed?: string[];
  results?: Array<{
    full_name: string;
    success: boolean;
  }>;
}

export interface ConversationSummary {
  conversation_id: string;
  title: string;
  preview: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  last_role?: string | null;
}

export interface ConversationHistoryMessage {
  role: string;
  content: string;
  timestamp?: string;
  metadata?: Record<string, any>;
  tool_result?: Record<string, any> | null;
  tool_calls?: Array<Record<string, any>> | null;
  tool_call_id?: string | null;
}

export interface ConversationDetail extends ConversationSummary {
  metadata?: Record<string, any>;
  messages: ConversationHistoryMessage[];
}

export interface ConversationDeleteResponse {
  success: boolean;
  conversation_id: string;
  message: string;
}

export interface ApiClientConfig {
  baseUrl?: string;
  sseEndpoint?: string;
  wsEndpoint?: string;
  pollEndpoint?: string;
  timeout?: number;
  customHeaders?: Record<string, string>;
}

export class QueryMindApiClient {
  public readonly baseUrl: string;
  private sseEndpoint: string;
  private wsEndpoint: string;
  private pollEndpoint: string;
  private timeout: number;
  private customHeaders: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.sseEndpoint = config.sseEndpoint || '/api/querymind/v1/chat_sse';
    this.wsEndpoint = config.wsEndpoint || '/api/querymind/v1/chat_websocket';
    this.pollEndpoint = config.pollEndpoint || '/api/querymind/v1/chat_poll';
    this.timeout = config.timeout || 30000;
    this.customHeaders = config.customHeaders || {};

    console.log('[QueryMindApiClient] Constructor called with config:', config);
    console.log('[QueryMindApiClient] Endpoint configuration:');
    console.log('  - SSE endpoint:', this.sseEndpoint, config.sseEndpoint ? '(custom)' : '(default)');
    console.log('  - WS endpoint:', this.wsEndpoint, config.wsEndpoint ? '(custom)' : '(default)');
    console.log('  - Poll endpoint:', this.pollEndpoint, config.pollEndpoint ? '(custom)' : '(default)');
    console.log('  - Base URL:', this.baseUrl || '(empty)');
  }

  /**
   * Update custom headers (e.g., for authentication)
   */
  setCustomHeaders(headers: Record<string, string>) {
    this.customHeaders = headers;
  }

  /**
   * Get current custom headers
   */
  getCustomHeaders(): Record<string, string> {
    return { ...this.customHeaders };
  }

  /**
   * Send message using Server-Sent Events (SSE) streaming
   */
  async *streamChat(request: ChatRequest): AsyncGenerator<ChatStreamChunk, void, unknown> {
    const url = this.sseEndpoint.startsWith('http')
      ? this.sseEndpoint
      : `${this.baseUrl}${this.sseEndpoint}`;

    console.log('[QueryMindApiClient] SSE streaming to URL:', url);
    console.log('[QueryMindApiClient] SSE endpoint config:', {
      baseUrl: this.baseUrl,
      sseEndpoint: this.sseEndpoint,
      constructedUrl: url
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        ...this.customHeaders,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              return;
            }

            try {
              const chunk = JSON.parse(data) as ChatStreamChunk;
              yield chunk;
            } catch (e) {
              console.warn('Failed to parse SSE chunk:', data, e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Send message using WebSocket
   */
  createWebSocketConnection(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      let wsUrl: string;

      if (this.wsEndpoint.startsWith('ws://') || this.wsEndpoint.startsWith('wss://')) {
        // Absolute WebSocket URL provided
        wsUrl = this.wsEndpoint;
      } else {
        // Relative path - construct from baseUrl
        if (this.baseUrl) {
          // Parse baseUrl to extract host and convert http(s) to ws(s)
          const baseUrlObj = new URL(this.baseUrl);
          const wsProtocol = baseUrlObj.protocol === 'https:' ? 'wss:' : 'ws:';
          wsUrl = `${wsProtocol}//${baseUrlObj.host}${this.wsEndpoint}`;
        } else {
          // Fallback to window.location
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          wsUrl = `${protocol}//${window.location.host}${this.wsEndpoint}`;
        }
      }

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => resolve(ws);
      ws.onerror = (error) => reject(error);

      // Set timeout
      setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          reject(new Error('WebSocket connection timeout'));
        }
      }, this.timeout);
    });
  }

  /**
   * Send message via WebSocket
   */
  async sendWebSocketMessage(
    ws: WebSocket,
    request: ChatRequest
  ): Promise<AsyncGenerator<ChatStreamChunk, void, unknown>> {
    return new Promise((resolve, reject) => {
      if (ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      async function* generator() {
        let isCompleted = false;
        const messageQueue: ChatStreamChunk[] = [];
        let resolveNext: ((value: IteratorResult<ChatStreamChunk>) => void) | null = null;

        const messageHandler = (event: MessageEvent) => {
          try {
            const chunk = JSON.parse(event.data) as ChatStreamChunk;

            if (chunk.rich?.type === 'completion') {
              isCompleted = true;
              if (resolveNext) {
                resolveNext({ done: true, value: undefined });
                resolveNext = null;
              }
              return;
            }

            if (chunk.rich?.type === 'error') {
              ws.removeEventListener('message', messageHandler);
              if (resolveNext) {
                resolveNext({ done: true, value: undefined });
              }
              return;
            }

            if (resolveNext) {
              resolveNext({ done: false, value: chunk });
              resolveNext = null;
            } else {
              messageQueue.push(chunk);
            }
          } catch (e) {
            console.warn('Failed to parse WebSocket message:', event.data, e);
          }
        };

        ws.addEventListener('message', messageHandler);

        while (!isCompleted) {
          if (messageQueue.length > 0) {
            yield messageQueue.shift()!;
          } else {
            await new Promise<IteratorResult<ChatStreamChunk>>((resolve) => {
              resolveNext = resolve;
            });
          }
        }

        ws.removeEventListener('message', messageHandler);
      }

      try {
        ws.send(JSON.stringify(request));
        resolve(generator());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send message using polling (fallback option)
   */
  async sendPollMessage(request: ChatRequest): Promise<ChatResponse> {
    const url = this.pollEndpoint.startsWith('http')
      ? this.pollEndpoint
      : `${this.baseUrl}${this.pollEndpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.customHeaders,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<ChatResponse>;
  }

  /**
   * List chat conversations for the current user
   */
  async listConversations(
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    conversations: ConversationSummary[];
    pagination: {
      limit: number;
      offset: number;
      total_count: number;
      has_more: boolean;
    };
  }> {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    const url = `${this.baseUrl}/api/querymind/v1/chat/conversations?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.customHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a single conversation with full message history
   */
  async getConversation(conversationId: string): Promise<ConversationDetail> {
    const url = `${this.baseUrl}/api/querymind/v1/chat/conversations/${encodeURIComponent(conversationId)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.customHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<ConversationDeleteResponse> {
    const url = `${this.baseUrl}/api/querymind/v1/chat/conversations/${encodeURIComponent(conversationId)}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.customHeaders,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.detail || data?.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return data;
  }

  /**
   * Generate unique IDs for conversations and requests
   */
  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  // ========== Schema Management Methods ==========

  /**
   * Get all tables with schema metadata
   */
  async getTables(limit: number = 1000, offset: number = 0): Promise<{
    tables: Array<{
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
    }>;
    statistics: {
      total_tables: number;
      complete_tables: number;
      partial_tables: number;
      incomplete_tables: number;
    };
    pagination: {
      page: number;
      page_size: number;
      total_count: number;
      total_pages: number;
    };
  }> {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    const url = `${this.baseUrl}/api/querymind/v1/schema/tables?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.customHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get detailed schema information for a specific table
   */
  async getTableDetail(fullName: string): Promise<{
    table_name: string;
    schema_name: string;
    business_context: {
      domain: string;
      description: string;
      keywords: string[];
    };
    fields: Array<{
      field_name: string;
      data_type: string;
      is_nullable: boolean;
      is_primary_key: boolean;
      is_foreign_key: boolean;
      business_meaning: string;
      is_missing_meaning: boolean;
    }>;
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
  }> {
    // Fixed: Use correct path /schema/tables/{full_name}
    const url = `${this.baseUrl}/api/querymind/v1/schema/tables/${encodeURIComponent(fullName)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.customHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update schema metadata for a table
   */
  async updateSchemaMetadata(
    fullName: string,
    data: {
      domain?: string;
      description?: string;
      keywords?: string[];
      field_meanings?: Record<string, string>;
    }
  ): Promise<{ success: boolean; message: string }> {
    // Fixed: Use correct path /schema/tables/{full_name}/metadata
    const url = `${this.baseUrl}/api/querymind/v1/schema/tables/${encodeURIComponent(fullName)}/metadata`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.customHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Enrich schema metadata using AI
   */
  async enrichSchema(fullName: string): Promise<SchemaEnrichResponse> {
    // Fixed: Use correct path /schema/tables/{full_name}/enrich
    const url = `${this.baseUrl}/api/querymind/v1/schema/tables/${encodeURIComponent(fullName)}/enrich`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.customHeaders,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.detail || data?.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    if (data?.success === false) {
      throw new Error(data.detail || data.message || 'Schema enrichment failed');
    }

    return data;
  }

  /**
   * Delete a single schema table from memory
   */
  async deleteSchemaTable(fullName: string): Promise<SchemaDeleteResponse> {
    const url = `${this.baseUrl}/api/querymind/v1/schema/tables/${encodeURIComponent(fullName)}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.customHeaders,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.detail || data?.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return data;
  }

  /**
   * Delete multiple schema tables from memory
   */
  async deleteSchemaTables(fullNames: string[]): Promise<SchemaDeleteResponse> {
    const url = `${this.baseUrl}/api/querymind/v1/schema/tables/delete`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.customHeaders,
      },
      body: JSON.stringify({ full_names: fullNames }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.detail || data?.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return data;
  }
}

/**
 * Default API client instance
 */
export const apiClient = new QueryMindApiClient();
