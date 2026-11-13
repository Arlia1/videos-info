"""Generate professional Argentine male voiceover for Agencia Arlia - Fábricas & Mueblerías (Antes vs Después)
Voice: es-AR-TomasNeural with tuned rate and pitch for commercial radio impact
"""
import os
import asyncio
import edge_tts
import subprocess
import soundfile as sf
import numpy as np

DIR = os.path.dirname(os.path.abspath(__file__))

SECTIONS = [{'id': 'act1_antes_pdf', 'text': '¿Antes? Mandando catálogos en PDF pesados que nadie abre y con precios desactualizados.', 'rate': '+20%', 'pitch': '-1Hz', 'target_start': 0.2}, {'id': 'act2_antes_whatsapp', 'text': 'Y perdiendo horas pasando medidas y telas a mano por WhatsApp.', 'rate': '+20%', 'pitch': '-1Hz', 'target_start': 6.26}, {'id': 'act3_despues_web', 'text': '¿Después? Tu catálogo web interactivo con medidas, tapizados y pedido directo a tu WhatsApp.', 'rate': '+20%', 'pitch': '-1Hz', 'target_start': 9.94}, {'id': 'act4_despues_impacto', 'text': 'Actualizá precios en un clic y recibí órdenes listas para fabricar.', 'rate': '+19%', 'pitch': '-1Hz', 'target_start': 16.12}, {'id': 'act5_agencia_arlia', 'text': 'Agencia Arlia. Pedí presupuesto por MD.', 'rate': '+14%', 'pitch': '-2Hz', 'target_start': 20.26}]

SR = 44100
TOTAL_DUR = 24.5
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
