import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomerSearch({ value, onChange, placeholder = 'گاہک تلاش کریں...' }: CustomerSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10 pl-10 h-12 text-base bg-card"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange('')}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
