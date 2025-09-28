import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  Bot,
  Menu,
  X,
  Wallet,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ReceiptText },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/ai-chat', label: 'AI Chat', icon: Bot },
];
const NavContent = () => {
  const location = useLocation();
  return (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              'flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors duration-200',
              isActive
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800'
            )
          }
        >
          <item.icon className="mr-4 h-6 w-6" />
          {item.label}
        </NavLink>
      ))}
    </>
  );
};
export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 min-h-screen p-4">
          <div className="flex items-center gap-2 h-16 px-4 mb-4">
            <Wallet className="h-8 w-8 text-teal-500" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Zenith</h1>
          </div>
          <nav className="flex flex-col space-y-2">
            <NavContent />
          </nav>
        </aside>
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <Wallet className="h-7 w-7 text-teal-500" />
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Zenith</h1>
            </div>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4 bg-white dark:bg-slate-950">
                <div className="flex items-center justify-between h-16 mb-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-8 w-8 text-teal-500" />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Zenith</h1>
                  </div>
                </div>
                <nav className="flex flex-col space-y-2" onClick={() => setMobileMenuOpen(false)}>
                  <NavContent />
                </nav>
              </SheetContent>
            </Sheet>
          </header>
          {/* Main Content */}
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <ThemeToggle className="fixed bottom-4 right-4" />
      <Toaster richColors position="top-right" />
    </div>
  );
}