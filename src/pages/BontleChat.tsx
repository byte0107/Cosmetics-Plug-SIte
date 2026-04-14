import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBontleResponse } from '../services/bontle';
import clsx from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SUGGESTIONS = ["Dry skin tips", "Best braids", "Gala makeup", "Clear acne"];

export default function BontleChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] as [{text: string}] }));
    const responseText = await getBontleResponse(history, text);
    
    const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col relative pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-zinc-900 px-5 py-4 flex items-center gap-4 shadow-md">
        <button onClick={() => navigate(-1)} className="text-white active:scale-95 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary relative">
            <span className="material-symbols-outlined">auto_awesome</span>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="font-black text-white text-lg leading-tight">Bontle AI</h1>
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-8 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-primary">auto_awesome</span>
            </div>
            <h2 className="text-xl font-black text-zinc-900 mb-2">Lumelang! I'm Bontle.</h2>
            <p className="text-sm text-zinc-500">Your personal beauty advisor for the Roma climate. How can I help you glow today?</p>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={clsx("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={clsx(
              "max-w-[80%] p-4 text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-zinc-900 text-white rounded-2xl rounded-tr-sm" 
                : "bg-white text-zinc-800 border border-zinc-100 rounded-2xl rounded-tl-sm shadow-sm"
            )}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-zinc-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs font-medium text-zinc-400 ml-2">Bontle is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-[80px] w-full max-w-[430px] bg-zinc-50 p-4">
        {messages.length === 0 && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1">
            {SUGGESTIONS.map(s => (
              <button 
                key={s} 
                onClick={() => handleSend(s)}
                className="whitespace-nowrap bg-white border border-zinc-200 text-zinc-600 text-xs font-bold px-4 py-2 rounded-2xl active:scale-95 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask Bontle..."
            className="flex-1 bg-white border border-zinc-200 rounded-[32px] px-5 py-3 text-sm focus:outline-none focus:border-primary transition-colors shadow-sm"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="w-12 h-12 bg-zinc-900 text-white rounded-[24px] flex items-center justify-center disabled:opacity-50 active:scale-95 transition-all shadow-md shrink-0"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
