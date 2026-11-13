"""
Recalculate voice segment start times based on ACTUAL audio durations.
Adds a 0.35s gap between each segment to avoid overlap.
Then regenerates all mix WAVs.
"""
import os, subprocess, numpy as np, soundfile as sf
from scipy.ndimage import uniform_filter1d
import sys

LIB = os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio.sfx import (SR, bp, lp, hp, noise, norm, t_, env_exp,
                             whoosh, ding, pop, thump, click, add, limit)

DIR = os.path.dirname(os.path.abspath(__file__))
GAP = 0.35  # seconds between segments

# Actual durations measured with ffprobe
ACTUAL_DURS = {
    "video_1_gastronomia": {
        "h1":  6.696,
        "h2":  3.336,
        "sol": 2.904,
        "imp": 4.440,
        "cta": 4.392,
    },
    "video_2_estetica": {
        "h1":  6.696,
        "h2":  4.488,
        "sol": 3.192,
        "imp": 4.536,
        "cta": 7.200,
    },
    "video_3_inmobiliaria": {
        "h1":  6.696,
        "sol": 6.624,
        "imp": 3.096,
        "cta": 8.736,
    },
    "video_4_rediseno_web": {
        "h1":  6.696,
        "h2":  4.176,
        "sol": 4.128,
        "imp": 3.672,
        "cta": 7.104,
    },
    "video_5_corralon_ferreteria": {
        "h1":  6.696,
        "h2":  4.368,
        "sol": 4.008,
        "imp": 2.640,
        "cta": 9.072,
    },
    "video_6_videos_virales": {
        "h1":  3.216,
        "h2":  3.480,
        "sol": 8.592,
        "cta": 6.720,
    },
}

SECTION_ORDER = {
    "video_1_gastronomia":        ["h1","h2","sol","imp","cta"],
    "video_2_estetica":           ["h1","h2","sol","imp","cta"],
    "video_3_inmobiliaria":       ["h1","sol","imp","cta"],
    "video_4_rediseno_web":       ["h1","h2","sol","imp","cta"],
    "video_5_corralon_ferreteria":["h1","h2","sol","imp","cta"],
    "video_6_videos_virales":     ["h1","h2","sol","cta"],
}

def compute_starts(vid_id, padding_before=0.25):
    order = SECTION_ORDER[vid_id]
    durs  = ACTUAL_DURS[vid_id]
    starts = {}
    t = padding_before
    for sec in order:
        starts[sec] = round(t, 3)
        t += durs[sec] + GAP
    total = t + 0.5  # 0.5s tail
    return starts, round(total, 2)

# ── print new timings ──────────────────────────────────────────────────────
print("=" * 60)
print("NEW VOICE TIMINGS (gap=0.35s, no overlap)")
print("=" * 60)
all_configs = {}
for vid_id in SECTION_ORDER:
    starts, total = compute_starts(vid_id)
    all_configs[vid_id] = {"starts": starts, "total": total}
    print(f"\n{vid_id}  total_dur={total}s")
    for sec, t in starts.items():
        end = round(t + ACTUAL_DURS[vid_id][sec], 3)
        print(f"  {sec}: start={t}s  end={end}s  dur={ACTUAL_DURS[vid_id][sec]}s")

# ── luxury score (identical to batch_generate_audios.py) ──────────────────
def generate_luxury_score(total_dur):
    total_samples = int(total_dur * SR)
    score = np.zeros((total_samples, 2), dtype=np.float32)
    bpm = 118.0
    beat = 60.0 / bpm
    bar  = beat * 4
    chords = [
        [146.83,174.61,220.00,261.63,329.63],
        [116.54,146.83,174.61,220.00,261.63],
        [174.61,220.00,261.63,329.63,392.00],
        [130.81,164.81,196.00,246.94,293.66],
    ]
    bass_roots = [73.42,58.27,87.31,65.41]
    for c_idx in range(int(total_dur/bar)+1):
        cs = c_idx * bar
        if cs >= total_dur: break
        chord = chords[c_idx % len(chords)]
        pad_dur = bar * 1.05
        tt = t_(pad_dur)
        pad_wave = np.zeros_like(tt)
        for f in chord:
            pad_wave += np.sin(2*np.pi*f*tt) + 0.5*np.sin(2*np.pi*(f*1.002)*tt)
        env = np.sin(np.pi*np.clip(tt/pad_dur,0,1))**1.5
        pad_wave = lp(pad_wave * env, 1400)
        add(score, norm(pad_wave,0.28), cs, gain=0.45, pan=0.0)
    arp_notes = [293.66,349.23,440.00,523.25,659.25,523.25,440.00,349.23]
    for idx, at in enumerate(np.arange(0.2, total_dur-0.5, beat/2)):
        f = arp_notes[idx % len(arp_notes)]
        d_p = 0.22; tt_p = t_(d_p)
        pluck = (np.sin(2*np.pi*f*tt_p)+0.3*np.sin(4*np.pi*f*tt_p))*env_exp(d_p,0.05)
        add(score, norm(pluck,0.28), at, gain=0.32, pan=np.sin(idx*0.7)*0.3)
    for idx, at in enumerate(np.arange(3.6, total_dur-0.8, beat)):
        bar_beat = idx % 4
        if bar_beat in (0,2):
            tt_k = t_(0.16)
            kick = np.sin(2*np.pi*(110*np.exp(-tt_k*26)+48)*tt_k)*env_exp(0.16,0.05)
            add(score, norm(kick,0.65), at, gain=0.65, pan=0.0)
        if bar_beat in (1,3):
            snap = hp(noise(0.1),1800)*env_exp(0.1,0.02)
            add(score, norm(snap,0.35), at, gain=0.35, pan=0.1)
        if at >= 6.8:
            root = bass_roots[(int(at/bar)) % len(bass_roots)]
            sub  = np.sin(2*np.pi*root*t_(beat*0.85))*env_exp(beat*0.85,0.3)
            add(score, norm(sub,0.55), at, gain=0.6, pan=0.0)
    add(score, whoosh(0.5), 3.6,  gain=0.5)
    add(score, pop(0.8),    4.4,  gain=0.5)
    add(score, pop(0.8),    5.2,  gain=0.5)
    add(score, whoosh(0.6), 7.0,  gain=0.55)
    add(score, click(1.3,0.8), 8.5, gain=0.5)
    add(score, ding(0.9),  11.2,  gain=0.65)
    add(score, whoosh(0.7),15.2,  gain=0.65)
    add(score, ding(1.0),  16.0,  gain=0.65)
    return score

# ── rebuild mix WAVs ──────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("REBUILDING MIX WAVs WITH CORRECTED TIMINGS")
print("=" * 60)

for vid_id, cfg in all_configs.items():
    starts    = cfg["starts"]
    total_dur = cfg["total"]
    total_samples = int(total_dur * SR)
    voice_track = np.zeros((total_samples, 2), dtype=np.float32)

    order = SECTION_ORDER[vid_id]
    for sec in order:
        wav_path = os.path.join(DIR, f"{vid_id}_{sec}.wav")
        if not os.path.exists(wav_path):
            print(f"  [WARN] {wav_path} not found, skipping")
            continue
        data, _ = sf.read(wav_path)
        if data.ndim == 1:
            data = np.stack([data, data], axis=-1)
        s = int(starts[sec] * SR)
        e = min(s + len(data), total_samples)
        voice_track[s:e] += data[:e - s] * 1.45

    # Normalize voice
    mx = np.max(np.abs(voice_track))
    if mx > 0:
        voice_track = (voice_track / mx) * 0.98

    # Music score
    music = generate_luxury_score(total_dur)

    # Sidechain duck
    vo_mono = np.abs(voice_track).mean(axis=-1)
    env_arr = uniform_filter1d(vo_mono, size=int(SR * 0.25))
    duck = np.clip(1.0 - env_arr * 1.8, 0.28, 1.0)
    music = music * duck[:, None]

    mix = music * 0.85 + voice_track * 1.35
    mix[:, 0] = limit(mix[:, 0], ceil=0.95)
    mix[:, 1] = limit(mix[:, 1], ceil=0.95)

    # Derive short key (strip "video_N_" prefix)
    short_key = "_".join(vid_id.split("_")[2:])  # e.g. "gastronomia"
    out_path = os.path.join(DIR, f"mix_{short_key}.wav")
    sf.write(out_path, mix[:total_samples], SR, subtype='PCM_16')
    print(f"  ✓ {out_path}  ({total_dur}s)")

print("\n[OK] All mixes rebuilt without overlap.")
