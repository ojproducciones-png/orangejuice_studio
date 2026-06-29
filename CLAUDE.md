# Orange Juice Studio — Landing Page

## Proyecto
Landing page de la agencia **Orange Juice Studio** (ojproducciones@hotmail.com).

## Stack
- HTML + Tailwind CSS (CDN) + Vanilla JS
- Un solo archivo `index.html` — sin frameworks ni bundler
- Fuentes: Inter (Google Fonts) + Material Symbols Outlined

## Paleta de colores
| Variable     | Valor       |
|--------------|-------------|
| Naranja      | `#E8650A`   |
| Negro base   | `#0A0A0A`   |
| Dark card    | `#1A1A1A`   |
| Bone (texto) | `#F5F4F0`   |
| Muted        | `#9A8E88`   |

## Secciones de la página
1. **Navbar** — fijo, hamburguesa en mobile, sombra al hacer scroll
2. **Hero** — headline + stats (100%, 3-en-1, $2,999)
3. **Servicios** — 3 pilares: Contenido, Campañas, Captación
4. **CTA intermedio** — banda naranja
5. **Precios** — Starter $2,999 MXN/mes + Paquetes Musicales ($1,500–$8,500)
6. **Portafolio** — placeholders de video (pendiente: agregar videos reales)
7. **Formulario de Auditoría** — conecta a WhatsApp (número: 529993928714)
8. **Footer** — links sociales (pendiente: agregar URLs reales)

## Pendientes
- [ ] Agregar videos/imágenes reales al portafolio
- [ ] Conectar links de redes sociales en footer
- [ ] Subir a GitHub y hacer deploy (GitHub Pages o Netlify)
- [ ] Configurar dominio personalizado

## Estructura de carpetas
```
orange-juice-studio/
├── index.html          ← página principal
├── assets/
│   ├── images/         ← logos, fotos, thumbnails de portafolio
│   ├── videos/         ← videos de portafolio (si se alojan local)
│   └── fonts/          ← fuentes locales (si se dejan de usar CDN)
├── .claude/
│   └── settings.json   ← configuración Claude para este proyecto
└── CLAUDE.md           ← este archivo
```
