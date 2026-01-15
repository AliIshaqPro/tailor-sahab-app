import { ReactNode } from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <main className="container mx-auto px-3 py-4 pb-8">
        {children}
      </main>
    </div>
  );
}
