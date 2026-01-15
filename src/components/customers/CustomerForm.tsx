import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Customer, CustomerFormData, measurementFields } from '@/types/customer';
import { Save, X, Ruler, Shirt } from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CustomerForm({ customer, onSubmit, onCancel, isLoading }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    phone: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone || '',
        qameez_length: customer.qameez_length ?? undefined,
        sleeve_length: customer.sleeve_length ?? undefined,
        chest: customer.chest ?? undefined,
        neck: customer.neck ?? undefined,
        waist: customer.waist ?? undefined,
        gher: customer.gher ?? undefined,
        collar_size: customer.collar_size ?? undefined,
        cuff_width: customer.cuff_width ?? undefined,
        placket_width: customer.placket_width ?? undefined,
        front_pocket: customer.front_pocket || '',
        side_pocket: customer.side_pocket || '',
        armhole: customer.armhole ?? undefined,
        elbow: customer.elbow ?? undefined,
        daman: customer.daman ?? undefined,
        bain: customer.bain ?? undefined,
        shalwar_length: customer.shalwar_length ?? undefined,
        paicha: customer.paicha ?? undefined,
        shalwar_pocket: customer.shalwar_pocket || '',
        shalwar_width: customer.shalwar_width ?? undefined,
        notes: customer.notes || '',
      });
    }
  }, [customer]);

  const handleChange = (key: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const qameezFields = measurementFields.filter(f => 
    !['shalwar_length', 'paicha', 'shalwar_pocket', 'shalwar_width'].includes(f.key)
  );
  
  const shalwarFields = measurementFields.filter(f => 
    ['shalwar_length', 'paicha', 'shalwar_pocket', 'shalwar_width'].includes(f.key)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Basic Info */}
      <Card className="elevated-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-urdu flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Ruler className="w-5 h-5 text-primary" />
            </div>
            بنیادی معلومات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                نام <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="گاہک کا نام"
                required
                className="text-lg h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-medium">
                فون نمبر
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="0300-0000000"
                className="text-lg h-12"
                dir="ltr"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Qameez Measurements */}
      <Card className="elevated-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-urdu flex items-center gap-2">
            <div className="bg-accent/20 p-2 rounded-lg">
              <Shirt className="w-5 h-5 text-accent" />
            </div>
            قمیص کے ناپ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {qameezFields.map((field) => (
              <div key={field.key} className="measurement-field">
                <Label htmlFor={field.key} className="text-sm font-medium text-muted-foreground block mb-2">
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  type={field.type}
                  value={(formData as any)[field.key] || ''}
                  onChange={(e) => 
                    handleChange(
                      field.key, 
                      field.type === 'number' 
                        ? parseFloat(e.target.value) || '' 
                        : e.target.value
                    )
                  }
                  placeholder={field.type === 'number' ? '0' : ''}
                  className="border-0 bg-transparent p-0 h-auto text-lg font-medium focus-visible:ring-0"
                  dir={field.type === 'number' ? 'ltr' : 'rtl'}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shalwar Measurements */}
      <Card className="elevated-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-urdu flex items-center gap-2">
            <div className="bg-secondary/20 p-2 rounded-lg">
              <Ruler className="w-5 h-5 text-secondary" />
            </div>
            شلوار کے ناپ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shalwarFields.map((field) => (
              <div key={field.key} className="measurement-field">
                <Label htmlFor={field.key} className="text-sm font-medium text-muted-foreground block mb-2">
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  type={field.type}
                  value={(formData as any)[field.key] || ''}
                  onChange={(e) => 
                    handleChange(
                      field.key, 
                      field.type === 'number' 
                        ? parseFloat(e.target.value) || '' 
                        : e.target.value
                    )
                  }
                  placeholder={field.type === 'number' ? '0' : ''}
                  className="border-0 bg-transparent p-0 h-auto text-lg font-medium focus-visible:ring-0"
                  dir={field.type === 'number' ? 'ltr' : 'rtl'}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="elevated-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-urdu">نوٹس</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="کوئی خاص ہدایات یا نوٹس..."
            className="min-h-[100px] text-base"
          />
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
          disabled={isLoading || !formData.name.trim()}
          className="h-12 px-8 bg-primary hover:bg-primary/90"
        >
          <Save className="w-5 h-5 ml-2" />
          {isLoading ? 'محفوظ ہو رہا ہے...' : 'محفوظ کریں'}
        </Button>
      </div>
    </form>
  );
}
