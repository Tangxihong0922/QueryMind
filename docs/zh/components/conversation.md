# 会话存储

会话存储是聊天线程的持久化记录。QueryMind 把它定义成一个很小、按用户隔离的契约：存储层负责消息和元数据，prompt 构建和工具执行则放在后面的 agent 流水线里。

## 数据模型

`Conversation` 包含 `id`、`user`、`messages`、`created_at`、`updated_at` 和自由形式的 `metadata`。`Message` 包含 `role`、`content`、`timestamp`，以及可选的 `metadata`、`tool_result`、`tool_calls`、`tool_call_id`。

`Conversation.add_message()` 会追加消息并刷新 `updated_at`。

## 存储契约

`ConversationStore` 只暴露 5 个操作：
- `create_conversation(...)`
- `get_conversation(...)`
- `update_conversation(...)`
- `delete_conversation(...)`
- `list_conversations(...)`

这个接口不负责搜索、摘要，也不负责 prompt shaping。

## Agent 流水线

下面用一次正常 query turn 说明 conversation 在存储和内存之间的读写。

```text
+====================================================================================================+
| 1) 读取会话                                                                                       |
|----------------------------------------------------------------------------------------------------|
| conversation_store.get_conversation(conversation_id, user)                                        |
| - 载入已有会话，或在首次请求时创建空会话                                                           |
| output: in-memory Conversation                                                                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 2) workflow 前的写入门槛                                                                           |
|----------------------------------------------------------------------------------------------------|
| Agent._send_message() 先拿到 conversation，再调用 workflow_handler.try_handle(...)                 |
| - starter UI / command 场景可能直接返回                                                           |
| - normal query 会继续往下走                                                                       |
| output: 只有真正进入 normal turn 的消息才会写入历史                                               |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 3) 写入 user message                                                                               |
|----------------------------------------------------------------------------------------------------|
| conversation.add_message(Message(role="user", content=message))                                    |
| sql_126 log: 先写入用户问题，再进入 LLM / tool loop                                               |
| output: conversation.messages 追加一条 user 消息                                                  |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 4) 写入 assistant / tool / assistant                                                              |
|----------------------------------------------------------------------------------------------------|
| LLM 返回 tool_calls 后：                                                                            |
| - conversation.add_message(role="assistant", tool_calls=...)                                       |
| - 每个 tool result 再写一条 role="tool" 的消息                                                     |
| 最后完成回答时：conversation.add_message(role="assistant", content=final_answer)                  |
| output: 一轮 query 的完整消息链被留在 Conversation.messages 里                                     |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 5) 持久化                                                                                         |
|----------------------------------------------------------------------------------------------------|
| auto-save 开启时调用 conversation_store.update_conversation(conversation)                         |
| sql_126 log: 一轮完成后把内存中的 conversation flush 回存储                                        |
| output: metadata + 新增消息文件都被写回                                                             |
+=============================================+======================================================+
                                                |
                                                v
+====================================================================================================+
| 6) 下一轮读取 recent history                                                                      |
|----------------------------------------------------------------------------------------------------|
| history-aware 组件会调用 conversation_store.get_recent(conversation_id, limit=10)                 |
| - 供 SchemaRetrieveContextEnricher 等组件复用最近消息和结构化结果                                  |
| output: 下一轮 prompt / tool context 能继承上一轮会话状态                                          |
+====================================================================================================+
```

1. `Agent._send_message()` 先解析用户。
2. 空消息，或 `request_context.metadata["starter_ui_request"]`，会先走 starter UI 路径，不进入正常轮次。
3. 正常轮次里，agent 会先加载或创建会话，然后在把用户消息写入历史之前调用 `workflow_handler.try_handle(...)`。
4. 如果 `WorkflowResult.should_skip_llm` 为 `true`，agent 会先执行 `conversation_mutation`，再流式输出返回的组件，然后直接返回，不再调用 LLM。
5. 如果 workflow 没有接管，这条用户消息才会被写入会话，随后继续进入 LLM / tool loop。
6. `update_conversation()` 是显式持久化步骤。开启 auto-save 时，agent 会在 starter UI 响应后，以及 workflow 接管的一轮结束后调用它。

同一个 store 也会被运行时里的 history-aware 组件读取，包括后端专用的 recent-history helper。

## 实现

### MemoryConversationStore

`MemoryConversationStore` 把 `Dict[str, Conversation]` 保存在进程内存中。

它会：
- 用初始用户消息创建会话
- 按 `user.id` 限制读取和删除
- 只列出当前用户的会话
- 按 `updated_at` 倒序排列会话列表

它存在的原因：
- 适合本地开发
- 适合单元测试和 demo
- 不需要外部依赖

代价：
- 进程退出就丢失
- 不支持重启后继续使用

### FileSystemConversationStore

`FileSystemConversationStore` 会把每个会话落成一个目录：

```text
conversations/
  conv_12345678/
    metadata.json
    messages/
      1700000000000000_000000.json
      1700000001000000_000001.json
```

它保存：
- `metadata.json`，包含会话 id、用户信息和时间戳
- `messages/` 目录下的一条条 JSON 消息文件

它会：
- `create_conversation()` 写入 metadata 和第一条用户消息
- `update_conversation()` 重写 metadata，只追加尚未保存的消息
- `get_conversation()` 重新加载 metadata 和 messages，再重建 `Conversation`
- `delete_conversation()` 先校验 ownership，再删除文件
- `list_conversations()` 按 owner 过滤、按 `updated_at` 排序并分页
- `get_recent()` 返回最近的 N 条消息，供 history-aware 组件使用

它的价值在于：
- 会话可以直接在磁盘上检查
- 重启后仍然保留
- 追加式消息文件更方便排障和恢复
- recent-history 读取可以复用之前的结构化工具输出

`get_recent()` 是 `FileSystemConversationStore` 的 helper，不属于 `ConversationStore` 接口。

## 边界

会话存储只负责原始历史和 ownership 校验，不负责 memory policy、schema governance、SQL governance 或 prompt chain 逻辑。

## 相关源码文件

- [`src/QueryMind/core/storage/base.py`](../../../src/QueryMind/core/storage/base.py) - `ConversationStore` 接口
- [`src/QueryMind/core/storage/models.py`](../../../src/QueryMind/core/storage/models.py) - `Conversation` 和 `Message` 模型
- [`src/QueryMind/integrations/local/storage.py`](../../../src/QueryMind/integrations/local/storage.py) - 内存会话存储
- [`src/QueryMind/integrations/local/file_system_conversation_store.py`](../../../src/QueryMind/integrations/local/file_system_conversation_store.py) - 文件系统会话存储
- [`src/QueryMind/core/agent/agent.py`](../../../src/QueryMind/core/agent/agent.py) - 会话加载、workflow 短路和持久化流程
- [`src/QueryMind/core/enricher/schema_retrieve.py`](../../../src/QueryMind/core/enricher/schema_retrieve.py) - 读取最近消息的 history-aware 组件
