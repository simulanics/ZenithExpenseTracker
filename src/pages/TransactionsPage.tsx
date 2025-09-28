import { useState, useMemo } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactionStore } from '@/stores/transactionStore';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { MoreHorizontal, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Transaction, categories } from '@/types';
import { EditTransactionSheet } from '@/components/EditTransactionSheet';
import { DeleteTransactionAlert } from '@/components/DeleteTransactionAlert';
import { toast } from 'sonner';
type SortKey = keyof Transaction;
type SortDirection = 'asc' | 'desc';
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};
export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useTransactionStore();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'date', direction: 'desc' });
  const [filters, setFilters] = useState<{ type: 'all' | 'income' | 'expense'; category: 'all' | string }>({ type: 'all', category: 'all' });
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    return filtered.sort((a, b) => {
      const key = sortConfig.key;
      const valA = a[key];
      const valB = b[key];

      const compareA = key === 'date' && valA instanceof Date ? valA.getTime() : valA;
      const compareB = key === 'date' && valB instanceof Date ? valB.getTime() : valB;

      if (compareA < compareB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, sortConfig, filters]);
  const handleDeleteConfirm = () => {
    if (deletingTransaction) {
      deleteTransaction(deletingTransaction.id);
      toast.success("Transaction deleted successfully.");
      setDeletingTransaction(null);
    }
  };
  const uniqueCategories = useMemo(() => ['all', ...Array.from(new Set(transactions.map(t => t.category)))], [transactions]);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-slate-800 dark:text-slate-100">All Transactions</CardTitle>
            <CardDescription>A complete history of your financial activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Select value={filters.type} onValueChange={(value) => setFilters(f => ({ ...f, type: value as any }))}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.category} onValueChange={(value) => setFilters(f => ({ ...f, category: value }))}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filteredAndSortedTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><Button variant="ghost" onClick={() => handleSort('date')}>Date <ArrowUpDown className="ml-2 h-4 w-4 inline" /></Button></TableHead>
                      <TableHead><Button variant="ghost" onClick={() => handleSort('type')}>Type <ArrowUpDown className="ml-2 h-4 w-4 inline" /></Button></TableHead>
                      <TableHead><Button variant="ghost" onClick={() => handleSort('category')}>Category <ArrowUpDown className="ml-2 h-4 w-4 inline" /></Button></TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="text-right"><Button variant="ghost" onClick={() => handleSort('amount')}>Amount <ArrowUpDown className="ml-2 h-4 w-4 inline" /></Button></TableHead>
                      <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedTransactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{format(t.date, 'PPP')}</TableCell>
                        <TableCell>
                          <Badge variant={t.type === 'income' ? 'default' : 'destructive'} className={t.type === 'income' ? 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30' : 'bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30'}>
                            {t.type}
                          </Badge>
                        </TableCell>
                        <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                        <TableCell className="max-w-xs truncate">{t.note || '-'}</TableCell>
                        <TableCell className={`text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingTransaction(t)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setDeletingTransaction(t)} className="text-red-600 focus:text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                <p className="text-xl font-medium">No transactions match your filters.</p>
                <p>Try adjusting your search or add a new transaction.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <EditTransactionSheet 
        transaction={editingTransaction}
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      />
      <DeleteTransactionAlert
        open={!!deletingTransaction}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}