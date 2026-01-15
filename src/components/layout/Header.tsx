import { Scissors } from 'lucide-react';

export function Header() {
  return (
    <header className="gradient-header text-primary-foreground py-6 px-6 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-accent/20 p-3 rounded-xl">
            <Scissors className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-urdu font-bold">
              ٹیلر ماسٹر
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              ناپ اور آرڈر مینجمنٹ
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
