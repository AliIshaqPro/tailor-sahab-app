import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer, CustomerFormData } from '@/types/customer';
import { toast } from 'sonner';

export function useCustomers(searchQuery: string = '') {
  return useQuery({
    queryKey: ['customers', searchQuery],
    queryFn: async (): Promise<Customer[]> => {
      let query = supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Customer[];
    },
    staleTime: 1000 * 60,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async (): Promise<Customer | null> => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Customer | null;
    },
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CustomerFormData): Promise<Customer> => {
      const { data: customer, error } = await supabase
        .from('customers')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return customer as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('گاہک کامیابی سے شامل ہو گیا');
    },
    onError: (error) => {
      console.error('Error creating customer:', error);
      toast.error('گاہک شامل کرنے میں مسئلہ ہوا');
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CustomerFormData> }): Promise<Customer> => {
      const { data: customer, error } = await supabase
        .from('customers')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return customer as Customer;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
      toast.success('گاہک کی معلومات اپڈیٹ ہو گئیں');
    },
    onError: (error) => {
      console.error('Error updating customer:', error);
      toast.error('معلومات اپڈیٹ کرنے میں مسئلہ ہوا');
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('گاہک کامیابی سے حذف ہو گیا');
    },
    onError: (error) => {
      console.error('Error deleting customer:', error);
      toast.error('گاہک حذف کرنے میں مسئلہ ہوا');
    },
  });
}
