-- Esquema PostgreSQL / Supabase para Carpintería de Aluminio & Vidriería
CREATE TABLE aluminum_series (
  id VARCHAR(30) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price_per_linear_meter_ars NUMERIC(12,2) NOT NULL,
  max_height_cm INT NOT NULL,
  acoustic_db INT NOT NULL
);

CREATE TABLE glass_types (
  id VARCHAR(30) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  price_per_m2_ars NUMERIC(12,2) NOT NULL,
  u_value NUMERIC(4,2) NOT NULL
);

CREATE TABLE quotes_pliego (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(120),
  items JSONB NOT NULL,
  total_ars NUMERIC(14,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
