---
name: viral-threejs-video
description: Generates high-retention short-form video scripts (TikTok, Reels, Shorts) and production-ready deterministic Three.js / React Three Fiber code using Remotion. Enforces scroll-stopping hooks, 4.5-second pacing, seamless loops, and useCurrentFrame rendering rules.
version: 1.0.0
---

# Director Técnico y Guionista: Video Programático Three.js & Remotion

Esta habilidad dota al agente de las competencias de un director técnico y narrativo especializado en video programático tridimensional de formato vertical (9:16). Su propósito es planificar guiones optimizados para algoritmos de retención masiva y compilar código en React Three Fiber y Remotion que renderice de forma determinista en navegadores sin cabeza (headless).

---

## 1. Protocolo de Ingeniería Narrativa y Guiones Virales

Al redactar el guion y estructurar los tiempos, el agente debe aplicar estrictamente la fórmula de 4 actos diseñada para retención y repetición:

### A. Parámetros Métricos Obligatorios
- **Duración total objetivo:** Entre 30 y 45 segundos.
- **Cadencia de locución:** Entre 2.5 y 2.8 palabras por segundo.
- **Presupuesto léxico:** Entre 80 y 115 palabras en total.
- **Formato de entrega:** Tabla de correspondencia temporal con marcas de voz, eventos 3D y diseño sonoro.

### B. Los 4 Actos de Retención

| Fase | Rango Temporal | Reglas Estructurales | Evento Gráfico en Three.js |
| :--- | :--- | :--- | :--- |
| **Acto 1: Gancho de Interrupción** | 0:00 - 0:02 (máx. 0:03) | De 8 a 13 palabras. Provocar disonancia cognitiva, paradoja cuantitativa o desafío contraintuitivo. Prohibido saludar o presentarse. | Escena de alto impacto: objeto 3D en colisión inminente, teseracto rotando o explosión de partículas. |
| **Acto 2: Anclaje de Verificación** | 0:02 - 0:08 | Entrega del primer valor concreto antes del segundo 8 (aumenta 27% la retención). Oración declarativa que valida el gancho. | Detención brusca de cámara, retroceso angular o revelación de una brecha física. |
| **Acto 3: Núcleo Modular** | 0:08 - 0:35 | Oraciones de 1 a 3 frases independientes. Ritmo: un cambio perceptible de cámara o geometría cada 4.5 segundos. Analogías tangibles. | Disolución de mallas, activación de campos de vectores, deformaciones procedurales o cambios de ángulo. |
| **Acto 4: Bucle Continuo (Loop)** | 0:35 - Fin | Prohibido despedirse o pedir "suscríbete". La última frase debe ser gramaticalmente incompleta y conectar con el gancho inicial. | Retorno exacto de las partículas y la cámara a las coordenadas iniciales ($t = 0$). |

---

## 2. Reglas Arquitectónicas Innegociables de Three.js & Remotion

Para evitar parpadeos, pérdidas de sincronía y errores durante el renderizado en servidor, el código TypeScript/React generado debe respetar las siguientes directrices:

1. **Veto estricto de `useFrame`:**
   - Queda totalmente prohibido el uso de `useFrame` de `@react-three/fiber`. En entornos headless opera de forma asíncrona y arruina la concordancia entre cuadros.
   - Toda animación debe derivar de `useCurrentFrame()` de Remotion: la posición, rotación, escala o variable de sombreador debe expresarse analíticamente respecto al fotograma actual.

2. **Envoltorio `<ThreeCanvas>` y dimensiones explícitas:**
   - La escena debe residir dentro de `<ThreeCanvas>` importado de `@remotion/three`.
   - Las propiedades `width` y `height` deben pasarse explícitamente desde `useVideoConfig()`.

3. **Uso de `<Sequence>` dentro de canvas 3D:**
   - Siempre que se utilice un componente `<Sequence>` dentro de `<ThreeCanvas>`, debe asignarse obligatoriamente la propiedad `layout="none"`. De lo contrario, Remotion inyectará un elemento HTML `<div>`, corrompiendo el grafo de escena de Three.js.

4. **Determinismo estocástico:**
   - Prohibido utilizar `Math.random()` dentro del ciclo de dibujado. Los valores pseudoaleatorios deben precalcularse en un búfer (`useMemo`) o derivarse de fórmulas periódicas trigonométricas.

5. **Zonas Seguras Verticales (UI Safe Zones):**
   - El renderizado se diseña en 1080×1920 (9:16).
   - **Zona superior (0% a 15% vertical - Y: 0 a 288px):** libre de focos 3D o títulos (área ocupada por navegación/búsqueda).
   - **Zona inferior (80% a 100% vertical - Y: 1536 a 1920px):** despejada (área ocupada por copy, audio y perfil).
   - **Margen lateral derecho (85% a 100% horizontal - X: 918 a 1080px):** despejado de elementos clave (área ocupada por botones de interacción).
   - **Foco principal y tipografía cinética:** concentrados en el área central (15% a 80% vertical, 0% a 85% horizontal).

---

## 3. Plantilla Base de Código Determinista

Al generar el componente de video, utiliza la siguiente estructura base en TypeScript:

```tsx
import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';

interface SceneProps {
  primaryColor?: string;
}

const ProceduralVisualizer: React.FC<SceneProps> = ({ primaryColor = '#00ffcc' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Transformación armónica para Seamless Loop (período exacto de 2*PI)
  const loopProgress = (frame / durationInFrames) * Math.PI * 2;
  const rotationY = loopProgress;

  // 2. Interpolación determinista dependiente del frame
  const scale = interpolate(
    frame,
    [0, fps * 2, durationInFrames],
    [1.0, 1.45, 1.0],
    {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // 3. Generación determinista de vértices/partículas precalculada
  const particleCount = 1500;
  const positions = useMemo(() => {
    const coords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2;
      const radius = 1.2 + ((i % 10) / 10) * 0.5;
      coords[i * 3] = Math.cos(theta) * radius;
      coords[i * 3 + 1] = ((i % 50) - 25) * 0.08;
      coords[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return coords;
  }, [particleCount]);

  return (
    <group rotation={[0, rotationY, 0]} scale={scale}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={primaryColor}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export const CompositionMain: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <ProceduralVisualizer primaryColor="#00ffcc" />
    </ThreeCanvas>
  );
};
```

---

## 4. Procedimiento de Ejecución del Agente

Cuando se le solicite un video sobre un tema específico, el agente debe seguir este flujo en orden:

1. **Fase de Guion Técnico:**
   - Crear el guion desglosado en tabla con las 4 fases.
   - Redactar explícitamente el gancho de 0 a 2 segundos y el empalme sintáctico del bucle continuo (*seamless loop*).
2. **Fase de Parámetros de Audio y Estilo:**
   - Definir el tono de voz (para ElevenLabs / Edge-TTS), pausas intencionales y momentos de atenuación musical (*audio ducking*).
3. **Fase de Implementación de Código:**
   - Escribir el código React Three Fiber respetando todas las reglas deterministas (`useCurrentFrame`, sin `useFrame`, dimensiones explícitas en canvas y `layout="none"` en `<Sequence>`).
4. **Verificación de Seguridad y Zonas Seguras:**
   - Confirmar que las posiciones de los elementos visuales respeten las zonas seguras verticales de 9:16.
5. **Grounding y Verificación Anti-Superposición (Cero Flotación & Zero Clipping):**
   - Mandatorio consultar `threejs-grounding-anti-superposicion`.
   - Verificar que todos los personajes y props toquen de forma exacta su superficie de apoyo (`Y = Y_surface`). Queda terminantemente prohibido dejar personajes flotando o hundidos.
   - Auditar que ningún cartel o texto 3D colisione o corte la cabeza/cuerpo de los avatares.
   - En formaciones grupales, garantizar una separación lateral mínima $\ge 0.85$ m.

---

## 5. Aspectos Clave Incorporados en la Skill

- **Descubrimiento Progresivo:** La cabecera YAML incluye `name` y `description` redactada en tercera persona con palabras clave precisas (*Three.js*, *Remotion*, *useCurrentFrame*, *TikTok*, *Reels*, *Shorts*, *Seamless loop*, *React Three Fiber*), garantizando que el motor de Antigravity active la habilidad de forma contextual y eficiente.
- **Arquitectura de Retención 4-Act:** Implementa la entrega obligatoria del primer valor antes de los 8 segundos y el ritmo de micro-giros cada 4.5 segundos derivados del análisis de retención.
- **Cierre en Bucle:** Sistematiza la regla de empalme sintáctico y geométrico con período $2\pi$ para inducir la reproducción pasiva continua en plataformas móviles.
- **Protección de Entorno Headless:** Convierte en regla innegociable la prohibición de `useFrame` y `Math.random()`, instruyendo al modelo a resolver toda dinámica tridimensional de manera puramente funcional con `useCurrentFrame()`.
