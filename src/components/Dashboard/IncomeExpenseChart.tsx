import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
export function IncomeExpenseChart() {
  const transactions = useTransactionStore((state) => state.transactions);
  const chartData = useMemo(() => {
    const now = new Date();
    const firstDay = startOfMonth(now);
    const lastDay = endOfMonth(now);
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    const data = daysInMonth.map(day => ({
      name: format(day, 'd'),
      income: 0,
      expense: 0,
    }));
    transactions.forEach(t => {
      if (t.date >= firstDay && t.date <= lastDay) {
        const dayIndex = t.date.getDate() - 1;
        if (t.type === 'income') {
          data[dayIndex].income += t.amount;
        } else {
          data[dayIndex].expense += t.amount;
        }
      }
    });
    return data;
  }, [transactions]);
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Monthly Overview</CardTitle>
        <CardDescription>Income vs. Expenses for {format(new Date(), 'MMMM yyyy')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="rgb(20, 184, 166)" name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="rgb(239, 68, 68)" name="Expense" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}