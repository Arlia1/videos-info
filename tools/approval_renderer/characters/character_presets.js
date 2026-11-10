// ============================================================================
// BAILAPP 3D — CHARACTER PRESETS (MINIMALIST LOW-POLY ART)
// ============================================================================

import { buildEnhancedCharacter } from './character_builder.js';

/**
 * 1. Raspberry Diva (Hero Principal / Choreo Videoclip)
 */
export function createStudioDancerA(opts = {}) {
  return buildEnhancedCharacter({
    skinColor: '#FFDEC8',
    hairColor: '#251E28',
    hairStyle: 'long_wavy',
    topColor: '#E06385', // Raspberry Frambuesa
    topType: 'croptop',
    sleeves: 'short',
    bottomColor: '#1F2937', // Shorts oscuros
    pantsLength: 'shorts',
    shoesColor: '#FFFFFF',
    accentColor: '#F472B6',
    ...opts,
  });
}

/**
 * 2. Bedroom Girl (Bailarina del Cuarto / Práctica Casera)
 */
export function createBedroomGirl(opts = {}) {
  return buildEnhancedCharacter({
    skinColor: '#FFDEC8',
    hairColor: '#2D242E',
    hairStyle: 'top_bun', // Rodete desenfadado de práctica
    topColor: '#374151', // Buzo oversize carbón
    topType: 'hoodie',
    sleeves: 'long',
    bottomColor: '#F8C8DC', // Jogger rosa pastel
    pantsLength: 'jogger',
    shoesColor: '#FFFFFF',
    accentColor: '#E06385',
    ...opts,
  });
}

/**
 * 3. Lavender K-Pop (Coreografía Dinámica)
 */
export function createStudioDancerB(opts = {}) {
  return buildEnhancedCharacter({
    skinColor: '#F5C7A5',
    hairColor: '#4A2A1A',
    hairStyle: 'high_ponytail', // Coleta alta
    topColor: '#8B5CF6', // Lila K-Pop
    topType: 'croptop',
    sleeves: 'short',
    bottomColor: '#DDD6FE', // Shorts lila pastel
    pantsLength: 'shorts',
    shoesColor: '#FFFFFF',
    accentColor: '#C4B5FD',
    ...opts,
  });
}

/**
 * 4. Mint Urban Heels (Estilo Comercial / Urbano)
 */
export function createStudioDancerC(opts = {}) {
  return buildEnhancedCharacter({
    skinColor: '#E4AC84',
    hairColor: '#1A1822',
    hairStyle: 'bob', // Corte bob angulado
    topColor: '#10B981', // Verde Menta
    topType: 'croptop',
    sleeves: 'short',
    bottomColor: '#F4E8C1', // Crema/beige
    pantsLength: 'shorts',
    shoesColor: '#FFFFFF',
    shoesType: 'sneaker',
    accentColor: '#34D399',
    ...opts,
  });
}
