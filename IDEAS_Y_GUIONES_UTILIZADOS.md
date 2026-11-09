# Catálogo de Ideas, Ángulos y Guiones Utilizados en Bailapp

Este documento recopila el inventario exhaustivo de todos los conceptos creativos, hooks virales, dolores de usuario (alumnas y academias) y guiones implementados a lo largo del proyecto Bailapp. Sirve como registro histórico para evitar repeticiones, detectar patrones de alta conversión y planificar futuras olas de contenido.

---

## 1. Matriz de Ángulos Creativos

| Audiencia | Territorio Emocional / Dolor | Insight Clave | Formato / Escenario |
| :--- | :--- | :--- | :--- |
| **Alumnas (B2C)** | Vergüenza y "Dos pies izquierdos" | Creencia limitante de que la danza es solo para gente con talento innato o profesionales. | Escena dormitorio vs. Estudio de danza. |
| **Alumnas (B2C)** | Espacio reducido en casa ("Bailar en la pieza") | El choque constante contra la cama o placard al intentar aprender coreos virales de TikTok. | Diorama de dormitorio claustrofóbico. |
| **Alumnas (B2C)** | Fitness tradicional aburrido vs. Danza | 45 min en la cinta mirando la pared vs. quemar 600 kcal riéndose con amigas al ritmo de música real. | Gimnasio tradicional vs. Estudio de baile. |
| **Alumnas (B2C)** | Finde sin plan / Scrollear en la cama | Rutina sedentaria de sábado; deseo de salir pero sin querer pagar matrículas anuales fijas. | Living room / Sillón scrolleando. |
| **Alumnas (B2C)** | Empoderamiento / Miedo a los tacos (Heels) | Deseo de bailar Heels frenado por timidez o falta de equilibrio; necesidad de clases desde cero. | Escena de pasarela / Estudio Heels. |
| **Alumnas (B2C)** | Terapia de endorfinas / Estrés de las 18 hs | Salir de la oficina o facultad quemada; la danza como desconexión mental absoluta. | Oficina / Espacio urbano a sala de danza. |
| **Alumnas (B2C)** | La crew de amigas y comunidad | La danza no es solo ejercicio físico, es sentido de pertenencia y socialización femenina. | Estudio de danza grupal / Podio de festejo. |
| **Alumnas (B2C)** | Búsqueda frustrada de clases | Navegar 20 perfiles de Instagram con stories viejas y Google Forms rotos para encontrar una clase. | Celular con feed caótico vs. App Bailapp. |
| **Alumnas (B2C)** | Drama del DM y visto clavado | Mandar mensaje preguntando cupo a las 19 hs y que respondan al día siguiente cuando ya pasó la clase. | Smartphone con burbuja de chat y visto azul. |
| **Academias (B2B)** | El drama de las transferencias bancarias | Dueñas perdiendo 3 horas por día cruzando comprobantes sin nombre, alias fantasma y planillas de Excel. | Recepción de academia / Mostrador con laptop y recibos. |
| **Academias (B2B)** | Historias de Instagram invisibles | Flyers hermosos en Canva con 28 vistas porque el algoritmo ya no distribuye stories. | Celular con gráfica de alcance en caída. |
| **Academias (B2B)** | Cancelaciones de último momento | Alumnas cancelando 2 horas antes de la clase dejando cupos vacíos imposibles de reubicar a mano. | Mostrador de estudio con cartel de cupo vacío. |
| **Academias (B2B)** | Caos en grupos de WhatsApp | 120 personas spameando dudas, comprobantes y pedidos de precios en un chat interminable. | Chat caótico de WhatsApp desbordado. |

---

## 2. Inventario Detallado de Guiones y Copys por Video

### 1. `video_viral_1_dos_pies_izquierdos` (y `bailapp_dos_pies_izquierdos_reel`)
- **Público:** Alumnas principiantes con inseguridad motriz o vergüenza.
- **Hook:** *"¿Pensás que tenés dos pies izquierdos y que bailar no es para vos?"*
- **Agitación:** Miedo al ridículo, a tropezarse frente a todos o sentir que no se tiene ritmo ni para aplaudir.
- **Solución / Reframe:** Clases para principiantes desde cero en Bailapp (Reggaetón, Twerk, Bachata). En 10 minutos se va la timidez.
- **Escenarios 3D:** Dormitorio casero → Estudio de danza → Podio de celebración.
- **CTA:** *"Entrá en bailapp.com.ar y elegí tu primera clase cerca tuyo."*

### 2. `video_viral_2_gym_vs_dance` (y `bailapp_viral_glowup_reel`)
- **Público:** Mujeres que abandonan el gimnasio tradicional por monotonía.
- **Hook:** *"¿Hacés 45 minutos de cinta mirando una pared sufriendo cada segundo?"*
- **Agitación:** El gym tradicional aburre porque el cerebro busca música, ritmo y desconexión social.
- **Solución / Reframe:** 1 clase de Commercial, Dancehall o Twerk quema más de 600 calorías riendo con amigas sin mirar el reloj.
- **Escenarios 3D:** Gimnasio procedural (`stage_gym.js` con cinta de correr) → Smartphone Bailapp → Estudio de danza.
- **CTA:** *"Cambiá la rutina por danza. Entrá a bailapp.com.ar"*

### 3. `video_viral_3_transferencias_drama` (y `bailapp_whatsapp_reel`)
- **Público:** Dueñas de estudios de danza y profesoras independientes (B2B).
- **Hook:** *"¿Seguís pidiendo comprobante de transferencia por WhatsApp para anotar gente a tu clase?"*
- **Agitación:** Alias sin nombre, transferencias no impactadas, Excel desactualizado y horas perdidas respondiendo mensajes.
- **Solución / Reframe:** En Bailapp las alumnas pagan directo en la app, reservan en 10 segundos y reciben pase digital QR.
- **Escenarios 3D:** Recepción de estudio (`stage_reception.js` con laptop y papeles) → Smartphone con pase QR → Estudio lleno.
- **CTA:** *"Sumá tu academia gratis en bailapp.com.ar"*

### 4. `video_viral_4_finde_sin_plan`
- **Público:** Jóvenes buscando planes de fin de semana espontáneos y accesibles.
- **Hook:** *"¿Llega el sábado y tu único plan es scrollear el celular en la cama?"*
- **Agitación:** Deseo de hacer algo divertido el finde pero sin atarse a matrículas mensuales caras ni contratos fijos.
- **Solución / Reframe:** Clases sueltas en Bailapp por lo que sale una merienda. Reservás hoy, bailás hoy.
- **Escenarios 3D:** Living room con sillón (`stage_livingroom.js`) → Mockup Smartphone Bailapp → Estudio con luces y música.
- **CTA:** *"Armá tu plan en bailapp.com.ar"*

### 5. `video_viral_5_heels_glowup`
- **Público:** Mujeres que quieren aprender Heels / Stiletto Dance pero tienen miedo al equilibrio o prejuicios.
- **Hook:** *"Hay una versión tuya súper empoderada esperando ponerse tacos y bailar."*
- **Agitación:** Creer que Heels es solo para profesionales o temer una torcedura de tobillo.
- **Solución / Reframe:** Clases de técnica, postura y caminata desde cero absoluto con profes que cuidan la anatomía.
- **Escenarios 3D:** Estudio con tacones → Smartphone interactivo → Coreografía en tacos con aplausos.
- **CTA:** *"Desbloqueá tu confianza en bailapp.com.ar"*

### 6. `bailapp_alumnas_reel`
- **Público:** Dueños de estudios frustrados con el algoritmo de Meta.
- **Hook:** *"El error número 1 que cometen los estudios de danza en Instagram."*
- **Dolor:** Flyers en Canva con 28 vistas y 2 likes de familiares.
- **Solución:** Bailapp como marketplace activo donde la gente entra a buscar clases, no a scrollear memes.

### 7. `bailapp_cancelaciones_reel`
- **Público:** Academias con pérdida de rentabilidad por cupos ociosos.
- **Hook:** *"¿Te cancelaron a las 18:30 y te quedó el salón con lugares vacíos?"*
- **Dolor:** Cancelaciones de último momento que dejan la sala a medio llenar sin posibilidad de cobrar.
- **Solución:** Reubicación automática de cupos caídos en tiempo real con lista de espera de Bailapp.

### 8. `bailapp_cuarto_vs_estudio_reel` & `bailapp_lowpoly3d_viral_reel`
- **Público:** Alumnas que practican solas en su casa.
- **Hook:** *"Levantá la mano si alguna vez te chocaste la cama bailando en tu pieza."*
- **Dolor:** Dedo chiquito lastimado, falta de espacio, imposibilidad de abrir los brazos o verse de cuerpo entero.
- **Solución:** Vivir la danza con piso de madera, espejos panorámicos y sonido profesional.

### 9. `bailapp_estudios_reel`
- **Público:** Recepcionistas y profes agotadas del WhatsApp de la academia.
- **Hook:** *"Basta de perder 3 horas por día contestando '¿precio?' en los DMs."*
- **Dolor:** Responder precio, horarios, cupo y alias una y otra vez para que terminen clavando el visto.
- **Solución:** Automatización completa del proceso de compra y reserva en 1 link de bio.

### 10. `bailapp_lowpoly3d_characters_reel`
- **Público:** Fidelización de comunidad y conexión femenina.
- **Hook:** *"Cuando encontrás tu crew de baile, todo cambia."*
- **Dolor:** Sentirse sola o desmotivada para entrenar.
- **Solución:** El vestuario, las risas en la diagonal y la amistad post-clase que te cambian la semana.

### 11. `bailapp_lowpoly3d_dm_drama_reel`
- **Público:** Usuarias que intentan anotarse a una clase a última hora.
- **Hook:** *"¿Te pasó de querer ir a bailar hoy y que te claven el visto por DM?"*
- **Dolor:** Querer bailar a las 19 hs y recibir respuesta a las 11 hs del día siguiente cuando ya se llenó.
- **Solución:** Reserva instantánea con confirmación en el acto.

### 12. `bailapp_lowpoly3d_v2_reel`
- **Público:** Usuarias indecisas sobre qué estilo probar.
- **Hook:** *"¿Buscás clase de baile pero no sabés por dónde arrancar?"*
- **Dolor:** Comparar 15 perfiles de Instagram desconectados.
- **Solución:** Catálogo unificado por barrio, nivel y estilo (K-Pop, Heels, Twerk, Bachata).

### 13. `bailapp_principiantes_reel`
- **Público:** Adultos principiantes con síndrome del impostor.
- **Hook:** *"Quiero aprender a bailar pero me da mucha vergüenza."*
- **Dolor:** *"Ya estoy grande para arrancar"*, *"todos van a saber menos yo"*.
- **Solución:** Clases 100% iniciantes pensadas para disfrutar el proceso sin juzgar.

### 14. `bailapp_terapia_endorfinas_reel`
- **Público:** Mujeres estresadas por el trabajo o la universidad.
- **Hook:** *"El antídoto al estrés de las 18 hs se llama clase de baile."*
- **Dolor:** Quedarse scrolleando en la cama con culpa y dolor de cabeza.
- **Solución:** La descarga somática y el subidón de serotonina que solo la música y el movimiento generan.

### 15. `bailapp_trend_viral_reel`
- **Público:** Creadoras de contenido y fans de TikTok.
- **Hook:** *"¿Cuántas tomas hiciste de ese trend en tu cuarto?"*
- **Dolor:** Espejo del placard recortado, luz pésima y frustración.
- **Solución:** Bailar la coreo viral en un estudio profesional con iluminación y espacio real.

---

## 3. Territorios Creativos Disponibles para Nuevas Campañas

Para no saturar las ideas existentes, las próximas producciones pueden explorar:
1. **El "Post-Breakup Dance Glow Up":** El baile como reconstrucción de autoestima tras una ruptura amorosa.
2. **K-Pop Random Dance / Fandom:** Encontrar amigas para ensayar coreos de K-Pop grupales sin que te miren raro.
3. **La primera clase de Salsa / Bachata con pareja o sola:** Desmitificar que para ritmos latinos necesitás llevar a alguien.
4. **Mamás que vuelven a bailar:** Recuperar su espacio propio y desconectar de las tareas de cuidado 1 hora al día.
5. **Urban Battles / Freestyle:** Para público urbano que busca mejorar su improvisación y soltarse.
