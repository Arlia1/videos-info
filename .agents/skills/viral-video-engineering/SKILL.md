---
name: viral-video-engineering
description: Use when scripting, structuring, timing, or coding short-form viral videos (Reels, TikTok, Shorts) for maximum retention, hook rate, and conversion.
---

# Viral Short-Form Video Engineering Playbook

Guía definitiva de ingeniería de contenido audiovisual corto (9:16 vertical, 15 a 30 segundos) para Reels, TikTok y YouTube Shorts. Basada en retención algorítmica, psicología de scroll, fórmulas de guión viral y directivas de renderizado por código.

---

## 1. La Anatomía del Algoritmo (Métricas Clave)

El éxito de un video corto depende de 3 métricas que el algoritmo mide en tiempo real:

| Métrica | Benchmark Viral | Cómo se Optimiza en Código / Guión |
| :--- | :--- | :--- |
| **Hook Rate (3s Hold)** | **> 65%** | Movimiento visual en t=0.0s, texto hook legible en <1.5s, voz arranca sin silencios. |
| **Average Watch Time** | **> 85%** | Ritmo acelerado (+8% a +14%), micro-estímulo cada 2s, evitar caídas de energía. |
| **Completion & Loop** | **> 45%** | Duración acotada (20–25s), remate que conecta con el inicio o CTA de fricción cero. |

---

## 2. La Estructura de 4 Fases (The Hook-Agitate-Reframe-Action Framework)

Para videos de conversión B2B/creadores (como estudios de danza, academias o comercios):

```
0.0s --------- 3.5s --------- 8.5s ---------------- 18.0s -------------- 24.5s
[ FASE 1: HOOK ] [ FASE 2: AGITAR ] [ FASE 3: EL REFRAME ] [ FASE 4: CTA ]
  Dolor inmediato    Validar empatía    Mecanismo único       Acción única
  Visual impactante   Flyers / Visto    Bailapp / Alumnas    Link en bio
```

### Fase 1: El Hook de Dolor Empático (0.0s – 3.5s)
- **Regla de Oro:** Prohibido el saludo institucional (*"Hola a todos"*, *"Bienvenidos"*).
- **Audio:** La primera palabra debe sonar en el milisegundo 0.
- **Visual:** Presentar la contradicción visual más fuerte (ej: la sala de danza hermosa pero vacía; el profesor esperando con el cronómetro).
- **Fórmulas de Hook:**
  - *Pregunta de dolor cerrado:* "¿Te pasa que abrís la sala, tenés todo listo... y no llega nadie?"
  - *La verdad incómoda:* "Tus profesores son buenísimos, pero tus clases siguen a medio llenar."
  - *Patrón interruptor:* "Son las siete de la tarde. Luces prendidas, piso encerado... y dos personas anotadas."

### Fase 2: Agitación & Empatía (3.5s – 8.5s)
- **Objetivo:** Hacer que el espectador sienta: *"Esta gente entiende exactamente mi día a día"*.
- **Mecanismo:** Describir la fricción real sin filtros:
  - Pelear contra el algoritmo de Instagram.
  - Subir historias con flyers que nadie lee.
  - Responder mensajes de *"¿info precio?"* para que te claven el visto.
- **Visual:** Elementos reconocibles en pantalla (burbujas de chat con visto azul `✓✓`, alcance cayendo, historias con 12 vistas).

### Fase 3: El Giro / Reframe (8.5s – 18.0s)
- **Objetivo:** Quitar la culpa del creador/dueño y presentar el *nuevo vehículo*.
- **Narrativa:** *"El problema no son tus clases ni tus precios. Es que estás buscando alumnas donde ya nadie busca."*
- **Revelación:** Las alumnas no están scrolleando pasivamente en Instagram; están en **Bailapp** buscando activamente qué bailar hoy en su barrio.
- **Visual:** Cambio drástico de iluminación (de frío/vacío a cálido/energético). Entran los personajes enérgicos, se muestra la app en smartphone y la barra de cupos sube al 100%.

### Fase 4: Clímax & Llamado a la Acción (18.0s – 24.5s)
- **Regla:** Una sola acción, con fricción cero.
- **PROHIBIDO:** *"Seguinos, dale like, compartí y descargá la app"*.
- **CORRECTO:** *"Sumá tu estudio a Bailapp gratis y llená tus salas. Link en bio."*
- **Visual:** Botón gigante pulsante de alta visibilidad y placa estética de marca.

---

## 3. Reglas de Pacing, Audio y Locución Natural

### Fonética y Dicción Rioplatense Natural
1. **Puntuación para TTS:**
   - Usar puntos seguidos para forzar caídas de tono naturales.
   - Usar puntos suspensivos `...` para pausas dramáticas de respiración.
   - Evitar oraciones subordinadas largas de más de 12 palabras.
2. **Vocabulario Coloquial Genuino:**
   - Usar: *"te matás armando flyers"*, *"te clavan el visto"*, *"pará un segundo"*, *"en tu barrio"*, *"para arrancar hoy"*.
   - Evitar palabras de spot televisivo tradicional: *"descubre"*, *"accede a nuestra plataforma"*, *"solución integral"*.
3. **Velocidad Óptima:**
   - Velocidad conversacional ágil: `--rate=+2%` a `--rate=+8%`. Superar el `+12%` tiende a mecanizar los fonemas consonánticos en Edge-TTS.
4. **Capa de Adaptación Fonética Obligatoria (Audio vs. Subtítulos):**
   - Las voces neuronales en español leen pésimo los extranjerismos, siglas y marcas escritas en inglés ("K-Pop", "Commercial", "gym", "Bailapp", "bailapp.com.ar").
   - **Regla estricta:** Desacoplar siempre el texto del prompt TTS del texto de subtítulos/pantalla.
     - En audio TTS: transcribir fonéticamente al español cómo suena naturalmente (ej. `queipop`, `comérshial`, `en el gimnasio`, `Bailap`, `bailap punto com punto ar`).
     - En pantalla y subtítulos: mantener siempre la ortografía y marcas oficiales impecables (`K-Pop`, `Commercial Dance`, `Gym`, `Bailapp`, `bailapp.com.ar`).

---

## 4. Estándar de Renderizado y Código Visual

### A. Anatomía y Creación de Personajes (Rig Vectorial Cohesivo)
- **PROHIBIDO:** Dibujar personajes con geometrías ad-hoc, polígonos rectos simplificados o proporciones inventadas.
- **MANDATORIO:** Todo nuevo personaje debe ensamblarse sobre un **rig vectorial anatómico validado** (ej. sistema *Humaaans* de Pablo Stanley), reutilizando exactamente las curvas Bézier de piernas (`Leg-Back`, `Leg-Front`), brazos estilizados (`Skin-Arms`), torso y rostro.
- **Diferenciación por Disciplina:** Los estilos de danza y arquetipos se expresan exclusivamente mediante capas de vestuario superpuestas (faldas plisadas, palazzos con tajo, calzas, cargo) y calzado auténtico (stiletto heels, zapatillas chunky platform, medias puntas), preservando siempre la armonía y calidad del conjunto.

### B. Responsive Auto-Sizing Badges (Píldoras Dinámicas Superiores)
Nunca usar anchos fijos (`width = 480`). El badge debe calcular su ancho según el texto medido con `measureText()` y mantenerse centrado:

```javascript
function drawDynamicHeaderBadge(g, text, W, CX) {
  g.save();
  g.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  
  const textWidth = g.measureText(text).width;
  const paddingH = 34; // Espaciado lateral
  const dotSize = 14;
  const gap = 16;
  
  const bw = Math.max(260, textWidth + paddingH * 2 + dotSize + gap);
  const bh = 60;
  const bx = CX - bw / 2; // Siempre centrado absoluto
  const by = 80;

  // Fondo cápsula
  g.fillStyle = '#FFFFFF';
  g.shadowColor = 'rgba(224, 99, 133, 0.16)';
  g.shadowBlur = 24;
  g.shadowOffsetY = 8;
  roundRect(g, bx, by, bw, bh, 30);
  g.fill();
  g.shadowColor = 'transparent';

  // Borde
  g.strokeStyle = '#FAD2E1';
  g.lineWidth = 2.5;
  g.stroke();

  // Indicador
  const dotX = bx + paddingH + dotSize / 2;
  g.fillStyle = '#E06385';
  g.beginPath();
  g.arc(dotX, by + bh / 2, 6, 0, Math.PI * 2);
  g.fill();

  // Texto perfectamente centrado en su bloque interior
  g.fillStyle = '#2D242E';
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  g.fillText(text, dotX + gap, by + bh / 2 + 1);

  g.restore();
}
```

### C. Jerarquía de Capas (Z-Index) y Personajes
- **Regla Inquebrantable:** Los personajes NUNCA deben mostrarse por encima de las tarjetas, modales, teléfonos o textos.
- **Orden de Capas:**
  1. Capa 0: Fondo escénico y partículas.
  2. Capa 1: Personajes vectoriales Humaaans (`drawCharacter`).
  3. Capa 2: Contenedores UI (Cards, Phone Mockups, Modales).
  4. Capa 3: Textos, Chips, Botones CTA y elementos interactivos dentro de los contenedores.
  5. Capa 4: Subtítulos Safe Zone (`drawSubtitleSafeZone`).
- En escenas con interfaz central (como mockups de celular), los personajes deben dibujarse en Capa 1 (antes del teléfono) o ubicarse en los flancos laterales extremos (`X ≈ 140–160` y `X ≈ W - 140–160`), sin invadir el contenido del mockup.

### D. Safe Zones Móviles y Prevención Inflexible de Desbordes
- **Eje Y Subtítulos:** Fijar al **38% desde el borde inferior** (Y = 1370 en resolución 1080×1920).
- **Eje X:** Centrado en `CX = 540`, ancho de cápsula `pillW = 960 px`, ancho máximo útil de texto `maxW = 870 px`.
- **PROHIBIDO:** Dividir líneas a ciegas con `split(' ')` por la mitad o fijar `fontSize` estático.
- **División Inteligente por Palabras y Auto-Escalado:**
  - Medir con `g.measureText()` contra `maxW`.
  - 1 línea: 33 px.
  - 2 líneas: 29 px (interlineado 38 px).
  - 3 líneas: 23 px (interlineado 31 px).
  - Reducción dinámica de 1 en 1 px si alguna palabra excede `maxW`, garantizando 0% de desborde fuera del contenedor.
- **Chips en Smartphones:** Distribuir el ancho equitativamente (`chipW = ((pw - 64) - gaps) / chips.length`) o envolver en 2 filas para evitar que sobresalgan del mockup.

---

## 5. Checklist de Verificación de Video Viral

Antes de dar por finalizado un guión o render:
- [ ] ¿Los primeros 2 segundos tienen un dolor o contradicción visible inmediata?
- [ ] ¿La locución arranca sin silencio inicial y habla de tú a tú en tono rioplatense?
- [ ] ¿Los badges superiores se adaptan dinámicamente al texto y no desbordan ni quedan vacíos?
- [ ] ¿Los subtítulos respetan la safe zone del 38% inferior y NUNCA desbordan la cápsula?
- [ ] ¿Los personajes están en Capa 1 (detrás de cards/teléfonos) y NUNCA tapan la interfaz ni los textos?
- [ ] ¿En personajes 3D Low-Poly se respeta el estándar V4 (100% geometría 3D, solo ojos y boca limpios, pies apoyados en $Y = 0.00$ y cero planos cuadrados)?
- [ ] ¿Los carteles flotantes 3D están claramente separados de las cabezas de los personajes (sin intersecciones ni solapamientos)?
- [ ] ¿Los carteles 3D permanecen 100% dentro del frustum/encuadre de cámara vertical 9:16 sin ser cortados lateralmente?
- [ ] ¿Los personajes posicionados sobre objetos (camas, sillas, podios) tienen su cota Y ajustada dinámicamente a la superficie del objeto?
- [ ] ¿Se crearon escenarios procedurales específicos si la narrativa lo requería en lugar de reciclar forzadamente el dormitorio?
- [ ] ¿Existe aislamiento escénico estricto (cero objetos fantasma ni geometrías superpuestas entre cortes de escena)?
- [ ] ¿El ritmo visual cambia o introduce un elemento nuevo cada 2–3 segundos con cámara dinámica continua?
- [ ] ¿El CTA propone una única acción concreta (link en bio)?
- [ ] ¿El audio final cumple la norma de broadcast (-14.0 LUFS / True Peak ≤ -1.0 dBFS)?
- [ ] ¿Se generó el archivo `copy.txt` con Hook, Copy persuasivo, CTA y Hashtags para publicación en redes?
