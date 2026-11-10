---
name: threejs-ganchos
description: Biblioteca y método para escribir ganchos (primeros 1-3 segundos) de videos virales de three.js, WebGL y creative coding. Usar cuando haya que abrir un Reel/TikTok/Short de código 3D, mejorar un arranque flojo, generar variantes de hook, o escribir el texto en pantalla inicial. Invocar también desde threejs-guion-viral en el paso del gancho.
---

# Ganchos para videos de three.js

Los primeros 1-3 s deciden si el video recibe más distribución. Instagram mide si el espectador pasa ese umbral. No hay un número oficial publicado de "retención aceptable"; los porcentajes que circulan son reglas empíricas de creadores. Tratarlos como orientación, no como verdad.

## Método
1. Escribir **5 ganchos** distintos (mezclando tipos).
2. Cada uno tiene 3 capas: **visual** (qué se ve en el frame 0), **texto** (máx. 7-8 palabras, legible en celular), **audio** (frase hablada o sonido).
3. Probarlo **en mute**: si no engancha sin sonido, reescribir.
4. Elegir el más específico y visual. Descartar los genéricos.

## Tipos de gancho (con ejemplos adaptables)

**1. Resultado primero (el más fuerte para visuales).** Arrancar con el momento más impactante, ya en movimiento.
- Visual: 200 000 partículas explotando y reformándose como una mano.
- Texto: "Esto corre en el navegador."

**2. Contraste de esfuerzo.** Poco input, resultado enorme.
- Texto: "Un solo prompt. Cero assets. Un juego 3D."
- Texto: "1 archivo HTML. Eso es todo."

**3. Desafío a una creencia.**
- Texto: "Dicen que 3D en la web es lento."
- Texto: "Esto NO es Blender. Es JavaScript."

**4. Control imposible / interacción mágica.** Funciona muy bien con hand tracking.
- Texto: "Controlo 3D con la mano. Sin mouse."

**5. Curiosidad con vacío de información.**
- Texto: "Mirá qué pasa cuando cierro el puño…"
- Texto: "Nadie nota esto hasta el segundo 8."

**6. Escala o número concreto.**
- Texto: "300 000 partículas. 60 fps. En tu celular."

**7. Pregunta directa al espectador.**
- Texto: "¿Esto es 3D real o un video?"

**8. Pattern interrupt visual.** Corte brusco, zoom extremo, cambio de color violento en el frame 0-1.

**9. Prueba social / identidad.** "Lo que hacen los devs que cobran por hacer webs 3D."

## Reglas
- Movimiento visible desde el primer frame; evitar fondos negros estáticos.
- Si hay voz, que la primera palabra sea el valor, no un saludo.
- El texto aparece en <0.5 s, queda 1.5-2.5 s y no tapa el efecto.
- Contraste alto: partículas brillantes sobre fondo oscuro funcionan, pero con un destello o movimiento fuerte inicial.
- Un hook que promete algo debe pagarse antes de que termine el video.
- Evitar mentir en el gancho: si el efecto depende de una máquina potente o un trucaje, no prometer "en cualquier celular".

## Ganchos por formato
Ver ejemplos específicos en `../threejs-formatos-virales/SKILL.md`.
