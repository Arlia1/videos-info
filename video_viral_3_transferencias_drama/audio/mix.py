"""Audio mix for Video Viral 1 - Dos Pies Izquierdos (25.0s)
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

DUR = 26.5
N = int(DUR * SR) + SR // 2

def st():
    return np.zeros((N, 2), np.float32)

def generate_music():
    score = st()
    beat = 0.44  # ~136 BPM alegre

    # Sección 1 (0.0s - 7.5s): Inseguridad / Cuarto
    bass_intro = [65.41, 73.42, 82.41, 65.41]
    for idx, at in enumerate(np.arange(0.1, 7.5, beat)):
        freq = bass_intro[idx % len(bass_intro)]
        d = 0.26
        t_note = t_(d)
        plk = (np.sin(2 * np.pi * freq * t_note) + 0.3 * np.sin(3 * np.pi * freq * t_note)) * env_exp(d, 0.08)
        add(score, norm(plk, 0.35), at, gain=0.55, pan=0.0)

        d_tick = 0.03
        tick = bp(noise(d_tick), 3400, 7200) * env_exp(d_tick, 0.015)
        add(score, norm(tick, 0.25), at + beat/2, gain=0.25, pan=0.2)

    # Transición (7.4s)
    add(score, whoosh(0.6), 7.4, gain=0.7)

    # Sección 2 (7.5s - 16.5s): Smartphone & Reframe
    bass_mid = [110.0, 130.81, 146.83, 164.81]
    for idx, at in enumerate(np.arange(7.8, 16.5, beat)):
        freq = bass_mid[idx % len(bass_mid)]
        d = 0.24
        t_note = t_(d)
        synth = (np.sin(2 * np.pi * freq * t_note) + 0.5 * np.sin(4 * np.pi * freq * t_note)) * env_exp(d, 0.06)
        add(score, norm(synth, 0.35), at, gain=0.6, pan=0.0)

        # Kick
        d_k = 0.16
        t_k = t_(d_k)
        kick = np.sin(2 * np.pi * (130 * np.exp(-t_k * 24)) * t_k) * env_exp(d_k, 0.05)
        add(score, norm(kick, 0.6), at, gain=0.8, pan=0.0)

    # Ding de confirmación en smartphone (13.5s)
    add(score, ding(0.8), 13.5, gain=0.65)

    # Drop a Estudio & Celebración (16.5s - 25.0s)
    add(score, whoosh(0.8), 16.2, gain=0.85)

    for idx, at in enumerate(np.arange(16.5, DUR, beat / 2)):
        # Hi-hat acelerado
        d_hh = 0.02
        hh = hp(noise(d_hh), 7500) * env_exp(d_hh, 0.008)
        add(score, norm(hh, 0.2), at, gain=0.35, pan=(idx % 2 * 0.4 - 0.2))

        if idx % 2 == 0:
            # Kick en cada beat
            d_k = 0.16
            t_k = t_(d_k)
            kick = np.sin(2 * np.pi * (140 * np.exp(-t_k * 22)) * t_k) * env_exp(d_k, 0.05)
            add(score, norm(kick, 0.7), at, gain=0.85, pan=0.0)

            # Sub bajo potente
            d_sub = 0.35
            t_sub = t_(d_sub)
            sub = np.sin(2 * np.pi * 55 * t_sub) * env_exp(d_sub, 0.1)
            add(score, norm(sub, 0.6), at, gain=0.75, pan=0.0)

    return score

def main():
    vo_path = os.path.join(os.path.dirname(__file__), 'voiceover.mp3')
    out_path = os.path.join(os.path.dirname(__file__), 'mix.wav')

    data, sr = sf.read(vo_path)
    if data.ndim == 1:
        data = np.stack([data, data], axis=-1)
    if sr != SR:
        from scipy.signal import resample
        num = int(len(data) * SR / sr)
        data = resample(data, num)

    music = generate_music()

    # Padding / trimming voice
    vo_full = np.zeros_like(music)
    vo_len = min(len(data), len(music))
    vo_full[:vo_len] = data[:vo_len] * 1.35  # Voz protagonista nítida

    # Ducking
    vo_mono = np.abs(vo_full).mean(axis=-1)
    env = uniform_filter1d(vo_mono, size=int(SR * 0.25))
    duck = np.clip(1.0 - env * 1.6, 0.18, 1.0)
    music = music * duck[:, None]

    # Mix & Master
    mix = music * 0.75 + vo_full * 1.15
    mix[:, 0] = limit(mix[:, 0], ceil=0.92)
    mix[:, 1] = limit(mix[:, 1], ceil=0.92)

    total_samples = int(DUR * SR)
    sf.write(out_path, mix[:total_samples], SR, subtype='PCM_16')
    print(f'Mix generado exitosamente: {out_path}')

if __name__ == '__main__':
    main()
