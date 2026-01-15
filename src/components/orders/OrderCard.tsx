import { Order } from '@/types/order';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  Phone,
  Banknote
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onStatusChange: (order: Order, status: 'pending' | 'completed') => void;
  onDelete: (order: Order) => void;
}

export function OrderCard({ order, onStatusChange, onDelete }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ur-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isPending = order.status === 'pending';
  const remainingAmount = (order.price || 0) - (order.advance_payment || 0);

  return (
    <Card className={cn(
      'elevated-card animate-fade-in transition-all duration-300',
      isPending ? 'border-r-4 border-r-pending' : 'border-r-4 border-r-success'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                className={cn(
                  'text-sm px-3 py-1',
                  isPending ? 'status-pending' : 'status-completed'
                )}
              >
                {isPending ? (
                  <>
                    <Clock className="w-3.5 h-3.5 ml-1" />
                    زیر التوا
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                    مکمل
                  </>
                )}
              </Badge>
              <span className="text-sm text-muted-foreground" dir="ltr">
                #{order.order_number}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <User className="w-5 h-5 text-primary" />
              {order.customer?.name || 'نامعلوم گاہک'}
            </div>
            
            {order.customer?.phone && (
              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span dir="ltr">{order.customer.phone}</span>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(order)}
            className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {order.description && (
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            {order.description}
          </p>
        )}

        {order.fabric_details && (
          <div className="text-sm">
            <span className="text-muted-foreground">کپڑا: </span>
            <span className="font-medium">{order.fabric_details}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm">
          {order.price && (
            <div className="flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-success" />
              <span className="text-muted-foreground">کل:</span>
              <span className="font-semibold" dir="ltr">
                {formatCurrency(order.price)}
              </span>
            </div>
          )}
          
          {order.advance_payment && order.advance_payment > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">پیشگی:</span>
              <span className="font-medium text-primary" dir="ltr">
                {formatCurrency(order.advance_payment)}
              </span>
            </div>
          )}

          {remainingAmount > 0 && order.price && (
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">باقی:</span>
              <span className="font-semibold text-destructive" dir="ltr">
                {formatCurrency(remainingAmount)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(order.created_at)}
            </span>
            
            {order.delivery_date && (
              <span className="flex items-center gap-1.5">
                <span>ڈلیوری:</span>
                <span className="font-medium text-foreground">
                  {formatDate(order.delivery_date)}
                </span>
              </span>
            )}
          </div>

          <Button
            variant={isPending ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(order, isPending ? 'completed' : 'pending')}
            className={cn(
              'transition-all',
              isPending 
                ? 'bg-success hover:bg-success/90 text-success-foreground'
                : ''
            )}
          >
            {isPending ? (
              <>
                <CheckCircle2 className="w-4 h-4 ml-1" />
                مکمل کریں
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 ml-1" />
                زیر التوا کریں
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
