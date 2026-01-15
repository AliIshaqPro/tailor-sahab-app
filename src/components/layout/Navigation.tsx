import { NavLink } from 'react-router-dom';
import { Users, ClipboardList, Download, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'ڈیش بورڈ', icon: LayoutDashboard },
  { to: '/customers', label: 'گاہک', icon: Users },
  { to: '/orders', label: 'آرڈرز', icon: ClipboardList },
  { to: '/backup', label: 'بیک اپ', icon: Download },
];

export function Navigation() {
  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 py-2 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200',
                  'hover:bg-muted hover:text-primary',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="whitespace-nowrap">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
