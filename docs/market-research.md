# Investigación de mercado — supuestos del simulador de inversión

**Proyecto:** ELEMENT by ICONO (28 departamentos boutique, Cancún Centro SM 22, a 1 cuadra de Av. Náder). Entrega: enero 2027.
**Fecha de investigación:** 2026-07-17.
**Uso:** estos valores alimentan `src/lib/config.js` (calculadora de inversión pública, con disclaimer). Todos son **supuestos de mercado editables** — el cliente (ICONO) NO ha proporcionado cifras propias de renta/plusvalía. Los valores marcados `[DATO PENDIENTE]` deben validarse con ICONO antes de comunicar como cifras del desarrollo.

Criterio general: **conservador y defendible**. Cuando las fuentes divergen, se toma el valor bajo/medio del rango, no el optimista.

---

## 1. Renta vacacional (Airbnb) — ADR y ocupación

| Dato | Valor usado | Fuente | Nota |
|---|---|---|---|
| Ocupación anual promedio Cancún | **0.55 (estudio), 0.52 (2R), 0.50 (3R)** | [Airbtics — Cancún revenue](https://airbtics.com/annual-airbnb-revenue-in-cancun-mexico/) (nov 2024–oct 2025: mediana 58%, 212 noches/año); [AirDNA MarketMinder Cancún](https://www.airdna.co/vacation-rental-data/app/mx/quintana-roo/cancun/overview) (47% promedio); [AirROI Cancún 2026](https://www.airroi.com/airbnb-data/mexico/quintana-roo/canc%C3%BAn) (36.1% promedio jun 2025–may 2026) | Las fuentes divergen (36–58%) porque miden universos distintos (mediana vs. promedio, ciudad vs. región). Se usa 50–55%, debajo de la mediana de Airbtics. Unidades grandes suelen ocupar menos noches → 3R < 2R < estudio. |
| ADR (tarifa diaria promedio) | **$1,100 MXN (estudio), $1,900 (2R), $2,500 (3R)** ≈ $59 / $103 / $135 USD | [Airbtics](https://airbtics.com/annual-airbnb-revenue-in-cancun-mexico/) (ADR mediano $68 USD); [AirDNA](https://www.airdna.co/vacation-rental-data/app/mx/quintana-roo/cancun/overview) ($160 USD promedio, incluye Zona Hotelera); [AirROI](https://www.airroi.com/airbnb-data/mexico/quintana-roo/canc%C3%BA n) ($130 USD promedio) | El promedio de mercado ($130–160 USD) está inflado por la Zona Hotelera y unidades de lujo frente al mar. Para **centro** (SM 22) se usa la banda baja: estudio cerca del ADR mediano ciudad ($68 USD ≈ $1,258 MXN → se redondea abajo a $1,100), y escalado por tamaño para 2R/3R. |

Ingreso bruto Airbnb implícito (sanity check): estudio ≈ $221k MXN/año (10.5% bruto sobre $2.1M), 2R ≈ $361k (8.6% sobre $4.2M), 3R ≈ $456k (9.1% sobre $5.0M). Rangos dentro de lo reportado para la zona antes de gastos.

## 2. Plusvalía (apreciación anual)

| Dato | Valor usado | Fuente | Nota |
|---|---|---|---|
| Apreciación anual proyectada | **8% anual (0.08)** | [El Financiero — QRoo lidera plusvalía](https://www.elfinanciero.com.mx/opinion/de-jefes/2024/07/09/quintana-roo-y-baja-california-lideran-plusvalia/) (12.5% anualizado 2024, 2° nacional; Benito Juárez 13%); [Inmobiliare — SHF QRoo](https://inmobiliare.com/quintana-roo-alza-vivienda-shf/) (14.3% estatal 2025 vs 8.7% nacional); [La Jornada Maya — Colegio de Valuadores QRoo](https://www.lajornadamaya.mx/quintanaroo/227982/quintana-roo-preven-incremento-de-hasta-20-por-ciento-en-plusvalia-inmobiliaria-cancun-colegio-de-valuadores) (previsión hasta 20% en zonas puntuales) | Q. Roo registró 12.5–14.3% anual en 2024–2025 (índice SHF). Se usa **8%** — debajo de ambas cifras estatales y cercano al promedio nacional — porque proyectar hacia adelante el pico histórico no es defendible en un simulador público. Editable si ICONO quiere otro escenario. |

## 3. Renta de largo plazo (mensual, centro)

| Dato | Valor usado | Fuente | Nota |
|---|---|---|---|
| Estudio / 1R amueblado centro | **$12,000 MXN/mes** | [MetrosLibres — rentar en Cancún](https://metroslibres.com/blog/rentar-departamento-cancun-2026) (1R amueblado zona intermedia: $12–18k; estudios ~$11.5k); [Inmuebles24 1R Cancún](https://www.inmuebles24.com/departamentos-en-renta-en-cancun-con-1-recamara.html) | Banda baja del rango para amueblado nuevo. |
| 2 recámaras centro | **$20,000 MXN/mes** | [Inmuebles24 — 2R Cancún Centro](https://www.inmuebles24.com/departamentos-en-renta-en-cancun-centro-zona-de-cancun-con-2-recamaras.html) (listados observados $14,000–$32,500) | Punto medio-bajo del rango observado para edificio nuevo con amenidades. |
| 3 recámaras centro | **$26,000 MXN/mes** | [Inmuebles24 — 3R Benito Juárez](https://www.inmuebles24.com/departamentos-en-renta-en-cancun-ciudad-de-benito-juarez-con-3-recamaras.html) (referencias hasta $50k en zonas premium como El Table) | Muy por debajo de zonas premium; conservador para centro. |

Rendimiento bruto largo plazo implícito: 6.9% / 5.7% / 6.2% — consistente con mercados urbanos mexicanos.

## 4. Costos de operación

| Dato | Valor usado | Fuente | Nota |
|---|---|---|---|
| Cuota de mantenimiento (HOA) | **$2,500 MXN/mes** `[DATO PENDIENTE]` | [Neivor — cuotas de mantenimiento](https://www.neivor.com/blogs/como-calcular-el-costo-de-la-cuota-de-mantenimiento/) (ejemplos Cancún ~$1,500/mes) | Edificio boutique nuevo con amenidades suele estar arriba del ejemplo genérico; se usa $2,500 (asumir costo alto = conservador). **Validar cuota real con ICONO.** |
| Administración de rentas vacacionales | **25% del ingreso bruto (0.25)** `[DATO PENDIENTE]` | [Awning — Airbnb management fees](https://awning.com/post/airbnb-management-fees) (full-service 25–40%); [Tribu Tulum — ROI y administración](https://www.tributulum.com/en/guia/guias-practicas/airbnb-and-vacation-rentals-in-tulum-roi-and-management) (Riviera Maya 15–25%); [The Agency Riviera Maya](https://theagencyrerivieramaya.com/blog-make-passive-income-property-manager-tulum.html) (20–30%) | 25% es el punto típico full-service en la Riviera Maya. Confirmar si ICONO ofrecerá operador propio con otra comisión. |
| Predial anual (Benito Juárez) | **$5,000 MXN/año** `[DATO PENDIENTE]` | [BBVA — predial Cancún](https://www.bbva.mx/educacion-financiera/impuestos/impuesto-predial-cancun.html); [Ley de Hacienda Municipio Benito Juárez](https://documentos.congresoqroo.gob.mx/leyes/L139-XVIII-20250110-L1820251210088.pdf) | El predial se calcula sobre valor catastral (típicamente muy por debajo del comercial); para estas bandas de precio el orden de magnitud es pocos miles de pesos al año. $5,000 es estimado alto/conservador. Validar con avalúo catastral real. |

## 5. Otros parámetros

| Dato | Valor usado | Nota |
|---|---|---|
| Tipo de cambio MXN/USD | 18.5 | Solo referencia de display; revisar al lanzar. |
| Descuento preventa Friends & Family | 6% | Dato del flyer del cliente (no es supuesto de mercado). |
| Precios desde (estudio $2.1M, 2R $4.2M, 3R $5.0M) | — | Datos del flyer del cliente. |

---

**Cómo editar:** todos los valores viven en `src/lib/config.js` con comentarios `// fuente:` o `// supuesto:`. Cambiar ahí y correr `npm test` para validar rangos.
