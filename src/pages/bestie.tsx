import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HelpModal from '../components/HelpModal';
import { Sparkles, Send, ShieldAlert, Mic, Volume2, VolumeX } from 'lucide-react';
import { ChatMessage } from '../types';

type SpeechResultEvent = Event & { results: ArrayLike<ArrayLike<{ transcript: string; isFinal?: boolean }>> };
type SpeechRecognitionLike = {
  lang: string; interimResults: boolean; continuous: boolean; maxAlternatives: number;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null; onend: (() => void) | null;
  start: () => void; stop: () => void;
};
type SpeechWindow = Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };

export default function BestiePage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bestie',
      text: "Hi there 💗 I'm Bestie, your companion here at FreeSoul. How are you holding up today? You can tell me anything.",
      timestamp: 'Just now'
    }
  ]);
  const [isCrisisDetected, setIsCrisisDetected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const voiceTranscriptRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.removeItem('freesoul.bestie.v1');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    if (silenceTimerRef.current !== null) window.clearTimeout(silenceTimerRef.current);
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
  }, []);

  const speakReply = (text: string) => {
    if (!voiceReplies || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      if (silenceTimerRef.current !== null) window.clearTimeout(silenceTimerRef.current);
      recognitionRef.current?.stop(); setIsListening(false); return;
    }
    if (!voiceModeEnabled) {
      setChatError('Turn on Voice Mode first, then tap the microphone to speak.');
      return;
    }
    if (isSending) return;
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) { setChatError('Voice input is not supported in this browser. Try Chrome or Edge, or type your message.'); return; }
    const recognition = new Recognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      voiceTranscriptRef.current = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ').trim();
      if (!voiceTranscriptRef.current) return;
      if (silenceTimerRef.current !== null) window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = window.setTimeout(() => {
        const transcript = voiceTranscriptRef.current.trim();
        voiceTranscriptRef.current = '';
        recognition.stop();
        setIsListening(false);
        if (transcript) {
          setInput(transcript);
          void handleSendMessage(undefined, transcript);
        }
      }, 1500);
    };
    recognition.onerror = () => { setIsListening(false); setChatError('Could not hear that clearly. Please try again or type your message.'); };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    voiceTranscriptRef.current = '';
    setChatError('');
    try { recognition.start(); setIsListening(true); }
    catch { setIsListening(false); setChatError('Microphone could not start. Check browser permissions.'); }
  };

  const handleSendMessage = async (e?: React.FormEvent, voiceText?: string) => {
    e?.preventDefault();
    const messageText = (voiceText ?? input).trim();
    if (!messageText || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const lowerInput = messageText.toLowerCase();
    const isCrisis = /suicid|kill myself|hurt myself|self[- ]harm|end it|want to die|can't stay safe|cannot stay safe/.test(lowerInput);
    const sentAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, userMsg]);
    setChatError('');
    setInput('');

    if (isCrisis) {
      setIsCrisisDetected(true);
      setMessages((prev) => [...prev, {
        id: `${Date.now()}-support`,
        sender: 'bestie',
        text: "I'm really glad you told me. Your safety matters. If you might act on these thoughts or are in immediate danger, contact local emergency services now or reach a crisis hotline. You can open the Support Hub here for resources. Is there someone you trust who can stay with you right now?",
        timestamp: sentAt,
        isCrisis: true,
      }]);
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].slice(-12).map((message) => ({ role: message.sender === 'user' ? 'user' : 'assistant', content: message.text })) }),
      });
      const data = await response.json() as { reply?: unknown; error?: unknown };
      if (!response.ok || typeof data.reply !== 'string') {
        throw new Error(typeof data.error === 'string' ? data.error : 'Bestie could not reply. Please try again.');
      }

      const reply = {
        id: `${Date.now()}-bestie`,
        sender: 'bestie',
        text: data.reply as string,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      } as ChatMessage;
      setMessages((prev) => [...prev, reply]);
      speakReply(reply.text);
    } catch (error) {
      setInput(messageText);
      setChatError(error instanceof Error ? error.message : 'Bestie could not connect right now. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-wellness-bg text-wellness-navy font-sans pb-16">
      <Head>
        <title>Bestie AI — FreeSoul</title>
      </Head>

      <Navbar onOpenHelp={() => setIsHelpOpen(true)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <main className="max-w-4xl mx-auto px-6 pt-10 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-wellness-lavender/60 shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-wellness-navy text-white flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-wellness-lavender" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-extrabold">Bestie 💗</h1>
            <p className="text-xs text-wellness-sageDark">A supportive AI companion, whenever you need a moment to talk.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#554879] bg-[#282342] px-4 py-3 text-xs leading-5 text-[#d2c9ea] shadow-soft">
          Messages are sent to Groq to generate replies. FreeSoul redacts common identifiers before forwarding. Avoid sharing identifying details. Bestie is not a crisis service.
        </div>

        {isCrisisDetected && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              <div>
                <h4 className="font-bold text-red-800 text-sm">Immediate Support Recommended</h4>
                <p className="text-xs text-red-700">Please access confidential 24/7 crisis resources.</p>
              </div>
            </div>
            <button onClick={() => setIsHelpOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold">
              Open HELP Hub
            </button>
          </div>
        )}

        {/* Chat Box */}
        <div className="bg-white rounded-3xl border border-wellness-lavender/60 shadow-card flex flex-col h-[min(65vh,620px)] min-h-[420px]">
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4" role="log" aria-live="polite" aria-label="Conversation">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-4 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-wellness-navy text-white rounded-br-none'
                    : msg.isCrisis
                    ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-none'
                    : 'bg-wellness-bg text-wellness-navy border border-wellness-lavender rounded-bl-none'
                }`}>
                  <p>{msg.text}</p>
                  <span className={`text-[10px] mt-1 block ${msg.sender === 'user' ? 'text-wellness-lavender/70' : 'text-wellness-sageDark'}`}>{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-none border border-wellness-lavender bg-wellness-bg px-4 py-3 text-sm text-wellness-sageDark" aria-label="Bestie is responding">
                  Bestie is thinking…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-wellness-lavender p-4">
            {chatError && <p className="mb-3 text-xs font-medium text-rose-700" role="alert">{chatError}</p>}
            <div className="mb-3 flex items-center justify-between rounded-xl border border-violet-300/20 bg-violet-400/10 px-3 py-2">
              <div><p className="text-xs font-semibold text-violet-100">Voice Mode</p><p className="text-[10px] text-violet-100/60">{voiceModeEnabled ? 'Tap the mic to speak; Bestie replies automatically.' : 'Turn on to send spoken messages automatically.'}</p></div>
              <button type="button" role="switch" aria-checked={voiceModeEnabled} aria-label="Toggle Voice Mode" onClick={() => { setVoiceModeEnabled((enabled) => { if (enabled) { recognitionRef.current?.stop(); setIsListening(false); } return !enabled; }); setChatError(''); }} className={`relative h-7 w-12 rounded-full transition-colors ${voiceModeEnabled ? 'bg-violet-500' : 'bg-slate-600'}`}>
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${voiceModeEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Message Bestie"
              placeholder="Type your message to Bestie..."
              className="flex-1 px-4 py-3 bg-wellness-bg border border-wellness-lavender rounded-xl text-sm focus:outline-none focus:border-wellness-navy"
            />
            <button type="button" disabled={!voiceModeEnabled || isSending} onClick={toggleListening} aria-label={isListening ? 'Stop voice input' : 'Start voice input'} title={isListening ? 'Listening — tap to stop' : voiceModeEnabled ? 'Speak one message' : 'Turn on Voice Mode first'} className={`rounded-xl border p-3 transition ${isListening ? 'border-rose-300 bg-rose-500/20 text-rose-100' : 'border-wellness-lavender bg-wellness-bg text-wellness-accent hover:bg-wellness-lavender/30 disabled:opacity-40'}`}>
              <Mic className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => { setVoiceReplies((enabled) => !enabled); window.speechSynthesis?.cancel(); }} aria-label={voiceReplies ? 'Turn off spoken replies' : 'Turn on spoken replies'} title={voiceReplies ? 'Spoken replies on' : 'Spoken replies off'} className="rounded-xl border border-wellness-lavender bg-wellness-bg p-3 text-wellness-accent hover:bg-wellness-lavender/30">
              {voiceReplies ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim() || isSending}
              className="bg-wellness-navy text-white p-3 rounded-xl hover:bg-wellness-navy/90 transition-all disabled:opacity-45"
            >
              <Send className="w-5 h-5" />
            </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
