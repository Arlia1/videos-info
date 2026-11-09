"""Audio mix for Bailapp - Reel Low Poly 3D (24.5s)
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

DUR = 24.5
N = int(DUR * SR) + SR // 2

def st():
    return np.zeros((N, 2), np.float32)

def generate_music():
    score = st()
    beat = 0.44  # ~136 BPM enérgico

    # --- SECCIÓN 1 (0.0s - 7.8s): Cuarto Apretado Low-Poly (Beat rítmico juguetón) ---
    bass_intro = [65.41, 73.42, 82.41, 65.41]
    for idx, at in enumerate(np.arange(0.1, 7.8, beat)):
        freq = bass_intro[idx % len(bass_intro)]
        d = 0.26
        t_note = t_(d)
        plk = (np.sin(2 * np.pi * freq * t_note) +
               0.3 * np.sin(3 * np.pi * freq * t_note)) * env_exp(d, 0.08)
        add(score, norm(plk, 0.35), at, gain=0.55, pan=0.0)

        # Percusión / tick
        d_tick = 0.03
        tick = bp(noise(d_tick), 3400, 7200) * env_exp(d_tick, 0.015)
        add(score, norm(tick, 0.25), at + beat/2, gain=0.25, pan=0.2)

    # Golpe cómico tropezón con esquina de cama (2.4s)
    d_thump = 0.20
    t_thump = t_(d_thump)
    thump = np.sin(2 * np.pi * 85 * t_thump) * env_exp(d_thump, 0.05)
    add(score, norm(thump, 0.5), 2.4, gain=0.65, pan=0.0)

    # --- TRANSICIÓN A ESTUDIO 3D (7.6s - 8.2s) ---
    d_sw = 0.65
    sw = whoosh(d_sw)
    add(score, norm(sw, 0.55), 7.6, gain=0.65, pan=0.0)

    # --- SECCIÓN 2 (7.8s - 16.5s): Estudio 3D & Baile Pleno (Groove K-Pop/Dancehall) ---
    t_groove = np.arange(7.8, 16.5, beat)
    bass_groove = [110.0, 130.81, 146.83, 164.81, 130.81, 146.83, 164.81, 174.61]

    for idx, at in enumerate(t_groove):
        freq = bass_groove[idx % len(bass_groove)]
        d = 0.36
        t_note = t_(d)
        bass = (np.sin(2 * np.pi * freq * t_note) + 0.5 * np.sin(4 * np.pi * freq * t_note)) * env_exp(d, 0.12)
        add(score, norm(bass, 0.55), at, gain=0.72, pan=0.0)

        # Kick potente
        d_k = 0.16
        t_k = t_(d_k)
        f_k = np.linspace(145, 48, len(t_k))
        phase_k = 2 * np.pi * np.cumsum(f_k) / SR
        kick = np.sin(phase_k) * env_exp(d_k, 0.05)
        add(score, norm(kick, 0.60), at, gain=0.68, pan=0.0)

        # Palmas alegres
        if idx % 2 == 1:
            d_cl = 0.14
            clap = bp(noise(d_cl), 1400, 6500) * env_exp(d_cl, 0.035)
            add(score, norm(clap, 0.45), at, gain=0.55, pan=0.15)

        # Acordes Dance Pop alegres
        d_ch = 0.35
        t_ch = t_(d_ch)
        c_freqs = [261.63, 329.63, 392.00] if (idx // 4) % 2 == 0 else [220.0, 261.63, 329.63]
        chord = sum(np.sin(2 * np.pi * f * t_ch) for f in c_freqs) * env_exp(d_ch, 0.15)
        add(score, norm(chord, 0.38), at + beat/2, gain=0.50, pan=-0.2)

    # --- SECCIÓN 3 (16.5s - 21.0s): Smartphone 3D Interactivo ---
    t_phone = np.arange(16.5, 21.0, beat)
    for idx, at in enumerate(t_phone):
        d_p = 0.20
        t_p = t_(d_p)
        ping = np.sin(2 * np.pi * (523.25 + (idx % 3) * 65) * t_p) * env_exp(d_p, 0.06)
        add(score, norm(ping, 0.4), at, gain=0.45, pan=0.2)

    # Chime mágico
    ch = ding(0.85)
    add(score, ch, 16.6, gain=0.55, pan=0.2)

    # --- SECCIÓN 4 (21.0s - 24.5s): Podio 3D, Confeti & Conversión ---
    d_cta = 3.5
    t_cta = t_(d_cta)
    cta_chord = (np.sin(2 * np.pi * 261.63 * t_cta) +
                 np.sin(2 * np.pi * 329.63 * t_cta) +
                 np.sin(2 * np.pi * 392.00 * t_cta) +
                 np.sin(2 * np.pi * 523.25 * t_cta) * 0.5) * np.exp(-t_cta / 1.8)
    add(score, norm(cta_chord, 0.5), 21.0, gain=0.65, pan=0.0)

    # Campana final
    final_bell = ding(1.1)
    add(score, final_bell, 21.2, gain=0.70, pan=0.1)

    return score

def main():
    print("1. Generando música y ambientación rítmica...")
    music = generate_music()

    print("2. Cargando voz neuronal...")
    here = os.path.dirname(os.path.abspath(__file__))
    vpath = os.path.join(here, 'voiceover.mp3')

    cmd_wav = f"ffmpeg -y -i '{vpath}' -ar {SR} -ac 2 /tmp/voice_temp_lowpoly.wav >/dev/null 2>&1"
    os.system(cmd_wav)

    v_data, v_sr = sf.read('/tmp/voice_temp_lowpoly.wav')
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
