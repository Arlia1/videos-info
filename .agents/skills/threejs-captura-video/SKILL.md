---
name: threejs-captura-video
description: Cómo grabar y exportar escenas de three.js/WebGL como video vertical profesional (1080x1920, 30/60 fps, loops perfectos, captura determinista frame a frame, MediaRecorder, WebCodecs, ffmpeg, cámara, iluminación, bloom, zona segura). Usar al preparar la parte técnica de un guion de video, cuando el usuario pregunte cómo grabar su escena three.js, exportar a MP4, evitar frames perdidos, o hacer que el video loopee.
---

# Captura de video de escenas three.js

## Elegir método

| Método | Cuándo | Contras |
|---|---|---|
| **Grabación de pantalla** (OBS, nativa del OS) | Hand tracking o interacción en vivo con webcam | Calidad depende de la máquina; hay que cuidar la resolución |
| **`canvas.captureStream()` + `MediaRecorder`** | Prototipos rápidos, 30 fps | Graba en tiempo real con reloj de pared: si la escena es pesada se pierden frames y queda entrecortado |
| **Captura determinista frame a frame** (loop controlado, sin `requestAnimationFrame`) | Escenas pesadas, shaders, físicas, loops exactos | Más código |
| **WebCodecs (`VideoEncoder`) + muxer MP4** | Exportar MP4 desde el navegador | Compatibilidad según navegador |
| **Secuencia PNG + ffmpeg** | Máxima calidad | Lento y pesado en disco |

Regla: para visuales sin interacción en vivo, usar **captura determinista**. El tiempo de la escena sale de `t = frame / fps`, no del reloj real.

## Captura determinista (esquema)
```js
const fps = 60, duration = 12, total = fps * duration;
for (let i = 0; i < total; i++) {
  const t = i / fps;
  updateScene(t);            // todo depende de t, no de Date.now()
  renderer.render(scene, camera);
  await encodeFrame(renderer.domElement, i / fps); // WebCodecs o guardar PNG
}
```
- Con WebCodecs, los timestamps van en microsegundos y deben crecer de forma monótona; duración por frame = 1 000 000 / fps.
- Usar `preserveDrawingBuffer: true` si se leen píxeles del canvas.
- Para previsualizar sí usar `requestAnimationFrame`; para grabar, el loop controlado.
- Con ffmpeg: `ffmpeg -framerate 60 -i frame_%05d.png -c:v libx264 -pix_fmt yuv420p -crf 16 salida.mp4`.

## Loop perfecto
- Definir duración `D` y hacer toda animación periódica: `sin(2π·t/D)`, `cos(2π·t/D)`.
- Ruido en loop: muestrear el ruido sobre un círculo en el espacio 4D (`cos`, `sin` como dos coordenadas) en vez de avanzar linealmente.
- Verificar que el último frame sea casi idéntico al primero.
- Si hay partículas con vida útil, reiniciar con fase desfasada para que no haya "salto".

## Formato y encuadre
- **1080×1920 (9:16)**, 30 fps mínimo; 60 fps para movimiento rápido/shaders.
- `renderer.setPixelRatio(1)` en la captura para controlar el tamaño exacto; renderizar a la resolución final.
- Zona segura: dejar libres ~10-15 % arriba y ~20 % abajo (UI de la app) y los costados. El efecto principal en el tercio central.
- Subir con buen bitrate (H.264, yuv420p), el audio AAC.

## Look cinematográfico
- Fondo oscuro con color de contraste; `UnrealBloomPass` suave, no excesivo.
- Partículas: `AdditiveBlending`, `depthWrite:false`, tamaño con atenuación.
- Cámara con movimiento lento continuo (órbita o dolly), un push-in en el clímax.
- Tone mapping (`ACESFilmicToneMapping`) y `outputColorSpace = SRGBColorSpace`.
- Viñeta y leve grano para dar acabado; no abusar de aberración cromática.
- Postprocesado puede costar fps: bajarlo para preview y subirlo al grabar de forma determinista.

## Hand tracking (grabación en vivo)
- Buena iluminación frontal, fondo limpio, cámara estable.
- Suavizar landmarks con media móvil o filtro One Euro.
- Grabar la pantalla en 1080p+ y recortar a 9:16 en edición; mostrar la mano real y el efecto en simultáneo.
- Dejar 2-3 tomas; el tracking puede fallar.

## Audio y sincronía
- Marcar en el guion los beats del audio donde ocurre cada cambio visual (explosión en el drop, cambio de forma en el beat).
- En captura determinista, el audio se agrega después con ffmpeg: `ffmpeg -i video.mp4 -i audio.m4a -c:v copy -c:a aac -shortest final.mp4`.
- Los efectos de sonido sutiles (whoosh en transiciones, click en gestos) aumentan la sensación de calidad.
- Usar audio con licencia o la biblioteca de la propia plataforma.

## Checklist técnico
- [ ] 1080×1920, 30 o 60 fps constantes
- [ ] Sin frames perdidos ni stutter
- [ ] Loop cierra sin salto (si aplica)
- [ ] Texto en zona segura
- [ ] Brillo/contraste visible en pantalla de celular en brillo medio
- [ ] Audio sincronizado con los cambios
