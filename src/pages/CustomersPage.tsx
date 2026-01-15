import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers, useDeleteCustomer } from '@/hooks/useCustomers';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { CustomerSearch } from '@/components/customers/CustomerSearch';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types/customer';
import { Plus, Users } from 'lucide-react';

export default function CustomersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  
  const { data: customers, isLoading, error } = useCustomers(searchQuery);
  const deleteCustomer = useDeleteCustomer();

  const handleEdit = (customer: Customer) => {
    navigate(`/customers/${customer.id}/edit`);
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      await deleteCustomer.mutateAsync(customerToDelete.id);
      setCustomerToDelete(null);
    }
  };

  if (error) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-destructive" />}
        title="مسئلہ پیش آیا"
        description="گاہکوں کی فہرست لوڈ کرنے میں مسئلہ ہوا۔ براہ کرم دوبارہ کوشش کریں۔"
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-urdu font-bold text-foreground">
            گاہک
          </h1>
          <p className="text-muted-foreground mt-1">
            {customers?.length || 0} گاہک رجسٹرڈ ہیں
          </p>
        </div>
        <Button
          onClick={() => navigate('/customers/new')}
          className="h-12 px-6 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 ml-2" />
          نیا گاہک
        </Button>
      </div>

      {/* Search */}
      <CustomerSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="نام یا فون سے تلاش کریں..."
      />

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner />
      ) : customers && customers.length > 0 ? (
        <div className="grid gap-4">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : searchQuery ? (
        <EmptyState
          icon={<Users className="w-12 h-12 text-muted-foreground" />}
          title="کوئی گاہک نہیں ملا"
          description={`"${searchQuery}" سے کوئی گاہک نہیں ملا`}
        />
      ) : (
        <EmptyState
          icon={<Users className="w-12 h-12 text-muted-foreground" />}
          title="ابھی کوئی گاہک نہیں"
          description="اپنا پہلا گاہک شامل کریں"
          action={
            <Button
              onClick={() => navigate('/customers/new')}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-5 h-5 ml-2" />
              نیا گاہک شامل کریں
            </Button>
          }
        />
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!customerToDelete}
        onOpenChange={(open) => !open && setCustomerToDelete(null)}
        onConfirm={confirmDelete}
        title="گاہک حذف کریں"
        description={`کیا آپ واقعی "${customerToDelete?.name}" کو حذف کرنا چاہتے ہیں؟ اس کے تمام آرڈرز بھی حذف ہو جائیں گے۔`}
      />
    </div>
  );
}
