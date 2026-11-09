// ============================================================================
// BAILAPP 3D SHARED ASSET LIBRARY: CHARACTER PRESETS
// ============================================================================

import { buildEnhancedCharacter } from './character_builder.js';

/**
 * Bailarina del Cuarto (Protagonista inicial, práctica casera con buzo oversize)
 */
export function createBedroomGirl(opts = {}) {
  return buildEnhancedCharacter({
    skinColor: '#FFD5B8',
    hairColor: '#2D242E',
    hairStyle: 'long_wavy',
    topColor: '#374151', // Buzo gris carbón/oversize
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
 * Bailarina Estudio Principal (Raspberry Diva - Choreo Videoclip)
 */
export function createStudioDancerA(opts = {}) {
  return buildEnhancedCharacter({
    skinColor: '#FFD5B8',
    hairColor: '#2D242E',
    hairStyle: 'long_wavy',
    topColor: '#E06385', // Raspberry Diva
    topType: 'croptop',
    sleeves: 'short',
    bottomColor: '#1F2937', // Biker shorts negros
    pantsLength: 'shorts',
    shoesColor: '#FFFFFF',
    accentColor: '#F472B6',
    ...opts,
  });
}

/**
 * Bailarina Estudio Secundaria (Lavender K-Pop)
 */
export function createStudioDancerB(opts = {}) {
  return buildEnhancedCharacter({
    skinColor: '#F5C396',
    hairColor: '#4A2810',
    hairStyle: 'high_ponytail',
    topColor: '#8B5CF6', // Lavender K-Pop
    topType: 'croptop',
    sleeves: 'short',
    bottomColor: '#C4B5FD', // Shorts lila pastel
    pantsLength: 'shorts',
    shoesColor: '#FFFFFF',
    accentColor: '#A78BFA',
    ...opts,
  });
}

/**
 * Bailarina Estudio Terciaria (Mint Urban / Heels)
 */
export function createStudioDancerC(opts = {}) {
  return buildEnhancedCharacter({
    skinColor: '#E2AC80',
    hairColor: '#1F1D2B',
    hairStyle: 'bob',
    topColor: '#10B981', // Mint Urban
    topType: 'croptop',
    sleeves: 'short',
    bottomColor: '#F4E8C1', // Beige/crema
    pantsLength: 'shorts',
    shoesColor: '#FFFFFF',
    accentColor: '#34D399',
    ...opts,
  });
}
