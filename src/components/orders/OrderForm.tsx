import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CustomerSearch } from '@/components/customers/CustomerSearch';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { useCustomers, useCreateCustomer } from '@/hooks/useCustomers';
import { Customer, CustomerFormData } from '@/types/customer';
import { OrderFormData } from '@/types/order';
import { Save, X, Plus, User, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function OrderForm({ onSubmit, onCancel, isLoading }: OrderFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [formData, setFormData] = useState<Omit<OrderFormData, 'customer_id'>>({
    description: '',
    fabric_details: '',
    price: undefined,
    advance_payment: undefined,
    delivery_date: '',
  });

  const { data: customers, isLoading: customersLoading } = useCustomers(searchQuery);
  const createCustomer = useCreateCustomer();

  const handleChange = (key: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCustomerCreate = async (data: CustomerFormData) => {
    try {
      const newCustomer = await createCustomer.mutateAsync(data);
      setSelectedCustomer(newCustomer);
      setShowNewCustomerForm(false);
      setSearchQuery('');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    
    onSubmit({
      customer_id: selectedCustomer.id,
      ...formData,
    });
  };

  if (showNewCustomerForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewCustomerForm(false)}
          >
            <X className="w-4 h-4 ml-1" />
            واپس
          </Button>
          <span>نیا گاہک شامل کریں</span>
        </div>
        <CustomerForm
          onSubmit={handleCustomerCreate}
          onCancel={() => setShowNewCustomerForm(false)}
          isLoading={createCustomer.isPending}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Customer Selection */}
      <Card className="elevated-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-urdu flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
            گاہک منتخب کریں
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedCustomer ? (
            <div className="flex items-center justify-between p-4 bg-success/10 border border-success/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-success/20 p-2 rounded-full">
                  <Check className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedCustomer.name}</p>
                  {selectedCustomer.phone && (
                    <p className="text-sm text-muted-foreground" dir="ltr">
                      {selectedCustomer.phone}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedCustomer(null)}
              >
                تبدیل کریں
              </Button>
            </div>
          ) : (
            <>
              <CustomerSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="نام یا فون سے تلاش کریں..."
              />
              
              {searchQuery && (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {customersLoading ? (
                    <p className="text-center text-muted-foreground py-4">
                      تلاش ہو رہی ہے...
                    </p>
                  ) : customers && customers.length > 0 ? (
                    customers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setSearchQuery('');
                        }}
                        className={cn(
                          'w-full text-right p-4 rounded-lg border transition-all',
                          'hover:bg-primary/5 hover:border-primary/30',
                          'focus:outline-none focus:ring-2 focus:ring-primary/20'
                        )}
                      >
                        <p className="font-medium">{customer.name}</p>
                        {customer.phone && (
                          <p className="text-sm text-muted-foreground" dir="ltr">
                            {customer.phone}
                          </p>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-3">کوئی گاہک نہیں ملا</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewCustomerForm(true)}
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        نیا گاہک شامل کریں
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {!searchQuery && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => setShowNewCustomerForm(true)}
                >
                  <Plus className="w-5 h-5 ml-2" />
                  نیا گاہک شامل کریں
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card className="elevated-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-urdu">آرڈر کی تفصیلات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              تفصیل
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="آرڈر کی تفصیل..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fabric_details" className="text-base font-medium">
              کپڑے کی تفصیل
            </Label>
            <Input
              id="fabric_details"
              value={formData.fabric_details}
              onChange={(e) => handleChange('fabric_details', e.target.value)}
              placeholder="کپڑے کی قسم، رنگ وغیرہ"
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-base font-medium">
                کل رقم (روپے)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || '')}
                placeholder="0"
                className="h-12"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advance_payment" className="text-base font-medium">
                پیشگی رقم (روپے)
              </Label>
              <Input
                id="advance_payment"
                type="number"
                value={formData.advance_payment || ''}
                onChange={(e) => handleChange('advance_payment', parseFloat(e.target.value) || '')}
                placeholder="0"
                className="h-12"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_date" className="text-base font-medium">
              ڈلیوری کی تاریخ
            </Label>
            <Input
              id="delivery_date"
              type="date"
              value={formData.delivery_date}
              onChange={(e) => handleChange('delivery_date', e.target.value)}
              className="h-12"
              dir="ltr"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="flex items-center gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-12 px-6"
        >
          <X className="w-5 h-5 ml-2" />
          منسوخ
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !selectedCustomer}
          className="h-12 px-8 bg-primary hover:bg-primary/90"
        >
          <Save className="w-5 h-5 ml-2" />
          {isLoading ? 'محفوظ ہو رہا ہے...' : 'آرڈر بنائیں'}
        </Button>
      </div>
    </form>
  );
}
