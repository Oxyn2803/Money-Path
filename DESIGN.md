---
version: "alpha"
name: "Money Path"
description: "Personal finance platform inspired by Emerald24 digital banking. Dark-first, glass morphism, emerald green accent."
colors:
  primary: "#00C853"
  primary-light: "#69F0AE"
  primary-dark: "#009624"
  secondary: "#1DB954"
  background: "#0A0A0A"
  surface: "#111111"
  surface-elevated: "#1A1A1A"
  surface-glass: "rgba(255, 255, 255, 0.05)"
  border: "rgba(255, 255, 255, 0.08)"
  border-active: "rgba(0, 200, 83, 0.3)"
  text-primary: "#FFFFFF"
  text-secondary: "rgba(255, 255, 255, 0.6)"
  text-muted: "rgba(255, 255, 255, 0.4)"
  success: "#00E676"
  warning: "#FFB74D"
  error: "#FF5252"
  info: "#40C4FF"
  gradient-start: "#00C853"
  gradient-end: "#69F0AE"
typography:
  h1:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 3rem
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  h2:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h3:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.3
  h4:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: "Inter"
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "Inter"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter"
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.05em"
  mono:
    fontFamily: "JetBrains Mono"
    fontSize: 0.875rem
    fontWeight: 400
rounded:
  sm: 6px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
components:
  card:
    background: "{colors.surface-glass}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.lg}"
    backdropBlur: "16px"
    padding: "{spacing.lg}"
  card-hover:
    borderColor: "{colors.border-active}"
    background: "rgba(255, 255, 255, 0.08)"
  button-primary:
    background: "linear-gradient(135deg, {colors.gradient-start}, {colors.gradient-end})"
    textColor: "#000000"
    borderRadius: "{rounded.full}"
    fontWeight: 600
    padding: "12px 28px"
  button-secondary:
    background: "transparent"
    textColor: "{colors.text-primary}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.full}"
    padding: "12px 28px"
  button-ghost:
    background: "transparent"
    textColor: "{colors.text-secondary}"
    borderRadius: "{rounded.md}"
  input:
    background: "{colors.surface}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.md}"
    textColor: "{colors.text-primary}"
    placeholderColor: "{colors.text-muted}"
    focusBorderColor: "{colors.primary}"
  sidebar:
    background: "{colors.surface}"
    width: "280px"
    borderColor: "{colors.border}"
  navbar:
    background: "rgba(10, 10, 10, 0.8)"
    backdropBlur: "12px"
    borderColor: "{colors.border}"
    height: "64px"
  badge-pro:
    background: "linear-gradient(135deg, {colors.gradient-start}, {colors.gradient-end})"
    textColor: "#000000"
    borderRadius: "{rounded.full}"
    fontSize: "0.75rem"
  badge-soon:
    background: "{colors.surface-elevated}"
    textColor: "{colors.text-secondary}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.full}"
  chart:
    positive: "{colors.success}"
    negative: "{colors.error}"
    accent1: "{colors.primary}"
    accent2: "{colors.primary-light}"
    gridColor: "rgba(255, 255, 255, 0.05)"
    tooltipBackground: "{colors.surface-elevated}"
  stat-card:
    background: "{colors.surface-glass}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.lg}"
    iconBackground: "rgba(0, 200, 83, 0.1)"
    iconColor: "{colors.primary}"
---

## Overview

**Money Path** es una plataforma de finanzas personales para el mercado latinoamericano (MVP: México, es-MX).

El sistema de diseño se inspira en la estética de banca digital premium de Emerald24: **dark-first, glass morphism, gradiente esmeralda como acento protagonista**. El objetivo visual es transmitir confianza financiera, modernidad y claridad — como una app de fintech premium, no una hoja de cálculo.

### Principios de diseño
1. **Dark-first:** El fondo negro (#0A0A0A) reduce fatiga visual y da protagonismo al contenido financiero.
2. **Glass morphism:** Cards y superficies con `backdrop-blur` y bordes semi-transparentes crean profundidad sin peso visual.
3. **Acento esmeralda:** Un solo color de acento (verde esmeralda) guía la atención del usuario hacia acciones principales y datos positivos.
4. **Tipografía jerárquica:** Plus Jakarta Sans para headings (impacto), Inter para body (legibilidad), JetBrains Mono para valores numéricos y monetarios.
5. **Espacio generoso:** Mucho whitespace (en este caso, "darkspace") entre elementos para sensación premium.

### Material language
Vidrio sobre obsidiana. Las superficies flotan sobre el fondo oscuro con transparencia sutil. Los elementos activos brillan con gradiente esmeralda. Las transiciones son suaves (200–300ms ease).

---

## Colors

### Paleta principal
| Rol | Hex | Uso |
|---|---|---|
| Primary | #00C853 | Botones CTA, links activos, iconos de acción principal |
| Primary Light | #69F0AE | Gradiente (extremo claro), hover states, acentos secundarios |
| Primary Dark | #009624 | Pressed states, bordes activos sutiles |
| Secondary | #1DB954 | Variante de acento (badges, indicadores online) |

### Neutros
| Rol | Valor | Uso |
|---|---|---|
| Background | #0A0A0A | Fondo global de la app |
| Surface | #111111 | Sidebar, paneles laterales, fondos de sección |
| Surface Elevated | #1A1A1A | Cards elevados, modales, dropdowns |
| Surface Glass | rgba(255,255,255,0.05) | Cards con glass morphism |
| Border | rgba(255,255,255,0.08) | Bordes de cards, dividers, separadores |
| Border Active | rgba(0,200,83,0.3) | Bordes en hover/focus de elementos interactivos |

### Texto
| Rol | Valor | Uso |
|---|---|---|
| Text Primary | #FFFFFF | Headlines, valores monetarios, texto principal |
| Text Secondary | rgba(255,255,255,0.6) | Subtítulos, descripciones, labels |
| Text Muted | rgba(255,255,255,0.4) | Placeholders, metadata, timestamps |

### Semánticos
| Rol | Hex | Uso |
|---|---|---|
| Success | #00E676 | Ingresos, retorno positivo, transacciones exitosas |
| Warning | #FFB74D | Alertas no críticas, fechas de vencimiento próximas |
| Error | #FF5252 | Gastos, pérdidas, errores de formulario |
| Info | #40C4FF | Tips informativos, estados de procesamiento |

### Gradiente principal
`linear-gradient(135deg, #00C853, #69F0AE)` — Usado en botones primarios, badges Pro, hero sections y elementos que necesitan máximo protagonismo.

---

## Typography

### Familias
- **Plus Jakarta Sans** (Google Fonts): headings. Geométrica, moderna, con peso visual.
- **Inter** (Google Fonts): body text. Optimizada para pantalla, excelente legibilidad.
- **JetBrains Mono** (Google Fonts): valores monetarios (MXN $12,500.00), códigos, datos tabulares.

### Escala
| Token | Family | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| h1 | Plus Jakarta Sans | 3rem (48px) | 800 | 1.1 | -0.03em |
| h2 | Plus Jakarta Sans | 2.25rem (36px) | 700 | 1.2 | -0.02em |
| h3 | Plus Jakarta Sans | 1.5rem (24px) | 600 | 1.3 | — |
| h4 | Plus Jakarta Sans | 1.125rem (18px) | 600 | 1.4 | — |
| body-lg | Inter | 1.125rem (18px) | 400 | 1.6 | — |
| body-md | Inter | 1rem (16px) | 400 | 1.5 | — |
| body-sm | Inter | 0.875rem (14px) | 400 | 1.5 | — |
| label | Inter | 0.75rem (12px) | 500 | 1 | 0.05em |
| mono | JetBrains Mono | 0.875rem (14px) | 400 | — | — |

### Reglas
- Valores monetarios **siempre** en `mono` (JetBrains Mono): `$12,500.00 MXN`
- Headlines nunca en más de 2 líneas en desktop
- Body text máximo 65ch de ancho para legibilidad

---

## Layout

### Spacing scale
4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 px (base = 8px)

### Grid
- **Landing pages:** max-width 1280px, padding horizontal 24px (mobile) / 48px (desktop)
- **Dashboard:** sidebar fija 280px + área principal fluida
- **Cards grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` con gap de 16px

### Breakpoints (Tailwind defaults)
| Nombre | Min-width |
|---|---|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

### Sidebar
- Ancho fijo: 280px en desktop
- Colapsada: 72px (solo iconos) en tablet
- Oculta con drawer en mobile (<768px)
- Fondo: #111111 con borde derecho rgba(255,255,255,0.08)

### Navbar
- Altura: 64px
- Fondo: rgba(10,10,10,0.8) con backdrop-blur 12px
- Sticky top con z-index 50
- Logo a la izquierda, navegación centrada, avatar/CTA a la derecha

---

## Elevation & Depth

### Sombras
| Nivel | Valor | Uso |
|---|---|---|
| sm | 0 1px 2px rgba(0,0,0,0.3) | Botones, inputs |
| md | 0 4px 12px rgba(0,0,0,0.4) | Cards, dropdowns |
| lg | 0 8px 32px rgba(0,0,0,0.5) | Modales, popovers |
| glow | 0 0 20px rgba(0,200,83,0.15) | Hover en botones primarios, elementos destacados |

### Z-index layers
| Layer | Z-index |
|---|---|
| Base | 0 |
| Cards | 10 |
| Sidebar | 30 |
| Navbar | 50 |
| Dropdown | 60 |
| Modal overlay | 70 |
| Modal | 80 |
| Toast | 90 |
| Tooltip | 100 |

### Glass effect recipe
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.08);