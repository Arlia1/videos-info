"""Audio mix for Bailapp - Reel Cuarto vs Estudio Real (27.5s)
Score sintético + Locución Rioplatense Natural + Ducking + Limiter -> audio/mix.wav
"""
import os, sys
import numpy as np
import soundfile as sf
from scipy.ndimage import uniform_filter1d

LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
sys.path.insert(0, LIB)

from core.audio.sfx import (
    SR, bp, lp, hp, noise, norm, t_, env_exp, whoosh, ding,
    add, limit
)

DUR = 27.5
N = int(DUR * SR) + SR // 2

def st():
    return np.zeros((N, 2), np.float32)

def generate_music():
    score = st()
    beat = 0.46  # ~130 BPM
    
    # --- SECCIÓN 1 (0.0s - 11.5s): Caos en la Pieza (Beat rítmico juguetón) ---
    bass_intro = [65.41, 73.42, 82.41, 65.41]
    for idx, at in enumerate(np.arange(0.2, 11.4, beat)):
        freq = bass_intro[idx % len(bass_intro)]
        d = 0.28
        t_note = t_(d)
        plk = (np.sin(2 * np.pi * freq * t_note) +
               0.3 * np.sin(3 * np.pi * freq * t_note)) * env_exp(d, 0.08)
        add(score, norm(plk, 0.35), at, gain=0.55, pan=0.0)
        
        # Click / Percusión
        d_tick = 0.03
        tick = bp(noise(d_tick), 3200, 7000) * env_exp(d_tick, 0.015)
        add(score, norm(tick, 0.25), at + beat/2, gain=0.25, pan=0.2)

    # Golpe cómico en "dedo chiquito" (7.0s)
    d_thump = 0.18
    t_thump = t_(d_thump)
    thump = np.sin(2 * np.pi * 90 * t_thump) * env_exp(d_thump, 0.04)
    add(score, norm(thump, 0.5), 7.0, gain=0.65, pan=0.0)

    # --- SWEEP TRANSICIÓN (11.2s - 11.8s) ---
    d_sw = 0.7
    sw = whoosh(d_sw)
    add(score, norm(sw, 0.50), 11.2, gain=0.60, pan=0.0)

    # --- SECCIÓN 2 (11.7s - 19.5s): Estudio Real & Pleno Baile (Dancehall / Pop Groove) ---
    t_groove = np.arange(11.7, 19.5, beat)
    bass_groove = [110.0, 130.81, 146.83, 164.81, 130.81, 146.83, 164.81, 174.61]
    
    for idx, at in enumerate(t_groove):
        freq = bass_groove[idx % len(bass_groove)]
        d = 0.36
        t_note = t_(d)
        bass = (np.sin(2 * np.pi * freq * t_note) + 0.5 * np.sin(4 * np.pi * freq * t_note)) * env_exp(d, 0.12)
        add(score, norm(bass, 0.55), at, gain=0.70, pan=0.0)
        
        # Kick potente
        d_k = 0.16
        t_k = t_(d_k)
        f_k = np.linspace(140, 48, len(t_k))
        phase_k = 2 * np.pi * np.cumsum(f_k) / SR
        kick = np.sin(phase_k) * env_exp(d_k, 0.05)
        add(score, norm(kick, 0.60), at, gain=0.65, pan=0.0)
        
        # Palmas enérgicas
        if idx % 2 == 1:
            d_cl = 0.14
            clap = bp(noise(d_cl), 1200, 6000) * env_exp(d_cl, 0.035)
            add(score, norm(clap, 0.45), at, gain=0.55, pan=0.15)
            
        # Acordes Dance Pop
        d_ch = 0.35
        t_ch = t_(d_ch)
        c_freqs = [261.63, 329.63, 392.00] if (idx // 4) % 2 == 0 else [220.0, 261.63, 329.63]
        chord = sum(np.sin(2 * np.pi * f * t_ch) for f in c_freqs) * env_exp(d_ch, 0.15)
        add(score, norm(chord, 0.38), at + beat/2, gain=0.48, pan=-0.2)

    # Chime en "Dejá de romper los muebles" (19.6s)
    ch = ding(0.85)
    add(score, ch, 19.6, gain=0.55, pan=0.2)

    # --- SECCIÓN 3 (22.5s - 27.5s): CTA & Resolución ---
    d_cta = 5.0
    t_cta = t_(d_cta)
    cta_chord = (np.sin(2 * np.pi * 261.63 * t_cta) +
                 np.sin(2 * np.pi * 329.63 * t_cta) +
                 np.sin(2 * np.pi * 392.00 * t_cta) +
                 np.sin(2 * np.pi * 523.25 * t_cta) * 0.5) * np.exp(-t_cta / 2.0)
    add(score, norm(cta_chord, 0.5), 22.5, gain=0.6, pan=0.0)
    
    # Campana final
    final_bell = ding(1.0)
    add(score, final_bell, 22.8, gain=0.65, pan=0.1)

    return score

def main():
    print("1. Generando música y ambientación rítmica...")
    music = generate_music()

    print("2. Cargando voz neuronal...")
    here = os.path.dirname(os.path.abspath(__file__))
    vpath = os.path.join(here, 'voiceover.mp3')
    
    cmd_wav = f"ffmpeg -y -i '{vpath}' -ar {SR} -ac 2 /tmp/voice_temp_cuarto.wav >/dev/null 2>&1"
    os.system(cmd_wav)
    
    v_data, v_sr = sf.read('/tmp/voice_temp_cuarto.wav')
    voice = st()
    vl = min(len(v_data), N)
    voice[:vl] = v_data[:vl]

    print("3. Aplicando ducking dinámico sobre la música...")
    voice_env = np.abs(voice[:, 0]) + np.abs(voice[:, 1])
    voice_env = uniform_filter1d(voice_env, size=int(0.18 * SR))
    
    duck = np.clip(1.0 - (voice_env * 2.8), 0.25, 1.0)
    music = music * duck[:, None]

    print("4. Mezclando stems y master limiting...")
    mix = music * 0.75 + voice * 1.15
    mix[:, 0] = limit(mix[:, 0], ceil=0.92)
    mix[:, 1] = limit(mix[:, 1], ceil=0.92)

    out_wav = os.path.join(here, 'mix.wav')
    total_samples = int(DUR * SR)
    sf.write(out_wav, mix[:total_samples], SR, subtype='PCM_16')
    print(f"✓ Mix exportado con éxito en {out_wav} ({DUR}s @ {SR}Hz)")

if __name__ == '__main__':
    main()
