import { z } from 'zod';
export const transactionSchema = z.object({
  id: z.string().default(() => `txn_${crypto.randomUUID()}`),
  type: z.enum(['income', 'expense']),
  amount: z.number().positive({ message: 'Amount must be positive' }),
  category: z.string().min(1, { message: 'Category is required' }),
  date: z.date(),
  note: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});
export type Transaction = z.infer<typeof transactionSchema>;

export const transactionFormSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive({ message: 'Amount must be positive' }),
  category: z.string().min(1, { message: 'Category is required' }),
  date: z.date(),
  note: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const categories = [
  'Food', 'Housing', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Education', 'Other Expense',
  // Income
  'Salary', 'Bonus', 'Freelance', 'Investment', 'Gift', 'Other Income'
] as const;
export type Category = typeof categories[number];