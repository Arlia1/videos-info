"""Audio mix for Bailapp - Reel Estudios de Danza (25.5s)
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

DUR = 25.5
N = int(DUR * SR) + SR // 2

def st():
    return np.zeros((N, 2), np.float32)

def generate_music():
    score = st()
    beat = 0.48  # ~125 BPM
    
    # --- SECCIÓN 1 (0.0s - 8.5s): Espera y Fricción (Intro acústica pausada) ---
    bass_intro = [55.0, 65.41, 73.42, 82.41]  # A1, C2, D2, E2
    for idx, at in enumerate(np.arange(0.2, 8.5, beat)):
        freq = bass_intro[idx % len(bass_intro)]
        d = 0.32
        t_note = t_(d)
        plk = (np.sin(2 * np.pi * freq * t_note) +
               0.4 * np.sin(4 * np.pi * freq * t_note)) * env_exp(d, 0.08)
        add(score, norm(plk, 0.35), at, gain=0.55, pan=0.0)
        
        # Tik-tok suave de reloj de pared
        d_tick = 0.04
        tick = bp(noise(d_tick), 2800, 5200) * env_exp(d_tick, 0.015)
        add(score, norm(tick, 0.2), at + beat/2, gain=0.25, pan=0.3)

    # --- SWEEP TRANSICIÓN (8.3s - 9.0s) ---
    d_sw = 0.8
    sw = whoosh(d_sw)
    add(score, norm(sw, 0.45), 8.3, gain=0.55, pan=0.0)

    # --- SECCIÓN 2 & 3 (8.8s - 20.8s): Revelación & Salas Llenas (Dance / Pop Beat) ---
    t_groove = np.arange(8.8, 20.7, beat)
    bass_groove = [110.0, 130.81, 146.83, 164.81, 130.81, 146.83, 164.81, 174.61]
    
    for idx, at in enumerate(t_groove):
        # Bassline cálido y con empuje
        freq = bass_groove[idx % len(bass_groove)]
        d = 0.40
        t_note = t_(d)
        bass = (np.sin(2 * np.pi * freq * t_note) + 0.5 * np.sin(4 * np.pi * freq * t_note)) * env_exp(d, 0.12)
        add(score, norm(bass, 0.5), at, gain=0.68, pan=0.0)
        
        # Kick suave en cada pulso
        d_k = 0.18
        t_k = t_(d_k)
        f_k = np.linspace(130, 45, len(t_k))
        phase_k = 2 * np.pi * np.cumsum(f_k) / SR
        kick = np.sin(phase_k) * env_exp(d_k, 0.05)
        add(score, norm(kick, 0.55), at, gain=0.60, pan=0.0)
        
        # Palmas / Snare en tiempos 2 y 4
        if idx % 2 == 1:
            d_cl = 0.14
            clap = bp(noise(d_cl), 1100, 5500) * env_exp(d_cl, 0.035)
            add(score, norm(clap, 0.4), at, gain=0.48, pan=0.15)
            
        # Acordes de piano eléctrico / Rhodes
        d_ch = 0.38
        t_ch = t_(d_ch)
        c_freqs = [261.63, 329.63, 392.00] if (idx // 4) % 2 == 0 else [220.0, 261.63, 329.63]
        chord = sum(np.sin(2 * np.pi * f * t_ch) for f in c_freqs) * env_exp(d_ch, 0.15)
        add(score, norm(chord, 0.35), at + beat/2, gain=0.42, pan=-0.2)

    # Chime en el momento de "Salas Llenas" (15.2s)
    ch = ding(0.85)
    add(score, ch, 15.2, gain=0.55, pan=0.2)

    # --- SECCIÓN 4 (20.8s - 25.5s): CTA & Resolución ---
    d_cta = 4.7
    t_cta = t_(d_cta)
    cta_chord = (np.sin(2 * np.pi * 261.63 * t_cta) +
                 np.sin(2 * np.pi * 329.63 * t_cta) +
                 np.sin(2 * np.pi * 392.00 * t_cta) +
                 np.sin(2 * np.pi * 523.25 * t_cta) * 0.5) * np.exp(-t_cta / 2.0)
    add(score, norm(cta_chord, 0.5), 20.8, gain=0.6, pan=0.0)
    
    # Campana final
    final_bell = ding(1.0)
    add(score, final_bell, 21.0, gain=0.65, pan=0.1)

    return score

def main():
    print("1. Generando música y ambientación rítmica...")
    music = generate_music()

    print("2. Cargando voz neuronal...")
    here = os.path.dirname(os.path.abspath(__file__))
    vpath = os.path.join(here, 'voiceover.mp3')
    
    # Cargar y convertir voiceover a 48kHz estéreo
    cmd_wav = f"ffmpeg -y -i '{vpath}' -ar {SR} -ac 2 /tmp/voice_temp.wav >/dev/null 2>&1"
    os.system(cmd_wav)
    
    v_data, v_sr = sf.read('/tmp/voice_temp.wav')
    voice = st()
    vl = min(len(v_data), N)
    voice[:vl] = v_data[:vl]

    print("3. Aplicando ducking dinámico sobre la música...")
    voice_env = np.abs(voice[:, 0]) + np.abs(voice[:, 1])
    voice_env = uniform_filter1d(voice_env, size=int(0.18 * SR))
    
    # Atenuar música cuando la voz habla
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
