import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactionStore } from '@/stores/transactionStore';
import { Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
export function AIInsightCard() {
  const transactions = useTransactionStore((state) => state.transactions);
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchInsight = async () => {
      if (transactions.length < 3) {
        setInsight("Add more transactions to get personalized AI insights.");
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: "Based on my recent transactions, give me one concise, actionable financial tip or a summary of my spending habit. Keep it under 50 words.",
            transactions: transactions.map(t => ({...t, date: t.date.toISOString()})),
          }),
        });
        if (!response.ok || !response.body) {
          throw new Error('Failed to fetch AI insight');
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let fullResponse = "";
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
        }
        setInsight(fullResponse);
      } catch (error) {
        console.error('AI insight error:', error);
        setInsight("Could not fetch an insight at this time. Please try again later.");
        toast.error("Failed to get AI insight.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsight();
  }, [transactions]);
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-teal-500" />
          <div>
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Insight</CardTitle>
            <CardDescription>A quick tip based on your data.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center">
        {isLoading ? (
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-slate-600 dark:text-slate-300 italic">"{insight}"</p>
        )}
      </CardContent>
    </Card>
  );
}