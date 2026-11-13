-- Esquema Supabase / PostgreSQL para Inmobiliaria Boutique
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(180) NOT NULL,
  operation VARCHAR(20) NOT NULL CHECK (operation IN ('Venta', 'Alquiler', 'Pozo')),
  type VARCHAR(40) NOT NULL,
  zone VARCHAR(80) NOT NULL,
  address VARCHAR(180) NOT NULL,
  price NUMERIC(14,2) NOT NULL,
  currency VARCHAR(5) DEFAULT 'USD',
  expenses_ars NUMERIC(12,2) DEFAULT 0,
  total_m2 INT NOT NULL,
  covered_m2 INT NOT NULL,
  rooms INT NOT NULL,
  bathrooms INT NOT NULL,
  garage BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  status VARCHAR(25) DEFAULT 'Disponible',
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE appraisals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  zone VARCHAR(80) NOT NULL,
  property_type VARCHAR(50) NOT NULL,
  estimated_m2 INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public properties view" ON properties FOR SELECT USING (true);
