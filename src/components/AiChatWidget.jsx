import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User } from 'lucide-react';
import axios from 'axios';

const QUICK_SUGGESTIONS = [
  '🛋️ Помогите подобрать диван',
  '🎨 Какие есть ткани и цвета?',
  '📏 Изготавливаете под мой размер?',
  '🚛 Сроки изготовления и доставка'
];

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: 'Здравствуйте! Я персональный ИИ-консультант фабрики Bula Mebel. Помогу выбрать диван, подобрать ткань под интерьер или рассчитать стоимость. О чем хотите узнать?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/ai/chat', { message: text });
      const reply = response.data?.reply || 'Спасибо за вопрос! Наш менеджер также всегда на связи в WhatsApp.';
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'ai', 
          content: 'Сейчас я работаю в демонстрационном режиме. Вы можете задать любой вопрос или написать нам напрямую в WhatsApp для точного расчета!' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-widget-container">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="ai-launcher-btn"
          aria-label="Открыть чат с ИИ помощником"
        >
          <div className="ai-launcher-icon-wrap">
            <Sparkles size={18} />
            <span className="ai-online-pulse" />
          </div>
          <div className="ai-launcher-text">
            <strong>ИИ-консультант</strong>
            <small>Онлайн · помощь в выборе</small>
          </div>
        </button>
      ) : (
        <section className="ai-chat-window" role="dialog" aria-label="Чат с ИИ консультантом Bula Mebel">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <div className="ai-header-avatar">
                <Bot size={20} />
                <span className="ai-online-pulse" />
              </div>
              <div>
                <h3 className="ai-header-title">Bula AI Консультант</h3>
                <div className="ai-header-status">
                  <span className="ai-status-dot" />
                  <span>В сети · фабрика Bula Mebel</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ai-header-close-btn"
              aria-label="Закрыть чат"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`ai-message-row ${msg.role}`}>
                <div className="ai-message-avatar">
                  {msg.role === 'ai' ? <Bot size={15} /> : <User size={15} />}
                </div>
                <div className="ai-message-bubble">
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Suggestions Chips (shown if only 1 AI message or customer is asking for start) */}
            {messages.length === 1 && (
              <div className="ai-chips-container">
                <span className="ai-chips-label">Частые вопросы:</span>
                <div className="ai-chips-wrapper">
                  {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="ai-chip-btn"
                      onClick={() => handleSendMessage(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Animated Typing Indicator */}
            {isLoading && (
              <div className="ai-message-row ai">
                <div className="ai-message-avatar">
                  <Bot size={15} />
                </div>
                <div className="ai-typing-dots">
                  <span className="ai-typing-dot" />
                  <span className="ai-typing-dot" />
                  <span className="ai-typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="ai-chat-footer">
            <form 
              className="ai-chat-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Задайте вопрос по диванам, тканям..."
                className="ai-chat-input"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="ai-chat-send-btn"
                aria-label="Отправить вопрос"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="ai-chat-footnote">
              Обучен на каталоге и материалах Bula Mebel
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
