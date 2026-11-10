---
name: threejs-lowpoly-contexto-visual
description: Dirección de arte y contexto visual para escenas lowpoly 3D en three.js (flat shading, geometría de pocos polígonos, paletas de color, iluminación, niebla, cielo, agua, terreno procedural, props, atmósfera por hora del día, animaciones idle, postprocesado mínimo y coherencia narrativa del mundo). Usar siempre que el usuario trabaje en estilo lowpoly o low poly 3D, pida definir ambiente, escenario, paleta, props, iluminación o "contexto visual" de un video, o quiera que una escena se vea cuidada, coherente y con mundo propio.
---

# Contexto visual lowpoly 3D en three.js

El estilo lowpoly funciona en video corto porque se lee rápido, es liviano para renderizar y se ve limpio en pantallas chicas. El riesgo es que se vea "genérico". La diferencia la hacen: **paleta cerrada, luz con intención, un mundo con historia y movimiento idle en todo.**

## 1. Define el mundo (contexto) antes de modelar
Escribir en 4 líneas, antes de tocar código:
- **Dónde estamos:** isla flotante, ciudad nocturna, bosque, desierto, estación espacial, taller.
- **Cuándo:** amanecer, mediodía, atardecer, noche, tormenta.
- **Qué emoción:** calma satisfactoria, aventura, misterio, caos divertido.
- **Qué cuenta:** la historia mínima que el espectador entiende sin texto (un faro que se enciende, un tren que cruza, un pueblo que despierta).

Todo elemento que no sirva a ese contexto se elimina. El contexto visual también es el **gancho narrativo**: un mundo reconocible en 1 s.

## 2. Geometría lowpoly
- Usar primitivas de **pocos segmentos**: `IcosahedronGeometry(r, 0)` (rocas), `ConeGeometry(r, h, 5-7)` (pinos), `CylinderGeometry(r1, r2, h, 6-8)` (troncos, torres), `OctahedronGeometry`, `BoxGeometry`.
- **Variar con ruido de vértices:** desplazar levemente cada vértice con un valor aleatorio fijo por semilla para que no se vea todo "perfecto".
- **Silueta primero:** el objeto debe leerse como silueta en un solo color; los detalles son secundarios.
- **Proporciones exageradas:** troncos finos, copas grandes, edificios con techos grandes; el exceso estilizado se ve intencional.
- **Pocos materiales:** reutilizar materiales y usar `InstancedMesh` para repeticiones (árboles, rocas, estrellas).

```js
const mat = new THREE.MeshStandardMaterial({ color: 0x4caf7d, flatShading: true, roughness: 0.9, metalness: 0 });
const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), mat);
```
`flatShading: true` es lo que da la cara facetada. Con `roughness` alto y `metalness` 0 se evita el brillo plástico.

### Terreno / agua facetados
```js
const g = new THREE.PlaneGeometry(40, 40, 24, 24); g.rotateX(-Math.PI/2);
const p = g.attributes.position;
for (let i = 0; i < p.count; i++) {
  p.setY(i, noise(p.getX(i) * 0.15, p.getZ(i) * 0.15) * 3);
}
g.computeVertexNormals();
const terrain = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x6ab04c, flatShading: true }));
```
Para agua: plano con pocos segmentos y una animación de `y` con `sin(x + t)` en cada frame, color azul con algo de transparencia o emisivo suave.

## 3. Paleta de color
- **Máximo 5-6 colores** por escena: 1 dominante (60%), 1-2 secundarios (30%), 1 acento (10%).
- El **héroe lleva el acento** (el color más saturado o cálido) sobre una base más fría/desaturada.
- Mantener el mismo "ADN" en todos los videos para que se reconozca tu cuenta: misma familia de saturación y misma lógica de luces.

Paletas guía (ajustar a gusto, son puntos de partida):
| Ambiente | Base | Secundario | Acento | Fondo / cielo |
|---|---|---|---|---|
| Amanecer cálido | verdes suaves | beige | naranja `#ff8a4c` | degradé durazno a lila |
| Mediodía fresco | verde menta y azul | blanco roto | amarillo `#ffd23f` | celeste claro |
| Atardecer épico | violetas y azules | rosado | naranja ardiente | degradé violeta a naranja |
| Noche mágica | azul marino y púrpura | turquesa | amarillo cálido de ventanas | azul muy oscuro con estrellas |
| Neón / cyber | gris azulado oscuro | magenta | cian eléctrico | negro violáceo |

Usar espacio de color correcto: `renderer.outputColorSpace = THREE.SRGBColorSpace` y tone mapping `ACESFilmicToneMapping` con exposición moderada.

## 4. Iluminación (lo que más sube la calidad)
Receta base de 3 luces:
1. **`HemisphereLight`** (cielo/suelo) para color ambiente suave: `new THREE.HemisphereLight(skyColor, groundColor, 0.7)`.
2. **`DirectionalLight` principal** (sol) con ángulo bajo-medio (30-50°) para que las caras facetadas tengan buen contraste entre sí; color cálido de día, azulado de noche.
3. **Luz de relleno o contraluz** (rim): `DirectionalLight` o `PointLight` suave del lado opuesto con un color complementario para separar el héroe del fondo.
- **Sombras:** `renderer.shadowMap.enabled = true`, `type = PCFSoftShadowMap`, `light.shadow.mapSize.set(2048, 2048)` y ajustar el frustum de la luz al diorama para evitar sombras pixeladas.
- **Luces prácticas** (ventanas, faroles, fuego) con `emissive` en los materiales + un `PointLight` pequeño; son el mejor "detalle caro" en escenas nocturnas.
- Evitar luz plana frontal: aplana los polígonos y se pierde el efecto lowpoly.

## 5. Atmósfera y fondo
- **Niebla:** `scene.fog = new THREE.Fog(colorFondo, near, far)` con el mismo color del fondo para fundir el horizonte y separar capas.
- **Cielo:** degradé con una esfera grande (`BackSide`) o un fondo CSS/shader simple; evitar un negro absoluto salvo en estilo neón.
- **Nubes lowpoly:** agrupar 3-5 icosaedros achatados y blancos, moviéndose lento.
- **Partículas ambientales:** pocas (luciérnagas, polvo, nieve, hojas) para sensación de vida; sin saturar.
- **Postprocesado mínimo:** bloom suave solo en emisivos, viñeta ligera. Si el efecto quita claridad a las caras facetadas, bajarlo.

## 6. Animación idle (todo debe respirar)
Un diorama lowpoly estático se siente muerto. Agregar siempre:
- Flotación del diorama: `y += sin(t * 1.2) * 0.15`.
- Rotación lenta de molinos, hélices, ruedas.
- Árboles que se mecen: rotación de la copa `sin(t + fase) * 0.03`.
- Agua que ondula; nubes que derivan; humo que sube; faros con barrido de luz.
- Un **elemento de acción** secundario (un barco, un pájaro, un tren) que cruce el cuadro para dar vida y para encuadrar movimientos de cámara.
- Hacer las fases periódicas con la duración del loop para que cierre perfecto.

## 7. Contexto narrativo por beat
| Beat | Qué muestra el mundo |
|---|---|
| Gancho | El elemento más icónico o el "problema" (la isla se está cayendo, una tormenta) |
| Contexto | El mundo completo en plano general: reglas del lugar |
| Escalada | Eventos que transforman el mundo (amanece, crece un bosque, se construye) |
| Clímax | La transformación final o el momento de máxima belleza |
| Cierre | El mundo en equilibrio, listo para loop |

Idea fuerte: **transformación del mismo diorama** (día a noche, invierno a verano, vacío a ciudad) con una sola escena y cambios de paleta/luz. Barato de producir, muy satisfactorio, ideal para loops.

## 8. Coherencia, Grounding y Cero Colisiones
- **Grounding matemático absoluto (cero flotación):**
  - Los personajes y props colocados sobre el suelo u otras superficies (camas, cintas de gym, podios, bancos) deben tener sus cotas $Y$ perfectamente ancladas al plano de apoyo (`Y = Y_surface`).
  - Prohibido dejar personajes levitando a centímetros del suelo o hundidos en la malla.
  - Ver tabla de alturas calibradas y reglas en `threejs-grounding-anti-superposicion`.
- **Prevención de colisiones (Zero Clipping):**
  - Carteles y textos 3D deben mantener un despeje mínimo de $0.35$ m por encima de las cabezas de los personajes.
  - Los bailarines contiguos deben situarse con una separación mínima $|\Delta X| \ge 0.85$ m para evitar intersecciones de extremidades al moverse.
- **Una sola regla de estilo:** mismo nivel de poligonaje, mismo contraste entre caras, mismo grosor de proporciones en todos los objetos.
- **Escala consistente** entre props (una casa no puede ser más pequeña que un árbol sin intención).
- **No mezclar** texturas fotorrealistas con lowpoly liso: o todo color plano, o texturas de gradiente muy simples.
- **Reutilizar la identidad entre videos:** misma paleta base, mismo tipo de luz, misma tipografía en pantalla.

## 9. Rendimiento (para grabar a 60 fps)
- `InstancedMesh` para repeticiones; evitar miles de `Mesh` separados.
- Compartir geometrías y materiales.
- Sombras: una sola luz que proyecte.
- Pixel ratio 1 al exportar a 1080×1920 y render determinista (ver `../threejs-captura-video/SKILL.md`).

## 10. Plantilla de ficha de dirección visual (entregar con el guion)
```
Mundo: ______________________   Hora/clima: __________
Emoción: ____________________   Historia mínima: ______
Paleta (5-6 hex): ___________________________________
Héroe + acento: _____________________________________
Luces: hemisferio / sol (ángulo, color) / contraluz
Fondo y niebla: _____________________________________
Props principales (máx. 5): _________________________
Animaciones idle: ___________________________________
Elemento de acción: _________________________________
```

Para posición y encuadre ver `../threejs-composicion-contenido/SKILL.md`; para cámara ver `../threejs-camara-movimientos/SKILL.md`.
