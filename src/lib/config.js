// ÚNICO lugar donde se editan datos del producto y supuestos de mercado.
// [DATO PENDIENTE] = pendiente de validación por ICONO.
// Supuestos de mercado: ver docs/market-research.md (fuentes citadas).
export const CONFIG = {
  whatsapp: '529983410834',
  fxMxnUsd: 18.5, // revisar al lanzar
  delivery: { es: 'Enero 2027', en: 'January 2027' },
  presale: { discountPct: 0.06, label: { es: 'Preventa Friends & Family', en: 'Friends & Family presale' } },
  appreciationPct: 0.08, // fuente: SHF vía https://inmobiliare.com/quintana-roo-alza-vivienda-shf/ (QRoo 14.3% en 2025, 12.5% en 2024) — se usa 8%, conservador, cercano al promedio nacional
  costs: {
    maintenanceMonthly: 2500, // [DATO PENDIENTE] validar cuota real con ICONO — supuesto: edificio boutique nuevo con amenidades; referencia genérica Cancún ~$1,500/mes (neivor.com)
    adminPct: 0.25,           // [DATO PENDIENTE] administración de rentas típica full-service Riviera Maya 20-30% (awning.com, tributulum.com)
    propertyTaxAnnual: 5000,  // [DATO PENDIENTE] predial aprox Benito Juárez; se calcula sobre valor catastral, estimado alto/conservador (bbva.mx predial Cancún)
  },
  typologies: [
    {
      id: 'studio',
      priceFrom: 2100000,
      m2: 32, // ficha IG "1 Recámara": 31-34 m² — confirmar con ICONO que Estudios = esta unidad
      units: null, // [DATO PENDIENTE]
      name: { es: 'Estudios', en: 'Studios' },
      rental: {
        adr: 1100, // supuesto: ~$59 USD, debajo del ADR mediano de Cancún ($68 USD, airbtics.com); centro < Zona Hotelera
        occupancy: 0.55, // supuesto: debajo de la mediana 58% (airbtics.com); promedio AirDNA 47%
        monthlyRent: 12000, // supuesto: banda baja 1R/estudio amueblado centro $11.5k-18k (metroslibres.com, inmuebles24.com)
      },
    },
    {
      id: '2br',
      priceFrom: 4200000, // flyer F&F; ficha IG abr-2026 decía desde $3,525,400 — validar vigencia
      m2: 59, // ficha IG: 58-60 m², 2 baños completos
      units: null, // [DATO PENDIENTE]
      name: { es: '2 Recámaras', en: '2 Bedrooms' },
      rental: {
        adr: 1900, // supuesto: ~$103 USD, escalado por tamaño; promedio de mercado $130-160 USD incluye Zona Hotelera (airdna.co, airroi.com)
        occupancy: 0.52, // supuesto: unidades más grandes ocupan menos noches que estudios
        monthlyRent: 20000, // supuesto: punto medio-bajo de listados 2R Cancún Centro $14k-32.5k (inmuebles24.com)
      },
    },
    {
      id: '3br',
      priceFrom: 5000000, // flyer F&F; ficha IG abr-2026 decía desde $4,515,600 — validar vigencia
      m2: 76, // ficha IG: 76 m², 2 baños completos
      units: null, // [DATO PENDIENTE]
      name: { es: '3 Recámaras', en: '3 Bedrooms' },
      rental: {
        adr: 2500, // supuesto: ~$135 USD, tope conservador para centro; aún debajo del promedio regional con Zona Hotelera (airdna.co)
        occupancy: 0.5, // supuesto: unidades familiares grandes, menor rotación
        monthlyRent: 26000, // supuesto: muy por debajo de zonas premium (3R El Table ~$50k, inmuebles24.com)
      },
    },
  ],
};
