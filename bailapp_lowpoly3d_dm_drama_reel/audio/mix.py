"""Audio mix for Bailapp - Reel Low Poly 3D (31.0s)
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
    beat = 0.46  # ~130 BPM enérgico

    # --- SECCIÓN 1 (0.0s - 12.4s): El Drama del DM (Bajo rítmico misterioso/frustración) ---
    bass_intro = [65.41, 73.42, 82.41, 65.41]
    for idx, at in enumerate(np.arange(0.1, 12.4, beat)):
        freq = bass_intro[idx % len(bass_intro)]
        d = 0.28
        t_note = t_(d)
        plk = (np.sin(2 * np.pi * freq * t_note) +
               0.3 * np.sin(3 * np.pi * freq * t_note)) * env_exp(d, 0.08)
        add(score, norm(plk, 0.35), at, gain=0.55, pan=0.0)

        # Percusión / tick
        d_tick = 0.03
        tick = bp(noise(d_tick), 3400, 7200) * env_exp(d_tick, 0.015)
        add(score, norm(tick, 0.25), at + beat/2, gain=0.25, pan=0.2)

    # Notificación de mensaje / visto (5.2s)
    d_notif = 0.15
    t_notif = t_(d_notif)
    notif = np.sin(2 * np.pi * 880 * t_notif) * env_exp(d_notif, 0.04)
    add(score, norm(notif, 0.4), 5.2, gain=0.6, pan=0.1)

    # --- TRANSICIÓN A SMARTPHONE 3D & SOLUCIÓN (12.2s - 12.8s) ---
    d_sw = 0.65
    sw = whoosh(d_sw)
    add(score, norm(sw, 0.55), 12.2, gain=0.65, pan=0.0)

    # --- SECCIÓN 2 (12.4s - 21.4s): Smartphone 3D & Estudio Real (Groove Pop / Dancehall Pleno) ---
    t_groove = np.arange(12.4, 25.6, beat)
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

    # Chime mágico en la reserva
    ch = ding(0.85)
    add(score, ch, 16.5, gain=0.55, pan=0.2)

    # --- SECCIÓN 3 (25.6s - 31.0s): Podio 3D, Celebración & Conversión ---
    d_cta = 5.0
    t_cta = t_(d_cta)
    cta_chord = (np.sin(2 * np.pi * 261.63 * t_cta) +
                 np.sin(2 * np.pi * 329.63 * t_cta) +
                 np.sin(2 * np.pi * 392.00 * t_cta) +
                 np.sin(2 * np.pi * 523.25 * t_cta)) * env_exp(d_cta, 0.6)
    add(score, norm(cta_chord, 0.4), 25.6, gain=0.65, pan=0.0)

    # Campana final
    d_fin = ding(1.2)
    add(score, d_fin, 26.2, gain=0.6, pan=0.0)

    return score

def main():
    dir_path = os.path.dirname(os.path.abspath(__file__))
    vo_path = os.path.join(dir_path, 'voiceover.mp3')
    out_wav = os.path.join(dir_path, 'mix.wav')

    # Convert voiceover to wav
    tmp_vo = os.path.join(dir_path, 'tmp_vo.wav')
    os.system(f"ffmpeg -y -i '{vo_path}' -ar {SR} -ac 2 '{tmp_vo}' -loglevel error")
    vo, _ = sf.read(tmp_vo)
    os.remove(tmp_vo)

    music = generate_music()

    # Ducking
    vo_mono = np.mean(vo, axis=1) if vo.ndim == 2 else vo
    env = np.abs(vo_mono)
    smooth_len = int(0.12 * SR)
    env_smooth = uniform_filter1d(env, size=smooth_len)
    max_env = np.max(env_smooth) if np.max(env_smooth) > 0 else 1.0
    duck_gain = 1.0 - 0.42 * np.clip(env_smooth / max_env, 0, 1)

    min_len = min(len(music), len(duck_gain))
    music[:min_len, 0] *= duck_gain[:min_len]
    music[:min_len, 1] *= duck_gain[:min_len]

    # Mix
    mixed = np.copy(music)
    vo_len = min(len(mixed), len(vo))
    mixed[:vo_len] += vo[:vo_len] * 1.15

    # Master limit
    final_audio = limit(mixed)
    sf.write(out_wav, final_audio[:int(DUR * SR)], SR)
    print(f"Mix saved to {out_wav}")

    # Standardize to -14 LUFS
    norm_wav = os.path.join(dir_path, 'mix_norm.wav')
    cmd = (
        f"ffmpeg -y -i '{out_wav}' -af "
        f"loudnorm=I=-14:LRA=7:TP=-1.5 '{norm_wav}' -loglevel error && "
        f"mv '{norm_wav}' '{out_wav}'"
    )
    os.system(cmd)
    print("Mix normalized to EBU R128 (-14 LUFS)")

if __name__ == '__main__':
    main()
