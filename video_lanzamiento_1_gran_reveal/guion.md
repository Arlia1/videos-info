# Guion — Lanzamiento Oficial 1: El Gran Reveal (Secreto Revelado)

- **Tipo:** Lanzamiento Oficial (Día D)
- **Duración estimada:** 24.0 segundos @ 24 fps (1080x1920 vertical)
- **Objetivo:** Guardados masivos, autoridad y reveal de la plataforma.

## 1. Variantes de Gancho (Primeros 1-3 segundos)
1. *(Elegida)* **Texto:** "Guardate este video porque a partir de hoy cambia cómo vas a bailar."
   - Visual: Push-in veloz hacia la bailarina de espaldas en penumbra cálida, girando al drop musical.
2. "Esto no es una app más: es el fin de los DMs clavados en visto."
3. "¿Buscabas excusa para empezar a bailar hoy? Se acabaron las excusas."
4. "Nadie te lo dijo, pero a partir de hoy la danza funciona así."
5. "Lo que todas las academias de baile estaban esperando en silencio."

## 2. Beat Sheet Técnico

| Tiempo | Visual 3D (Cámara & Escena) | Texto en Pantalla (Safe Zone) | Locución / Audio | Nota Técnica Three.js |
|---|---|---|---|---|
| **0.0 - 2.5s** | Push-in acelerado hacia el centro del estudio en penumbra cálida. La bailarina hero gira mirando a cámara. | **LANZAMIENTO OFICIAL • GUARDÁ ESTO ⚡** | *"Guardate este video porque a partir de hoy cambia cómo vas a bailar."* | `camera.position.z` interpolado de 10.5 a 7.2. Foco directo al rostro limpio con pupila blanca. |
| **2.5 - 7.0s** | Travelling lateral rápido: Flashback procedural del cuarto frustrante y el escritorio aburrido de oficina. | **CHAU A ROGAR POR CUPOS EN INSTAGRAM 🚫** | *"Se terminaron los 20 mensajes por Instagram rogando por cupo o cruzando comprobantes fantasmas."* | Transición por barrido de luz (`dirLight.intensity` pulsando). |
| **7.0 - 15.0s** | Grúa ascendente y reveal: El estudio 3D completo se ilumina. 3 bailarinas (Heels, K-Pop y Urbano) bailan sincronizadas. Emerge cartel 3D. | **TODOS LOS ESTILOS • CONFIRMACIÓN EN VIVO 🪩✨** | *"Hoy nace Bailapp: abrís la app, elegís tu estilo favorito cerca de tu casa y reservás tu clase en 10 segundos."* | Subwoofers con escala reactiva al beat (`Math.sin(t * 14)`). Cartel 3D con badge emissive verde menta. |
| **15.0 - 24.0s** | Órbita 360° en Podio de Gala: Las 3 bailarinas celebran en el podio facetado con lluvia sutil de prismas pastel. | **ENTRÁ A BAILAPP.COM.AR • CUPOS ABIERTOS 🎟️🚀** | *"Los cupos de lanzamiento ya están abiertos. Entrá al link de la bio y asegurá tu primera clase antes de que se agoten."* | `stagePodium.rotation.y = t * 0.18`. CTA flotante centrado en X, Y = 1420 px. |

## 3. Copy para Publicación
¡OFICIALMENTE EN VIVO! BIENVENIDAS A LA NUEVA ERA DE LA DANZA 🪩✨🚀

Basta de mandar 20 mensajes directos por Instagram esperando que te confirmen cupo.
Basta de alias bancarios fantasma y planillas de Excel desactualizadas.

Hoy nace Bailapp: la app que reúne los mejores estudios, profes y ritmos de tu ciudad en un solo lugar.
Dancehall, Heels, Reggaetón, Urbano, K-Pop o Twerk. Reservás en 10 segundos con tu pase digital QR y vas directo a la pista 🔥

👉 Entrá hoy mismo en bailapp.com.ar (link en bio) y asegurá tu lugar antes de que se llenen los cupos.
Etiquetá a tu crew con la que vas a ir a bailar esta semana 👇👯‍♀️
