---
name: bailapp-viral-video
description: Directivas de estilo, fórmulas de guión viral, estética visual pastel, safe zones y pipeline de producción de video corto para Bailapp (Cono Sur Latam).
---

# Bailapp — Manual de Estilo y Pipeline de Producción de Video Viral

Este documento define el estándar creativo, narrativo, auditivo, anatómico y técnico definitivo para producir contenido en video de alto impacto y retención para **Bailapp** en TikTok, Instagram Reels y YouTube Shorts, optimizado para el público de **Argentina, Uruguay y Chile**.

---

## 1. Directiva Fundamental de Producción: Animación 100% por Código

- **PROHIBIDO:** Usar modelos de IA generativa de imágenes (Midjourney, DALL-E, Flux, Stable Diffusion, etc.) o fotorrealismo.
- **MANDATORIO:** Todo el arte y animación se genera **programáticamente con CÓDIGO** (HTML5, SVG modular, Canvas 2D, JavaScript / GSAP, renderizado vía Chromium Headless / FFmpeg).
- **Estilo Aprobado:** **Animación Vectorial / Motion Graphics Estilizado**:
  - Personajes vectoriales con proporciones adultas jóvenes (18–22 años), anatomía matemáticamente integrada sobre el sistema modular *Humaaans* (Pablo Stanley).
  - Activos aislados con fondo transparente para animar por capas.
  - Paleta *Soft Pastel* cuidada y minimalista con prendas de contraste (negro carbón, washed black, verde oliva, taupe).
  - **Estilos Descartados para Bailapp:** *Pixel Explain* y *Paper Cut* fueron evaluados y descartados.

---

## 2. Identidad Visual: *Soft Pastel Motion* (Paleta Rosa)

Quedan **estrictamente prohibidos**:
- Estilos 3D tipo Pixar / caricatura corporativa / estilo chibi infantil.
- Luces de neón cyberpunk o gamers.
- Fondos oscuros o estéticas pesadas.
- Superposiciones de tarjetas, textos o badges tapando el cuerpo o rostro del personaje (el personaje debe tener su propia zona libre).

### Paleta de Color Mandatoria:
- **Rosa Pastel Base:** `#FAD2E1`, `#F8C8DC` (delicado, aesthetic, clean).
- **Tonos de Apoyo:** Crema cálido (`#FFF9F5`), Nude / Beige suave (`#F4E8C1`, `#D8C2B0`), Blanco puro (`#FFFFFF`).
- **Acentos:** Rosa frambuesa suave (`#E06385`), gris carbón suave para textos (`#2D242E`).

---

## 3. Catálogo de Personajes Aislados (Assets en `/bailapp_characters/`)

Todos los personajes deben guardarse y utilizarse como **activos limpios aislados** (resolución base 600×900, fondo transparente PNG / SVG):

### A. Modelos Genéricos:
1. **`character_generico_1.png`:**
   - Postura casual en pantalón baggy arena/beige, zapatillas de danza urbanas, crop top washed black y smartphone en mano.
   - Cabello largo castaño ondulado suelto natural.
2. **`character_generico_2.png`:**
   - Postura dinámica activa con campera crop verde oliva sobre remera blanca, pantalón jogging taupe y gesto de señalar.

### B. Arquetipos de Danza:
3. **`character_urbano.png` (Bailarina de Urbano / Street / Reggaetón):**
   - Pantalones cargo holgados en tonos arena, zapatillas urbanas de plataforma con suela blanca, top ceñido washed black y actitud street dance relajada.
4. **`character_heels.png` (Bailarina de Heels / Stiletto Dance):**
   - **Rig anatómico:** Construido sobre el mismo sistema *Humaaans* para preservar la cohesión total con los otros modelos.
   - **Postura icónica de Heels (*Strut / Caminata de pasarela*):** Pierna de apoyo firme alargada y pierna delantera en avance con zancada estilizada.
   - **Calzado auténtico de Heels:** Botines de baile negros con caña ceñida al tobillo, empeine arqueado con espacio libre bajo el puente, puntera fina y **taco aguja (*stiletto*) de 9 cm** con tapita en tono frambuesa/fucsia. Prohibidas las suelas planas o zapatillas con pinches.
   - Outfit ceñido en calzas negras de baile, top entallado y cabello suelto con volumen.
5. **`character_ballet.png` (Bailarina de Ballet / Contemporáneo):**
   - Maillot de danza negro, falda cruzada de tul rosa suave semitranslúcido, zapatillas de media punta en rosa empolvado con lazos de raso cruzados en los tobillos. Línea clásica y cabello suelto ondulado (sin chongo infantil ni coleta).

---

## 4. Reglas Críticas de Anatomía y Estilo Humano

1. **Cabello:** Siempre **suelto, ondulado o lacio natural**. Queda terminantemente prohibida la coleta (cola de caballo) o el rodete/bun apretado, ya que infantiliza la figura.
2. **Anatomía Integrada:** No dibujar extremidades o cuerpos con curvas Bézier manuales ad-hoc; siempre ensamblar sobre los componentes modulares validados de *Humaaans* para mantener proporciones, pesos de línea y puntos de articulación perfectos.
3. **Contraste de Ropa:** La ropa de la bailarina debe generar contraste visual respecto al fondo pastel (usar negros, carbón, grises profundos, arena u oliva).

---

## 5. Voz, Dicción, Tono y Pacing (Voz Rioplatense Natural)

- **Nombre de Marca:** Siempre **«Bailapp»** (todo junto, una sola palabra, nunca separado).
- **PROHIBIDO:** Decir *"la app de danza del cono sur"*. En su lugar usar: *"Encontrá tu clase y reservá en un toque"*.
- **Pacing de Locución:** La voz neuronal debe sintetizarse con aceleración conversacional (**`--rate=+14%`**) para sonar ágil, enérgica y humana, eliminando la cadencia lenta o robótica de audiolibro.
- **Dicción Natural:** Evitar términos en inglés ("DMs") que provoquen vacilaciones fonéticas. Usar *"mensajes"* o frases directas habladas.
- **Voz TTS Oficial:** `es-AR-ElenaNeural` (o `es-UY-ValentinaNeural`).
- **Duración Ideal:** Entre **22 y 26 segundos** en total para mantener la máxima retención.

---

## 6. Safe Zones, Centrado y Prevención de Desbordes

- **Ubicación Vertical Mandatoria:** Subtítulos fijados al **38% desde el borde inferior** (Y ≈ 1370 px en resolución 1080×1920) para esquivar la interfaz nativa de TikTok, Reels y Shorts.
- **Centrado Absoluto:** Todos los textos deben dibujarse con `textAlign = 'center'` y anclarse en `X = CX = 540`.
- **Regla Anti-Desborde:** Todo texto con más de 38 caracteres debe dividirse automáticamente en dos líneas balanceadas (`30px`), garantizando que jamás sobrepase el contenedor ni corte palabras.
- **Espaciado en Cards:** Mantener un margen interior mínimo de 30px en todas las tarjetas de UI para evitar que los textos toquen los bordes.

---

## 7. Pipeline Técnico de Renderizado y Muxing

### Comandos de Ejecución Validados:

1. **Generación de Voz Fluida (+14% velocidad):**
   ```bash
   edge-tts --voice es-AR-ElenaNeural --rate=+14% --text "<guion_natural>" --write-media audio/voiceover.mp3 --write-subtitles audio/subtitles.vtt
   ```

2. **Mezcla de Audio con BGM sutil (Volumen 0.09 + Ducking + Fadeout):**
   ```bash
   ffmpeg -y -i audio/voiceover.mp3 -ss 10 -t <duracion> -i <bgm.mp3> \
     -filter_complex "[1:a]volume=0.09,afade=t=in:st=0:d=0.8,afade=t=out:st=<fin-1.8>:d=1.8[bgm];[0:a]volume=1.15[v];[v][bgm]amix=inputs=2:duration=first[aout]" \
     -map "[aout]" -ar 48000 -ac 2 audio/mix.wav
   ```

3. **Renderizado de Fotogramas (1080×1920 @ 24fps):**
   ```bash
   node /home/yoel1/lemo-opuscar/core/render/video.mjs <directorio> --fps 24 --workers 4 --size 1080x1920 --out out/video_v2.mp4
   ```

4. **Muxing y Normalización de Audio (-14.0 LUFS / True Peak -1.2 dBFS):**
   ```bash
   sh /home/yoel1/lemo-opuscar/core/render/mux.sh out/video_v2.mp4 audio/mix.wav bailapp_final_v2.mp4 24 0
   ```
