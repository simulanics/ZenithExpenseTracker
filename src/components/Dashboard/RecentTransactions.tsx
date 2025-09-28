import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
export function RecentTransactions() {
  const transactions = useTransactionStore((state) => state.transactions);
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [transactions]);
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 col-span-1 lg:col-span-2 flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Recent Transactions</CardTitle>
        <CardDescription>Your last 5 financial activities.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {recentTransactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {t.type === 'income' ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className="capitalize">{t.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{t.category}</Badge>
                  </TableCell>
                  <TableCell>{format(t.date, 'MMM d, yyyy')}</TableCell>
                  <TableCell className={`text-right font-medium ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(t.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-lg">No transactions yet.</p>
            <p>Add your first transaction to see it here.</p>
          </div>
        )}
      </CardContent>
      {transactions.length > 0 && (
        <CardFooter className="border-t pt-4 flex justify-end">
          <Button asChild variant="ghost" className="text-teal-500 hover:text-teal-600">
            <Link to="/transactions">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}