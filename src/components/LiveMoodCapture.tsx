import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Loader2, ScanFace } from 'lucide-react';
import type { MoodType } from '../types';

const moodMap: Record<string, MoodType> = {
  happy: 'Happy', sad: 'Sad', angry: 'Angry', fearful: 'Anxious', disgusted: 'Stressed', surprised: 'Good', neutral: 'Neutral',
};

export default function LiveMoodCapture({ onMoodDetected }: { onMoodDetected: (mood: MoodType, reflection: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scoreHistory = useRef<Array<Record<string, number>>>([]);
  const candidateRef = useRef('');
  const candidateFrames = useRef(0);
  const lastSuggestedMood = useRef<MoodType | null>(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Camera is off. Start it to get an on-device expression estimate.');
  const [emotion, setEmotion] = useState('');
  const [confidence, setConfidence] = useState(0);

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setActive(false);
    setStatus('Camera is off. No image was saved.');
  };

  const startCamera = async () => {
    setLoading(true);
    setStatus('Loading expression model…');
    try {
      const faceapi = await import('@vladmandic/face-api');
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
      setStatus('Center your face and hold still for a moment.');
    } catch (error) {
      setStatus(error instanceof Error && error.name === 'NotAllowedError' ? 'Camera permission was denied. You can still select a mood manually.' : 'Could not start camera or load the expression model. Use manual mood selection instead.');
      stopCamera();
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let busy = false;
    const detect = async () => {
      if (cancelled || busy || !videoRef.current || videoRef.current.readyState < 2) return;
      busy = true;
      try {
        const faceapi = await import('@vladmandic/face-api');
        const result = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: .6 })).withFaceExpressions();
        if (cancelled) return;
        if (!result) {
          scoreHistory.current = [];
          candidateRef.current = '';
          candidateFrames.current = 0;
          lastSuggestedMood.current = null;
          setStatus('No clear face detected. Face the camera in even lighting.');
          setEmotion('');
          return;
        }
        scoreHistory.current = [...scoreHistory.current, { ...result.expressions }].slice(-5);
        const averaged = Object.fromEntries(Object.keys(result.expressions).map((key) => [
          key,
          scoreHistory.current.reduce((sum, sample) => sum + (sample[key] ?? 0), 0) / scoreHistory.current.length,
        ]));
        const [label, score] = Object.entries(averaged).sort((a, b) => b[1] - a[1])[0];
        const mood = moodMap[label] ?? 'Neutral';
        const pct = Math.round(score * 100);
        setEmotion(label);
        setConfidence(pct);
        if (label === candidateRef.current) candidateFrames.current += 1;
        else { candidateRef.current = label; candidateFrames.current = 1; }
        if (pct >= 55 && candidateFrames.current >= 3) {
          setStatus(`Steady expression estimate: ${label} (${pct}%). Confirm or change the suggested mood below.`);
          if (lastSuggestedMood.current !== mood) {
            lastSuggestedMood.current = mood;
            onMoodDetected(mood, `Face expression check-in suggested ${mood.toLowerCase()} (${label}, ${pct}% estimate). How are you actually feeling?`);
          }
        } else {
          setStatus(`Reading expression… ${label} (${pct}%). Hold a steady, well-lit position for a clearer suggestion.`);
        }
      } catch { if (!cancelled) setStatus('Expression detection paused. You can choose a mood manually.'); }
      finally { busy = false; }
    };
    const timer = window.setInterval(detect, 1000);
    void detect();
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [active, onMoodDetected]);

  return <section className="rounded-3xl border border-[#69578e] bg-gradient-to-br from-[#30274d] to-[#201d39] p-6 shadow-card space-y-4">
    <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-400/15 text-violet-200"><ScanFace className="h-5 w-5" /></span><div><h2 className="font-heading text-lg font-bold text-white">Live expression check-in</h2><p className="text-xs text-violet-100/70">On-device estimate · no images stored or uploaded</p></div></div>
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-violet-200/20 bg-[#17142a]">
        <video ref={videoRef} muted playsInline className={`h-full w-full object-cover ${active ? '' : 'hidden'}`} />
        {!active && <div className="absolute inset-0 grid place-items-center text-violet-100/50"><CameraOff className="h-8 w-8" /></div>}
        {active && emotion && <div className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-[#17142a]/80 px-3 py-1 text-sm font-semibold text-white backdrop-blur">{emotion} · {confidence}%</div>}
      </div>
      <div className="space-y-3"><p className="text-sm leading-relaxed text-violet-50/80" aria-live="polite">{status}</p>
        {!active ? <button type="button" disabled={loading} onClick={startCamera} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/30 disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}{loading ? 'Starting…' : 'Start camera'}</button> : <button type="button" onClick={stopCamera} className="w-full rounded-xl border border-violet-200/25 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">Turn camera off</button>}
      </div>
    </div>
    <p className="text-[11px] leading-relaxed text-violet-100/55">Facial expressions cannot reliably tell how someone feels. Treat the suggestion as a prompt, then confirm or change your mood below. Camera access requires your permission.</p>
  </section>;
}
