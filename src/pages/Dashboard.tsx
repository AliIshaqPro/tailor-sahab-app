import { useCustomers } from '@/hooks/useCustomers';
import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  Plus,
  TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: customers } = useCustomers();
  const { data: allOrders } = useOrders();
  const { data: pendingOrders } = useOrders('pending');
  const { data: completedOrders } = useOrders('completed');

  const stats = [
    {
      title: 'کل گاہک',
      value: customers?.length || 0,
      icon: Users,
      color: 'bg-primary/10 text-primary',
      onClick: () => navigate('/customers'),
    },
    {
      title: 'کل آرڈرز',
      value: allOrders?.length || 0,
      icon: ClipboardList,
      color: 'bg-accent/20 text-accent',
      onClick: () => navigate('/orders'),
    },
    {
      title: 'زیر التوا',
      value: pendingOrders?.length || 0,
      icon: Clock,
      color: 'bg-pending/10 text-pending',
      onClick: () => navigate('/orders?status=pending'),
    },
    {
      title: 'مکمل آرڈرز',
      value: completedOrders?.length || 0,
      icon: CheckCircle2,
      color: 'bg-success/10 text-success',
      onClick: () => navigate('/orders?status=completed'),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h1 className="text-3xl md:text-4xl font-urdu font-bold text-foreground mb-2">
          خوش آمدید
        </h1>
        <p className="text-lg text-muted-foreground">
          آج کا دن مبارک ہو! اپنے کاروبار کا جائزہ لیں۔
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="elevated-card cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            onClick={stat.onClick}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className={`p-4 rounded-2xl mb-4 ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-1" dir="ltr">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.title}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="elevated-card">
        <CardHeader>
          <CardTitle className="text-xl font-urdu flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            فوری کارروائی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/customers/new')}
              className="h-16 text-lg bg-primary hover:bg-primary/90"
            >
              <Plus className="w-6 h-6 ml-2" />
              نیا گاہک شامل کریں
            </Button>
            <Button
              onClick={() => navigate('/orders/new')}
              variant="outline"
              className="h-16 text-lg border-2 border-primary text-primary hover:bg-primary/5"
            >
              <Plus className="w-6 h-6 ml-2" />
              نیا آرڈر بنائیں
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Pending Orders */}
      {pendingOrders && pendingOrders.length > 0 && (
        <Card className="elevated-card">
          <CardHeader>
            <CardTitle className="text-xl font-urdu flex items-center gap-2">
              <Clock className="w-6 h-6 text-pending" />
              حالیہ زیر التوا آرڈرز
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => navigate('/orders')}
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {order.customer?.name || 'نامعلوم گاہک'}
                    </p>
                    <p className="text-sm text-muted-foreground" dir="ltr">
                      #{order.order_number}
                    </p>
                  </div>
                  {order.delivery_date && (
                    <div className="text-sm text-muted-foreground">
                      ڈلیوری: {new Date(order.delivery_date).toLocaleDateString('ur-PK')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
