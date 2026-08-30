import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  needsHumanHelp?: boolean;
  createdAt: string;
}

interface ChatConversation {
  id: string;
  title?: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Português" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
    { code: "ar", name: "العربية" },
    { code: "hi", name: "हिन्दी" },
    { code: "ru", name: "Русский" }
  ];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: conversations = [] } = useQuery({
    queryKey: ['/api/chat/conversations'],
    enabled: isAuthenticated,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['/api/chat/conversations', currentConversation, 'messages'],
    enabled: isAuthenticated && !!currentConversation,
  });

  const createConversationMutation = useMutation({
    mutationFn: async (data: { language: string; title?: string }) => {
      const response = await apiRequest('POST', '/api/chat/conversations', data);
      return response.json();
    },
    onSuccess: (newConversation) => {
      setCurrentConversation(newConversation.id);
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversations'] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: string; message: string; language: string }) => {
      const response = await apiRequest('POST', '/api/chat/message', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/chat/conversations', currentConversation, 'messages'] 
      });
      setMessage("");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (!currentConversation) {
      // Create new conversation
      await createConversationMutation.mutateAsync({
        language,
        title: message.slice(0, 50) + (message.length > 50 ? '...' : '')
      });
      return;
    }

    sendMessageMutation.mutate({
      conversationId: currentConversation,
      message,
      language
    });
  };

  const startNewConversation = () => {
    setCurrentConversation(null);
    setMessage("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col mb-4">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">CareBot</h4>
                <p className="text-xs text-blue-100">Healthcare Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={startNewConversation}
                className="text-white hover:text-blue-200 text-xs"
              >
                New Chat
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-blue-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {!currentConversation ? (
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-gray-100 border border-gray-200 p-3 rounded-xl max-w-xs">
                  <p className="text-sm text-gray-800">
                    {language === 'es' 
                      ? "¡Hola! Soy CareBot. Puedo ayudarte con:"
                      : "Hello! I'm CareBot. I can help you with:"
                    }
                  </p>
                  <ul className="text-xs text-gray-600 mt-2 space-y-1">
                    <li>• {language === 'es' ? 'Encontrar proveedores' : 'Finding providers'}</li>
                    <li>• {language === 'es' ? 'Preguntas sobre seguros' : 'Insurance questions'}</li>
                    <li>• {language === 'es' ? 'Preparación de citas' : 'Appointment prep'}</li>
                    <li>• {language === 'es' ? 'Opciones de tratamiento' : 'Treatment options'}</li>
                  </ul>
                </div>
              </div>
            ) : (
              (messages as ChatMessage[])?.map((msg: ChatMessage) => (
                <div key={msg.id} className={`flex items-start space-x-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`p-3 rounded-xl max-w-xs ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 border border-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left p-2 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-gray-600" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'es' ? "Escribe tu mensaje..." : "Type your message..."}
                className="text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={sendMessageMutation.isPending || createConversationMutation.isPending}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isPending || createConversationMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {language === 'es' ? 'CareBot habla 12 idiomas' : 
                 language === 'zh' ? 'CareBot 支持12种语言' :
                 language === 'fr' ? 'CareBot parle 12 langues' :
                 language === 'de' ? 'CareBot spricht 12 Sprachen' :
                 language === 'it' ? 'CareBot parla 12 lingue' :
                 language === 'pt' ? 'CareBot fala 12 idiomas' :
                 language === 'ja' ? 'CareBotは12ヶ国語対応' :
                 language === 'ko' ? 'CareBot은 12개 언어 지원' :
                 language === 'ar' ? 'CareBot يتحدث 12 لغة' :
                 language === 'hi' ? 'CareBot 12 भाषाओं में उपलब्ध' :
                 language === 'ru' ? 'CareBot говорит на 12 языках' :
                 'CareBot speaks 12 languages'}
              </p>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs bg-transparent border border-gray-300 rounded px-2 py-1"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
