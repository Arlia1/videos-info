---
name: bailapp-viral-video
description: Directivas de estilo, fórmulas de guión viral, estética visual pastel, safe zones y pipeline de producción de video corto para Bailapp (Cono Sur Latam).
---

# Bailapp — Manual de Estilo y Pipeline de Producción de Video Viral

Este documento define el estándar creativo, narrativo, auditivo, anatómico y técnico definitivo para producir contenido en video de alto impacto y retención para **Bailapp** en TikTok, Instagram Reels y YouTube Shorts, optimizado para el público de **Argentina, Uruguay y Chile**.

---

## 1. Directiva Fundamental de Producción: Animación 100% por Código (2D & Low Poly 3D)

- **PROHIBIDO:** Usar modelos de IA generativa de imágenes (Midjourney, DALL-E, Flux, Stable Diffusion, etc.) o fotorrealismo.
- **MANDATORIO:** Todo el arte y animación se genera **programáticamente con CÓDIGO** (HTML5 Canvas 2D, WebGL / Three.js, JavaScript / GSAP, renderizado vía Chromium Headless / FFmpeg).
- **Estilos Aprobados para Bailapp:**
  1. **Animación Vectorial / Motion Graphics Estilizado (2D):**
     - Personajes vectoriales sobre el sistema modular *Humaaans* (Pablo Stanley).
     - Activos aislados en capas limpias.
  2. **Estilo Low Poly 3D Minimalista (*Low-Poly Pastel World*):**
     - Geometría tridimensional faceteada (`flatShading: true`, sin texturas ruidosas), inspirada en la elegancia geométrica de *Monument Valley* adaptada a la identidad juvenil de Bailapp.
     - Modelado paramétrico de escenarios por primitivas geométricas reducidas (cajas, prismas, cilindros de 6 a 8 caras, conos, icosaedros de nivel 0).
     - Iluminación facetada con luz direccional y ambiental cálida que esculpe sombras geométricas suaves en cada polígono.
- **Estilos Descartados para Bailapp:** *Pixel Explain*, *Paper Cut* y fotorrealismo 3D tipo Pixar/chibi infantil quedan estrictamente descartados.

---

## 2. Identidad Visual: *Soft Pastel Motion* (Paleta Rosa y Low-Poly Pastel)

Quedan **estrictamente prohibidos**:
- Estilos 3D tipo Pixar / caricatura corporativa / estilo chibi infantil.
- Luces de neón cyberpunk agresivas o estéticas oscuras/pesadas.
- **Personajes o elementos 3D superpuestos por encima de tarjetas, textos, botones o interfaces:** Las tarjetas y elementos de UI son el mensaje central y deben permanecer 100% nítidos, legibles y en primer plano.
- **Desbordes de texto fuera de sus contenedores:** Ningún texto, subtítulo, badge o chip puede sobresalir de los bordes de su bloque visual.

### Paleta de Color Mandatoria:
- **Rosa Pastel Base:** `#FAD2E1`, `#F8C8DC`, `#FCE8F0` (delicado, aesthetic, clean).
- **Tonos de Apoyo:** Crema cálido (`#FFF9F5`), Nude / Beige suave (`#F4E8C1`, `#D8C2B0`), Blanco puro (`#FFFFFF`).
- **Acentos Vibrantes:** Rosa frambuesa suave (`#E06385`), Magenta enérgico (`#D81B60`), Menta pastel (`#D1FAE5`), Lavanda suave (`#EDE9FE`).
- **Tipografía y Contraste:** Gris carbón suave (`#2D242E`), washed black para textos de máxima legibilidad.

---

## 2.1. Arquitectura de Escenarios 3D Modulares Dinámicos (Low-Poly Stage Swapping)

Para videos en estilo Low Poly 3D, el motor debe permitir **generar y alternar escenarios procedimentales según los requerimientos del guión**, manteniendo un rendimiento ultrarrápido y determinista en Three.js / WebGL / Canvas.

### Catálogo de Escenarios Procedimentales según la Narrativa:
1. **`stage_bedroom` (El Cuarto Claustrofóbico / Expectativa vs. Realidad):**
   - **Elementos Low-Poly:** Cama facetada con acolchado rosa pastel, mesita de noche geométrica con libros apilados, smartphone 3D apoyado en ángulo, lámpara de noche con luz tenue cálida, espejo de cuerpo entero facetado.
   - **Atmósfera:** Espacio acotado (1×1m) que transmite la frustración de no tener espacio para bailar.
2. **`stage_office` (La Rutina / Salida de la Facu o Trabajo a las 18 hs):**
   - **Elementos Low-Poly:** Escritorio bajo minimalista, laptop facetada abierta, iconos de sobres de correo flotando en 3D (`✉️`), indicador de batería baja (`🪫`) parpadeante.
   - **Atmósfera:** Tonos fríos/desaturados que contrastan con la posterior explosión de energía.
3. **`stage_studio` (El Estudio Real Bailapp / Moda Videoclip):**
   - **Elementos Low-Poly:** Gran pista de danza con tablones de madera facetada en tono crema/rosado (`#F5EDE8`), pared de espejos gigantes con reflejos angulares, reflectores de estudio cenitales que proyectan conos de luz pastel volumétrica, columnas de sonido/subwoofers low-poly vibrando al ritmo.
   - **Atmósfera:** Brillante, espaciosa, alegre y liberadora.
4. **`stage_smartphone` (La Solución Interactiva en 3D):**
   - **Elementos Low-Poly:** Chasis de smartphone iPhone 3D facetado girando en ángulo isométrico suave, con tarjetas de clases flotando en relieve tridimensional ("Dancehall Principiantes", "Heels desde cero", "K-Pop Choreo"), badges de cupos y botones de reserva 3D interactivos.
   - **Atmósfera:** UI moderna, táctil, limpia y magnética.
5. **`stage_podium` (Clímax, Celebración & Conversión Final):**
   - **Elementos Low-Poly:** Podio cilíndrico o hexagonal facetado de celebración, lluvia de prismas y confeti geométrico flotando suavemente, y la Gran Placa Oficial de Conversión con el dominio `bailapp.com.ar`.

### Reglas para Crear Nuevos Escenarios según el Guión:
- **Ensamblaje por Primitivas Puras:** Todo nuevo escenario debe construirse combinando geometrías simples (`BoxGeometry`, `CylinderGeometry(r, r, h, 6)`, `ConeGeometry`, `IcosahedronGeometry(r, 0)`).
- **Materiales:** `MeshStandardMaterial({ flatShading: true, roughness: 0.85, metalness: 0.05 })` o sombreado faceteado plano. Sin mapas de textura pesados.
- **Transición entre Escenarios:** Usar interpolación suave de rotación de cámara (turntable), barridos de luz, o apariciones con rebote elástico (*overshoot* / *springy bounce* `easeOutBack`).

---

## 2.2. Principio de Limpieza Escénica (Clean Environment — Cero Partículas Voladoras Invasivas)

- **PROHIBIDO:** Llenar el escenario con partículas voladoras desordenadas, sparkles aleatorios o confeti flotando en toda la pantalla. Generan ruido visual, abarrotan la composición y distraen de los mensajes clave y de la coreografía.
- **MANDATORIO:** Mantener un entorno limpio, enfocado, ordenado y minimalista.
  - La atención debe residir en:
    1. La coreografía y expresividad de los personajes 3D.
    2. La arquitectura del diorama 3D (cuarto, estudio, espejos, teléfono).
    3. La claridad tipográfica de las tarjetas y los subtítulos.
  - La iluminación y atmósfera se resuelven con **haces de luz volumétrica suaves**, sutiles pulsos en los subwoofers y sombras de contacto proyectadas en el suelo.

---

## 2.3. Sistema Central de Assets Compartidos y Personajes 3D Low-Poly Mejorados (Enhanced Low-Poly)

Todos los activos tridimensionales procedimentales generados para Bailapp se almacenan de forma permanente y modular en la carpeta central del proyecto:
📁 `bailapp_shared_3d/`
├── `characters/` (`character_builder.js`, `character_presets.js`)
├── `stages/` (`stage_bedroom.js`, `stage_studio.js`, `stage_smartphone.js`, `stage_podium.js`)
├── `props/`
└── `audio/` (`mix.wav`, `subtitles.vtt`, `voiceover.mp3`)

### Directiva de Geometría Facetada con Mayor Conteo Poligonal ("Menos Cuadrados, Más Poly"):
- **PROHIBIDO:** Usar exclusivamente `BoxGeometry` para todas las partes del cuerpo (estilo Minecraft / cajas de cartón toscas).
- **MANDATORIO:** Utilizar primitivas facetadas con mayor densidad poligonal (`flatShading: true`), logrando una silueta orgánica, atlética y estilizada (referencia visual: *Monument Valley*, *Crossy Road*, animación indie estilizada):
  1. **Cabeza y Rostro Minimalista 100% 3D (`head` - Estándar V4 Aprobado):**
     - **PROHIBIDO:** Usar planos cuadrados 2D (`PlaneGeometry`) con texturas Canvas como máscara facial (generan el defecto visual de "cuadrado blanco" flotante).
     - **PROHIBIDO:** Sobrecargar el rostro con cejas pesadas, nariz 3D, rubor o delineado alado grueso (crean cúmulos de polígonos oscuros que a la distancia parecen manchas negras).
     - **MANDATORIO: Solo Ojos y Boca en 3D puro:**
       - **Ojos 3D:** Esclera blanca elíptica luminosa (`CylinderGeometry(0.040, 0.040, 0.012, 14)` con material blanco emissive `0.25`), iris/pupila limpia en tono espresso profundo (`#2E1E1E`), destello especular blanco esférico kawaii (`SphereGeometry(0.0085, 8, 8)`) y contorno superior fino biselado (`BoxGeometry(0.082, 0.012, 0.014)`).
       - **Boca 3D:** Sonrisa radiante curva hacia arriba en medio toroide 3D (`TorusGeometry(0.036, 0.009, 8, 16, Math.PI)` en tono frambuesa coral `#E05375`) con prisma de dientes blancos alineados en su interior (`BoxGeometry(0.036, 0.009, 0.012)` blanco emissive).
       - Base craneal: Cráneo continuo esférico facetado (`SphereGeometry(0.23, 14, 10)`), mandíbula cónica (`CylinderGeometry(0.22, 0.15, 0.22, 12)`) y mentón suave (`DodecahedronGeometry(0.08, 0)`).
  2. **Calibración y Apoyo en el Piso Real ($Y = 0.00$):**
     - El centro de masa de la cadera se calibra estrictamente en `hips.position.y = 0.84`.
     - La suma de muslo ($-0.38$) y pantorrilla ($-0.38$) con el offset de cadera ($-0.08$) es exactamente $0.84$.
     - Esto garantiza que la suela de la zapatilla o tacón descanse con contacto físico exacto a $Y = 0.00$, con una sombra volumétrica elíptica suave en $Y = 0.005$.
  3. **Carteles Flotantes con Tipografía Real 3D:**
     - Todo cartel o globo flotante en 3D (ej. burbuja de DM, flyer de cupo lleno) debe texturizarse con `CanvasTexture` renderizando tipografía real de alta resolución, marcas de tiempo, emojis y sellos diagonales nítidos (ej. *"CUPO LLENO ❌"*).
  4. **Cámara Dinámica Continua:**
     - Prohibido dejar la cámara estática en un solo ángulo. Utilizar trayectorias continuas mediante curvas spline o interpolación lerp (Dolly in, Orbit panorámico, Tilt y Crane) sincronizadas con los cortes de escena y el beat musical.
  5. **Cabello Esculpido (`hair`):**
     - Casquete con volumen facetado (`SphereGeometry(0.285, 12, 10)`).
     - Mechones frontales y laterales cónicos (`ConeGeometry(..., 6)` o prismas biselados) que enmarcan la cara con movimiento.
     - Estilos según personaje: `long_wavy` (ondas en cascada con 5 mechones independientes), `high_ponytail` (cola alta con coletero), `space_buns` (rodetes dobles), o `bob` (corte recto biselado).
  3. **Torso y Pecho (`torso`):**
     - Silueta de bailarina atlética: Pecho cónico `CylinderGeometry(0.26, 0.20, 0.32, 10)` aplanado sutilmente en Z (`scale(1.15, 1.0, 0.76)`), cintura definida `CylinderGeometry(0.20, 0.22, 0.16, 10)`.
     - Cuello cilíndrico suave de 8 caras.
  4. **Pelvis y Cadera (`hips`):**
     - Centro de pivote `CylinderGeometry(0.23, 0.26, 0.22, 10)` con ribete/cinturón de contraste.
  5. **Brazos y Piernas Articulados en 2 Tramos:**
     - Hombros, codos, caderas y rodillas con esferas de articulación (`SphereGeometry(r, 8, 8)`).
     - Extremidades cónicas ahusadas (`CylinderGeometry` de 8 caras, más ancho arriba, más fino en muñecas y tobillos).
     - Manos estilizadas con pulgar separado para poses de baile y sujeción de smartphone.
     - Calzado facetado: Sneakers urbanas chunky con suela blanca gruesa y detalle de color, o tacones para Heels.
  6. **Sombra de Contacto:**
     - Sombra elipsoidal volumétrica suave en el piso (`CylinderGeometry(0.48, 0.52, 0.02, 16)` con opacidad 0.22) que ancla visualmente al personaje en el diorama.
   - Capacidad para sostener un mini smartphone low-poly, cruzar brazos, posar en cadera o levantar brazos en pasos de baile.
6. **Extremidades Inferiores (`legL`, `legR`) y Calzado:**
   - Muslo y pantorrilla con articulación de rodilla.
   - Calzado estilizado según el estilo de baile:
     - **Zapatillas Urbanas/Chunky:** `BoxGeometry(0.24, 0.16, 0.42)` en blanco y rosa pastel.
     - **Tacones Heels:** Empeine arqueado con taco aguja estilizado en frambuesa/negro.

### Animación y Coreografía Procedural en Código:
- **Groove de Danza:** `torso.position.y = baseY + Math.sin(t * tempo) * 0.12`
- **Sway de Caderas:** `hips.rotation.z = Math.sin(t * tempo * 0.5) * 0.15`
- **Pose de Brazos y Cabeza:** Rotación angular con rebote suave para acompañar el ritmo musical.
- **Sombras Proyectadas:** Todo personaje tiene `castShadow = true`, proyectando su sombra volumétrica sobre la pista de madera del estudio o el suelo del cuarto.

---

## 2.4. Reglas Críticas de Composición Espacial 3D, Cámaras y Escenarios

Para evitar errores visuales comunes en escenas 3D renderizadas por código, se deben aplicar las siguientes directrices obligatorias:

### A. Separación Espacial Estricta de Carteles Flotantes (Anti-Clipping de Cabezas)
- **PROHIBIDO:** Posicionar carteles flotantes en coordenadas donde sus esquinas o planos colisionen o se integren con la cabeza o el cabello de los personajes.
- **MANDATORIO:** La cabeza del personaje ocupa la cota $Y \in [1.35, 1.90]$ m.
  - Si el cartel está centrado sobre el personaje, debe situarse a una cota superior segura: $Y \ge 2.45$ m con $Z$ adelantado ($Z \ge 0.5$ m).
  - Si el cartel se posiciona hacia un flanco lateral, debe tener un offset suficiente ($X \le -1.1$ m o $X \ge 1.1$ m) y al menos $0.8$ m de margen en Z para evitar cualquier intersección durante las rotaciones y gestos.

### B. Frustum Safe Framing en Formato Vertical 9:16
- En video vertical 9:16 con cámara en perspectiva (FOV $38^\circ$), el semiancho horizontal útil a distancia $D$ es aproximadamente $0.194 \times D$.
- A $D = 7.0$ m de distancia, la ventana visible abarca desde $X = -1.35$ m hasta $X = +1.35$ m.
- **Regla Inflexible:**
  - Todo cartel flotante lateral debe tener un ancho máximo acotado ($1.2$ a $1.4$ m) o situarse con centro en $X \in [-0.25, 0.25]$ si es ancho ($1.8$ a $2.1$ m).
  - Ningún cartel puede quedar cortado por el borde lateral o superior de la cámara.

### C. Posicionamiento Dinámico sobre Objetos y Grounding Inviolable (Superficies)
> [!IMPORTANT]
> Ver skill complementaria obligatoria: `.agents/skills/threejs-grounding-anti-superposicion/SKILL.md`.
- **CERO PERSONAJES FLOTANDO:** Ningún personaje puede tener los pies flotando en el aire sobre el suelo o sobre cualquier mueble.
- Si el personaje se posiciona sobre un objeto (sentado en la cama, apoyado en una mesada o parado sobre un podio elevado), **su coordenada de origen no debe fijarse en $Y = 0.00$ ciega ni arbitrariamente**.
  - Debe calibrarse exactamente a la altura de contacto de la superficie:
    - Piso de parquet / Estudio: `Y = 0.00`
    - Cinta de correr del gimnasio: `Y = 0.24`
    - Podio 1º puesto: `Y = 0.65`, 2º puesto: `Y = 0.42`, 3º puesto: `Y = 0.30`
    - Almohadón del sillón: `Y = 0.44` (con articulación de piernas en ángulo de 90°)
    - Colchón de la cama: `Y = 0.70`
- **Generación de Escenas Nuevas por Guion:** Si el guion plantea una temática específica (ej. gimnasio con pesas, oficina, estudio con barra de ballet), **se debe programar proceduralmente la escena nueva correspondiente** (`stage_gym.js`, `stage_office.js`), sin reciclar forzadamente el dormitorio para situaciones que requieren otro contexto.

### D. Cámara con Movimiento Continuo y Dinámico
- Prohibida la cámara fija o con vibración mínima.
- Aplicar trayectorias compuestas con splines o interpolaciones continuas:
  - Travelling / Dolly hacia el sujeto con cambio de altura (Crane).
  - Órbitas cinemáticas circulares o arcos de 3/4 que acentúen la tridimensionalidad low-poly.
  - Sincronización precisa entre las aceleraciones de cámara y los drops musicales.

### E. Aislamiento Escénico Estricto y Cero Superposición de Bloques (Anti-Clipping)
> [!IMPORTANT]
> Todo elemento 3D (carteles, muebles, pantallas, personajes) debe cumplir las reglas de separación espacial para evitar solapamientos visuales (z-fighting, colisión de mallas, carteles incrustados en cabezas).
- **Separación entre bailarines:** Distancia lateral mínima $|\Delta X| \ge 0.85$ m o escalonamiento en Z ($|\Delta Z| \ge 0.5$ m) para evitar colisión de extremidades en animaciones rítmicas.
- **Carteles flotantes:** Altura mínima sobre la coronilla del personaje ($Y \ge 2.15$ m) o desplazamiento lateral con margen ($|\Delta X| \ge 0.75$ m). Nunca atravesar la cabeza del personaje.
- En cada transición entre escenas narrativas ($t \ge t_{corte}$), **todos** los elementos pertenecientes a la escena previa deben desactivarse de forma inmediata e inequívoca:
  ```javascript
  stagePrevio.visible = false;
  signPrevio.visible = false;
  charPrevio.root.visible = false;
  ```
- No pueden quedar carteles huérfanos, sombras residuales ni geometrías del plano anterior flotando en la escena activa.
- **Auditoría Previa de 3 Stills:** Antes de dar por bueno un render, capturar 3 fotogramas de prueba en $t=2s$, $t=12s$ y $t=22s$ para verificar apoyo de pies y ausencia de colisiones.

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
6. **`character_kpop.png` (Bailarina K-Pop / Commercial Dance):**
   - Rig Humaaans idéntico a Heels y Urbano: falda tenis tableada/plisada con tablas en negro carbón y cinturilla rosa pastel, zapatillas chunky de plataforma urbana blanca con suela rosa, top cropped ceñido con corte idol y mechón fino de acento pastel en el flequillo.
7. **`character_bachata.png` (Bailarina de Bachata / Ritmos Latinos):**
   - Rig Humaaans espejado con postura sensual: pantalón palazzo de baile latino con caída fluida y tajo lateral que descubre la línea de pierna y los tacones de salón stiletto, top halter cruzado frambuesa/vino y aros argolla dorados (*hoop earrings*).

---

## 4. Reglas Críticas de Anatomía y Creación de Nuevos Personajes

1. **PROHIBIDO Inventar Geometrías Ad-Hoc:** Queda terminantemente prohibido dibujar personajes con polígonos rectos simplificados, trapecios o anatomía inventada. Pierden de inmediato la estética y se ven toscos.
2. **Preservación Obligatoria del Rig Humaaans:** Todo nuevo personaje debe construirse **directamente sobre el código SVG modular del rig oficial de Humaaans** (Pablo Stanley), utilizando las coordenadas Bézier exactas de:
   - Piernas: `Leg-Back` y `Leg-Front` con sus curvas anatómicas de muslo, rodilla, pantorrilla y empeine.
   - Brazos: `Skin-Arms` con la curvatura de codos, antebrazos y manos estilizadas sosteniendo el smartphone (`Hand-Phone`).
   - Torso y Cuello: `Top-Body` y `Head-Skin`.
   - Cabello: `Hair-Wavy` (ondulado voluminoso) o `Hair-Front` + `Hair-Back` naturales.
3. **Variación Exclusiva por Capas de Vestuario:** Los distintos géneros de danza se diferencian únicamente modificando las capas textiles (faldas, calzas, palazzos, tops) y el calzado (stilettos de heels, zapatillas chunky, zapatillas de media punta) montadas sobre el rig anatómico invariable.
4. **Cabello:** Siempre **suelto, ondulado o lacio natural**. Queda terminantemente prohibida la coleta (cola de caballo) o el rodete/bun apretado, ya que infantiliza la figura.
5. **Contraste de Ropa:** La ropa de la bailarina debe generar contraste visual respecto al fondo pastel (usar negros, carbón, grises profundos, frambuesa, ciruela, arena u oliva).

---

## 5. Voz, Dicción, Tono y Adaptación Fonética TTS

- **Nombre de Marca:** Siempre **«Bailapp»** en pantalla y subtítulos.
- **PROHIBIDO:** Decir *"la app de danza del cono sur"*. En su lugar usar: *"Encontrá tu clase y reservá en un toque"*.
- **Pacing de Locución:** La voz neuronal debe sintetizarse con aceleración conversacional (**`--rate=+2%` a `--rate=+6%`** en frases complejas o **`--rate=+10%`** en frases cortas) para sonar ágil, enérgica y humana, eliminando la cadencia lenta o robótica de audiolibro.
- **Voz TTS Oficial:** `es-AR-ElenaNeural` (o `es-UY-ValentinaNeural`).
- **Duración Ideal:** Entre **22 y 30 segundos** en total para mantener la máxima retención.

### Regla de Oro: Separación de Texto Fonético (Audio) vs. Ortografía Visual (Subtítulos/UI)
Las voces TTS neuronales en español (`es-AR-ElenaNeural`) **no leen bien palabras en inglés, siglas ni marcas con doble consonante**; las deletrean o pronuncian de forma tosca ("ka pop", "co-mer-cial", "gim", "baila-pe-pe", "punto a erre").
**SOLUCIÓN OBLIGATORIA:** Separar siempre el texto que lee el motor TTS del texto que se muestra en pantalla:

| Término / Concepto | En Pantalla / Subtítulos (Ortografía Real) | En Guion TTS (Adaptación Fonética) | Razón / Pronunciación Resultante |
| :--- | :--- | :--- | :--- |
| **K-Pop** | `K-Pop` / `K-Pop Choreo` | `queipop` o `kei pop` | Evita que diga "ka pop"; pronuncia [kej-pɒp] nativo. |
| **Commercial Dance** | `Commercial Dance` | `comérshial` | Evita "co-mer-cial"; pronuncia [ko'meɾʃjal] auténtico. |
| **Gym** | `Gym` / `en el gym` | `en el gimnasio` | Evita pronunciaciones extrañas o forzadas de "gym". |
| **Bailapp** | `Bailapp` | `Bailap` (con una sola 'p') | Evita que deletree o enfatice la doble p ("Báilap" fluido). |
| **bailapp.com.ar** | `bailapp.com.ar` | `bailap punto com punto ar` | Evita el robótico "punto a erre" y suena como lo dice un argentino. |
| **Reggaetón** | `Reggaetón` | `reguetón` | Fonética estándar en español con acento perfecto. |
| **Link en bio** | `Link en bio` | `Encontrá el link en bio` o `Enlace en bio` | Dicción directa y sin trabas fonéticas. |
| **DMs / WhatsApp** | `DMs` / `WhatsApp` | `mensajes directos` / `mensajes` | Fluidez conversacional rioplatense. |

---

## 6. Jerarquía Estricta de Capas y Z-Index Inviolable (2D y Low Poly 3D)

Queda **terminantemente prohibido** que los personajes o elementos del entorno 3D se dibujen sobre tarjetas de interfaz, teléfonos móviles, modales, botones o bloques de texto. 

### Orden Mandatorio de Capas (de atrás hacia adelante):
```
[ Capa 0: Escenario 3D Low-Poly / Fondo Escénico / Iluminación Facetada ]
                                    ↓
[ Capa 1: Personajes / Modelos Low-Poly / Bailarinas Humaaans ]
                                    ↓
[ Capa 2: Contenedores Estructurales UI (Cards, Phone Mockups 3D/2D, Modales) ]
                                    ↓
[ Capa 3: Contenido UI Interior (Textos, Botones, Chips, Iconos, Shimmers) ]
                                    ↓
[ Capa 4: Subtítulos Safe Zone (`drawSubtitleSafeZone` en Y = 1370 px) ]
```

### Reglas de Implementación en Código (Aplica a 2D y 3D):
1. **Invocación Anticipada de Personajes y Escenarios:** En cualquier escena donde coexistan elementos 3D / personajes y elementos de UI (tarjetas, mockup de smartphone o botones CTA), el escenario 3D y los personajes **DEBEN renderizarse SIEMPRE ANTES** de dibujar el contenedor de UI. De esta manera, el contenedor se renderiza naturalmente encima del personaje y del escenario si hay intersección.
2. **Flancos Seguros en Smartphone Mockup:**
   - Cuando un smartphone mockup ocupe el centro de la pantalla (`pw ≈ 680–700 px`, abarcando desde $X \approx 190$ hasta $X \approx 890$), las bailarinas acompañantes o elementos del entorno deben situarse en los flancos laterales extremos (`X = 140–160` a la izquierda, `X = W - 140–160` a la derecha) con escala equilibrada (`scale = 1.05–1.12`).
   - Las manos, smartphones o siluetas de los personajes NUNCA deben tapar las tarjetas de clases, los títulos ni los botones de «Reservar».
3. **Escena de CTA Final:** La tarjeta de conversión con el enlace oficial `bailapp.com.ar` y su botón interactivo deben dibujarse en Capa 2 y Capa 3. Los personajes y el podio 3D se dibujan en Capa 0 y Capa 1, con coordenadas base ajustadas para no colisionar de forma invasiva con el botón web.

---

## 7. Contención Inviolable de Textos dentro de sus Contenedores (Cero Desbordes)

> [!IMPORTANT]
> Ver skill complementaria: `.agents/skills/threejs-grounding-anti-superposicion/SKILL.md` (Sección 4.4 y 4.5).
> **REGLA MANDATORIA DE CONTENCIÓN:**
> Todo texto que se renderice dentro de cualquier contenedor visual (tarjetas, badges, pastillas/chips, botones, carteles 3D, modales o subtítulos) **DEBE quedar 100% contenido en su interior**.
> Queda terminantemente **PROHIBIDO** que cualquier texto, letra o glifo desborde, sobresalga, se corte o toque los bordes de su caja contenedora.

Queda **estrictamente prohibido**:
- Dividir textos a ciegas con `split(' ')` por la mitad asumiendo 2 líneas fijas.
- Usar tamaños de fuente estáticos sin verificar la medida real con `g.measureText()`.
- Permitir que una sola fila de chips de categorías desborde el ancho útil de un smartphone o tarjeta.
- Cualquier texto que toque o traspase el borde de su contenedor (tarjeta, píldora de subtítulo o chip).
- Diseñar botones o badges donde las palabras largas queden pegadas al radio de curvatura (`roundRect`).

### A. Invariante de Padding Interno Seguro (Safe Inner Padding)
- **Padding horizontal mínimo:** $10\%$ del ancho de la caja o al menos $20$ px a cada lado.
- **Padding vertical mínimo:** al menos $12$ a $16$ px arriba y abajo.
- El ancho disponible para texto siempre es: $W_{\text{disponible}} = W_{\text{contenedor}} - 2 \times \text{paddingX}$.

### B. Algoritmo Obligatorio de Auto-Fit de Fuente (Auto-Scaling):
Antes de ejecutar `fillText()` en cualquier contenedor de tamaño predeterminado:
```javascript
function fitTextInBox(ctx, text, maxW, baseSize = 32, minSize = 14) {
  let size = baseSize;
  ctx.font = `700 ${size}px "Outfit", sans-serif`;
  let measured = ctx.measureText(text).width;
  if (measured > maxW) {
    size = Math.max(minSize, Math.floor(baseSize * (maxW / measured)));
    ctx.font = `700 ${size}px "Outfit", sans-serif`;
  }
  return size;
}
```

### C. Algoritmo Canónico para Subtítulos Seguros (`drawSubtitleSafeZone`)
El contenedor de subtítulos se sitúa en la safe zone vertical ($Y = 1370\text{ px}$, $W = 960\text{ px}$, $H = 132\text{ px}$). El texto interno **debe ajustarse dinámicamente** mediante partición inteligente por palabras y escalado dinámico de fuente:

```javascript
function wrapWordsToLines(g, text, maxW) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let current = '';
  for (const w of words) {
    const test = current ? current + ' ' + w : w;
    if (g.measureText(test).width <= maxW) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawSubtitleSafeZone(g, text) {
  const subY = 1370;
  const pillW = 960;
  const pillH = 132;
  const pillX = (W - pillW) / 2;
  const maxW = pillW - 90; // 870 px de ancho máximo útil (45 px de margen interior a cada lado)

  g.save();

  // Fondo cápsula con sombra soft pastel
  g.fillStyle = 'rgba(255, 255, 255, 0.98)';
  g.shadowColor = 'rgba(224, 99, 133, 0.22)';
  g.shadowBlur = 32;
  g.shadowOffsetY = 12;
  roundRect(g, pillX, subY, pillW, pillH, 36);
  g.fill();
  g.shadowColor = 'transparent';

  g.strokeStyle = '#F8C8DC';
  g.lineWidth = 2.5;
  g.stroke();

  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#2D242E';

  // Selección dinámica de tamaño de fuente según cantidad de líneas necesarias
  let fontSize = 33;
  g.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  let lines = wrapWordsToLines(g, text, maxW);

  if (lines.length === 2) {
    fontSize = 29;
    g.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    lines = wrapWordsToLines(g, text, maxW);
  } else if (lines.length >= 3) {
    fontSize = 23;
    g.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    lines = wrapWordsToLines(g, text, maxW);
  }

  // Reducción preventiva si alguna palabra o línea aún supera maxW
  while (fontSize > 16) {
    let overflow = false;
    for (const l of lines) {
      if (g.measureText(l).width > maxW) {
        overflow = true;
        break;
      }
    }
    if (!overflow) break;
    fontSize -= 1;
    g.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    lines = wrapWordsToLines(g, text, maxW);
  }

  // Distribución vertical equilibrada dentro de la cápsula
  if (lines.length === 1) {
    g.fillText(lines[0], CX, subY + pillH / 2);
  } else if (lines.length === 2) {
    const spacing = 38;
    const startY = subY + pillH / 2 - spacing / 2;
    g.fillText(lines[0], CX, startY);
    g.fillText(lines[1], CX, startY + spacing);
  } else {
    const spacing = 31;
    const startY = subY + pillH / 2 - spacing;
    g.fillText(lines[0], CX, startY);
    g.fillText(lines[1], CX, startY + spacing);
    g.fillText(lines[2], CX, startY + spacing * 2);
  }

  g.restore();
}
```

### B. Prevención de Desborde en Chips y Listas en Smartphone Mockup
- Cuando se muestren categorías de danza (ej. Twerk, Dancehall, Commercial, Reggaetón, Bachata) dentro de un teléfono con ancho $pw$:
  - El ancho utilizable interno es `pw - 64 px`.
  - Si se muestran 4 chips en una sola fila, calcular matemáticamente el ancho exacto por chip:
    `const chipW = ((pw - 64) - (chips.length - 1) * gap) / chips.length;`
    y usar texto centrado en cada chip con tipografía compacta (`15–16px`).
  - Alternativamente, organizar los chips en **2 filas de 2 chips cada una**, garantizando que ningún chip toque el margen derecho del teléfono.

### C. Margen Interior Obligatorio en Tarjetas de Mensaje
- Todas las tarjetas informativas (Cards de agitación, tarjetas de horario, cajas de confirmación) deben mantener un **padding horizontal mínimo de 36 px** respecto a sus bordes externos.
- Si un texto descriptivo es extenso, debe medirse con `measureText()` y utilizar `wrapWordsToLines(...)` para garantizar un interlineado armónico y cero desborde lateral.

---

## 8. Pipeline Técnico de Renderizado y Muxing

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
   node $HOME/lemo-opuscar/core/render/video.mjs <directorio> --fps 24 --workers 4 --size 1080x1920 --out out/video_v2.mp4
   ```

4. **Muxing y Normalización de Audio (-14.0 LUFS / True Peak -1.2 dBFS):**
   ```bash
   sh $HOME/lemo-opuscar/core/render/mux.sh out/video_v2.mp4 audio/mix.wav bailapp_final_v2.mp4 24 0
   ```

---

## 9. Generación Obligatoria del Archivo de Copys (`copy.txt`)

Toda producción de video viral para Bailapp **debe generar obligatoriamente** un archivo `copy.txt` dentro de la carpeta del proyecto, listo para ser copiado y pegado en Instagram Reels, TikTok o YouTube Shorts:

### Estructura Estándar Obligatoria de `copy.txt`:
```text
[HOOK / TÍTULO DE INTERRUPCIÓN EN MAYÚSCULAS + EMOJIS]

[BODY COPY / STORYTELLING EMPÁTICO]
- Redactado en tono coloquial rioplatense natural (Argentina, Uruguay, Chile).
- Estructura: Dolor cotidiano -> Empatía / Humor -> Giro -> Solución con Bailapp.

[CALL TO ACTION (CTA) ÚNICO Y CLARO]
- 👉 Enlace a bailapp.com.ar o descarga de la app con indicación clara "link en bio".

[PREGUNTA DE CONVERSIÓN PARA COMENTARIOS]
- Incentivo directo a comentar para potenciar el algoritmo.

---
[HASHTAGS ESTRATÉGICOS]
#Bailapp #ClasesDeBaile #[Ritmo] #[Ciudad] #ViralReels ...
```

