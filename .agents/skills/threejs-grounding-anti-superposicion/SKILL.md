---
name: threejs-grounding-anti-superposicion
description: Use when building 3D lowpoly scenes, positioning characters on floors or props (podiums, couches, beds, treadmills), adding floating 3D signs, designing 2D/3D text containers, cards, badges, buttons, or auditing scenes to guarantee zero floating characters, zero geometry clipping/overlap, exact surface grounding, and strict text containment inside containers without overflow.
---

# Grounding Estricto, Anti-Superposición y Contención Inviolable de Textos en Three.js / Canvas

Esta skill define las reglas obligatorias e invariantes matemáticas para garantizar que en cualquier escena (Three.js / WebGL / Canvas 2D / Low-Poly):
1. Los personajes **nunca queden flotando en el aire ni hundidos**.
2. **Ningún bloque, cartel, mueble o personaje se superponga o colisione indebidamente**.
3. **TODOS los textos queden 100% contenidos dentro de sus contenedores** (tarjetas, botones, badges, píldoras, carteles 3D, banners y subtítulos), con padding seguro y sin desbordar jamás.

---

## 1. Principio Fundamental de Contacto (Grounding Invariant)

Un personaje u objeto colocado sobre una superficie **debe tocarla de forma exacta en el eje Y**.

### Reglas Prohibidas:
* **PROHIBIDO:** Dejar personajes con los pies flotando a 5–20 cm sobre el piso o la superficie (`Y > Y_surface`). Destruye de inmediato la credibilidad del diorama 3D.
* **PROHIBIDO:** Hundir los pies o zapatillas dentro de la geometría del suelo o del mueble (`Y < Y_surface`), salvo que sea explícitamente agua, pasto espeso o arena.
* **PROHIBIDO:** Personajes sentados en sillones o camas con los glúteos flotando en el aire sin tocar el almohadón.

---

## 2. Tabla Maestra de Alturas de Superficie (`Y_surface`)

Al posicionar la raíz del personaje (`char.root.position.set(x, Y_surface, z)`), usar **siempre** los valores de contacto calibrados del escenario:

| Escenario / Superficie | Altura de Contacto (`Y_surface`) | Regla de Posicionamiento del Personaje |
|---|---|---|
| **Piso de Parquet / Estudio** (`stage_studio`) | `Y = 0.00` | Suela de zapatillas apoyada exactamente en `0.00`. |
| **Piso del Cuarto** (`stage_bedroom`) | `Y = 0.00` | Suela apoyada en el piso. |
| **Cinta de Correr del Gym** (`stage_gym`) | `Y = 0.24` | Suela pisando la banda de rodamiento de la cinta (`Y = 0.24`). |
| **Almohadón del Sillón** (`stage_livingroom`) | `Y = 0.44` | Personaje sentado: `hipsY` ajustado para que muslos descansen en `0.44`. |
| **Colchón de la Cama** (`stage_bedroom`) | `Y = 0.70` | Personaje sobre la cama o sentado en el borde (`Y = 0.70`). |
| **Podio 1º Puesto (Centro)** (`stage_podium`) | `Y = 0.65` | Suela del ganador en `Y = 0.65`, `X = 0.0`. |
| **Podio 2º Puesto (Izquierda)** (`stage_podium`) | `Y = 0.42` | Suela del 2º puesto en `Y = 0.42`, `X = -1.25`. |
| **Podio 3º Puesto (Derecha)** (`stage_podium`) | `Y = 0.30` | Suela del 3º puesto en `Y = 0.30`, `X = 1.25`. |

### Contacto de Personajes Sentados:
```javascript
// Ejemplo para sentar un personaje en el sillón (almohadón en Y = 0.44)
char.root.position.set(0, 0.44, 0.1);
char.setPose({
  hipsY: 0.0,
  torsoTilt: 0.05,
  legLX: -1.45, kneeLX: 1.45, // Piernas dobladas a 90 grados hacia adelante y abajo
  legRX: -1.45, kneeRX: 1.45,
});
```

---

## 3. Dinámica de Animación y Retorno al Suelo

En animaciones de baile procedimentales (`updateDance(t, style, speed)`):
1. **Pie de apoyo anclado:** Al menos un pie debe conservar contacto con la superficie (`Y = 0.0`) en cada paso rítmico.
2. **Saltos (Jumps / Bounces):** Si el personaje salta (`Math.abs(Math.sin(...))`), el offset vertical debe partir de `Y = 0.0` y **volver obligatoriamente a `Y = 0.0`**.
3. **Cero offset acumulado:** Las funciones trigonométricas de rebote deben usar `Math.max(0, ...)` o amplitudes que no dejen un residuo positivo al detenerse la animación.

---

## 4. Reglas de Prevención de Superposiciones (Zero Clipping & Anti-Overlap)

Ningún elemento del diorama 3D puede atravesar o intersectar otro elemento de manera antiestética.

### 4.1. Distancia de Seguridad entre Personajes (Formaciones de Baile):
* **Bailarinas lado a lado:** Distancia horizontal mínima `|ΔX| >= 0.85m` para evitar que los brazos o caderas se toquen al bailar.
* **Formación triangular (1 líder, 2 coristas):**
  - Líder: `position.set(0, 0, 0.2)`
  - Lateral izquierda: `position.set(-0.85, 0, -0.3)`
  - Lateral derecha: `position.set(0.85, 0, -0.3)`
  - La diferencia en Z (`ΔZ = 0.5m`) garantiza que los movimientos laterales nunca colisionen.

### 4.2. Carteles Flotantes 3D vs. Personajes:
* **Separación vertical y de profundidad:**
  - Si un cartel flota sobre la cabeza del personaje: `sign.position.y >= char.head.y + 0.35m` (mínimo `Y = 2.15m` si la bailarina mide 1.70m de altura).
  - Si el cartel está al costado: `|sign.position.x - char.root.x| >= 0.75m`.
  - El cartel nunca debe atravesar el cráneo, cabello o extremidades en ningún punto de su oscilación flotante (`Math.sin(t)`).

### 4.3. UI 2D Canvas vs. Objetos 3D:
* La escena 3D y la cámara deben planificarse con **espacio negativo reservado**:
  - **Zona superior (Y = 0 a 180px):** Libre para la barra de progreso y badges superiores.
  - **Zona de subtítulos (Y = 1350 a 1550px):** La cámara nunca debe enfocar los pies cortados justo detrás del texto ni colocar objetos de alto contraste detrás del subtítulo.
  - **Zona inferior (Y = 1750 a 1920px):** Reservada para el botón o badge de CTA permanente (`bailapp.com.ar`).

### 4.4. Regla Inviolable de Contención de Textos (Cero Desbordes / Zero Overflow):
Todo texto presentado dentro de un contenedor visual (tarjeta, pastilla/pill, badge, botón, modal, cartel 3D o subtítulo con fondo) **debe quedar 100% contenido en su interior**, respetando márgenes internos seguros (padding).

* **PROHIBIDO:** Letras, palabras o glifos que toquen el borde del contenedor, sobresalgan del rectángulo redondeado o se corten en los extremos.
* **PROHIBIDO:** Textos con fuentes fijas gigantes que fuercen desbordes en palabras largas (ej. "Entrenamiento", "Transferencias", "Comunidad").
* **PROHIBIDO:** Cajas de subtítulos o botones con bordes ajustados a mano sin medir el ancho real del texto renderizado.

### 4.5. Algoritmos Obligatorios de Auto-Fit y Padding Seguro:

#### A. Contenedores con Tamaño Fijo (Auto-Fit Font Size):
Si el contenedor tiene ancho $W$ y alto $H$ fijos, el tamaño de fuente **debe reducirse automáticamente** hasta que el texto quepa con al menos $10\%$ de padding horizontal:
```javascript
// Algoritmo de ajuste de fuente a contenedor fijo
function drawContainedText(ctx, text, boxX, boxY, boxW, boxH, baseFontSize = 36, minFontSize = 14) {
  const paddingX = boxW * 0.10; // 10% de margen horizontal interno
  const maxTextWidth = boxW - (paddingX * 2);
  let fontSize = baseFontSize;

  ctx.font = `700 ${fontSize}px "Outfit", sans-serif`;
  let measured = ctx.measureText(text).width;

  // Escalar fuente si el texto excede el espacio disponible
  if (measured > maxTextWidth) {
    fontSize = Math.max(minFontSize, Math.floor(fontSize * (maxTextWidth / measured)));
    ctx.font = `700 ${fontSize}px "Outfit", sans-serif`;
  }

  // Dibujar centrado en el contenedor
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, boxX + boxW / 2, boxY + boxH / 2);
}
```

#### B. Contenedores Dinámicos (Dynamic Sizing con Auto-Padding):
Si el contenedor debe envolver al texto (ej. badges, pastillas de categorías, botones de CTA), el tamaño de la caja se deriva de la medición del texto más un padding seguro:
```javascript
// Medición previa y caja dinámica
ctx.font = '700 28px "Outfit", sans-serif';
const textMetrics = ctx.measureText(label);
const paddingHorizontal = 28; // px
const paddingVertical = 14;   // px
const badgeWidth = textMetrics.width + (paddingHorizontal * 2);
const badgeHeight = 44 + (paddingVertical * 2);
const badgeX = (1080 - badgeWidth) / 2; // Centrado en pantalla
const badgeY = 120;

// Dibujar contenedor que abraza al texto perfectamente
ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
ctx.beginPath();
ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 16);
ctx.fill();

// Dibujar texto 100% contenido
ctx.fillStyle = '#2D242E';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(label, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
```

#### C. Carteles Flotantes 3D (`CanvasTexture` sobre `PlaneGeometry`):
* En Three.js, si se proyecta un canvas sobre un plano 3D (`new THREE.PlaneGeometry(planeW, planeH)`), el canvas interno (ej. $1024 \times 512$ px) debe reservar un margen perimetral de al menos $60$ px en todos sus bordes antes de dibujar el texto o la placa de fondo.
* La relación de aspecto del canvas debe ser idéntica a la geometría:
  $$\frac{\text{canvas.width}}{\text{canvas.height}} = \frac{\text{planeW}}{\text{planeH}}$$

---

## 5. Protocolo de Auditoría Pre-Renderizado (Auditoría Visual Obligatoria)

Antes de lanzar el renderizado completo de cualquier video:

1. **Generar Stills en 3 Puntos Clave de Tiempo:**
   Ejecutar capturas deterministas en:
   - `t = 2.0s` (Escena 1 / Contexto inicial).
   - `t = 12.0s` (Escena 2 / Estudio de danza / Acción principal).
   - `t = 22.0s` (Escena 3 / Podio o CTA final).
   ```bash
   LEMO_ANGLE=swiftshader node "$HOME/lemo-opuscar/core/render/still.mjs" <directorio> 2.0 12.0 22.0 --out /tmp/audit --size 1080x1920
   ```

2. **Checklist de Verificación Visual:**
   - [ ] **Pies en el piso:** Las suelas de las zapatillas tocan la superficie sin flotar ni atravesar el suelo (`Y = Y_surface`).
   - [ ] **Podios y muebles:** En podios, camas o sillones, los personajes están a la altura exacta (`0.65`, `0.44`, `0.70`).
   - [ ] **Brazos y hombros:** Las bailarinas tienen espacio lateral suficiente y no se cruzan polígonos entre sí.
   - [ ] **Carteles 3D:** Los carteles tienen espacio libre alrededor y no tocan el cabello ni los peinados con volumen.
   - [ ] **Contención total de textos:**
     - [ ] Ningún texto se sale de su caja, tarjeta, badge, pastilla o botón.
     - [ ] Todos los textos tienen al menos un 10% de padding interno libre respecto a los bordes de su contenedor.
     - [ ] Las palabras largas no sufren truncamiento abrupto ni desbordan la pantalla de 1080px.
   - [ ] **Subtítulos legibles:** Ningún objeto 3D tapa las letras del subtítulo ni del badge superior.

Si cualquiera de estos puntos falla, ajustar las coordenadas y el auto-fit en `main.js` antes de iniciar el render final.
