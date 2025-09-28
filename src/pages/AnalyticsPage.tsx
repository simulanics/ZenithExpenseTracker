import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMemo } from 'react';
import { startOfMonth, subMonths, format } from 'date-fns';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff4d4d', '#4dff4d', '#4d4dff'];
export default function AnalyticsPage() {
  const transactions = useTransactionStore((state) => state.transactions);
  const spendingData = useMemo(() => {
    const expenseByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    return Object.entries(expenseByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);
  const trendData = useMemo(() => {
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
    const monthlyData = Array.from({ length: 6 }).map((_, i) => {
      const monthDate = subMonths(new Date(), 5 - i);
      return {
        name: format(monthDate, 'MMM'),
        income: 0,
        expense: 0,
      };
    });
    transactions.forEach(t => {
      if (t.date >= sixMonthsAgo) {
        const monthIndex = 5 - (new Date().getMonth() - t.date.getMonth() + 12) % 12;
        if (monthIndex >= 0 && monthIndex < 6) {
          if (t.type === 'income') {
            monthlyData[monthIndex].income += t.amount;
          } else {
            monthlyData[monthIndex].expense += t.amount;
          }
        }
      }
    });
    return monthlyData;
  }, [transactions]);
  const hasData = transactions.length > 0;
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Analytics</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Visual insights into your financial health.
          </p>
        </div>
      </div>
      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>A breakdown of your expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              {spendingData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">No expense data available.</div>
              )}
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 shadow-md">
            <CardHeader>
              <CardTitle>Income vs. Expense Trend</CardTitle>
              <CardDescription>Your financial flow over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="rgb(20, 184, 166)" name="Income" />
                  <Bar dataKey="expense" fill="rgb(239, 68, 68)" name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-20 px-6 bg-white dark:bg-slate-950 rounded-lg shadow-md border border-dashed border-slate-300 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">No Data to Analyze</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Add some transactions to see your financial analytics.
          </p>
          <div className="mt-6">
            <AddTransactionSheet />
          </div>
        </div>
      )}
    </motion.div>
  );
}