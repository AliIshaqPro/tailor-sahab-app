import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BackupData {
  version: string;
  created_at: string;
  customers: any[];
  orders: any[];
}

export function useRestore() {
  const restoreBackup = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);

      // Validate backup structure
      if (!backupData.customers || !backupData.orders) {
        throw new Error('Invalid backup format');
      }

      // Delete existing data first
      const { error: deleteOrdersError } = await supabase
        .from('orders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteOrdersError) throw deleteOrdersError;

      const { error: deleteCustomersError } = await supabase
        .from('customers')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteCustomersError) throw deleteCustomersError;

      // Restore customers
      if (backupData.customers.length > 0) {
        const { error: customersError } = await supabase
          .from('customers')
          .insert(backupData.customers);

        if (customersError) throw customersError;
      }

      // Restore orders
      if (backupData.orders.length > 0) {
        const { error: ordersError } = await supabase
          .from('orders')
          .insert(backupData.orders);

        if (ordersError) throw ordersError;
      }

      toast.success(`ڈیٹا واپس آ گیا - ${backupData.customers.length} گاہک، ${backupData.orders.length} آرڈرز`);
      return true;
    } catch (error) {
      console.error('Restore error:', error);
      toast.error('ڈیٹا واپس لانے میں مسئلہ ہوا');
      return false;
    }
  };

  return { restoreBackup };
}
