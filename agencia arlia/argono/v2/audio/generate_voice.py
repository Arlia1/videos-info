"""Generate professional Argentine male voiceover for Agencia Arlia - Inmobiliarias Ad
Voice: es-AR-TomasNeural with tuned rate and pitch for commercial radio impact
"""
import os
import asyncio
import edge_tts
import subprocess
import soundfile as sf
import numpy as np

DIR = os.path.dirname(os.path.abspath(__file__))

SECTIONS = [
    {
        "id": "act1_portales",
        "text": "¿Seguís pagando fortunas en portales donde tus clientes terminan viendo a tu competencia?",
        "rate": "+20%",
        "pitch": "-1Hz",
        "target_start": 0.20
    },
    {
        "id": "act2_whatsapp",
        "text": "¿O perdiendo visitas por tardar en mandar fichas y ubicaciones por WhatsApp?",
        "rate": "+20%",
        "pitch": "-1Hz",
        "target_start": 3.85
    },
    {
        "id": "act3_web_propiedades",
        "text": "Tené tu propio portal inmobiliario: filtros por zona, tour virtual y agenda directa a tu WhatsApp.",
        "rate": "+20%",
        "pitch": "-1Hz",
        "target_start": 7.05
    },
    {
        "id": "act4_contactos_propios",
        "text": "Captá contactos cien por ciento tuyos y destacá tus propiedades las veinticuatro horas.",
        "rate": "+19%",
        "pitch": "-1Hz",
        "target_start": 11.45
    },
    {
        "id": "act5_agencia_arlia",
        "text": "Agencia Arlia. Pedí presupuesto por MD.",
        "rate": "+14%",
        "pitch": "-2Hz",
        "target_start": 15.85
    }
]

SR = 44100
TOTAL_DUR = 20.0
TOTAL_SAMPLES = int(TOTAL_DUR * SR)

async def synth_section(sec):
    out_mp3 = os.path.join(DIR, f"{sec['id']}.mp3")
    comm = edge_tts.Communicate(sec['text'], 'es-AR-TomasNeural', rate=sec['rate'], pitch=sec['pitch'])
    await comm.save(out_mp3)
    
    out_wav = os.path.join(DIR, f"{sec['id']}.wav")
    subprocess.run([
        'ffmpeg', '-y', '-loglevel', 'error',
        '-i', out_mp3,
        '-ar', str(SR),
        '-ac', '2',
        out_wav
    ], check=True)
    
    data, _ = sf.read(out_wav)
    dur = len(data) / SR
    print(f"[{sec['id']}] start: {sec['target_start']:.2f}s | dur: {dur:.2f}s | ends: {sec['target_start'] + dur:.2f}s")
    return out_wav, dur

async def main():
    timeline = np.zeros((TOTAL_SAMPLES, 2), dtype=np.float32)
    
    for sec in SECTIONS:
        wav_path, dur = await synth_section(sec)
        data, _ = sf.read(wav_path)
        if data.ndim == 1:
            data = np.stack([data, data], axis=-1)
            
        start_sample = int(sec['target_start'] * SR)
        end_sample = min(start_sample + len(data), TOTAL_SAMPLES)
        length_to_copy = end_sample - start_sample
        
        timeline[start_sample:end_sample] += data[:length_to_copy] * 1.30

    max_val = np.max(np.abs(timeline))
    if max_val > 0:
        timeline = (timeline / max_val) * 0.95

    master_voice_path = os.path.join(DIR, 'voiceover_timeline.wav')
    sf.write(master_voice_path, timeline, SR, subtype='PCM_16')
    print(f"Master voiceover timeline generated: {master_voice_path} (Duration: {TOTAL_DUR}s)")

if __name__ == '__main__':
    asyncio.run(main())