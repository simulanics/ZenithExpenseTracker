import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTransactionStore } from '@/stores/transactionStore';
import { Transaction } from '@/types';
import { toast } from 'sonner';
interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}
const initialMessages: Message[] = [
  {
    id: 1,
    role: 'assistant',
    content: "Hello! I'm your Zenith AI assistant. How can I help you with your finances today? I can analyze your transaction data to provide insights.",
  },
];
const examplePrompts = [
  "How can I save money on food?",
  "What's my biggest expense category this month?",
  "Summarize my spending for last week.",
  "Create a budget for me based on my income.",
];
export default function AIChatPage() {
  const transactions = useTransactionStore((state) => state.transactions);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: messageContent,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    const aiResponseId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: aiResponseId, role: 'assistant', content: '' }]);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          transactions: transactions.map(t => ({...t, date: t.date.toISOString()})), // Serialize dates
        }),
      });
      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiResponseId ? { ...msg, content: msg.content + chunk } : msg
          )
        );
      }
    } catch (error) {
      console.error('AI chat error:', error);
      toast.error('Failed to get AI response.');
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiResponseId
            ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-8rem)] flex flex-col"
    >
      <Card className="flex-1 flex flex-col shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-full">
              <Bot className="h-6 w-6 text-teal-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">AI Financial Assistant</h1>
              <p className="text-slate-500 dark:text-slate-400">Ask me anything about your finances.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex items-start gap-4', msg.role === 'user' && 'justify-end')}>
              {msg.role === 'assistant' && (
                <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                  <Bot className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-md p-4 rounded-2xl prose dark:prose-invert',
                  msg.role === 'user'
                    ? 'bg-teal-500 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}{isLoading && msg.id === messages[messages.length - 1].id && <span className="animate-pulse">|</span>}</p>
              </div>
              {msg.role === 'user' && (
                <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                  <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1].content === '' && (
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                <Bot className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="max-w-md p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="w-full">
            {messages.length <= 1 && (
              <div className="w-full mb-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {examplePrompts.map(prompt => (
                  <Button key={prompt} variant="outline" size="sm" className="text-left justify-start" onClick={() => handleSendMessage(prompt)}>
                    <Sparkles className="mr-2 h-4 w-4 text-teal-500" />
                    {prompt}
                  </Button>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask about your spending, budgets, or savings..."
                className="flex-1 min-h-[42px] max-h-32 resize-none"
                rows={1}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}