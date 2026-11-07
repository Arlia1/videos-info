"""Mix for Bailapp (Art Deco viral video):
Score (1930s Gershwin-style symphonic jazz) + Spanish neural voices + foley + room reverb + ducking -> out/mix.wav
"""
import os, sys, json
import numpy as np
import soundfile as sf
import soxr

D = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('LIB', '/home/yoel1/lemo-opuscar')
sys.path.insert(0, ROOT)

from core.audio.sfx import (
    SR, bp, lp, hp, noise, norm, t_, env_exp, brown, whoosh, thump, step, ding,
    add, limit, compress
)

DUR = 30.0
N = int(DUR * SR) + SR // 2
rng = np.random.default_rng(1930)

def st():
    return np.zeros((N, 2), np.float32)

def mono(d):
    return np.zeros(int(round(d * SR)), np.float32)

# Simple stereo room reverb simulation
def room(x, mix=0.25, decay=0.4):
    delays = [int(0.017 * SR), int(0.029 * SR), int(0.043 * SR), int(0.061 * SR)]
    gains = [0.4, 0.3, 0.2, 0.15]
    out = np.zeros_like(x)
    for c in (0, 1):
        sig = x[:, c]
        accum = np.zeros_like(sig)
        for d, g in zip(delays, gains):
            shifted = np.pad(sig, (d, 0))[:len(sig)] * g * decay
            accum += shifted
        out[:, c] = sig * (1.0 - mix) + accum * mix
    return out

# Synthesize Symphonic Jazz Score (1930s Gershwin Art Deco palette)
def generate_score():
    score = st()
    tt = np.arange(N) / SR

    # Section 1: Intro (0.0 - 8.5s) - Staccato walking bass, clockwork syncopation, muted trumpet
    # Walking bass line (compas en C menor / G7)
    bass_notes = [65.41, 73.42, 82.41, 98.0, 65.41, 73.42, 82.41, 98.0] # C2, D2, E2, G2
    beat_dur = 0.51 # ~118 BPM
    for idx, at in enumerate(np.arange(0.2, 8.2, beat_dur)):
        freq = bass_notes[idx % len(bass_notes)]
        d = 0.35
        t_note = t_(d)
        # Plucked string sound
        plk = (np.sin(2 * np.pi * freq * t_note) +
               0.5 * np.sin(4 * np.pi * freq * t_note) +
               0.25 * np.sin(6 * np.pi * freq * t_note)) * env_exp(d, 0.08)
        add(score, norm(plk, 0.45), at, gain=0.65, pan=0.0)

    # Piano syncopated chords (intro)
    chord_times = [0.8, 1.8, 2.8, 3.8, 4.8, 5.8, 6.8]
    for ct in chord_times:
        d = 0.4
        t_c = t_(d)
        chord = (np.sin(2 * np.pi * 261.63 * t_c) + # C4
                 np.sin(2 * np.pi * 311.13 * t_c) + # Eb4
                 np.sin(2 * np.pi * 392.00 * t_c)) * env_exp(d, 0.1) # G4
        add(score, norm(chord, 0.3), ct, gain=0.5, pan=-0.2)

    # Section 2: Dramatic Silence (8.5 - 9.0s) -> no music here, just tension

    # Section 3: The Turn & Grand Waltz / Stride (9.0 - 20.0s) - Major brass, rich piano chords, clarinet
    t_major = np.arange(9.2, 19.8, beat_dur)
    major_bass = [130.81, 164.81, 196.00, 261.63, 174.61, 220.00, 196.00, 246.94] # C3, E3, G3, C4, F3, A3, G3, B3
    for idx, at in enumerate(t_major):
        freq = major_bass[idx % len(major_bass)]
        d = 0.42
        t_note = t_(d)
        bass = (np.sin(2 * np.pi * freq * t_note) + 0.6 * np.sin(4 * np.pi * freq * t_note)) * env_exp(d, 0.12)
        add(score, norm(bass, 0.5), at, gain=0.75, pan=0.0)

        # Stride brass / piano chords on offbeats
        if idx % 2 == 1:
            d_ch = 0.45
            t_ch = t_(d_ch)
            brass = (np.sin(2 * np.pi * 523.25 * t_ch) + # C5
                     np.sin(2 * np.pi * 659.25 * t_ch) + # E5
                     np.sin(2 * np.pi * 783.99 * t_ch) + # G5
                     np.sin(2 * np.pi * 1046.50 * t_ch) * 0.4) * env_exp(d_ch, 0.18)
            add(score, norm(brass, 0.4), at + 0.25, gain=0.6, pan=0.25)

    # Gershwin Clarinet Glissando ascending into the reveal (8.8 - 9.8s)
    d_gliss = 1.0
    t_gl = t_(d_gliss)
    f_gliss = np.linspace(300, 1100, len(t_gl))
    phase = 2 * np.pi * np.cumsum(f_gliss) / SR
    clarinet = (np.sin(phase) + 0.3 * np.sin(3 * phase)) * np.sin(np.pi * t_gl / d_gliss) ** 0.5
    add(score, norm(clarinet, 0.55), 8.8, gain=0.75, pan=-0.1)

    # Section 4: Climax (20.0 - 25.5s) - Dynamic Jazz swing, brush snare rhythm, tubular bells
    t_climax = np.arange(20.2, 25.4, beat_dur / 2) # double time feel
    for idx, at in enumerate(t_climax):
        # Brush snare
        d_sn = 0.15
        snare = bp(noise(d_sn), 1200, 6500) * env_exp(d_sn, 0.04)
        add(score, norm(snare, 0.4), at, gain=0.45, pan=0.1)

    # Tubular Bells / Chimes on key accents
    for bt in [20.2, 22.0, 23.8]:
        d_bell = 1.4
        t_b = t_(d_bell)
        bell = (np.sin(2 * np.pi * 1046.5 * t_b) * env_exp(d_bell, 0.4) +
                np.sin(2 * np.pi * 2093.0 * t_b) * 0.5 * env_exp(d_bell, 0.25) +
                np.sin(2 * np.pi * 3135.9 * t_b) * 0.25 * env_exp(d_bell, 0.15))
        add(score, norm(bell, 0.5), bt, gain=0.65, pan=0.3)

    # Section 5: Grand Finale (25.5 - 30.0s) - Triumphant orchestral resolution
    d_fin = 4.2
    t_f = t_(d_fin)
    fin_chord = (np.sin(2 * np.pi * 261.63 * t_f) * 0.7 + # C4
                 np.sin(2 * np.pi * 329.63 * t_f) * 0.6 + # E4
                 np.sin(2 * np.pi * 392.00 * t_f) * 0.6 + # G4
                 np.sin(2 * np.pi * 523.25 * t_f) * 0.5 + # C5
                 np.sin(2 * np.pi * 1046.5 * t_f) * 0.3) * np.exp(-t_f / 2.2)
    add(score, norm(fin_chord, 0.6), 25.6, gain=0.8, pan=0.0)

    # Harp upward glissando on final hit
    d_harp = 1.2
    t_h = t_(d_harp)
    f_harp = np.linspace(400, 2200, len(t_h))
    harp = np.sin(2 * np.pi * np.cumsum(f_harp) / SR) * env_exp(d_harp, 0.3)
    add(score, norm(harp, 0.45), 25.5, gain=0.7, pan=-0.2)

    return room(score, mix=0.22)

# Foley by Material (Art Deco specific)
def generate_foley():
    foley = st()

    # Clock ticks (0.5 to 8.0s)
    for ct in np.arange(0.5, 8.0, 1.0):
        d_tick = 0.04
        tt = t_(d_tick)
        tick = hp(noise(d_tick), 3500) * env_exp(d_tick, 0.003) + np.sin(2 * np.pi * 2800 * tt) * env_exp(d_tick, 0.005)
        add(foley, norm(tick, 0.25), ct, gain=0.4, pan=-0.1)

    # Hard tile shoe impact (Shot 2, t = 4.4s) - harsh concrete slap
    d_tile = 0.12
    t_tile = t_(d_tile)
    tile_strike = hp(noise(d_tile), 1800) * env_exp(d_tile, 0.008) + np.sin(2 * np.pi * 120 * t_tile) * env_exp(d_tile, 0.03) * 0.7
    add(foley, norm(tile_strike, 0.5), 4.4, gain=0.65, pan=0.0)

    # Heavy electric switch "chunk" + filament ignition hum (t = 8.6s)
    d_sw = 0.18
    t_sw = t_(d_sw)
    chunk = lp(noise(d_sw), 450) * env_exp(d_sw, 0.02) * 1.2 + np.sin(2 * np.pi * 95 * t_sw) * env_exp(d_sw, 0.035)
    add(foley, norm(chunk, 0.7), 8.6, gain=0.85, pan=0.0)

    # Counted light bulb buzz & pop (t = 8.8s to 11.5s)
    for bt in np.arange(8.9, 11.5, 0.35):
        d_b = 0.06
        t_b = t_(d_b)
        bpop = np.sin(2 * np.pi * 850 * t_b) * env_exp(d_b, 0.008) + hp(noise(d_b), 4000) * env_exp(d_b, 0.003) * 0.4
        add(foley, norm(bpop, 0.3), bt, gain=0.45, pan=0.1)

    # Heavy bronze doors sliding open (t = 14.0s) - deep metallic resonance & air
    d_door = 1.8
    t_door = t_(d_door)
    door_glide = (bp(noise(d_door), 180, 850) * np.sin(np.pi * t_door / d_door) +
                  np.sin(2 * np.pi * 110 * t_door) * env_exp(d_door, 0.6) * 0.4)
    add(foley, norm(door_glide, 0.45), 14.1, gain=0.6, pan=0.0)

    # Sprung wooden floor resonance (Shot 4, t = 16.5s) - warm cushioned wooden bounce
    d_wd = 0.22
    t_wd = t_(d_wd)
    wood_bounce = np.sin(2 * np.pi * 85 * t_wd) * env_exp(d_wd, 0.04) + bp(noise(d_wd), 200, 600) * env_exp(d_wd, 0.02)
    add(foley, norm(wood_bounce, 0.4), 16.5, gain=0.55, pan=-0.1)

    # Grand Jeté leap whoosh & elastic landing (Shot 5, t = 21.0s, 22.8s)
    w = whoosh(d=0.42, v=0.6)
    add(foley, w, 21.2, gain=0.55, pan=0.0)
    add(foley, norm(wood_bounce, 0.5), 22.8, gain=0.6, pan=0.0)

    # Final crystal chime on Bailapp logo (Shot 6, t = 26.2s)
    d_chime = ding(v=0.7)
    add(foley, d_chime, 26.2, gain=0.75, pan=0.15)

    return room(foley, mix=0.18)

# Load and Mix Voice Lines
def generate_voice():
    voice_track = st()
    lines_cfg = json.load(open(os.path.join(D, 'lines.json')))

    for L in lines_cfg:
        wav_path = os.path.join(D, 'voices', L['id'] + '.wav')
        if not os.path.exists(wav_path):
            continue
        data, sr = sf.read(wav_path, dtype='float32')
        if sr != SR:
            data = soxr.resample(data, sr, SR)
        if data.ndim > 1:
            data = data.mean(axis=1)

        # Clean vocal processing: light compression + presence EQ
        data = compress(norm(data, 0.88), thr=0.25, ratio=3.2)
        # Add slight theater warmth
        data_stereo = np.stack([data, data], axis=1)
        data_proc = room(data_stereo, mix=0.12, decay=0.25)

        s = int(L['t'] * SR)
        e = min(N, s + len(data_proc))
        voice_track[s:e, :] += data_proc[:e - s, :] * 1.15

    return voice_track

# Master Mixdown
def main():
    print("Generating music score...")
    score = generate_score()

    print("Generating foley...")
    foley = generate_foley()

    print("Loading voices...")
    voice = generate_voice()

    # Duck music under voice lines
    print("Ducking music under dialogue...")
    voice_energy = lp(np.abs(voice).max(axis=1), 8)
    duck_gain = np.where(voice_energy > 0.05, 0.38, 1.0)
    # Smooth ducking curve
    from scipy.ndimage import uniform_filter1d
    duck_gain = uniform_filter1d(duck_gain, size=int(0.12 * SR))
    score = score * duck_gain[:, None]

    # Combine stems
    mix = score * 0.72 + foley * 0.65 + voice * 1.05

    # Peak Limiter
    print("Master limiting...")
    mix[:, 0] = limit(mix[:, 0], ceil=0.92)
    mix[:, 1] = limit(mix[:, 1], ceil=0.92)

    out_dir = os.path.join(D, 'out')
    os.makedirs(out_dir, exist_ok=True)
    out_wav = os.path.join(out_dir, 'mix.wav')
    sf.write(out_wav, mix[:int(DUR * SR)], SR, subtype='PCM_24')
    print(f"Mix written successfully to {out_wav} ({DUR}s, {SR}Hz)")

if __name__ == '__main__':
    main()
