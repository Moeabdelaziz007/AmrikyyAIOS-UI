
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../types';
import { generateResponse } from '../../services/geminiService';
import { SendIcon, SparklesIcon } from '../Icons';

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I'm Maya, your AI travel assistant. How can I help you plan your next adventure today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
    
    // FIX: Removed redundant addition of the current user message to the chat history.
    // The `generateResponse` service is now responsible for appending the current prompt.

    const aiResponseText = await generateResponse(input, chatHistory);
    const aiMessage: Message = { sender: 'ai', text: aiResponseText };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-bg-tertiary rounded-b-md">
      <div 
        role="log"
        aria-live="polite"
        aria-busy={isLoading}
        className="flex-grow p-4 overflow-y-auto space-y-4"
      >
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-purple flex items-center justify-center">
                  <SparklesIcon className="h-6 w-6 text-white" />
              </div>
            )}
            <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-br-none' : 'bg-bg-secondary text-text-primary rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-3 justify-start">
             <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-purple flex items-center justify-center animate-pulse-glow" style={{'--glow-color': '#3B82F680'} as React.CSSProperties}>
                  <SparklesIcon className="h-6 w-6 text-white" />
              </div>
            <div className="max-w-[70%] p-3 rounded-2xl bg-bg-secondary rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="relative">
          <label htmlFor="chat-input" className="sr-only">Type your message</label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-full pl-5 pr-14 text-text-primary focus:ring-2 focus:ring-primary-blue focus:outline-none transition-all duration-300"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            aria-label="Send message"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-primary-blue rounded-full flex items-center justify-center hover:bg-primary-blue/80 transition-colors disabled:bg-gray-500"
          >
            <SendIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
