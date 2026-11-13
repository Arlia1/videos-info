"""Batch Audio Generator & Mixer for All 6 Agencia Arlia Videos
Uses edge-tts (es-AR-TomasNeural) + procedural luxury tech score + sidechain ducking + loudness normalization
"""
import os
import sys
import asyncio
import edge_tts
import subprocess
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

VIDEOS = [
    {
        "id": "video_1_gastronomia",
        "title": "Gastronomía & Bares",
        "dur": 21.0,
        "sections": [
            {"id": "h1", "text": "¿Seguís regalando hasta el treinta por ciento en comisiones?", "rate": "+18%", "start": 0.25},
            {"id": "h2", "text": "¿O perdiendo ventas por contestar tarde en WhatsApp?", "rate": "+20%", "start": 3.65},
            {"id": "sol", "text": "Pasate a tu propia web: catálogo automático y comanda directa a tu WhatsApp.", "rate": "+20%", "start": 6.85},
            {"id": "imp", "text": "Cero por ciento de comisión. Todo el margen queda en tu negocio.", "rate": "+18%", "start": 11.20},
            {"id": "cta", "text": "Agencia Arlia: pedinos tu presupuesto hoy mismo y en una semana tenés tu web lista, funcional y generándote clientes.", "rate": "+16%", "start": 15.30}
        ]
    },
    {
        "id": "video_2_estetica",
        "title": "Estéticas & Barberías",
        "dur": 21.5,
        "sections": [
            {"id": "h1", "text": "¿Seguís cortando o atendiendo a una clienta y teniendo que frenar para responder WhatsApp?", "rate": "+18%", "start": 0.25},
            {"id": "h2", "text": "¿O se te superponen turnos y terminás perdiendo plata?", "rate": "+20%", "start": 4.50},
            {"id": "sol", "text": "Pasate a tu propia web de reservas automáticas. Tu cliente elige servicio, profesional, día y horario en diez segundos.", "rate": "+19%", "start": 7.60},
            {"id": "imp", "text": "Cero mensajes manuales. Agenda llena las veinticuatro horas.", "rate": "+18%", "start": 12.80},
            {"id": "cta", "text": "Agencia Arlia: pedinos tu presupuesto hoy mismo y en una semana tenés tu web lista, funcional y generándote clientes.", "rate": "+16%", "start": 15.90}
        ]
    },
    {
        "id": "video_3_inmobiliaria",
        "title": "Inmobiliarias & Propiedades",
        "dur": 22.0,
        "sections": [
            {"id": "h1", "text": "¿Cuántas veces por día te piden propiedades y tenés que mandar quinientas fotos por WhatsApp, colapsando tu teléfono y el de tu cliente?", "rate": "+19%", "start": 0.25},
            {"id": "sol", "text": "Pasate a tu propio catálogo inmobiliario web. Todas tus propiedades ordenadas con fotos en alta calidad, filtros por zona y precio, y consulta directa en un clic.", "rate": "+19%", "start": 6.80},
            {"id": "imp", "text": "Mostrá categoría y cerrá operaciones más rápido.", "rate": "+18%", "start": 13.50},
            {"id": "cta", "text": "Agencia Arlia: pedinos tu presupuesto hoy mismo y en una semana tenés tu web lista, funcional y generándote clientes.", "rate": "+16%", "start": 16.40}
        ]
    },
    {
        "id": "video_4_rediseno_web",
        "title": "Sitios Web Desactualizados",
        "dur": 21.0,
        "sections": [
            {"id": "h1", "text": "¿Tu página web quedó desactualizada, lenta o se ve rota en el celular?", "rate": "+18%", "start": 0.25},
            {"id": "h2", "text": "Una web vieja no te da prestigio: te espanta clientes todos los días.", "rate": "+18%", "start": 4.10},
            {"id": "sol", "text": "En Agencia Arlia modernizamos tu web desde cero: ultrarrápida, con diseño premium y pensada para convertir visitas en ventas reales.", "rate": "+19%", "start": 7.60},
            {"id": "imp", "text": "Pasá de una web abandonada a una máquina de captar clientes.", "rate": "+18%", "start": 12.80},
            {"id": "cta", "text": "Agencia Arlia: pedinos tu presupuesto hoy mismo y en una semana tenés tu web lista, funcional y generándote clientes.", "rate": "+16%", "start": 15.70}
        ]
    },
    {
        "id": "video_5_corralon_ferreteria",
        "title": "Corralones & Ferreterías",
        "dur": 21.5,
        "sections": [
            {"id": "h1", "text": "¿Seguís mandando listas de precios eternas en PDF o Excel que nadie lee?", "rate": "+18%", "start": 0.25},
            {"id": "h2", "text": "¿O perdiendo ventas porque tus clientes no saben qué materiales tenés en stock?", "rate": "+19%", "start": 4.10},
            {"id": "sol", "text": "Pasate a tu catálogo digital para corralones y ferreterías. Tu cliente busca materiales en dos segundos, arma su lista y te manda el pedido cotizado directo a tu WhatsApp.", "rate": "+20%", "start": 7.90},
            {"id": "imp", "text": "Sin errores de medidas ni demoras.", "rate": "+18%", "start": 13.60},
            {"id": "cta", "text": "Agencia Arlia: pedinos tu presupuesto hoy mismo y en una semana tenés tu web lista, funcional y generándote clientes.", "rate": "+16%", "start": 15.90}
        ]
    },
    {
        "id": "video_6_videos_virales",
        "title": "Videos Virales para Negocios",
        "dur": 21.0,
        "sections": [
            {"id": "h1", "text": "¿Querés que hagamos videos virales como este para tu negocio?", "rate": "+16%", "start": 0.25},
            {"id": "h2", "text": "Videos limpios, modernos, con animación 2D y locución profesional que atrapan la atención en los primeros tres segundos y transforman visualizaciones en clientes reales.", "rate": "+18%", "start": 3.70},
            {"id": "sol", "text": "Dejá de subir publicaciones que nadie mira. En Agencia Arlia te armamos la estrategia y los videos listos para pautar.", "rate": "+18%", "start": 10.60},
            {"id": "cta", "text": "Escribinos hoy mismo y te pasamos un presupuesto.", "rate": "+14%", "start": 16.20}
        ]
    }
]

def generate_luxury_score(total_dur):
    N = int(total_dur * SR)
    score = np.zeros((N, 2), np.float32)
    bpm = 118.0
    beat = 60.0 / bpm
    bar = beat * 4

    chords = [
        [146.83, 174.61, 220.00, 261.63, 329.63],
        [116.54, 146.83, 174.61, 220.00, 261.63],
        [174.61, 220.00, 261.63, 329.63, 392.00],
        [130.81, 164.81, 196.00, 246.94, 293.66],
    ]
    bass_roots = [73.42, 58.27, 87.31, 65.41]

    # Ambient Chords
    for c_idx in range(int(total_dur / bar) + 1):
        chord_start = c_idx * bar
        if chord_start >= total_dur: break
        chord = chords[c_idx % len(chords)]
        pad_dur = bar * 1.05
        tt = t_(pad_dur)
        pad_wave = np.zeros_like(tt)
        for f in chord:
            pad_wave += np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * (f * 1.002) * tt)
        env = np.sin(np.pi * np.clip(tt / pad_dur, 0, 1)) ** 1.5
        pad_wave = lp(pad_wave * env, 1400)
        add(score, norm(pad_wave, 0.28), chord_start, gain=0.45, pan=0.0)

    # Tech Plucks
    arp_notes = [293.66, 349.23, 440.00, 523.25, 659.25, 523.25, 440.00, 349.23]
    for idx, at in enumerate(np.arange(0.2, total_dur - 0.5, beat / 2)):
        f = arp_notes[idx % len(arp_notes)]
        d_p = 0.22
        tt_p = t_(d_p)
        pluck = (np.sin(2 * np.pi * f * tt_p) + 0.3 * np.sin(4 * np.pi * f * tt_p)) * env_exp(d_p, 0.05)
        add(score, norm(pluck, 0.28), at, gain=0.32, pan=np.sin(idx * 0.7) * 0.3)

    # Modern Beat & Bass
    for idx, at in enumerate(np.arange(3.6, total_dur - 0.8, beat)):
        bar_beat = idx % 4
        if bar_beat in (0, 2):
            tt_k = t_(0.16)
            kick = np.sin(2 * np.pi * (110 * np.exp(-tt_k * 26) + 48) * tt_k) * env_exp(0.16, 0.05)
            add(score, norm(kick, 0.65), at, gain=0.65, pan=0.0)
        if bar_beat in (1, 3):
            snap = hp(noise(0.1), 1800) * env_exp(0.1, 0.02)
            add(score, norm(snap, 0.35), at, gain=0.35, pan=0.1)
        # Sub-bass
        if at >= 6.8:
            root = bass_roots[(int(at / bar)) % len(bass_roots)]
            sub = np.sin(2 * np.pi * root * t_(beat * 0.85)) * env_exp(beat * 0.85, 0.3)
            add(score, norm(sub, 0.55), at, gain=0.6, pan=0.0)

    # Sound effects
    add(score, whoosh(0.5), 3.6, gain=0.5)
    add(score, pop(0.8), 4.4, gain=0.5)
    add(score, pop(0.8), 5.2, gain=0.5)
    add(score, whoosh(0.6), 7.0, gain=0.55)
    add(score, click(1.3, 0.8), 8.5, gain=0.5)
    add(score, ding(0.9), 11.2, gain=0.65)
    add(score, whoosh(0.7), 15.2, gain=0.65)
    add(score, ding(1.0), 16.0, gain=0.65)

    return score

async def process_video_audio(cfg):
    total_dur = cfg['dur']
    total_samples = int(total_dur * SR)
    voice_track = np.zeros((total_samples, 2), dtype=np.float32)

    print(f"\n==========================================")
    print(f"Generando Audio para: {cfg['title']} ({total_dur}s)")
    print(f"==========================================")

    for sec in cfg['sections']:
        part_mp3 = os.path.join(DIR, f"{cfg['id']}_{sec['id']}.mp3")
        comm = edge_tts.Communicate(sec['text'], 'es-AR-TomasNeural', rate=sec['rate'], pitch="-1Hz")
        await comm.save(part_mp3)

        part_wav = os.path.join(DIR, f"{cfg['id']}_{sec['id']}.wav")
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', part_mp3, '-ar', str(SR), '-ac', '2', part_wav], check=True)
        data, _ = sf.read(part_wav)
        if data.ndim == 1:
            data = np.stack([data, data], axis=-1)

        start_s = int(sec['start'] * SR)
        end_s = min(start_s + len(data), total_samples)
        voice_track[start_s:end_s] += data[:end_s - start_s] * 1.45
        print(f"  [{sec['id']}] {sec['start']:.2f}s -> {sec['start'] + len(data)/SR:.2f}s | {sec['text'][:50]}...")

    # Peak normalization for voice
    max_vo = np.max(np.abs(voice_track))
    if max_vo > 0:
        voice_track = (voice_track / max_vo) * 0.98

    # Generate music score
    music = generate_luxury_score(total_dur)

    # Sidechain Ducking (music dips gently during speech)
    vo_mono = np.abs(voice_track).mean(axis=-1)
    env = uniform_filter1d(vo_mono, size=int(SR * 0.25))
    duck = np.clip(1.0 - env * 1.8, 0.28, 1.0)
    music = music * duck[:, None]

    # Mix together (LOUD, CRISP, COMMERCIAL BROADCAST STANDARD)
    mix = music * 0.85 + voice_track * 1.35
    mix[:, 0] = limit(mix[:, 0], ceil=0.95)
    mix[:, 1] = limit(mix[:, 1], ceil=0.95)

    out_mix_path = os.path.join(DIR, f"mix_{cfg['id'].replace('video_', '')}.wav")
    sf.write(out_mix_path, mix[:total_samples], SR, subtype='PCM_16')
    print(f"Mix final guardado: {out_mix_path} (Dur: {total_dur}s)")
    return out_mix_path

async def main():
    for cfg in VIDEOS:
        await process_video_audio(cfg)
    print("\n[OK] Todos los audios (6 videos) han sido generados y masterizados con exito.")

if __name__ == '__main__':
    asyncio.run(main())
