import { Scissors } from 'lucide-react';

export function Header() {
  return (
    <header className="gradient-header text-primary-foreground py-4 px-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2.5 rounded-xl shrink-0">
            <Scissors className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-urdu font-bold truncate">
              ٹیلر ماسٹر
            </h1>
            <p className="text-primary-foreground/80 text-xs truncate">
              ناپ اور آرڈر مینجمنٹ
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
