"""Master Viral Audio Mix for Agencia Arlia - Talleres Mecánicos y Lubricentros
Upgraded with Viral Retention SFX:
- 0.1s Pattern-Interrupt Sub-Drop + Alarm Ping
- Act 1 Money-Drain Ticks
- Act 2 Rapid WhatsApp Notification Pop Cascade
- Act 3 High-Energy Bass Riser + Cash Register / Success Chime
- Sidechain Ducking & EBU R128 Ready Mastering
"""
import os
import sys
import json
import numpy as np
import soundfile as sf
from scipy.ndimage import uniform_filter1d

LIB = os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)

from core.audio.sfx import (
    SR, bp, lp, hp, noise, norm, t_, env_exp, whoosh, ding, pop, thump, click,
    add, limit
)

DIR = os.path.dirname(os.path.abspath(__file__))
TIMINGS_PATH = os.path.join(DIR, 'timings.json')

with open(TIMINGS_PATH, 'r', encoding='utf-8') as f:
    TIMINGS = json.load(f)

DUR = float(TIMINGS['total_dur'])
ACTS = TIMINGS['acts']
N = int(np.ceil(DUR * SR))

def st():
    return np.zeros((N, 2), np.float32)

def generate_viral_score():
    score = st()
    bpm = 122.0  # Faster, high-retention viral tempo
    beat = 60.0 / bpm
    bar = beat * 4

    chords = [
        [146.83, 174.61, 220.00, 261.63, 329.63],  # Dm9
        [116.54, 146.83, 174.61, 220.00, 261.63],  # Bbmaj9
        [174.61, 220.00, 261.63, 329.63, 392.00],  # Fmaj9
        [130.81, 164.81, 196.00, 246.94, 293.66],  # C(add9)
    ]
    bass_roots = [73.42, 58.27, 87.31, 65.41]

    act2_start = ACTS[1]['start']
    act3_start = ACTS[2]['start']
    act4_start = ACTS[3]['start']
    act5_start = ACTS[4]['start']

    # 1. Warm Ambient Pad Layer
    for c_idx in range(int(DUR / bar) + 1):
        chord_start = c_idx * bar
        if chord_start >= DUR:
            break
        chord = chords[c_idx % len(chords)]
        pad_dur = min(bar * 1.05, DUR - chord_start)
        if pad_dur <= 0.05:
            continue
        tt = t_(pad_dur)
        pad_wave = np.zeros_like(tt)
        
        for f in chord:
            tone = (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * (f * 1.003) * tt) + 0.3 * np.sin(2 * np.pi * (f * 0.5) * tt))
            pad_wave += tone
        
        env = np.sin(np.pi * np.clip(tt / pad_dur, 0, 1)) ** 1.5
        pad_wave = lp(pad_wave * env, 1350)
        add(score, norm(pad_wave, 0.28), chord_start, gain=0.44, pan=0.0)

    # 2. Viral Driving Synth Arpeggios
    arp_notes = [
        293.66, 349.23, 440.00, 523.25, 659.25, 523.25, 440.00, 349.23,
        233.08, 293.66, 349.23, 440.00, 523.25, 440.00, 349.23, 293.66,
        349.23, 440.00, 523.25, 659.25, 783.99, 659.25, 523.25, 440.00,
        261.63, 329.63, 392.00, 493.88, 587.33, 493.88, 392.00, 329.63
    ]
    step_time = beat / 2
    
    for idx, at in enumerate(np.arange(0.15, DUR - 0.4, step_time)):
        f = arp_notes[idx % len(arp_notes)]
        d_p = 0.22
        tt_p = t_(d_p)
        pluck = (np.sin(2 * np.pi * f * tt_p) + 0.4 * np.sin(4 * np.pi * f * tt_p)) * env_exp(d_p, 0.045)
        pluck = lp(pluck, 3800)
        pan = np.sin(idx * 0.8) * 0.38
        vol = 0.24 if at < act3_start else 0.38
        add(score, norm(pluck, 0.3), at, gain=vol, pan=pan)

    # 3. High-Retention Beat & Sub-Bass
    for idx, at in enumerate(np.arange(act2_start, DUR - 0.6, beat)):
        bar_beat = (idx % 4)
        if bar_beat == 0 or bar_beat == 2:
            d_k = 0.18
            tt_k = t_(d_k)
            pitch_env = 115.0 * np.exp(-tt_k * 28) + 46.0
            kick = np.sin(2 * np.pi * np.cumsum(pitch_env) / SR) * env_exp(d_k, 0.06)
            add(score, norm(kick, 0.68), at, gain=0.62, pan=0.0)

        if bar_beat == 1 or bar_beat == 3:
            d_s = 0.10
            tt_s = t_(d_s)
            snap = hp(noise(d_s), 1800) * env_exp(d_s, 0.02) + np.sin(2 * np.pi * 340 * tt_s) * env_exp(d_s, 0.03)
            add(score, norm(snap, 0.36), at, gain=0.36, pan=0.1)

        d_hh = 0.04
        hh = hp(noise(d_hh), 6200) * env_exp(d_hh, 0.012)
        add(score, norm(hh, 0.18), at + beat / 2, gain=0.24, pan=-0.2)

        if at >= act3_start:
            root = bass_roots[(int(at / bar)) % len(bass_roots)]
            d_b = beat * 0.9
            tt_b = t_(d_b)
            sub = np.sin(2 * np.pi * root * tt_b) * env_exp(d_b, 0.35)
            add(score, norm(sub, 0.58), at, gain=0.62, pan=0.0)

    # 4. VIRAL RETENTION SOUND EFFECTS (SFX)
    # 0.08s: Pattern-Interrupt Sub Impact + Urgent Ping
    add(score, thump(0.95, 48), 0.08, gain=0.72)
    add(score, click(1.5, 0.9), 0.12, gain=0.55)
    add(score, thump(0.85, 52), 1.15, gain=0.55)
    
    # Money Drain Counter Ticks in Act 1
    for tk in np.arange(0.5, min(act2_start - 0.3, 3.2), 0.22):
        add(score, click(1.8, 0.4), tk, gain=0.25, pan=0.25)

    # Act 2: Smartphone Chaos + Unread Badge Escalation Pops
    add(score, whoosh(0.55), max(0.1, act2_start - 0.15), gain=0.55)
    add(score, pop(0.75), act2_start + 0.25, gain=0.50, pan=-0.25)
    add(score, pop(0.85), act2_start + 0.80, gain=0.55, pan=0.25)
    add(score, pop(0.95), act2_start + 1.35, gain=0.60, pan=-0.15)
    add(score, thump(0.85, 50), act2_start + 1.90, gain=0.60, pan=0.0)

    # Act 3: Solution Transition + UI Tap Clicks + Cash/Order Success Chime
    add(score, whoosh(0.75), max(0.1, act3_start - 0.18), gain=0.70)
    add(score, thump(0.95, 62), act3_start + 0.04, gain=0.70)
    add(score, click(1.3, 0.75), act3_start + 0.70, gain=0.55, pan=0.12)
    add(score, click(1.5, 0.85), act3_start + 1.40, gain=0.60, pan=0.18)
    
    # Ticket Slide-in Cash Chime
    ticket_t = act3_start + (ACTS[2]['end'] - act3_start) * 0.56
    add(score, ding(0.95), ticket_t, gain=0.72, pan=0.0)
    add(score, ding(1.25), ticket_t + 0.12, gain=0.55, pan=0.15)

    # Act 4: ROI Counter Impact
    add(score, whoosh(0.70), max(0.1, act4_start - 0.15), gain=0.68)
    add(score, thump(0.95, 60), act4_start + 0.05, gain=0.72)
    add(score, ding(1.1), act4_start + 0.55, gain=0.55)

    # Act 5: Brand Reveal & Urgent CTA
    add(score, whoosh(0.80), max(0.1, act5_start - 0.15), gain=0.68)
    add(score, ding(1.0), act5_start + 0.05, gain=0.65)

    return score

def main():
    vo_path = os.path.join(DIR, 'voiceover_timeline.wav')
    out_path = os.path.join(DIR, 'mix.wav')

    vo_data, vo_sr = sf.read(vo_path)
    if vo_data.ndim == 1:
        vo_data = np.stack([vo_data, vo_data], axis=-1)
    if vo_sr != SR:
        from scipy.signal import resample
        num = int(len(vo_data) * SR / vo_sr)
        vo_data = resample(vo_data, num)

    music = generate_viral_score()

    vo_full = np.zeros_like(music)
    vo_len = min(len(vo_data), len(music))
    vo_full[:vo_len] = vo_data[:vo_len] * 1.36

    vo_mono = np.abs(vo_full).mean(axis=-1)
    env = uniform_filter1d(vo_mono, size=int(SR * 0.26))
    duck = np.clip(1.0 - env * 1.75, 0.28, 1.0)
    music = music * duck[:, None]

    mix = music * 0.85 + vo_full * 1.16

    mix[:, 0] = limit(mix[:, 0], ceil=0.92)
    mix[:, 1] = limit(mix[:, 1], ceil=0.92)

    sf.write(out_path, mix[:N], SR, subtype='PCM_16')
    print(f"Master viral mix generated successfully: {out_path} ({DUR:.2f}s @ {SR}Hz)")

if __name__ == '__main__':
    main()
