import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Transaction, transactionSchema } from '@/types';
interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updatedTransaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
}
// Custom storage object to handle Date objects during serialization
const storageWithDateHandling = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    const parsed = JSON.parse(str);
    // Revive date strings back to Date objects
    if (parsed.state && Array.isArray(parsed.state.transactions)) {
      parsed.state.transactions.forEach((t: any) => {
        if (t.date) t.date = new Date(t.date);
        if (t.createdAt) t.createdAt = new Date(t.createdAt);
      });
    }
    return parsed;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => localStorage.removeItem(name),
};
export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (newTransaction) => {
        const validatedTransaction = transactionSchema.parse({
          ...newTransaction,
          date: new Date(newTransaction.date),
        });
        set((state) => ({
          transactions: [...state.transactions, validatedTransaction],
        }));
      },
      updateTransaction: (id, updatedTransaction) => {
        const validatedUpdate = transactionSchema.omit({ id: true, createdAt: true }).parse({
          ...updatedTransaction,
          date: new Date(updatedTransaction.date),
        });
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...validatedUpdate } : t
          ),
        }));
      },
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: 'zenith-finance-transactions',
      storage: createJSONStorage(() => storageWithDateHandling),
    }
  )
);