---
name: threejs-guion-viral
description: Escribe guiones completos para videos cortos virales (Reels, TikTok, Shorts) hechos con three.js, WebGL, shaders, partículas, físicas o hand tracking. Usar SIEMPRE que el usuario pida un guion, idea, storyboard, estructura o "qué mostrar" para un video de three.js, creative coding, 3D en el navegador, demos visuales o "cosas que hice con código/IA", aunque no diga la palabra "guion". Es la skill maestra y coordina threejs-ganchos, threejs-formatos-virales, threejs-captura-video y threejs-publicacion-metricas.
---

# Guion viral para videos de three.js

## Principio
Instagram rankea sobre todo por **tiempo de visualización**, **envíos por alcance** (DMs) y **likes por alcance**. Un guion viral de three.js se diseña para tres cosas: que nadie se vaya en los primeros 1-3 s, que se vea hasta el final (o en loop), y que alguien piense "esto se lo mando a X". El código es el medio; el video es el producto.

## Flujo (seguir en orden)

1. **Brief mínimo.** Si falta, asumir y declarar los supuestos en una línea (no interrogar): tema/efecto, plataforma (default: Reels 9:16), duración (default 20-30 s), idioma (default: el del usuario), si habla a cámara o es solo visual, nivel del público (devs / diseñadores / curiosos).
2. **Elegir formato.** Leer `../threejs-formatos-virales/SKILL.md` y elegir el formato que mejor encaje. Si el usuario ya tiene un efecto hecho, elegir el formato que lo muestre mejor.
3. **Escribir el gancho primero.** Leer `../threejs-ganchos/SKILL.md`. Escribir 5 variantes del gancho (visual + texto + audio) y elegir la mejor. Nunca arrancar con "Hola, hoy les voy a mostrar...".
4. **Armar el beat sheet** con la estructura de abajo.
5. **Producción.** Agregar notas técnicas de captura según `../threejs-captura-video/SKILL.md` (resolución, fps, loop, cámara).
6. **Publicación.** Agregar caption, CTA, audio y hashtags según `../threejs-publicacion-metricas/SKILL.md`.
7. **Checklist final** (abajo) y entregar.

## Estructura base (15-30 s)

| Tramo | Qué pasa | Regla |
|---|---|---|
| 0-1.5 s | **Gancho**: el resultado más impactante o una pregunta/afirmación que genera curiosidad | Movimiento desde el frame 1. Texto grande en pantalla. Nada de logo ni intro |
| 1.5-5 s | **Promesa / contexto mínimo**: qué es esto y por qué importa | Una frase. Mostrar, no explicar |
| 5-20 s | **Escalada**: 2-3 "upgrades" del efecto (más partículas, nuevo gesto, cambio de forma, cambio de color/escala) | Cada 2-4 s algo cambia: cámara, forma, color, zoom, corte |
| 20-26 s | **Clímax / payoff**: el momento más espectacular | Guardarlo para el final, pero el gancho ya mostró un adelanto |
| Últimos 2-4 s | **Cierre en loop o CTA corto** | Que el último frame se conecte con el primero, o un CTA de una línea |

Para videos de 30-60 s agregar un "segundo gancho" a mitad (cambio de ritmo o revelación: "y lo mejor es que...") para sostener retención.

## Formato de salida del guion

Entregar siempre:

1. **Título interno + formato elegido + duración + supuestos** (3 líneas).
2. **Tabla de guion** con columnas: `Tiempo | Visual (qué se ve y qué hace la cámara) | Texto en pantalla | Audio / voz | Nota técnica three.js`.
3. **Variantes de gancho** (las 5, marcando la elegida).
4. **Caption + CTA + hashtags + audio sugerido.**
5. **Checklist de retención** completado.

Hablar de forma concreta: "300 000 partículas cambian de esfera a corazón al cerrar el puño", no "un efecto cool".

## Checklist de retención
- [ ] Hay movimiento y texto en el frame 0-1.5 s
- [ ] Se entiende sin sonido (texto en pantalla cubre la idea; mucha gente mira en mute)
- [ ] Algo cambia al menos cada 2-4 s
- [ ] El clímax está en el último tercio
- [ ] El final loopea o deja una razón para rever
- [ ] Hay un motivo explícito para **enviarlo** ("mandáselo a un dev que dice que 3D en web es difícil") o **guardarlo** (promete código/prompt)
- [ ] Duración mínima necesaria; recortar todo lo que no sube la tensión
- [ ] Formato vertical 9:16 con zona segura (no poner texto en el borde inferior ni lateral)

## Errores comunes
- Mostrar el código o el editor antes que el resultado.
- Explicar la técnica antes de enseñar el efecto. Primero "wow", después "cómo".
- Escenas oscuras y estáticas los primeros segundos.
- Un solo efecto repetido 20 s sin escalada.
- CTA genérico ("seguime"). Preferir uno ligado al contenido ("comentá CÓDIGO y te paso el prompt").
