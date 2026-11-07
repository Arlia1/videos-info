# 🩰 Bailapp — Producción de Videos Publicitarios & Animación de UI

Repositorio central con todos los recursos, guiones, arte vectorial por código y animaciones de interfaz para la promoción de **[Bailapp](https://bailapp-prueba.vercel.app)** en TikTok, Instagram Reels y YouTube Shorts (Cono Sur / Argentina).

---

## 📁 Estructura del Proyecto

```text
├── bailapp_ui_animation/        # Animación interactiva de la interfaz de Bailapp (iPhone 16 Pro mockup)
│   ├── index.html              # Demo animada en código (GSAP + CSS 3D + Web Audio)
│   ├── gsap.min.js             # Motor de animación local (offline-ready)
│   ├── bailapp_promo_ui.mp4    # Video renderizado a 1080x1920 (24 fps)
│   └── bailapp_promo_final.mp4 # Video final con banda sonora y fade-in/fade-out
│
├── bailapp_characters/         # Ilustración y rigging de personajes vectoriales en código SVG
│   ├── character_heels.html    # Bailarina de Heels / Femme style
│   └── character_urbano.html   # Bailarina de Danzas Urbanas / Reggaetón
│
├── bailapp_motion/             # Escenas y pruebas de movimiento vectoriales
│   ├── sample_scene_v6.html    # Escena con paleta pastel y safe zones de subtítulos
│   └── ...
│
├── bailapp_15s/                # Campaña corta de 15 segundos
│   ├── script.txt              # Guión rioplatense enfocado en piso técnico y reserva rápida
│   ├── voice.mp3               # Locución neural es-AR
│   └── bailapp_15s_final.mp4   # Video final montado
│
├── bailapp/                    # Pipeline original de video viral Art Deco
│   ├── index.html              # Renderizador por Canvas 2D
│   ├── ballerina.js            # Animación procedural de danza
│   ├── shots.js                # Coreografía de planos
│   ├── mix.py                  # Generación y mezcla de audio
│   └── bailapp.mp4             # Master renderizado
│
├── .agents/skills/             # Directivas de agente y estándar creativo
│   └── bailapp-viral-video/    # Manual de estilo, paleta rosa pastel y safe zones
│
├── copy.txt                    # Copys y textos promocionales
└── README.md                   # Documentación general
```

---

## 🎨 Identidad Visual y Estándar Creativo

- **Paleta Soft Pastel:**
  - Rosa Pastel Base: `#FAD2E1`, `#F8C8DC`
  - Acentos: `#E85D8A`, `#D81B60`
  - Fondos Cálidos: `#FFF6F9`, `#FFF1F5`
  - Textos: `#2D2A2E` (Gris carbón suave)
- **Safe Zones para Reels/TikTok:**
  - Subtítulos y copys clave ubicados entre el **35% y 42% desde el borde inferior** para no colisionar con la interfaz nativa de la red social.
- **Formato Mandatorio:** `1080 × 1920` (9:16 vertical).

---

## 🚀 Cómo Reproducir y Visualizar la Animación de Interfaz

Abrí `bailapp_ui_animation/index.html` directamente en tu navegador:
```bash
# En Linux / macOS / Windows:
xdg-open bailapp_ui_animation/index.html
# o
open bailapp_ui_animation/index.html
```

O servila localmente con Python:
```bash
python3 -m http.server 8080 --directory bailapp_ui_animation
# Abrir en el navegador: http://localhost:8080
```

Incluye controles interactivos para reproducir, pausar, mover la línea de tiempo por segundo, ajustar la velocidad (0.5x, 1x, 1.5x, 2x) y activar/desactivar el sonido sintético.

---

## 🎬 Videos Exportados

Los videos finales listos para pauta y difusión están disponibles directamente en:
- `bailapp_promo_final.mp4` (Video publicitario de la UI de la app, 17s con música)
- `bailapp_15s/bailapp_15s_final.mp4` (Campaña corta 15s)
- `bailapp/bailapp.mp4` (Video viral 30s)
