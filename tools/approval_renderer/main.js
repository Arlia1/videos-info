import * as THREE from './three.module.js';
import { createLowPolyMaterial, buildEnhancedCharacter } from './characters/character_builder.js';
import {
  createBedroomGirl,
  createStudioDancerA,
  createStudioDancerB,
  createStudioDancerC
} from './characters/character_presets.js';
import { createStageBedroom } from './stages/stage_bedroom.js';
import { createStageStudio } from './stages/stage_studio.js';

const W = 1080;
const H = 1920;

const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  preserveDrawingBuffer: true,
  powerPreference: 'high-performance'
});
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#FFF5F8');

// Iluminación de estudio
const hemiLight = new THREE.HemisphereLight('#FFF0F5', '#E4D3DD', 1.30);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight('#FFFBF2', 1.50);
dirLight.position.set(4, 9, 6);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.bias = -0.0003;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 25;
dirLight.shadow.camera.left = -4;
dirLight.shadow.camera.right = 4;
dirLight.shadow.camera.top = 4;
dirLight.shadow.camera.bottom = -4;
scene.add(dirLight);

const rimLight = new THREE.DirectionalLight('#FAD2E1', 0.95);
rimLight.position.set(-5, 6, -3);
scene.add(rimLight);

const fillLight = new THREE.DirectionalLight('#FFF5F8', 0.55);
fillLight.position.set(0, 2, 5);
scene.add(fillLight);

// Pedestal de exhibición para personajes
const pedestalGeo = new THREE.CylinderGeometry(1.65, 1.80, 0.12, 32);
const pedestalMat = createLowPolyMaterial('#FAD2E1', 0.85);
const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
pedestal.position.y = -0.06;
pedestal.receiveShadow = true;
scene.add(pedestal);

// Creación de personajes base
const charRaspberry = createStudioDancerA();
const charBedroom = createBedroomGirl();
const charLavender = createStudioDancerB();
const charMint = createStudioDancerC();

// 5 Propuestas de Peinado sobre la bailarina principal (Raspberry)
const heroBaseOpts = {
  skinColor: '#FFDEC8',
  hairColor: '#231B26',
  topColor: '#E06385',
  topType: 'croptop',
  sleeves: 'short',
  bottomColor: '#1F2937',
  pantsLength: 'shorts',
  shoesColor: '#FFFFFF',
  accentColor: '#F472B6',
};

const hairOpt1 = buildEnhancedCharacter({ ...heroBaseOpts, hairStyle: 'curtain_waves' });
const hairOpt2 = buildEnhancedCharacter({ ...heroBaseOpts, hairStyle: 'high_ponytail_slick' });
const hairOpt3 = buildEnhancedCharacter({ ...heroBaseOpts, hairStyle: 'space_buns' });
const hairOpt4 = buildEnhancedCharacter({ ...heroBaseOpts, hairStyle: 'side_swept_glam' });
const hairOpt5 = buildEnhancedCharacter({ ...heroBaseOpts, hairStyle: 'classic_top_bun' });

const hairOptions = [hairOpt1, hairOpt2, hairOpt3, hairOpt4, hairOpt5];

hairOptions.forEach(char => {
  char.setPose({
    hipsY: 0.02, hipSway: 0.06, torsoSway: -0.03,
    armLX: -0.38, armLZ: -0.48, elbowLX: -0.75,
    armRX: 0.10, armRZ: 0.35, elbowRX: -1.20,
    headTilt: 0.02, headTurn: -0.04,
    legLX: -0.06, legLZ: -0.04, kneeLX: 0.05,
    legRX: 0.08, legRZ: 0.04, kneeRX: 0.12,
  });
  scene.add(char.root);
});

// ============================================================================
// 3 EJEMPLOS BASADOS EN LA REFERENCIA (WHATSAPP IMAGE LOWPOLY VOLUMEN)
// ============================================================================
const refHairBaseOpts = {
  skinColor: '#FFDEC8',
  hairColor: '#5C3A21', // Castaño cálido idéntico a la referencia
  topColor: '#7C3AED', // Top morado como en la referencia
  topType: 'croptop',
  sleeves: 'short',
  bottomColor: '#1F2937',
  pantsLength: 'shorts',
  shoesColor: '#FFFFFF',
  accentColor: '#A78BFA',
};

const refHair1 = buildEnhancedCharacter({ ...refHairBaseOpts, hairStyle: 'ref_chunky_bob' });
const refHair2 = buildEnhancedCharacter({ ...refHairBaseOpts, hairStyle: 'ref_long_curtain' });
const refHair3 = buildEnhancedCharacter({ ...refHairBaseOpts, hairStyle: 'ref_wavy_lob' });

const refHairGroup = [refHair1, refHair2, refHair3];
refHairGroup.forEach(char => {
  char.setPose({
    hipsY: 0.02, hipSway: 0.04, torsoSway: -0.02,
    armLX: -0.35, armLZ: -0.45, elbowLX: -0.70,
    armRX: 0.10, armRZ: 0.30, elbowRX: -1.15,
    headTilt: 0.01, headTurn: -0.02,
    legLX: -0.06, legLZ: -0.04, kneeLX: 0.05,
    legRX: 0.08, legRZ: 0.04, kneeRX: 0.12,
  });
  scene.add(char.root);
});

// Poses estilizadas de danza personajes base
charRaspberry.setPose({
  hipsY: 0.02, hipSway: 0.10, hipTwist: 0.06,
  torsoSway: -0.05, torsoTilt: -0.03,
  armLX: -0.42, armLZ: -0.58, elbowLX: -0.75,
  armRX: 0.10, armRZ: 0.35, elbowRX: -1.35,
  headTilt: 0.04, headTurn: -0.06,
  legLX: -0.08, legLZ: -0.06, kneeLX: 0.05,
  legRX: 0.10, legRZ: 0.06, kneeRX: 0.15,
});

charBedroom.setPose({
  hipsY: -0.01, hipSway: -0.08, torsoTilt: 0.06,
  armLX: -0.65, armLZ: -0.35, elbowLX: -1.45,
  armRX: 0.12, armRZ: 0.28, elbowRX: -0.80,
  headTilt: -0.05, headTurn: 0.08,
  legLX: 0.08, legLZ: -0.05, kneeLX: 0.12,
  legRX: -0.05, legRZ: 0.05, kneeRX: 0.06,
});

charLavender.setPose({
  hipsY: 0.03, hipSway: 0.12, torsoSway: -0.05,
  armLX: -1.15, armLZ: -0.42, elbowLX: -1.15,
  armRX: -0.80, armRZ: 0.48, elbowRX: -1.05,
  headTilt: -0.04, headTurn: 0.08,
  legLX: -0.12, legLZ: -0.08, kneeLX: 0.08,
  legRX: 0.10, legRZ: 0.08, kneeRX: 0.18,
});

charMint.setPose({
  hipsY: 0.02, hipSway: -0.10, torsoSway: 0.05,
  armLX: 0.10, armLZ: -0.30, elbowLX: -1.05,
  armRX: -0.55, armRZ: 0.50, elbowRX: -0.80,
  headTilt: 0.06, headTurn: -0.08,
  legLX: 0.10, legLZ: -0.05, kneeLX: 0.14,
  legRX: -0.06, legRZ: 0.05, kneeRX: 0.06,
});

scene.add(charRaspberry.root);
scene.add(charBedroom.root);
scene.add(charLavender.root);
scene.add(charMint.root);

// Escenarios
const bedroomObj = createStageBedroom();
bedroomObj.visible = false;
scene.add(bedroomObj);

const studioData = createStageStudio();
const studioObj = studioData.stage;
studioObj.visible = false;
scene.add(studioObj);

// Cámaras
const cameraChar = new THREE.PerspectiveCamera(34, W / H, 0.1, 50);
cameraChar.position.set(0.0, 0.94, 4.40);
cameraChar.lookAt(0, 0.90, 0);

const cameraLineup = new THREE.PerspectiveCamera(38, W / H, 0.1, 50);
cameraLineup.position.set(0.0, 1.05, 5.65);
cameraLineup.lookAt(0, 0.90, 0);

// Cámara retrato para apreciar el peinado de cerca (plano busto con respiración)
const cameraHairPortrait = new THREE.PerspectiveCamera(27, W / H, 0.1, 50);
cameraHairPortrait.position.set(0.0, 1.44, 2.20);
cameraHairPortrait.lookAt(0.0, 1.40, 0.0);

// Cámara lineup de las 5 opciones de peinado
const cameraHairLineup = new THREE.PerspectiveCamera(40, W / H, 0.1, 50);
cameraHairLineup.position.set(0.0, 1.15, 6.20);
cameraHairLineup.lookAt(0.0, 0.95, 0.0);

// Cámara lineup para los 3 ejemplos basados en la referencia (encuadre completo 3 bustos)
const cameraRefHairLineup = new THREE.PerspectiveCamera(38, W / H, 0.1, 50);
cameraRefHairLineup.position.set(0.0, 1.30, 4.40);
cameraRefHairLineup.lookAt(0.0, 1.22, 0.0);

const cameraBedroom = new THREE.PerspectiveCamera(46, W / H, 0.1, 50);
cameraBedroom.position.set(2.8, 3.5, 4.2);
cameraBedroom.lookAt(0.0, 0.85, 0.0);

const cameraStudio = new THREE.PerspectiveCamera(44, W / H, 0.1, 50);
cameraStudio.position.set(0.0, 2.4, 6.6);
cameraStudio.lookAt(0, 1.2, -0.9);

function hideAll() {
  pedestal.visible = false;
  bedroomObj.visible = false;
  studioObj.visible = false;

  charRaspberry.root.visible = false;
  charBedroom.root.visible = false;
  charLavender.root.visible = false;
  charMint.root.visible = false;

  charRaspberry.root.position.set(0, 0, 0);
  charRaspberry.root.rotation.set(0, 0, 0);
  charBedroom.root.position.set(0, 0, 0);
  charBedroom.root.rotation.set(0, 0, 0);
  charLavender.root.position.set(0, 0, 0);
  charLavender.root.rotation.set(0, 0, 0);
  charMint.root.position.set(0, 0, 0);
  charMint.root.rotation.set(0, 0, 0);

  hairOptions.forEach(char => {
    char.root.visible = false;
    char.root.position.set(0, 0, 0);
    char.root.rotation.set(0, 0, 0);
  });

  refHairGroup.forEach(char => {
    char.root.visible = false;
    char.root.position.set(0, 0, 0);
    char.root.rotation.set(0, 0, 0);
  });
}

window.render = async function(t = 0) {
  const mode = Math.round(t);
  hideAll();

  let activeCam = cameraChar;

  if (mode === 0) {
    pedestal.visible = true;
    charRaspberry.root.visible = true;
    charRaspberry.root.rotation.y = 0.10;
    activeCam = cameraChar;
  } else if (mode === 1) {
    pedestal.visible = true;
    charBedroom.root.visible = true;
    charBedroom.root.rotation.y = -0.08;
    activeCam = cameraChar;
  } else if (mode === 2) {
    pedestal.visible = true;
    charLavender.root.visible = true;
    charLavender.root.rotation.y = 0.12;
    activeCam = cameraChar;
  } else if (mode === 3) {
    pedestal.visible = true;
    charMint.root.visible = true;
    charMint.root.rotation.y = -0.10;
    activeCam = cameraChar;
  } else if (mode === 4) {
    pedestal.visible = false;
    charRaspberry.root.visible = true;
    charRaspberry.root.position.set(-0.28, 0, 0.18);
    charRaspberry.root.rotation.y = 0.08;

    charLavender.root.visible = true;
    charLavender.root.position.set(0.30, 0, 0.18);
    charLavender.root.rotation.y = -0.08;

    charBedroom.root.visible = true;
    charBedroom.root.position.set(-0.84, 0, -0.18);
    charBedroom.root.rotation.y = 0.20;

    charMint.root.visible = true;
    charMint.root.position.set(0.84, 0, -0.18);
    charMint.root.rotation.y = -0.20;

    activeCam = cameraLineup;
  } else if (mode === 5) {
    bedroomObj.visible = true;
    activeCam = cameraBedroom;
  } else if (mode === 6) {
    studioObj.visible = true;
    activeCam = cameraStudio;
  }
  // =========================================================================
  // MODOS DE APROBACIÓN DE PEINADOS (10 - 15)
  // =========================================================================
  else if (mode === 10) {
    // Opción 1: K-Pop Curtain Waves
    pedestal.visible = true;
    hairOpt1.root.visible = true;
    hairOpt1.root.rotation.y = 0.08;
    activeCam = cameraHairPortrait;
  } else if (mode === 11) {
    // Opción 2: Slick High Ponytail
    pedestal.visible = true;
    hairOpt2.root.visible = true;
    hairOpt2.root.rotation.y = 0.20; // Leve giro para mostrar el perfil dinámico de la coleta
    activeCam = cameraHairPortrait;
  } else if (mode === 12) {
    // Opción 3: Space Buns (Doble Rodete)
    pedestal.visible = true;
    hairOpt3.root.visible = true;
    hairOpt3.root.rotation.y = 0.06;
    activeCam = cameraHairPortrait;
  } else if (mode === 13) {
    // Opción 4: Side-Swept Glam
    pedestal.visible = true;
    hairOpt4.root.visible = true;
    hairOpt4.root.rotation.y = 0.12; // Muestra la ola asimétrica
    activeCam = cameraHairPortrait;
  } else if (mode === 14) {
    // Opción 5: Blunt Bob Center
    pedestal.visible = true;
    hairOpt5.root.visible = true;
    hairOpt5.root.rotation.y = 0.08;
    activeCam = cameraHairPortrait;
  } else if (mode === 15) {
    // Lineup de las 5 Opciones de Peinado
    pedestal.visible = false;
    hairOpt1.root.visible = true;
    hairOpt1.root.position.set(-1.10, 0, -0.20);
    hairOpt1.root.rotation.y = 0.15;

    hairOpt2.root.visible = true;
    hairOpt2.root.position.set(-0.55, 0, 0.05);
    hairOpt2.root.rotation.y = 0.12;

    hairOpt3.root.visible = true;
    hairOpt3.root.position.set(0.00, 0, 0.15);
    hairOpt3.root.rotation.y = 0.00;

    hairOpt4.root.visible = true;
    hairOpt4.root.position.set(0.55, 0, 0.05);
    hairOpt4.root.rotation.y = -0.12;

    hairOpt5.root.visible = true;
    hairOpt5.root.position.set(1.10, 0, -0.20);
    hairOpt5.root.rotation.y = -0.15;

    activeCam = cameraHairLineup;
  }
  // =========================================================================
  // MODOS DE APROBACIÓN 3 EJEMPLOS BASADOS EN REFERENCIA (20 - 23)
  // =========================================================================
  else if (mode === 20) {
    // Ejemplo 1: Bob Chunky Referencia (Réplica directa foto)
    pedestal.visible = true;
    refHair1.root.visible = true;
    refHair1.root.rotation.y = 0.04;
    activeCam = cameraHairPortrait;
  } else if (mode === 21) {
    // Ejemplo 2: Melena Larga Escalonada
    pedestal.visible = true;
    refHair2.root.visible = true;
    refHair2.root.rotation.y = 0.04;
    activeCam = cameraHairPortrait;
  } else if (mode === 22) {
    // Ejemplo 3: Bob Urbano Texturado
    pedestal.visible = true;
    refHair3.root.visible = true;
    refHair3.root.rotation.y = 0.04;
    activeCam = cameraHairPortrait;
  } else if (mode === 23) {
    // Lineup de los 3 Ejemplos
    pedestal.visible = false;
    refHair1.root.visible = true;
    refHair1.root.position.set(-0.68, 0, 0.0);
    refHair1.root.rotation.y = 0.12;

    refHair2.root.visible = true;
    refHair2.root.position.set(0.0, 0, 0.10);
    refHair2.root.rotation.y = 0.0;

    refHair3.root.visible = true;
    refHair3.root.position.set(0.68, 0, 0.0);
    refHair3.root.rotation.y = -0.12;

    activeCam = cameraRefHairLineup;
  }

  renderer.render(scene, activeCam);
};

window.READY = true;
