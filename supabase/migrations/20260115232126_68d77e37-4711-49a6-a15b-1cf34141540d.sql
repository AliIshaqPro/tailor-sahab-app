-- Create customers table with all measurement fields
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  -- Qameez measurements
  qameez_length DECIMAL(6,2), -- لمبائی قمیص
  sleeve_length DECIMAL(6,2), -- بازو
  chest DECIMAL(6,2), -- تیرا / چھاتی
  neck DECIMAL(6,2), -- گلا
  waist DECIMAL(6,2), -- کمر
  gher DECIMAL(6,2), -- گھیر
  collar_size DECIMAL(6,2), -- کالر گز
  cuff_width DECIMAL(6,2), -- کف چوڑائی
  placket_width DECIMAL(6,2), -- پٹی چوڑائی
  front_pocket TEXT, -- سامنے پاکٹ (yes/no/style)
  side_pocket TEXT, -- سائیڈ پاکٹ
  armhole DECIMAL(6,2), -- آرمول
  elbow DECIMAL(6,2), -- کہنی
  daman DECIMAL(6,2), -- دامن
  bain DECIMAL(6,2), -- بائن
  -- Shalwar measurements
  shalwar_length DECIMAL(6,2), -- شلوار لمبائی
  paicha DECIMAL(6,2), -- پائچہ
  shalwar_pocket TEXT, -- شلوار پاکٹ
  shalwar_width DECIMAL(6,2), -- شلوار چوڑائی
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  description TEXT,
  fabric_details TEXT,
  price DECIMAL(10,2),
  advance_payment DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  delivery_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for fast searching
CREATE INDEX idx_customers_name ON public.customers USING gin(to_tsvector('simple', name));
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_customers_created_at ON public.customers(created_at DESC);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);

-- Enable RLS (public access for this single-user app)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public access (this is a single-user local business app)
CREATE POLICY "Allow public access to customers" 
ON public.customers FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public access to orders" 
ON public.orders FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();