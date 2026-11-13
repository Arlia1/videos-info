-- Esquema PostgreSQL / Supabase para Distribuidora Mayorista B2B
CREATE TABLE wholesale_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(25) UNIQUE NOT NULL,
  name VARCHAR(160) NOT NULL,
  brand VARCHAR(60) NOT NULL,
  category VARCHAR(60) NOT NULL,
  units_per_pack INT NOT NULL,
  pack_weight_kg NUMERIC(6,2) NOT NULL,
  base_pack_price_ars NUMERIC(12,2) NOT NULL,
  stock_packs INT DEFAULT 100
);

CREATE TABLE b2b_remitos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  remito_number VARCHAR(30) UNIQUE NOT NULL,
  client_cuit VARCHAR(20) NOT NULL,
  delivery_zone VARCHAR(60) NOT NULL,
  total_weight_kg NUMERIC(8,2) NOT NULL,
  total_ars NUMERIC(14,2) NOT NULL,
  status VARCHAR(40) DEFAULT 'En Picking Depósito',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
