---
name: threejs-formatos-virales
description: Catálogo de formatos de video viral hechos con three.js/WebGL (partículas con hand tracking, shaders y morphing, físicas, loops satisfactorios, juegos creados con IA en un solo HTML, scroll 3D en sitios web, ASCII/voxel, gaussian splats) con guion modelo, ganchos y notas técnicas por formato. Usar cuando haya que decidir QUÉ video hacer con three.js, buscar ideas de contenido, elegir formato para un efecto ya hecho, o escribir un guion específico de un formato.
---

# Catálogo de formatos virales con three.js

Elegir un formato, usar su guion modelo y adaptarlo. Cada ficha: **Por qué funciona / Estructura / Gancho / Notas técnicas / Riesgos**.

Tendencias observadas en la web (abril-noviembre 2026): la combinación hand tracking + partículas circuló mucho en X e Instagram y varias herramientas la recrearon con prompts; los modelos de IA ya generan juegos 3D con física y música en un solo HTML con three.js, y las comparaciones entre modelos generando la misma escena se volvieron contenido en sí mismo. Verificar tendencias actuales antes de publicar: cambian rápido.

---
## 1. Partículas con hand tracking (MediaPipe + three.js)
- **Por qué funciona:** interacción física visible, se ve "futurista", el cuerpo del creador es parte del efecto, es fácil de rever.
- **Estructura (20-30 s):** gancho con el puño/pellizco provocando el efecto → mano abierta = explosión → pinch = contracción → cambio de forma (corazón, Saturno, ADN, galaxia) → combinación de dos manos (zoom, rotación) → final con forma icónica + loop.
- **Gancho:** "Controlo 200 000 partículas con la mano." / "Cerré el puño y pasó esto."
- **Notas técnicas:** MediaPipe Hands (hasta 2 manos, 21 puntos cada una). `Points` con `AdditiveBlending`, `depthWrite:false`, bloom suave. Interpolar posiciones (lerp) hacia formas objetivo para morphing fluido. Mapear gestos: distancia pulgar-índice → contracción; apertura de mano → dispersión; posición XY → rotación/zoom. Mostrar un recuadro pequeño de la cámara en una esquina ayuda a que se crea que es real.
- **Riesgos:** requiere buena luz; grabar con fondo limpio; suavizar el jitter del tracking.
- **Variantes:** theremin visual (altura = volumen, X = tono), breakout controlado con el dedo, dibujo en el aire.

## 2. Shader / morphing hipnótico (loop satisfactorio)
- **Por qué funciona:** retención por hipnosis y rewatch. Ideal para loops perfectos.
- **Estructura (8-15 s):** un solo objeto (esfera con ruido, líquido, malla deformada) → 2-3 transformaciones suaves de color/forma → vuelve al estado inicial = loop.
- **Gancho:** frame 0 ya en movimiento y colores saturados; texto: "Esto es solo matemática." / "Mirá hasta el final."
- **Notas técnicas:** vertex shader con ruido simplex/curl; uniforms controlados por tiempo (`t = (frame/fps) % duración`) para que el loop cierre exacto; paletas coseno. Hacer que todo sea periódico (usar `sin/cos` con `2π·t/D`).
- **Riesgos:** si es solo lindo y sin contexto, genera likes pero pocos envíos. Agregar un "dato" o un desafío ("adiviná cuántas líneas de código").

## 3. Físicas y caos controlado
- **Por qué funciona:** destrucción/colisión es adictivo; lo "satisfactorio" se envía.
- **Estructura (15-25 s):** calma → una acción pequeña dispara el caos (bolas cayendo, ballpit, tornado, voxelización de un video que cae) → cámara lenta en el pico → resultado final ordenado o epic.
- **Gancho:** "Dejé caer 5 000 esferas." / "Esto es física real en el navegador."
- **Notas técnicas:** Rapier o Cannon.js; `InstancedMesh` para miles de objetos; slow motion bajando el `timeStep` en el clímax; sombras suaves y cámara con leve shake.
- **Riesgos:** rendimiento al grabar; usar captura determinista (ver threejs-captura-video).

## 4. "Hice un juego 3D con un prompt" (vibe coding)
- **Por qué funciona:** contraste de esfuerzo/resultado; el espectador se identifica ("yo también puedo").
- **Estructura (25-40 s):** el prompt en pantalla (3 s, legible) → resultado ya jugable → 2-3 iteraciones ("ahora con física", "ahora con música") mostrando antes/después → versión final → CTA "comentá PROMPT".
- **Gancho:** "Un prompt. Un archivo. Un juego 3D."
- **Notas técnicas:** todo en un solo HTML con three.js por CDN o bundler; mostrar el prompt corto (no el pegote de 200 líneas); acelerar la espera de generación con corte/timelapse.
- **Variante muy compartible:** **comparativa** de modelos de IA generando la misma escena; mismo prompt, misma cámara, split-screen.
- **Riesgos:** no prometer "sin saber programar" si el resultado necesitó correcciones; ser honesto con los pasos.

## 5. Scroll 3D en sitios web (GSAP + three.js)
- **Por qué funciona:** público de diseñadores/freelancers; alto valor percibido; muy guardable.
- **Estructura (20-30 s):** el sitio plano → scroll y la cámara viaja por la escena → transición entre secciones → detalle de microinteracción (hover distorsiona la imagen) → CTA con la plantilla/tutorial.
- **Gancho:** "Así debería verse la web de tu marca." / "Este sitio se mueve con el scroll."
- **Notas técnicas:** `ScrollTrigger` de GSAP ligado a la posición de cámara o a uniforms; Theatre.js para coreografiar cámara; grabar el scroll con velocidad constante y easing.
- **Riesgos:** mostrar rendimiento móvil si es relevante.

## 6. Texto 3D, ASCII, voxel, gaussian splats (efectos de transformación)
- **Por qué funciona:** transición "A se convierte en B" muy visual (foto → partículas, video → voxels, texto → disolución).
- **Estructura (10-20 s):** objeto reconocible → disolución/reconstrucción → 2-3 estilos (ASCII, voxel, puntos) con corte rápido → reveal final.
- **Gancho:** "Convertí mi cara en 10 000 cubos." (solo con permiso/tuyo propio; no usar personas ajenas sin consentimiento).

## 7. Tutorial ultra-rápido "cómo se hace" (guardable)
- **Por qué funciona:** los guardados indican valor duradero.
- **Estructura (30-45 s):** resultado → 3 pasos con texto grande ("1. Points + AdditiveBlending", "2. lerp a la forma", "3. bloom") → resultado otra vez → "guardá esto".
- **Regla:** máximo 3-4 ideas. Dar el código completo en el caption, comentarios o link, no en el video.

## 8. Antes / después y "detrás de escena"
- Mostrar el cubo gris por defecto → el mismo código con iluminación, bloom y postprocesado. Satisface por contraste.

---

## Selector rápido
| Objetivo | Formato recomendado |
|---|---|
| Alcance máximo / envíos | 1, 3, 4 |
| Retención y rewatch | 2, 6 |
| Guardados y autoridad | 5, 7 |
| Atraer clientes freelance | 5, 4 |
| Audiencia no técnica | 1, 2, 3 |

## Referencias reutilizables
Ver cómo estructurar los tiempos en `../threejs-guion-viral/SKILL.md` y los textos de apertura en `../threejs-ganchos/SKILL.md`.
