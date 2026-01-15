import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from '@/hooks/useOrders';
import { OrderCard } from '@/components/orders/OrderCard';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/types/order';
import { Plus, ClipboardList, Clock, CheckCircle2 } from 'lucide-react';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') as 'pending' | 'completed' | null;
  const [activeTab, setActiveTab] = useState<string>(initialStatus || 'all');
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  
  const { data: allOrders, isLoading: allLoading } = useOrders();
  const { data: pendingOrders, isLoading: pendingLoading } = useOrders('pending');
  const { data: completedOrders, isLoading: completedLoading } = useOrders('completed');
  
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', value);
    }
    setSearchParams(searchParams);
  };

  const handleStatusChange = async (order: Order, status: 'pending' | 'completed') => {
    await updateStatus.mutateAsync({ id: order.id, status });
  };

  const handleDelete = (order: Order) => {
    setOrderToDelete(order);
  };

  const confirmDelete = async () => {
    if (orderToDelete) {
      await deleteOrder.mutateAsync(orderToDelete.id);
      setOrderToDelete(null);
    }
  };

  const getOrders = () => {
    switch (activeTab) {
      case 'pending':
        return { orders: pendingOrders, isLoading: pendingLoading };
      case 'completed':
        return { orders: completedOrders, isLoading: completedLoading };
      default:
        return { orders: allOrders, isLoading: allLoading };
    }
  };

  const { orders, isLoading } = getOrders();

  const renderOrdersList = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!orders || orders.length === 0) {
      return (
        <EmptyState
          icon={<ClipboardList className="w-12 h-12 text-muted-foreground" />}
          title={activeTab === 'all' ? 'ابھی کوئی آرڈر نہیں' : `کوئی ${activeTab === 'pending' ? 'زیر التوا' : 'مکمل'} آرڈر نہیں`}
          description="نیا آرڈر بنائیں"
          action={
            <Button
              onClick={() => navigate('/orders/new')}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-5 h-5 ml-2" />
              نیا آرڈر بنائیں
            </Button>
          }
        />
      );
    }

    return (
      <div className="grid gap-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-urdu font-bold text-foreground">
            آرڈرز
          </h1>
          <p className="text-muted-foreground mt-1">
            {allOrders?.length || 0} آرڈرز
          </p>
        </div>
        <Button
          onClick={() => navigate('/orders/new')}
          className="h-12 px-6 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 ml-2" />
          نیا آرڈر
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14">
          <TabsTrigger value="all" className="text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ClipboardList className="w-4 h-4 ml-2" />
            سب ({allOrders?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-base data-[state=active]:bg-pending data-[state=active]:text-pending-foreground">
            <Clock className="w-4 h-4 ml-2" />
            زیر التوا ({pendingOrders?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-base data-[state=active]:bg-success data-[state=active]:text-success-foreground">
            <CheckCircle2 className="w-4 h-4 ml-2" />
            مکمل ({completedOrders?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderOrdersList()}
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          {renderOrdersList()}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {renderOrdersList()}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!orderToDelete}
        onOpenChange={(open) => !open && setOrderToDelete(null)}
        onConfirm={confirmDelete}
        title="آرڈر حذف کریں"
        description={`کیا آپ واقعی آرڈر #${orderToDelete?.order_number} کو حذف کرنا چاہتے ہیں؟`}
      />
    </div>
  );
}
