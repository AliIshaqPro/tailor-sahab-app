import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderFormData } from '@/types/order';
import { toast } from 'sonner';

export function useOrders(status?: 'pending' | 'completed') {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: async (): Promise<Order[]> => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          customer:customers(id, name, phone)
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Order[];
    },
    staleTime: 1000 * 60,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async (): Promise<Order | null> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(id, name, phone)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Order | null;
    },
    enabled: !!id,
  });
}

async function generateOrderNumber(): Promise<string> {
  const today = new Date();
  const datePrefix = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .like('order_number', `${datePrefix}%`);

  if (error) throw error;

  const orderNum = (count || 0) + 1;
  return `${datePrefix}-${String(orderNum).padStart(3, '0')}`;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OrderFormData): Promise<Order> => {
      const orderNumber = await generateOrderNumber();
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          ...data,
          order_number: orderNumber,
          status: 'pending',
        })
        .select(`
          *,
          customer:customers(id, name, phone)
        `)
        .single();

      if (error) throw error;
      return order as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('آرڈر کامیابی سے بن گیا');
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      toast.error('آرڈر بنانے میں مسئلہ ہوا');
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'completed' }): Promise<Order> => {
      const { data: order, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select(`
          *,
          customer:customers(id, name, phone)
        `)
        .single();

      if (error) throw error;
      return order as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      const message = 'آرڈر کی حیثیت تبدیل ہو گئی';
      toast.success(message);
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
      toast.error('حیثیت تبدیل کرنے میں مسئلہ ہوا');
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('آرڈر کامیابی سے حذف ہو گیا');
    },
    onError: (error) => {
      console.error('Error deleting order:', error);
      toast.error('آرڈر حذف کرنے میں مسئلہ ہوا');
    },
  });
}
