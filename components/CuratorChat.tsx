import React, { useState, useRef, useEffect } from 'react';
import { chatWithCurator } from '../services/gemini';
import { ChatMessage } from '../types';

interface CuratorChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const CuratorChat: React.FC<CuratorChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '欢迎来到图鉴博物馆。我是您的 AI 策展人。无论您是在寻找一句触动心灵的书摘，还是一座令人惊叹的建筑，我都可以在此为您效劳。请问您想探索什么？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Convert internal message format to Gemini history format
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithCurator(history, userMsg);
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "非常抱歉，我似乎遇到了一些连接问题。请稍后再试。", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-stone-900 border-l border-stone-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-900/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-900 flex items-center justify-center border border-rose-700">
            <span className="text-white text-sm">AI</span>
          </div>
          <div>
            <h3 className="text-white font-medium">博物馆策展人</h3>
            <p className="text-xs text-stone-500">Online • Gemini 3 Flash</p>
          </div>
        </div>
        <button onClick={onClose} className="text-stone-500 hover:text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-950">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-rose-900 text-white rounded-br-none' 
                  : 'bg-stone-800 text-stone-200 rounded-bl-none border border-stone-700'
              } ${msg.isError ? 'border-red-500 bg-red-900/20' : ''}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-800 rounded-2xl px-4 py-3 border border-stone-700 rounded-bl-none flex gap-2">
              <span className="w-2 h-2 bg-stone-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-stone-500 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-stone-500 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-stone-900 border-t border-stone-800">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="询问关于名句、建筑或音乐..."
            className="w-full bg-stone-800 text-white placeholder-stone-500 rounded-xl px-4 py-3 pr-12 resize-none h-[50px] focus:h-[100px] transition-all focus:outline-none focus:ring-1 focus:ring-rose-500 border border-stone-700"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-2 bg-rose-700 hover:bg-rose-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CuratorChat;