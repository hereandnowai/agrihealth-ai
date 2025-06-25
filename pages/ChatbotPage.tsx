
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Section from '../components/Section';
import { ChatMessage as Message, GeminiChat, GroundingChunk } from '../types';
import { startChatSession, sendMessageToChatStream } from '../services/geminiService';
import { CHATBOT_NAME, CHATBOT_AVATAR_URL, BRAND_PRIMARY_COLOR, BRAND_SECONDARY_COLOR } from '../constants';
import { SendIcon, BotIcon, UserIcon, SparklesIcon, MenuIcon } from '../components/icons'; // Assuming MenuIcon for search toggle
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';


interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-end mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <img src={message.avatar || CHATBOT_AVATAR_URL} alt="Bot Avatar" className="w-8 h-8 rounded-full mr-2 self-start" />
      )}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow ${
          isUser 
            ? `bg-[${BRAND_SECONDARY_COLOR}] text-white rounded-br-none` 
            : `bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200`
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className="text-xs mt-1 opacity-70 text-right">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      {isUser && (
        <UserIcon className="w-8 h-8 rounded-full ml-2 text-gray-500 self-start" />
      )}
    </div>
  );
};

const GroundingSourcesDisplay: React.FC<{ sources: GroundingChunk[], onClear?: () => void }> = ({ sources, onClear }) => {
    const { getLocalizedString } = useLanguage();
    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-2 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
            <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-yellow-700">{getLocalizedString('groundingSources')}</p>
                {onClear && <button onClick={onClear} className="text-yellow-600 hover:text-yellow-800 text-xs">&times; clear</button>}
            </div>
            <ul className="list-disc list-inside space-y-1">
                {sources.map((chunk, index) => (
                    chunk.web && (
                        <li key={index}>
                            <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline">
                                {chunk.web.title || chunk.web.uri}
                            </a>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
};


const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatSession, setChatSession] = useState<GeminiChat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getLocalizedString, language } = useLanguage();
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const [currentGroundingChunks, setCurrentGroundingChunks] = useState<GroundingChunk[]>([]);

  useEffect(() => {
    const initialMessage: Message = {
      id: 'initial',
      text: getLocalizedString('chatbotWelcome', `Hello! I'm ${CHATBOT_NAME}. How can I help you today?`),
      sender: 'bot',
      timestamp: new Date(),
      avatar: CHATBOT_AVATAR_URL,
    };
    setMessages([initialMessage]);
    
    const systemInstruction = `You are ${CHATBOT_NAME}, a friendly, expert agricultural advisor for the AgriHealth AI platform. Always be available. Your primary goal is to assist users with questions about crop diseases, farming practices, image analysis, sensor data interpretation, and navigating the AgriHealth AI features. If asked about your identity, mention you are part of HERE AND NOW AI. Be concise and helpful. Respond in ${language} if possible, otherwise English.`;
    
    // Check if API_KEY is available before initializing chat
    if (process.env.API_KEY) {
        setChatSession(startChatSession(systemInstruction));
    } else {
        console.warn("API_KEY not available, chat functionality will be limited.");
        // Add a message to UI indicating API key issue
         setMessages(prev => [...prev, {
            id: 'api_key_warning',
            text: "Warning: AI Chat features are currently unavailable due to a configuration issue. Please contact support if this persists.",
            sender: 'bot',
            timestamp: new Date(),
            avatar: CHATBOT_AVATAR_URL,
        }]);
    }
  }, [getLocalizedString, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || !chatSession || isLoading) return;

    const userMessage: Message = {
      id: String(Date.now()),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setCurrentGroundingChunks([]); // Clear previous sources

    try {
      let botResponseText = '';
      let combinedChunks: GroundingChunk[] = [];
      const stream = await sendMessageToChatStream(chatSession, userMessage.text, useGoogleSearch);
      
      const botMessageId = String(Date.now() + 1);
      // Add a placeholder for bot message to update incrementally
      setMessages(prevMessages => [...prevMessages, {
          id: botMessageId,
          text: "...", // Placeholder
          sender: 'bot',
          timestamp: new Date(),
          avatar: CHATBOT_AVATAR_URL,
      }]);

      for await (const chunk of stream) {
        botResponseText += chunk.text;
        if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            combinedChunks = combinedChunks.concat(chunk.candidates[0].groundingMetadata.groundingChunks as GroundingChunk[]);
        }
        // Update the last bot message with new text
        setMessages(prevMessages => prevMessages.map(msg => 
            msg.id === botMessageId ? {...msg, text: botResponseText } : msg
        ));
      }
      
      // Final update to message text (already done incrementally) and set grounding chunks
      if (combinedChunks.length > 0) {
        // Filter unique chunks by URI
        const uniqueChunks = Array.from(new Map(combinedChunks.map(item => [item.web?.uri, item])).values())
                                .filter(chunk => chunk.web?.uri); // Ensure URI exists
        setCurrentGroundingChunks(uniqueChunks);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred.";
      const errorBotMessage: Message = {
        id: String(Date.now() + 1),
        text: `Sorry, I encountered an error: ${errorMessage}`,
        sender: 'bot',
        timestamp: new Date(),
        avatar: CHATBOT_AVATAR_URL,
      };
      setMessages(prevMessages => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Section title={getLocalizedString('chatbotTitle')} className="max-w-3xl mx-auto !p-0 flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)]">
      <div className={`flex items-center justify-between p-4 border-b bg-[${BRAND_SECONDARY_COLOR}] text-white rounded-t-xl`}>
          <div className="flex items-center">
            <img src={CHATBOT_AVATAR_URL} alt={CHATBOT_NAME} className="w-10 h-10 rounded-full mr-3 border-2 border-yellow-300"/>
            <h2 className={`text-xl font-semibold text-[${BRAND_PRIMARY_COLOR}]`}>{CHATBOT_NAME}</h2>
          </div>
          <button
            onClick={() => setUseGoogleSearch(prev => !prev)}
            title={getLocalizedString('toggleGoogleSearch')}
            className={`p-2 rounded-full transition-colors ${useGoogleSearch ? `bg-[${BRAND_PRIMARY_COLOR}] text-[${BRAND_SECONDARY_COLOR}]` : 'bg-teal-600 hover:bg-teal-500'}`}
          >
            <SparklesIcon className="w-5 h-5" />
          </button>
      </div>
      {useGoogleSearch && (
          <div className="p-2 text-xs text-center bg-yellow-100 text-yellow-800 border-b border-yellow-200">
              {getLocalizedString('googleSearchActive')}
          </div>
      )}

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        {isLoading && messages[messages.length -1].sender === 'user' && ( // Show spinner only if last message is user (bot is typing)
             <div className="flex justify-start mb-4">
                <img src={CHATBOT_AVATAR_URL} alt="Bot Avatar" className="w-8 h-8 rounded-full mr-2 self-start" />
                <div className="px-4 py-3 rounded-xl shadow bg-gray-100 text-gray-800 rounded-bl-none">
                    <LoadingSpinner size="sm" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <GroundingSourcesDisplay sources={currentGroundingChunks} onClear={() => setCurrentGroundingChunks([])} />

      <div className="p-4 border-t bg-gray-50 rounded-b-xl">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder={getLocalizedString('typeYourMessage')}
            className={`flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[${BRAND_PRIMARY_COLOR}] focus:border-[${BRAND_PRIMARY_COLOR}] transition-shadow disabled:bg-gray-200`}
            disabled={isLoading || !chatSession}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === '' || !chatSession}
            className={`p-3 bg-[${BRAND_SECONDARY_COLOR}] text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
         {!chatSession && process.env.API_KEY && !isLoading && (
            <p className="text-xs text-red-500 mt-1 text-center">Chat session could not be initialized. AI features might be unavailable.</p>
        )}
         {!process.env.API_KEY && (
             <p className="text-xs text-red-500 mt-1 text-center">API Key not configured. Chat functionality is disabled.</p>
         )}
      </div>
    </Section>
  );
};

export default ChatbotPage;
    