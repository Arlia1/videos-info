---
name: threejs-composicion-contenido
description: Reglas de ubicación del contenido y composición para videos verticales 9:16 de three.js y lowpoly 3D (zona segura de la interfaz de Reels/TikTok, tercio central, regla de tercios, jerarquía visual, capas de profundidad, espacio negativo para texto, posición del texto en pantalla, escala del objeto héroe, simetría y líneas guía). Usar siempre que haya que decidir dónde poner el objeto principal, el texto, el logo, la webcam o los elementos de la escena, o cuando un video se vea "desordenado", "chico" o "tapado por la interfaz".
---

# Composición y ubicación del contenido en 9:16

## Zonas del cuadro (1080×1920)
Dividir el cuadro mentalmente en zonas. Los porcentajes son orientativos: la interfaz de cada app cambia, así que verificar subiendo un borrador privado y mirando cómo se superpone.

```
┌────────────────────┐
│ ZONA ALTA (0-12%)  │ interfaz superior: evitar texto crítico
│ ░░░░░░░░░░░░░░░░░░ │
│ TERCIO SUPERIOR    │ texto del gancho / título (12-30%)
│                    │
│ TERCIO CENTRAL     │ OBJETO HÉROE y acción (30-65%)
│                    │
│ TERCIO INFERIOR    │ elementos secundarios / texto secundario (65-80%)
│ ░░░░░░░░░░░░░░░░░░ │
│ ZONA BAJA (80-100%)│ caption, botones y usuario: NO poner nada importante
└────────────────────┘
        Costado derecho (~15%): botones de like/comentar/enviar
```

Reglas:
- **Todo lo esencial dentro del recuadro central** (aprox. 80% del ancho, del 12% al 80% de la altura).
- **El borde derecho y la parte inferior** quedan tapados por botones y caption.
- Dejar siempre aire alrededor: el recorte por la interfaz es lo que más arruina un buen visual.

## Jerarquía visual
1. **Un solo héroe por plano:** el objeto o evento que debe leerse en 0.3 s (la isla, el personaje, la forma de partículas).
2. **Escala:** el héroe ocupa 35-60% del ancho en planos medios; más grande en el gancho (50-80%) y más chico en planos generales de contexto (25-40%).
3. **Contraste:** el héroe debe ser el elemento más saturado, brillante o contrastante. Fondo más apagado/desaturado.
4. **Dirección de la mirada:** si el personaje o la forma "apunta" hacia algo, dejar espacio en esa dirección (lead room).
5. **Regla de tercios en vertical:** colocar el punto de interés en una de las intersecciones de tercios (≈33% o ≈66% de la altura), no clavado en el centro cuando hay texto arriba.

## Capas de profundidad (lo que hace que el 3D "parezca 3D")
Armar la escena siempre en 3 capas:
- **Primer plano (foreground):** elementos cercanos y grandes, algo desenfocados u oscuros (ramas, rocas, bordes de isla). Aportan parallax al mover la cámara.
- **Plano medio (midground):** el héroe y su acción.
- **Fondo (background):** montañas, cielo, niebla, gradiente. Más bajo en contraste.
- **Niebla/atmósfera** (`scene.fog`) para separar capas con el color del fondo.
- Con cámara en movimiento lateral, el parallax entre capas vende la profundidad sin necesidad de efectos complejos.

## Espacio negativo y contención estricta de textos
- **Regla de contención absoluta:** Cualquier texto ubicado dentro de una placa, botón, pastilla, cartel 3D o tarjeta debe quedar **100% contenido dentro de sus márgenes**, con un padding de al menos 10% a cada lado. Prohibido desbordar o tocar los bordes del contenedor.
- Diseñar la escena **con un hueco reservado** para el texto: cielo vacío, océano liso, zona oscura.
- El texto no debe competir con detalle: fondo plano o desenfocado detrás.
- Posiciones recomendadas: **título/gancho** en el tercio superior (≈15-28% de altura); **segundo texto** en el tercio inferior sin llegar a la zona del caption (≈65-75%).
- Tamaño mínimo legible: alto de letra ≥ 5% de la altura del video para texto principal.
- Contraste con el fondo: texto claro sobre fondo oscuro con leve sombra, o placa de color sólida con la paleta del diorama.
- Máximo 2 líneas y 7-8 palabras por pantalla. Que aparezca y desaparezca con la acción, no se quede "pegado".

## Ubicación de elementos recurrentes
- **Hand tracking / webcam:** recuadro pequeño (15-20% del ancho) en una esquina superior izquierda dentro de la zona segura; la mano real y el efecto deben verse en simultáneo.
- **Logo o marca de agua:** pequeño, esquina superior izquierda en zona segura, baja opacidad; no en el borde inferior.
- **Contador / dato animado:** tercio superior, centrado o a la izquierda.
- **Prompt o código en pantalla:** tercio inferior-medio, fondo semitransparente, 3-5 líneas máximo.

## Composición específica de dioramas lowpoly
- **Isla / diorama flotante centrada** con 10-15% de aire a cada lado; el vacío alrededor refuerza la sensación de miniatura.
- **Diagonales:** caminos, ríos o vías en diagonal guían la mirada hacia el héroe (líneas guía).
- **Simetría** para planos "bonitos" y satisfactorios; **asimetría** con tercios para planos narrativos.
- **Verticalidad:** aprovechar el 9:16 con elementos altos (faros, torres, árboles, cascadas, globos) y cámara picada.
- **Escala con referencia:** incluir un elemento de tamaño reconocible (un personaje pequeño, un árbol) para que el espectador entienda la escala.
- **Regla de 3 elementos:** agrupar detalles de a 3 (tres árboles, tres casas) se lee más natural que cantidades pares.
- **Horizonte:** en vista de perfil, ubicar el horizonte en el tercio inferior si el cielo es protagonista, o en el superior si lo es el suelo.

## Reencuadre por beat
| Beat | Encuadre del héroe |
|---|---|
| Gancho | Grande, cerca, centro-superior, con texto arriba |
| Contexto | Pequeño en un plano general, con el mundo visible |
| Escalada | Medio, con el nuevo elemento entrando por un costado |
| Clímax | Muy cerca o muy lejos (extremos) con cámara baja o alta |
| Cierre | Mismo encuadre que el gancho (loop) |

## Checklist de composición y física visual
- [ ] El héroe está en el tercio central y se lee en menos de 1 s
- [ ] Nada importante en el borde derecho ni en el 20% inferior
- [ ] **Grounding estricto (cero personajes flotando):** Todos los personajes tocan la superficie (`Y_surface`) con la suela de sus pies o zapatillas. Si están sobre props (camas, cintas de correr, podios, sillones), la raíz `Y` coincide milimétricamente con la cota superior del objeto (ver `threejs-grounding-anti-superposicion`).
- [ ] **Zero clipping y anti-superposición:** Ningún cartel flotante atraviesa la cabeza o cuerpo de los personajes (margen vertical $\ge 0.35$m sobre coronilla). Las figuras lado a lado mantienen $\ge 0.85$m de distancia.
- [ ] No hay textos 2D o subtítulos tapando la cara o pies de los personajes sin espacio negativo.
- [ ] Todo elemento de escenas anteriores se oculta al cambiar de plano (`stage.visible = false`).
- [ ] Hay un hueco reservado para el texto con fondo limpio
- [ ] Tres capas de profundidad (primer plano, medio, fondo)
- [ ] El héroe es el elemento de mayor contraste
- [ ] La escena tiene una referencia de escala
- [ ] Probado como borrador en la app para verificar superposición de la interfaz

Para el movimiento de la cámara ver `../threejs-camara-movimientos/SKILL.md`; para estilo y ambiente ver `../threejs-lowpoly-contexto-visual/SKILL.md`.
