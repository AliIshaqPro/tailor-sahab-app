import { Customer, measurementFields } from '@/types/customer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Phone, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ur-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getMeasurementValue = (key: string) => {
    const value = (customer as any)[key];
    return value !== null && value !== undefined ? value : '-';
  };

  return (
    <Card className="elevated-card animate-fade-in hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-urdu font-semibold text-foreground truncate">
              {customer.name}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-muted-foreground">
              {customer.phone && (
                <span className="flex items-center gap-1.5 text-sm">
                  <Phone className="w-4 h-4" />
                  <span dir="ltr">{customer.phone}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm">
                <Calendar className="w-4 h-4" />
                {formatDate(customer.created_at)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(customer)}
              className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(customer)}
              className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Quick measurements preview */}
        <div className="flex flex-wrap gap-2 mb-3">
          {customer.qameez_length && (
            <Badge variant="secondary" className="font-normal">
              قمیص: {customer.qameez_length}
            </Badge>
          )}
          {customer.chest && (
            <Badge variant="secondary" className="font-normal">
              چھاتی: {customer.chest}
            </Badge>
          )}
          {customer.shalwar_length && (
            <Badge variant="secondary" className="font-normal">
              شلوار: {customer.shalwar_length}
            </Badge>
          )}
        </div>

        {/* Expand button */}
        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="w-full h-auto py-2 text-muted-foreground hover:text-foreground"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 ml-2" />
              تفصیلات چھپائیں
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 ml-2" />
              تفصیلات دکھائیں
            </>
          )}
        </Button>

        {/* Expanded measurements */}
        <div className={cn(
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-hidden transition-all duration-300',
          expanded ? 'max-h-[1000px] mt-4 opacity-100' : 'max-h-0 opacity-0'
        )}>
          {measurementFields.map((field) => (
            <div key={field.key} className="bg-muted/50 rounded-lg p-3">
              <span className="text-xs text-muted-foreground block mb-1">
                {field.label}
              </span>
              <span className="font-medium text-foreground">
                {getMeasurementValue(field.key)}
              </span>
            </div>
          ))}
        </div>

        {customer.notes && expanded && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground block mb-1">نوٹس</span>
            <p className="text-sm text-foreground">{customer.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
