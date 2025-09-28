import { AddTransactionSheet } from '@/components/AddTransactionSheet';
import { IncomeExpenseChart } from '@/components/Dashboard/IncomeExpenseChart';
import { RecentTransactions } from '@/components/Dashboard/RecentTransactions';
import { SummaryCards } from '@/components/Dashboard/SummaryCards';
import { AIInsightCard } from '@/components/Dashboard/AIInsightCard';
import { useTransactionStore } from '@/stores/transactionStore';
import { motion, Variants } from 'framer-motion';
export function HomePage() {
  const transactions = useTransactionStore((state) => state.transactions);
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };
  return (
    <div className="space-y-8">
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <AddTransactionSheet />
      </motion.div>
      {transactions.length === 0 ? (
        <motion.div
          className="text-center py-20 px-6 bg-white dark:bg-slate-950 rounded-lg shadow-md border border-dashed border-slate-300 dark:border-slate-700"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">Your Dashboard is Empty</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Get started by adding your first income or expense.
          </p>
          <div className="mt-6">
            <AddTransactionSheet />
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="lg:col-span-3" variants={itemVariants}>
            <SummaryCards />
          </motion.div>
          <motion.div className="lg:col-span-3" variants={itemVariants}>
            <IncomeExpenseChart />
          </motion.div>
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <RecentTransactions />
          </motion.div>
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <AIInsightCard />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}