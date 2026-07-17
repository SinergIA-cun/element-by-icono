# ELEMENT by ICONO — Rediseño del sitio para leads calificados

**Fecha**: 2026-07-16
**Cliente**: ICONO (desarrollo ELEMENT, Cancún) — cuenta Wix "ESPACIOS PLANIFICADOS"
**Sitio actual**: https://www.elementbyicono.com/ (Wix Editor clásico, Premium, Velo habilitado, site ID `0264ad46-3eb7-4aca-b218-b046e735321f`)
**Objetivo**: convertir el one-pager genérico actual en un sitio de conversión que genere leads calificados de inversionistas, con una calculadora de inversión como pieza central.

## Contexto y diagnóstico

- El producto: desarrollo boutique de 28 departamentos estilo moderno/urbano/industrial en el centro de Cancún, desde ~$1,900,000 MXN. Desarrollador con 10+ años de trayectoria (proyecto previo: iconotowers.com, misma cuenta Wix).
- El sitio actual es plantilla Wix genérica: sin datos de inversión, dos formularios idénticos sin calificación, typo en el precio del hero ("$1,900,00.00"), sin calculadora, sin brochure, sin avance de obra.
- Material visual bueno disponible en Instagram público: https://www.instagram.com/elementbyicono/ (fotos y videos; se descargará lo público, el cliente puede complementar).

## Decisiones tomadas (con el usuario)

1. **Plataforma**: se mantiene Wix como cascarón (dominio, hosting, panel). El sitio nuevo es **código custom montado a pantalla completa** dentro del sitio Wix existente (embed full-viewport). Razón: las APIs de Wix no permiten rediseñar visualmente páginas del Editor clásico; el embed custom es el único camino a la calidad deseada sin salir de Wix.
2. **Leads**: caen a **Airtable** (base nueva "Element Leads") vía función backend de **Velo** (`http-functions`), con el token de Airtable en el Secrets Manager de Wix. Lead caliente abre **WhatsApp** con mensaje precargado.
3. **Calculadora**: usa **números reales** del cliente (pendientes de entrega). Hasta recibirlos, se construye con placeholders claramente marcados `[DATO PENDIENTE]` (mismo sistema que Urbana Park).
4. **Idiomas**: **ES + EN** con toggle y detección por navegador. Calculadora con MXN/USD (tipo de cambio editable en config).
5. **Media**: descargar lo mejor del Instagram público; el cliente puede pasar material en calidad original después.

## Dirección visual — "Industrial Boutique"

- **Paleta**: tinta-navy profundo (evolución del logo actual), gris concreto, arena/latte cálido (de los renders), acento **cobre/latón** para CTAs y capa de datos. Definida como tokens CSS (`--color-*`).
- **Tipografía**: grotesk display de carácter para titulares (tracking apretado, tamaños grandes con `clamp()`), sans limpia para cuerpo, numerales tabulares grandes para datos (precios, rendimientos, m²). Máximo 2 familias.
- **Motivo gráfico**: líneas de plano arquitectónico (blueprint) como textura sutil en fondos y transiciones.
- **Motion**: reveals al scroll (IntersectionObserver), contadores animados en cifras, solo propiedades compositor-friendly (`transform`/`opacity`), respeta `prefers-reduced-motion`.

## Estructura del one-pager

1. **Hero** — video/render full-bleed, claim, precio correcto ("desde $1,900,000 MXN"), CTAs: "Simula tu inversión" (ancla a calculadora) + WhatsApp.
2. **Barra de datos duros** — 28 unidades · fecha de entrega · % plusvalía de zona · desde $/m². Contadores animados.
3. **Por qué Cancún centro** — mapa estilizado con puntos de interés (Zona Hotelera, ADO, Plaza Américas, Mercado 28, Puerto Cancún) + 3-4 datos de mercado con fuente citada.
4. **Tipologías** — cards con m², precio real, renta estimada, disponibilidad; CTA por card "Simular esta unidad" que precarga la calculadora.
5. **Calculadora de inversión** — ver sección propia.
6. **Amenidades + galería** — material del Instagram.
7. **Avance de obra** — timeline con fotos reales de obra y fecha de entrega.
8. **Trayectoria ICONO** — iconotowers como proyecto entregado, 10+ años.
9. **FAQ inversionista** — fideicomiso para extranjeros, escrituración, administración de rentas, forma de pago.
10. **Cierre** — formulario calificador + WhatsApp + datos de contacto (Crisantemos Lt. 18-01 SM 22, admin@elementbyicono.com).

## Calculadora de inversión (pieza central)

**Inputs**: tipología (precarga precio real y m²), forma de pago (contado / plan de pagos con enganche y mensualidades), modo de renta (Airbnb: ADR × ocupación / larga estancia: renta mensual), horizonte (3/5/10 años).

**Outputs**: rendimiento anual bruto y **neto** (resta mantenimiento, % administración de rentas, predial), ROI total a horizonte con plusvalía compuesta, años de payback. Disclaimer visible: simulación informativa, no asesoría financiera ni garantía de rendimientos.

**Gate de conversión**: tras ver el resultado → "Recibe tu simulación completa por WhatsApp o correo" → formulario corto → el lead llega a Airtable con la simulación completa adjunta (tipología, forma de pago, modo renta, horizonte, resultado). El botón de WhatsApp abre chat con resumen de la simulación precargado.

**Config**: todos los supuestos (precios, ADR, ocupación, plusvalía %, gastos, FX) viven en un único archivo de configuración JS editable, con marcado `[DATO PENDIENTE]` donde falten números reales.

## Calificación de leads

Formulario (en calculadora y cierre) captura: nombre, contacto (tel/email), perfil (inversionista / comprador / broker), tipología de interés, forma de pago prevista, horizonte de compra, canal preferido (WhatsApp/llamada/correo), idioma, fuente (sección desde la que convirtió). Campos de simulación se adjuntan automáticamente cuando el lead viene de la calculadora.

## Arquitectura técnica

- **Frontend**: single-page custom (HTML/CSS/JS build estático, organización por componentes según convenciones del usuario), diseñado para vivir en un embed full-viewport de Wix. Presupuesto: JS < 150 kb gz, CSS < 30 kb.
- **Montaje en Wix**: HtmlComponent/iframe a pantalla completa en la página home del sitio existente. Paso manual único en el editor Wix (guiado o vía credenciales del usuario). El bundle estático se hospeda en un hosting estático gratuito bajo control del cliente (Cloudflare Pages o GitHub Pages) y el iframe de Wix apunta a esa URL; el visitante solo ve elementbyicono.com.
- **Backend de leads**: Velo `http-functions` en el mismo sitio Wix expone `POST /submitLead`; valida input, escribe en Airtable (token en Wix Secrets Manager), responde éxito/error. El frontend muestra error amigable y ofrece WhatsApp como fallback si Airtable falla.
- **Airtable**: base nueva "Element Leads" creada vía MCP (tabla Leads con los campos de calificación + simulación + estatus de seguimiento).
- **SEO**: la página Wix conserva title/meta/OG optimizados y un bloque de contenido indexable (resumen del desarrollo) fuera del embed. Sitemap de Wix intacto.

## Manejo de errores

- Envío de lead: reintento único + mensaje claro + fallback a WhatsApp con datos precargados. Nunca se pierde el lead silenciosamente.
- Calculadora: validación de inputs (rangos razonables), estados vacíos claros, nunca NaN visible.
- Media: `loading="lazy"` bajo el fold, dimensiones explícitas, fallback de póster para videos.

## Testing / verificación

- Responsive: 320 / 375 / 768 / 1024 / 1440 sin overflow.
- Unit tests de la lógica de la calculadora (funciones puras de cálculo financiero: bruto, neto, ROI, payback) — es la parte con riesgo real de error.
- E2E del flujo de lead: simulación → formulario → registro verificado en Airtable.
- Lighthouse en la página final (targets: LCP < 2.5s dentro de lo que el embed de Wix permita).
- Verificación en ambos idiomas y ambas monedas.

## Fuera de alcance (por ahora)

- Rediseño de iconotowers.com.
- CRM más allá de Airtable (pipelines, automatizaciones de seguimiento).
- Panel de administración para editar precios (se edita el archivo de config; puede evolucionar a Airtable-as-CMS después).

## Pendientes del cliente

1. **Números reales**: precios por tipología (+ unidades disponibles), renta esperada (Airbnb ADR + ocupación y/o larga estancia), % plusvalía proyectada y fuente, planes de pago, fecha de entrega y avance de obra, gastos (mantenimiento, % administración, predial).
2. Confirmar el número de WhatsApp destino de leads.
3. (Opcional) Material visual en calidad original si el de Instagram no basta.
