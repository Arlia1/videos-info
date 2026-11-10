---
name: threejs-camara-movimientos
description: Catálogo y método para diseñar movimientos de cámara en videos verticales de three.js (órbita, dolly, push-in, travelling, grúa, fly-through, whip pan, parallax, rack focus, dutch angle, reveal) con código, easing, FOV, ritmo por tramo del guion y loops. Usar siempre que el guion necesite shot list, movimiento de cámara, transiciones entre planos, "cómo se mueve la cámara", cinematografía de escenas 3D o escenas lowpoly animadas, aunque el usuario solo diga "que se vea dinámico".
---

# Movimientos de cámara para videos three.js

La cámara es el editor del video: decide qué se ve, cuándo y con qué energía. En un video de 15-30 s, la cámara casi nunca debe estar quieta. Regla base: **el mundo se mueve un poco, la cámara se mueve un poco más, y en el clímax se mueve con intención.**

## Elegir el movimiento según el tramo del guion
| Tramo | Movimiento recomendado | Efecto en el espectador |
|---|---|---|
| Gancho (0-1.5 s) | Push-in rápido o whip pan hacia el objeto; o arrancar ya en plena órbita | Energía desde el frame 0 |
| Contexto (1.5-5 s) | Dolly out lento o grúa descendente que revela el mundo | "Entiendo dónde estoy" |
| Escalada (5-20 s) | Órbita lenta + cambios de ángulo por corte o travelling | Ritmo, variedad, sin cansar |
| Clímax | Push-in acelerado, o dolly zoom suave, o cámara baja mirando hacia arriba | Épica y escala |
| Cierre / loop | Órbita completa que vuelve al punto inicial | Loop perfecto |

## Catálogo
- **Órbita (orbit):** la cámara gira alrededor del objeto. Base de todo diorama lowpoly. Velocidad: una vuelta completa en 8-15 s para loops relajantes.
- **Dolly in / out:** acercarse o alejarse sobre el eje de visión. In = foco y tensión. Out = revelar contexto.
- **Push-in con easing:** dolly in que acelera al final (`easeInCubic`) para el clímax.
- **Travelling / truck:** desplazamiento lateral paralelo; muestra profundidad por parallax. Bueno para trenes, caminos, filas de árboles.
- **Pedestal / grúa (crane):** subir o bajar. Subir revela el paisaje; bajar "aterriza" en el protagonista.
- **Fly-through:** recorrer un camino con curva spline por el escenario. Gran valor visual, hace falta un recorrido pensado.
- **Whip pan:** giro rapidísimo (4-8 frames) con desenfoque; sirve de transición entre escenas.
- **Dolly zoom (vertigo):** mover la cámara hacia atrás mientras sube el FOV (o al revés) para mantener el tamaño del objeto y deformar el fondo. Usar en picos de sorpresa, 1-2 s.
- **Rack focus:** profundidad de campo que cambia de plano; con `BokehPass`. Cuidado: cuesta fps al grabar.
- **Dutch angle:** inclinar el roll 5-12° para tensión o caos. Poco tiempo.
- **Reveal por oclusión:** la cámara pasa tras un elemento (nube, montaña) y aparece el resultado.
- **Shake sutil:** ruido de baja amplitud en posición/rotación para golpes o explosiones; 0.2-0.5 s.

## Lente (FOV) y proyección
- **FOV 35-50°:** look cinematográfico y "diorama", menos distorsión. Recomendado para lowpoly premium.
- **FOV 60-75°:** más dinámico y vertiginoso, útil para fly-through.
- **FOV >85°:** deforma bordes; solo para efectos puntuales.
- **Cámara ortográfica (`OrthographicCamera`):** vista isométrica clásica de dioramas lowpoly. Ángulo típico: rotación Y de 45° y elevación de ~30-35°. Con ortográfica el "dolly" no cambia el tamaño: se anima `camera.zoom` y se llama `updateProjectionMatrix()`.
- En 9:16, el encuadre es alto: pensar en vertical (torres, caídas, cascadas, ascenso).

## Código base

### Damping suave hacia un objetivo
```js
const target = new THREE.Vector3(), desired = new THREE.Vector3();
function followCam(dt) {
  camera.position.x = THREE.MathUtils.damp(camera.position.x, desired.x, 4, dt);
  camera.position.y = THREE.MathUtils.damp(camera.position.y, desired.y, 4, dt);
  camera.position.z = THREE.MathUtils.damp(camera.position.z, desired.z, 4, dt);
  camera.lookAt(target);
}
```

### Órbita con loop exacto (duración D)
```js
function orbit(t, D = 12, radius = 14, height = 6) {
  const a = (t / D) * Math.PI * 2;
  camera.position.set(Math.cos(a) * radius, height, Math.sin(a) * radius);
  camera.lookAt(0, 1, 0);
}
```

### Recorrido por spline (fly-through)
```js
const path = new THREE.CatmullRomCurve3(points, true); // true = cerrada, ideal para loop
function fly(t, D = 14) {
  const u = (t / D) % 1;
  camera.position.copy(path.getPointAt(u));
  camera.lookAt(path.getPointAt((u + 0.02) % 1));
}
```

### Dolly zoom
```js
function dollyZoom(k, width = 6, dist0 = 20) { // k: 0..1
  const dist = dist0 + k * 14;
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(width / (2 * dist)));
  camera.position.z = dist;
  camera.updateProjectionMatrix();
}
```

### Easing
```js
const easeInOutCubic = x => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
const easeInCubic = x => x*x*x;
const easeOutExpo = x => x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
```
Con GSAP, animar un objeto proxy `{k:0}` y aplicar la cámara en `onUpdate`, o usar un timeline con `power2.inOut`.

## Reglas de dirección
1. **Un movimiento principal por plano.** Órbita + zoom + roll al mismo tiempo se ve amateur.
2. **Duración de plano:** 2-4 s en la escalada; 1-2 s en el gancho; un plano largo (6-8 s) solo si hay algo espectacular que mirar.
3. **Corte vs. movimiento continuo:** cortar entre ángulos cada 3-4 s mantiene la retención, pero cada corte debe tener motivo (nuevo dato visual).
4. **Eje y dirección:** mantener la dirección de movimiento consistente entre planos (si el personaje va a la derecha, no cambiar de lado sin razón).
5. **Easing siempre.** Movimiento lineal parece robótico; usar in-out suave, o ease-in en push-ins.
6. **Velocidad relativa:** si el objeto principal rota, la cámara debe moverse más lento o en sentido contrario; evita el mareo.
7. **Sincronizar con el audio:** push-in o whip pan en el drop o beat.
8. **Altura de cámara:** nivel de ojos del diorama = neutral; picado (arriba) = pequeño/vulnerable o "mundo en miniatura"; contrapicado = grandeza.
9. **Loop:** que la cámara termine donde empezó, con la misma velocidad.

## Shot list (formato de entrega)
| # | Tiempo | Plano (cerrado/medio/general) | Movimiento | Lente/FOV | Ángulo | Easing | Qué revela |
|---|---|---|---|---|---|---|---|

Ejemplo (diorama isla lowpoly, 20 s):
1. 0-1.5 s, primer plano del faro, push-in rápido, FOV 45, contrapicado, easeOutExpo, el elemento más llamativo.
2. 1.5-5 s, plano general, dolly out + grúa subiendo, FOV 40, picado 35°, inOutCubic, revela la isla entera.
3. 5-15 s, plano medio, órbita lenta, FOV 40, 25°, lineal suave, la vida de la isla (barcos, nubes).
4. 15-20 s, general, push-in final que cierra el loop al plano inicial.

## Cuidados al grabar
- Fijar `camera.near/far` razonables para evitar z-fighting con superficies planas (típico en lowpoly).
- Avisar de saltos de cámara al hacer loop: comparar el primer y el último frame.
- Con cámara ortográfica, controlar el `frustum` para que el diorama no se recorte en 9:16.
- Para captura frame a frame ver `../threejs-captura-video/SKILL.md`.
