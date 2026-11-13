"""Generate professional Argentine male voiceover for Agencia Arlia - Distribuidoras y Mayoristas B2B
Architecture: Sequential Zero-Overlap Audio Engine + Dynamic Duration Export
Voice: es-AR-TomasNeural with tuned rate (+19%) and pitch for high-retention viral pacing.
"""
import os
import re
import json
import asyncio
import edge_tts
import subprocess
import soundfile as sf
import numpy as np

DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(DIR)

SECTIONS = [{'id': 'act1_hook_mayorista', 'text': '¿Cuántas ventas mayoristas perdés en tu distribuidora por mandar listas en PDF desactualizadas y tardar en armar pedidos por WhatsApp?', 'rate': '+19%', 'pitch': '-1Hz', 'min_act_dur': 4.7}, {'id': 'act2_dolor_mayorista', 'text': 'Los comerciantes hacen pedidos a la noche; si tienen que leer un PDF gigante o esperar a mañana para saber precios por bulto, le piden a otro.', 'rate': '+19%', 'pitch': '-1Hz', 'min_act_dur': 4.7}, {'id': 'act3_solucion_mayorista', 'text': 'Nosotros lo solucionamos: creamos tu plataforma mayorista web con escala por bulto que calcula el total y envía el pedido listo a tu WhatsApp.', 'rate': '+19%', 'pitch': '-1Hz', 'min_act_dur': 5.0}, {'id': 'act4_impacto_mayorista', 'text': 'Cero comisiones, actualización masiva desde Excel en un clic y tus clientes reponiendo stock las veinticuatro horas.', 'rate': '+18%', 'pitch': '-1Hz', 'min_act_dur': 4.3}, {'id': 'act5_cta_mayorista', 'text': 'Agencia Arlia. Mandanos un mensaje directo y digitalizá tu distribuidora.', 'rate': '+15%', 'pitch': '-2Hz', 'min_act_dur': 4.1}]

SR = 44100
GAP_BETWEEN_CLIPS = 0.46  # Strict 460ms silence/breathing room between voice clips (Zero Overlap Guarantee)
INITIAL_OFFSET = 0.22     # Immediate hook start at 220ms for TikTok/Reels scroll-stopping
TAIL_BUFFER = 1.35        # Extra tail after final CTA so music & logo breathe cleanly

async def synth_section(sec):
    out_mp3 = os.path.join(DIR, f"{sec['id']}.mp3")
    comm = edge_tts.Communicate(sec['text'], 'es-AR-TomasNeural', rate=sec['rate'], pitch=sec['pitch'])
    await comm.save(out_mp3)
    
    out_wav = os.path.join(DIR, f"{sec['id']}.wav")
    subprocess.run([
        'ffmpeg', '-y', '-loglevel', 'error',
        '-i', out_mp3,
        '-af', 'silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,areverse',
        '-ar', str(SR),
        '-ac', '2',
        out_wav
    ], check=True)
    
    data, _ = sf.read(out_wav)
    dur = len(data) / SR
    return out_wav, data, dur

async def main():
    current_t = INITIAL_OFFSET
    computed_sections = []
    
    for idx, sec in enumerate(SECTIONS):
        wav_path, data, dur = await synth_section(sec)
        if data.ndim == 1:
            data = np.stack([data, data], axis=-1)
        
        act_start = 0.0 if idx == 0 else round(current_t - (GAP_BETWEEN_CLIPS * 0.45), 3)
        vo_start = round(current_t, 3)
        vo_end = round(current_t + dur, 3)
        
        min_act_dur = sec.get('min_act_dur', 3.8)
        raw_act_end = vo_end + (GAP_BETWEEN_CLIPS * 0.55)
        act_end = round(max(act_start + min_act_dur, raw_act_end), 3)
        
        current_t = round(act_end + (GAP_BETWEEN_CLIPS * 0.45), 3)
        
        computed_sections.append({
            'id': sec['id'],
            'act_index': idx + 1,
            'act_start': act_start,
            'vo_start': vo_start,
            'vo_dur': round(dur, 3),
            'vo_end': vo_end,
            'act_end': act_end,
            'data': data
        })
        print(f"[Act {idx+1}: {sec['id']}] Act: {act_start:.2f}s->{act_end:.2f}s | VO: {vo_start:.2f}s->{vo_end:.2f}s (dur: {dur:.2f}s) | ZERO OVERLAP OK")
    
    total_dur = round(computed_sections[-1]['vo_end'] + TAIL_BUFFER, 2)
    computed_sections[-1]['act_end'] = total_dur
    
    total_samples = int(np.ceil(total_dur * SR))
    timeline = np.zeros((total_samples, 2), dtype=np.float32)
    
    for csec in computed_sections:
        data = csec['data']
        start_sample = int(csec['vo_start'] * SR)
        end_sample = min(start_sample + len(data), total_samples)
        length_to_copy = end_sample - start_sample
        timeline[start_sample:end_sample] = data[:length_to_copy] * 1.32

    max_val = np.max(np.abs(timeline))
    if max_val > 0:
        timeline = (timeline / max_val) * 0.95

    master_voice_path = os.path.join(DIR, 'voiceover_timeline.wav')
    sf.write(master_voice_path, timeline, SR, subtype='PCM_16')
    
    timings_meta = {
        'total_dur': total_dur,
        'acts': [
            {
                'act': c['act_index'],
                'id': c['id'],
                'start': c['act_start'],
                'end': c['act_end'],
                'vo_start': c['vo_start'],
                'vo_end': c['vo_end'],
                'vo_dur': c['vo_dur']
            }
            for c in computed_sections
        ]
    }
    timings_path = os.path.join(DIR, 'timings.json')
    with open(timings_path, 'w', encoding='utf-8') as f:
        json.dump(timings_meta, f, indent=2)
        
    main_js_path = os.path.join(PROJECT_DIR, 'main.js')
    if os.path.exists(main_js_path):
        with open(main_js_path, 'r', encoding='utf-8') as f:
            js_code = f.read()
        acts_js_obj = json.dumps(timings_meta['acts'])
        js_code = re.sub(
            r'/\*__TIMINGS_START__\*/.*?/\*__TIMINGS_END__\*/',
            f'/*__TIMINGS_START__*/const TIMINGS = {{ total_dur: {total_dur}, acts: {acts_js_obj} }};/*__TIMINGS_END__*/',
            js_code,
            flags=re.DOTALL
        )
        with open(main_js_path, 'w', encoding='utf-8') as f:
            f.write(js_code)
            
    print(f"Master voiceover & dynamic timeline ready: {master_voice_path} (Exact Duration: {total_dur:.2f}s)")

if __name__ == '__main__':
    asyncio.run(main())
