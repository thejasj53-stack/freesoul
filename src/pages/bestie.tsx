import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HelpModal from '../components/HelpModal';
import { Sparkles, Send, ShieldAlert } from 'lucide-react';
import { ChatMessage } from '../types';

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const lowerInput = input.toLowerCase();
    const isCrisis = lowerInput.includes('suicide') || lowerInput.includes('hurt myself') || lowerInput.includes('end it') || lowerInput.includes('want to die');

    if (isCrisis) {
      setIsCrisisDetected(true);
    }

    const bestieReplyText = isCrisis
      = "I'm deeply concerned about what you're sharing, and your safety is the absolute top priority. Please reach out immediately to professional support or emergency services. You are valued.";

    const bestieMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bestie',
      text: isCrisis ? bestieReplyText : "I hear you. College can feel really heavy sometimes. Would you like to try a quick breathing exercise together, or talk more about what's causing this stress?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCrisis
    };

    setMessages(prev => [...prev, userMsg, bestieMsg]);
    setInput('');
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
            <p className="text-xs text-wellness-sageDark">Your empathetic AI companion. A little support, whenever you need it.</p>
          </div>
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
        <div className="bg-white rounded-3xl border border-wellness-lavender/60 shadow-card flex flex-col h-[500px]">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
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
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-wellness-lavender flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message to Bestie..."
              className="flex-1 px-4 py-3 bg-wellness-bg border border-wellness-lavender rounded-xl text-sm focus:outline-none focus:border-wellness-navy"
            />
            <button
              type="submit"
              className="bg-wellness-navy text-white p-3 rounded-xl hover:bg-wellness-navy/90 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}