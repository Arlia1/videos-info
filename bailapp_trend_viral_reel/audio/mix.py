"""Audio mix for Bailapp - Reel 'Trend Viral en tu Cuarto vs Estudio' (31.0s)
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

DUR = 31.0
N = int(DUR * SR) + SR // 2

def st():
    return np.zeros((N, 2), np.float32)

def generate_music():
    score = st()
    beat = 0.476  # ~126 BPM
    
    # --- SECCIÓN 1 (0.0s - 10.8s): En el cuarto / Espacio reducido (Pizzicato cómico y lofi) ---
    bass_intro = [65.41, 73.42, 82.41, 73.42]
    for idx, at in enumerate(np.arange(0.2, 10.8, beat)):
        freq = bass_intro[idx % len(bass_intro)]
        d = 0.22
        t_note = t_(d)
        plk = (np.sin(2 * np.pi * freq * t_note) +
               0.35 * np.sin(3 * np.pi * freq * t_note)) * env_exp(d, 0.06)
        add(score, norm(plk, 0.32), at, gain=0.52, pan=0.0)
        
        # Click / madera / choque
        d_tap = 0.03
        tap = bp(noise(d_tap), 2500, 5500) * env_exp(d_tap, 0.012)
        add(score, norm(tap, 0.22), at + beat/2, gain=0.25, pan=0.2 if idx % 2 == 0 else -0.2)

    # --- SWEEP TRANSICIÓN POP ESTUDIO (10.6s - 11.2s) ---
    d_sw = 0.7
    sw = whoosh(d_sw)
    add(score, norm(sw, 0.55), 10.6, gain=0.65, pan=0.0)

    # --- SECCIÓN 2 (11.0s - 22.0s): ESTUDIO REAL / K-POP & COMMERCIAL (Groove brillante) ---
    t_groove = np.arange(11.0, 22.0, beat)
    bass_groove = [110.0, 130.81, 146.83, 164.81, 130.81, 146.83, 164.81, 196.00]
    
    for idx, at in enumerate(t_groove):
        freq = bass_groove[idx % len(bass_groove)]
        d = 0.38
        t_note = t_(d)
        bass = (np.sin(2 * np.pi * freq * t_note) + 0.6 * np.sin(2 * 2 * np.pi * freq * t_note)) * env_exp(d, 0.14)
        add(score, norm(bass, 0.60), at, gain=0.74, pan=0.0)
        
        # Kick Dance Pop
        d_k = 0.16
        t_k = t_(d_k)
        f_k = np.linspace(155, 48, len(t_k))
        phase_k = 2 * np.pi * np.cumsum(f_k) / SR
        kick = np.sin(phase_k) * env_exp(d_k, 0.055)
        add(score, norm(kick, 0.65), at, gain=0.68, pan=0.0)
        
        # Palmas / Claps pop
        if idx % 2 == 1:
            d_cl = 0.15
            clap = bp(noise(d_cl), 1600, 7500) * env_exp(d_cl, 0.038)
            add(score, norm(clap, 0.50), at, gain=0.55, pan=0.1)
            
        # Acordes K-Pop Pop alegres
        d_ch = 0.35
        t_ch = t_(d_ch)
        c_freqs = [261.63, 329.63, 392.00, 523.25] if (idx // 4) % 2 == 0 else [220.0, 261.63, 329.63, 440.0]
        chord = sum(np.sin(2 * np.pi * f * t_ch) for f in c_freqs) * env_exp(d_ch, 0.14)
        add(score, norm(chord, 0.40), at + beat/2, gain=0.45, pan=-0.15)

    # Chime en "videoclip" (20.5s)
    ch = ding(0.9)
    add(score, ch, 20.5, gain=0.60, pan=0.2)

    # --- SECCIÓN 3 (22.0s - 31.0s): CTA & Cierre con Bailapp ---
    for idx, at in enumerate(np.arange(22.0, 30.5, beat)):
        d_k = 0.14
        t_k = t_(d_k)
        f_k = np.linspace(130, 50, len(t_k))
        phase_k = 2 * np.pi * np.cumsum(f_k) / SR
        kick = np.sin(phase_k) * env_exp(d_k, 0.04)
        add(score, norm(kick, 0.40), at, gain=0.45, pan=0.0)

        # Chords de resolución
        d_c = 0.35
        t_c = t_(d_c)
        c_freqs = [261.63, 329.63, 392.00, 523.25]
        chord = sum(np.sin(2 * np.pi * f * t_c) for f in c_freqs) * env_exp(d_c, 0.14)
        add(score, norm(chord, 0.35), at + beat/2, gain=0.40, pan=0.0)

    # Campana final en bailapp.com.ar
    final_bell = ding(1.2)
    add(score, final_bell, 25.5, gain=0.70, pan=0.0)

    return score

def main():
    print("1. Generando música y ambientación rítmica...")
    music = generate_music()

    print("2. Cargando voz neuronal...")
    here = os.path.dirname(os.path.abspath(__file__))
    vpath = os.path.join(here, 'voiceover.mp3')
    
    cmd_wav = f"ffmpeg -y -i '{vpath}' -ar {SR} -ac 2 /tmp/voice_temp_trend.wav >/dev/null 2>&1"
    os.system(cmd_wav)
    
    v_data, v_sr = sf.read('/tmp/voice_temp_trend.wav')
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
