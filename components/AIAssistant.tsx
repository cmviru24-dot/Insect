
import React, { useState, useEffect, useRef } from 'react';
import { createChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { Chat } from '@google/genai';
import { SendIcon, BrainIcon } from './icons';

interface AIAssistantProps {
  insectName: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ insectName }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newChat = createChat(insectName);
    setChat(newChat);
    setMessages([
        { role: 'model', text: `Hi! I'm Professor Buzz. Ask me anything about the ${insectName}!` }
    ]);
  }, [insectName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
        const response = await chat.sendMessage({ message: userInput });
        const modelMessage: ChatMessage = { role: 'model', text: response.text };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I'm having trouble thinking right now." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[60vh] max-h-[500px] bg-gray-50 rounded-lg shadow-inner">
      <div className="p-4 border-b flex items-center gap-2">
        <BrainIcon className="text-green-700 w-6 h-6"/>
        <h3 className="text-lg font-semibold text-gray-800">Chat with an Expert</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl bg-gray-200 text-gray-800">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={`Ask about the ${insectName}...`}
          className="flex-1 px-4 py-2 border rounded-l-full focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-amber-500 text-white rounded-r-full hover:bg-amber-600 disabled:bg-gray-400">
          <SendIcon className="w-6 h-6"/>
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
