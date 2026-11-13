# Agencia Arlia — Video Publicitario Oficial (1080x1920)

Video publicitario en formato vertical (9:16) con estética limpia, prestigiosa y diseño 2D de alta gama para **Agencia Arlia**.

---

## 🎯 Especificaciones Técnicas

- **Resolución Master**: 1080 x 1920 (9:16 vertical para Instagram Reels, TikTok, YouTube Shorts).
- **Tasa de Cuadros**: 24 FPS (render raw optimizado) / 60 FPS (preview studio).
- **Duración Total**: 20.00 segundos (480 frames exactos).
- **Locución**: Voz masculina argentina comercial (`es-AR-TomasNeural`), tono grave, dinámico, asertivo y profesional de radio/publicidad.
- **Audio Master**: EBU R128 (-14.0 LUFS, -1.2 dBTP) con sidechain ducking y banda sonora sintética de lujo + SFX (pops de WhatsApp, clicks de selección, chimes de comanda).
- **Estética Visual**:
  - Fondo oscuro de lujo (obsidiana a azul noche profundo `#0C1630` -> `#03050A`).
  - Líneas vectoriales continuas (splines suaves) con **nodos y puntos brillantes luminosos en movimiento constante** con estelas de luz.
  - Celular 2D de titanio con reflejo de cristal, dynamic island y pantallas reales:
    - *Acto 1*: Alerta de pérdida por comisiones del 30% en apps de delivery.
    - *Acto 2*: Caos en WhatsApp con burbujas de pedidos y alerta de cancelación por demoras.
    - *Acto 3*: Transformación a la web propia con catálogo digital interactivo y generación instantánea del ticket de comanda hacia WhatsApp.
    - *Acto 4*: Impacto de 0% comisión y 100% margen neto directo al bolsillo del dueño del local.
    - *Acto 5*: Cierre con insignia corporativa de Agencia Arlia y botón de llamada a la acción "Agendá tu demo hoy 🚀".
  - Subtítulos cinemáticos en zona segura inferior con cápsula de vidrio oscuro y resalte de palabras clave.

---

## 📁 Estructura del Proyecto

```
agencia_arlia_ad/
├── audio/
│   ├── generate_voice.py      # Generador de locución con edge-tts (es-AR-TomasNeural)
│   ├── mix.py                 # Sintetizador musical + SFX + ducking + masterizador
│   ├── voiceover_timeline.wav # Timeline de voz sincronizado (20s)
│   └── mix.wav                # Audio master final a 48000 Hz estéreo
├── index.html                 # Reproductor web interactivo con HUD y timeline scrubber
├── main.js                    # Motor gráfico 2D Canvas (deterministico window.render(t))
├── AgenciaArliaStudio.jsx      # Componente React completo para estudio interactivo
├── render.sh                  # Script de renderizado automático con Chromium SwiftShader
└── agencia_arlia_promo_final.mp4 # Video publicitario final masterizado
```

---

## 🚀 Cómo Renderizar Nuevamente

Para volver a generar el video en cualquier momento:

```bash
cd "/home/y/Escritorio/videos-ai (2)/agencia_arlia_ad"
./render.sh
```

O para previsualizarlo en el navegador abrí `index.html` en cualquier servidor local.
