"""Master Audio Mix for Agencia Arlia - Fábricas & Mueblerías Ad (20.0s)
High-end tech-luxury synth score + sound effects + Argentine male voiceover + sidechain ducking + mastering
Output: audio/mix.wav
"""
import os
import sys
import numpy as np
import soundfile as sf
from scipy.ndimage import uniform_filter1d

LIB = os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)

from core.audio.sfx import (
    SR, bp, lp, hp, noise, norm, t_, env_exp, whoosh, ding, pop, thump, click,
    add, limit
)

DUR = 20.0
N = int(DUR * SR)

def st():
    return np.zeros((N, 2), np.float32)

def generate_luxury_score():
    score = st()
    bpm = 116.0
    beat = 60.0 / bpm  # ~0.517s
    bar = beat * 4     # ~2.069s

    # Chord progression: Dm9 -> Bbmaj9 -> Fmaj9 -> C(add9)
    chords = [
        [146.83, 174.61, 220.00, 261.63, 329.63],  # Dm9
        [116.54, 146.83, 174.61, 220.00, 261.63],  # Bbmaj9
        [174.61, 220.00, 261.63, 329.63, 392.00],  # Fmaj9
        [130.81, 164.81, 196.00, 246.94, 293.66],  # C(add9)
    ]
    bass_roots = [73.42, 58.27, 87.31, 65.41] # D2, Bb1, F2, C2

    # 1. Warm Ambient Pad Layer
    for c_idx in range(int(DUR / bar) + 1):
        chord_start = c_idx * bar
        if chord_start >= DUR:
            break
        chord = chords[c_idx % len(chords)]
        pad_dur = bar * 1.05
        tt = t_(pad_dur)
        pad_wave = np.zeros_like(tt)
        
        for f in chord:
            tone = (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * (f * 1.003) * tt) + 0.3 * np.sin(2 * np.pi * (f * 0.5) * tt))
            pad_wave += tone
        
        env = np.sin(np.pi * np.clip(tt / pad_dur, 0, 1)) ** 1.5
        pad_wave = lp(pad_wave * env, 1200)
        add(score, norm(pad_wave, 0.28), chord_start, gain=0.45, pan=0.0)

    # 2. Modern Tech Plucks / Arpeggios
    arp_notes = [
        293.66, 349.23, 440.00, 523.25, 659.25, 523.25, 440.00, 349.23,
        233.08, 293.66, 349.23, 440.00, 523.25, 440.00, 349.23, 293.66,
        349.23, 440.00, 523.25, 659.25, 783.99, 659.25, 523.25, 440.00,
        261.63, 329.63, 392.00, 493.88, 587.33, 493.88, 392.00, 329.63
    ]
    step_time = beat / 2
    
    for idx, at in enumerate(np.arange(0.2, DUR - 0.5, step_time)):
        f = arp_notes[idx % len(arp_notes)]
        d_p = 0.25
        tt_p = t_(d_p)
        pluck = (np.sin(2 * np.pi * f * tt_p) + 0.35 * np.sin(4 * np.pi * f * tt_p)) * env_exp(d_p, 0.05)
        pluck = lp(pluck, 3500)
        pan = np.sin(idx * 0.7) * 0.35
        vol = 0.22 if at < 6.8 else 0.35
        add(score, norm(pluck, 0.3), at, gain=vol, pan=pan)

    # 3. Modern Tech Rhythm
    for idx, at in enumerate(np.arange(3.6, DUR - 0.8, beat)):
        bar_beat = (idx % 4)
        if bar_beat == 0 or bar_beat == 2:
            d_k = 0.18
            tt_k = t_(d_k)
            pitch_env = 110.0 * np.exp(-tt_k * 28) + 48.0
            kick = np.sin(2 * np.pi * np.cumsum(pitch_env) / SR) * env_exp(d_k, 0.06)
            add(score, norm(kick, 0.65), at, gain=0.6, pan=0.0)

        if bar_beat == 1 or bar_beat == 3:
            d_s = 0.10
            tt_s = t_(d_s)
            snap = hp(noise(d_s), 1800) * env_exp(d_s, 0.02) + np.sin(2 * np.pi * 320 * tt_s) * env_exp(d_s, 0.03)
            add(score, norm(snap, 0.35), at, gain=0.35, pan=0.1)

        d_hh = 0.04
        hh = hp(noise(d_hh), 6000) * env_exp(d_hh, 0.012)
        add(score, norm(hh, 0.18), at + beat / 2, gain=0.22, pan=-0.2)

        if at >= 6.8:
            root = bass_roots[(int(at / bar)) % len(bass_roots)]
            d_b = beat * 0.9
            tt_b = t_(d_b)
            sub = np.sin(2 * np.pi * root * tt_b) * env_exp(d_b, 0.35)
            add(score, norm(sub, 0.55), at, gain=0.6, pan=0.0)

    # 4. Synchronized Sound Effects (SFX)
    # Act 1 (0.0s - 3.8s): Heavy PDF Warning impacts
    add(score, thump(0.8, 52), 0.45, gain=0.5)
    add(score, thump(0.8, 52), 1.35, gain=0.45)

    # Transition to Act 2 (3.7s): Tech whoosh
    add(score, whoosh(0.5), 3.65, gain=0.45)

    # Act 2 (3.8s - 7.0s): WhatsApp furniture inquiries pops
    add(score, pop(0.7), 4.15, gain=0.45, pan=-0.2)
    add(score, pop(0.85), 4.75, gain=0.5, pan=0.2)
    add(score, pop(0.9), 5.4, gain=0.55, pan=-0.1)

    # Transition to Act 3 (6.9s): Clean digital sweep
    add(score, whoosh(0.6), 6.85, gain=0.55)

    # Act 3 (7.0s - 11.4s): Interactive Fabric & Size selector clicks + Instant Quote chime
    add(score, click(1.2, 0.7), 7.85, gain=0.5, pan=0.1)
    add(score, click(1.4, 0.8), 8.75, gain=0.55, pan=0.15)
    add(score, ding(0.9), 10.05, gain=0.65, pan=0.0)

    # Transition to Act 4 (11.3s): 1-Click Price Update Impact
    add(score, whoosh(0.7), 11.2, gain=0.65)
    add(score, thump(0.9, 60), 11.45, gain=0.7)

    # Transition to Act 5 (15.5s): Prestigious Brand Reveal
    add(score, whoosh(0.8), 15.45, gain=0.65)
    add(score, ding(1.0), 15.8, gain=0.6)

    return score

def main():
    dir_path = os.path.dirname(os.path.abspath(__file__))
    vo_path = os.path.join(dir_path, 'voiceover_timeline.wav')
    out_path = os.path.join(dir_path, 'mix.wav')

    vo_data, vo_sr = sf.read(vo_path)
    if vo_data.ndim == 1:
        vo_data = np.stack([vo_data, vo_data], axis=-1)
    if vo_sr != SR:
        from scipy.signal import resample
        num = int(len(vo_data) * SR / vo_sr)
        vo_data = resample(vo_data, num)

    music = generate_luxury_score()

    vo_full = np.zeros_like(music)
    vo_len = min(len(vo_data), len(music))
    vo_full[:vo_len] = vo_data[:vo_len] * 1.35

    # Sidechain Ducking
    vo_mono = np.abs(vo_full).mean(axis=-1)
    env = uniform_filter1d(vo_mono, size=int(SR * 0.28))
    duck = np.clip(1.0 - env * 1.7, 0.32, 1.0)
    music = music * duck[:, None]

    mix = music * 0.85 + vo_full * 1.15

    mix[:, 0] = limit(mix[:, 0], ceil=0.92)
    mix[:, 1] = limit(mix[:, 1], ceil=0.92)

    total_samples = int(DUR * SR)
    sf.write(out_path, mix[:total_samples], SR, subtype='PCM_16')
    print(f"Master mix generated successfully: {out_path} ({DUR}s @ {SR}Hz)")

if __name__ == '__main__':
    main()