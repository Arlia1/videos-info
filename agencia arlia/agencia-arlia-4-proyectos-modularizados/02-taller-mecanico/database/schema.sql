-- Esquema Supabase / PostgreSQL para Taller Mecánico & Diagnóstico
CREATE TABLE services_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  labor_hours NUMERIC(5,2) NOT NULL,
  base_parts_ars NUMERIC(12,2) NOT NULL
);

CREATE TABLE workshop_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate VARCHAR(15) NOT NULL,
  vehicle_model VARCHAR(120) NOT NULL,
  segment VARCHAR(40) NOT NULL,
  part_tier VARCHAR(30) NOT NULL,
  bay_number INT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time VARCHAR(10) NOT NULL,
  total_ars NUMERIC(14,2) NOT NULL,
  status VARCHAR(40) DEFAULT 'Recepcionado',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
