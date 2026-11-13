# Agencia Arlia — Suite de 4 Verticales B2B & B2C Modularizados

Este paquete contiene los **4 proyectos completos**, desacoplados del archivo único del previsualizador y estructurados siguiendo buenas prácticas de ingeniería de software (componentes aislados, custom hooks, servicios de WhatsApp, catálogos de datos y esquemas SQL con Row-Level Security para Supabase/PostgreSQL).

---

## Estructura de Carpetas del Paquete

```text
agencia_arlia_verticales/
├── 01-inmobiliaria-boutique/          # Real Estate de Alta Gama + Simulador Hipotecario + CRUD
├── 02-taller-mecanico/                # Cotizador por Segmento/Repuesto + Agenda de Boxes
├── 03-aberturas-vidrieria-cad/        # Configurador Paramétrico CAD SVG en vivo + Pliego de Obra
└── 04-distribuidora-mayorista-b2b/    # Terminal Mayorista B2B + Escalas + Comandera 58mm + Inflación
```

Cada proyecto incluye su propio entorno **Vite + React 18 + Tailwind CSS**:
- `src/components/`: Vistas y modales desacoplados por responsabilidad.
- `src/hooks/`: Lógica financiera, cálculo de escalas mayoristas, cotización mecánica y persistencia `localStorage`.
- `src/services/whatsapp.service.js`: Formateadores limpios de enlaces `wa.me` listos para despacho directo.
- `src/data/`: Datos semilla realistas adaptados al mercado local (Zona Sur / GBA).
- `database/schema.sql`: Tablas listas para pegar en el SQL Editor de **Supabase**.

---

## Cómo correr cualquiera de los proyectos localmente

1. Entrá a la subcarpeta del vertical que quieras levantar:
   ```bash
   cd 01-inmobiliaria-boutique
   # o cd 02-taller-mecanico
   # o cd 03-aberturas-vidrieria-cad
   # o cd 04-distribuidora-mayorista-b2b
   ```
2. Instalá las dependencias:
   ```bash
   npm install
   ```
3. Levantá el servidor de desarrollo (abre automáticamente en `http://localhost:3000`):
   ```bash
   npm run dev
   ```
