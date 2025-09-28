import OpenAI from 'openai';
import type { Message, ToolCall } from './types';
import { getToolDefinitions, executeTool } from './tools';
import { ChatCompletionMessageFunctionToolCall } from 'openai/resources/index.mjs';
/**
 * ChatHandler - Handles all chat-related operations
 *
 * This class encapsulates the OpenAI integration and tool execution logic,
 * making it easy for AI developers to understand and extend the functionality.
 */
export class ChatHandler {
  private client: OpenAI;
  private model: string;
  constructor(aiGatewayUrl: string, apiKey: string, model: string) {
    // This handler is now primarily for the template's original chat functionality.
    // The new Groq logic is in userRoutes.ts for simplicity in this phase.
    // We keep this configured for the Cloudflare AI gateway as it was.
    this.client = new OpenAI({
      baseURL: aiGatewayUrl,
      apiKey: apiKey
    });
    this.model = model;
  }
  /**
   * Process a user message and generate AI response with optional tool usage
   */
  async processMessage(
    message: string,
    conversationHistory: Message[],
    onChunk?: (chunk: string) => void
  ): Promise<{
    content: string;
    toolCalls?: ToolCall[];
  }> {
    const messages = this.buildConversationMessages(message, conversationHistory);
    const toolDefinitions = await getToolDefinitions();
    if (onChunk) {
      // Use streaming with callback
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages,
        tools: toolDefinitions.length > 0 ? toolDefinitions : undefined,
        tool_choice: toolDefinitions.length > 0 ? 'auto' : undefined,
        stream: true,
      });
      return this.handleStreamResponse(stream, onChunk);
    }
    // Non-streaming response
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages,
      tools: toolDefinitions.length > 0 ? toolDefinitions : undefined,
      tool_choice: toolDefinitions.length > 0 ? 'auto' : undefined,
      stream: false
    });
    return this.handleNonStreamResponse(completion);
  }
  private async handleStreamResponse(
    stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>,
    onChunk: (chunk: string) => void
  ) {
    let fullContent = '';
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      if (delta?.content) {
        fullContent += delta.content;
        onChunk(delta.content);
      }
    }
    // Tool calls are not supported in this simplified stream handler for now.
    return { content: fullContent };
  }
  private async handleNonStreamResponse(
    completion: OpenAI.Chat.Completions.ChatCompletion
  ) {
    const responseMessage = completion.choices[0]?.message;
    if (!responseMessage || !responseMessage.content) {
      return { content: 'I apologize, but I encountered an issue processing your request.' };
    }
    // Simplified: No tool calls for this path anymore.
    return {
      content: responseMessage.content
    };
  }
  /**
   * Build conversation messages for OpenAI API
   */
  private buildConversationMessages(userMessage: string, history: Message[]) {
    return [
      {
        role: 'system' as const,
        content: 'You are a helpful AI assistant.'
      },
      ...history.slice(-5).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user' as const, content: userMessage }
    ];
  }
  /**
   * Update the model for this chat handler
   */
  updateModel(newModel: string): void {
    this.model = newModel;
  }
}