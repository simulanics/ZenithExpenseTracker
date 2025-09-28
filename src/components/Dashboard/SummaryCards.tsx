import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionStore } from '@/stores/transactionStore';
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';
import { useMemo } from 'react';
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
export function SummaryCards() {
  const transactions = useTransactionStore((state) => state.transactions);
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [transactions]);
  const summaryData = [
    {
      title: 'Current Balance',
      amount: balance,
      icon: DollarSign,
      color: 'text-slate-500',
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: ArrowUpCircle,
      color: 'text-green-500',
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: ArrowDownCircle,
      color: 'text-red-500',
    },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {summaryData.map((item) => (
        <Card key={item.title} className="shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-slate-500 dark:text-slate-400">{item.title}</CardTitle>
            <item.icon className={`h-6 w-6 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(item.amount)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}