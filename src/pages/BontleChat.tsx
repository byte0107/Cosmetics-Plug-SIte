import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBontleResponse } from '../services/bontle';
import clsx from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SUGGESTIONS = ['Dry skin tips', 'Best braids', 'Gala makeup', 'Clear acne fast'];

export default function BontleChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef           = useRef<HTMLDivElement>(null);
  const inputRef                 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }] as [{ text: string }]
    }));
    const responseText = await getBontleResponse(history, text);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    }]);
    setIsTyping(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: '#f4f4f5' }}>

      {/* Header */}
      <div className="bg-zinc-900 px-4 md:px-8 py-4 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => navigate(-1)}
          className="text-white active:scale-95 transition-all p-1 rounded-xl hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary relative flex-shrink-0">
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-900 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-white text-base leading-tight">Bontle AI</h1>
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Online · Roma Beauty Expert</p>
        </div>
      </div>

      {/* Messages scroll area */}
      <div className="flex-1 overflow-y-auto py-6 px-4 md:px-0">
        <div className="max-w-2xl mx-auto w-full space-y-4 px-0 md:px-4">

          {messages.length === 0 && (
            <div className="text-center pt-8 pb-4">
              <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-primary">auto_awesome</span>
              </div>
              <h2 className="text-xl font-black text-zinc-900 mb-2">Lumelang! I'm Bontle.</h2>
              <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
                Your personal beauty advisor for the Roma climate. How can I help you glow today?
              </p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={clsx(
              'flex',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}>
              {msg.role === 'model' && (
                <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 mr-2">
                  <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                </div>
              )}
              <div className={clsx(
                'max-w-[80%] md:max-w-[65%] px-4 py-3 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-zinc-900 text-white rounded-2xl rounded-tr-sm'
                  : 'bg-white text-zinc-800 border border-zinc-100 rounded-2xl rounded-tl-sm shadow-sm'
              )}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start items-center gap-2">
              <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
              </div>
              <div className="bg-white border border-zinc-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 150, 300].map(delay => (
                    <div key={delay}
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}>
                    </div>
                  ))}
                </div>
                <span className="text-xs font-medium text-zinc-400">Bontle is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-zinc-100 px-4 md:px-0 py-4 flex-shrink-0">
        <div className="max-w-2xl mx-auto w-full px-0 md:px-4">
          {messages.length === 0 && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-3 pb-1">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => handleSend(s)}
                  className="shrink-0 bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs font-bold px-4 py-2 rounded-2xl active:scale-95 transition-all hover:border-primary hover:text-primary whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend(input)}
              placeholder="Ask Bontle anything..."
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-[28px] px-5 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 bg-zinc-900 text-white rounded-[20px] flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all hover:bg-primary flex-shrink-0">
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}