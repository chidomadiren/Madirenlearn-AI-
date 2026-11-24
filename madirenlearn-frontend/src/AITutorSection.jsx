import { useEffect, useRef, useState } from 'react';
import {
  FaArrowRight,
  FaBookOpen,
  FaChevronDown,
  FaPaperPlane,
  FaRobot,
  FaSyncAlt,
} from 'react-icons/fa';
import { API_BASE, apiFetch } from './api';

const SUBJECTS = [
  'Mathematics',
  'Shona',
  'English',
  'Combined Science',
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  text: 'Hello! Ask any school question in English or Shona, and I will guide you step by step. (Mhoro! Bvunza chero mubvunzo wechikoro, ndichakubatsira kuunzwisisa.)',
};

const INITIAL_LANGUAGE = 'english';

export function AITutorSection({
  initialSubject = 'Mathematics',
  onContinueToQuiz,
}) {
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [menuOpen, setMenuOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(INITIAL_LANGUAGE);

  const dropdownRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setQuestion('');
    setMenuOpen(false);
  };

  const formatChatGPTText = (text) => {
  if (!text) return text;
  
  // Replace markdown-style bold with HTML bold
  let result = text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*\* $/g, '')
    .replace(/^\*\*/g, '')
    .replace(/\*\$/g, '');

  // Replace ### headings with HTML h3
  result = result.replace(/### ([^\n]+)/g, '<h3>$1</h3>');

  // Replace bullet points (starting with - or *) with HTML list items
  result = result.replace(/^[\s]*[-*] (.+)$/gm, '<li>$1</li>');
  
  // Wrap in ul if there are list items
  if (result.includes('<li>')) {
    result = '<ul>' + result + '</ul>';
  }

  // Replace double newlines with paragraph breaks
  result = result.replace(/\n\n/g, '</p><p>');
  
  // Replace single newlines with breaks
  result = result.replace(/\n/g, '<br/>');

  // Ensure first paragraph starts properly
  result = result.replace(/^<p>/i, '<p>');
  result = result.replace(/<p>$/i, '<p>');
  
  return result;
};

const handleAskAI = async (e) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const updatedHistory = [
      ...messages,
      { role: 'user', text: trimmed, subject: selectedSubject },
    ];

    setMessages(updatedHistory);
    setQuestion('');
    setLoading(true);

    try {
      const response = await apiFetch(`${API_BASE}/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          question: trimmed,
          message: trimmed,
          language: language,
          history: updatedHistory.slice(-6).map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data.error || 'Could not get a response from the AI tutor.'
        );
      }

      // Use tutorResponse if available, fall back to other fields
      const reply =
        data.tutorResponse ||
        data.reply ||
        data.answer ||
        data.message ||
        data.response ||
        'Let us break down your school question step by step—what part would you like to start with?';

      // Format with ChatGPT-style formatting
      const formattedReply = formatChatGPTText(reply);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: formattedReply, subject: selectedSubject },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            err instanceof TypeError
              ? 'Unable to reach the tutor server right now. Please check your connection and try again.'
              : err.message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="socratic-tutor-wrapper">
      <div className="socratic-top-row">
        <div>
          <span className="socratic-kicker">YOUR PERSONAL GUIDE</span>
          <h2 className="socratic-heading">Your AI Socratic Tutor</h2>
        </div>

        <div className="socratic-top-actions">
          {typeof onContinueToQuiz === 'function' && (
            <button
              type="button"
              className="socratic-icon-btn"
              onClick={() => onContinueToQuiz(selectedSubject)}
              title={`Practice ${selectedSubject} Quiz`}
              aria-label={`Practice ${selectedSubject} Quiz`}
            >
              <FaArrowRight />
            </button>
          )}
          <button
            type="button"
            className="socratic-icon-btn"
            onClick={handleResetChat}
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>

      <div className="socratic-chat-card">
        <div className="socratic-chat-header">
          <div className="socratic-chat-title">
            <FaRobot className="socratic-bot-icon" />
            <span>AI Chat</span>
          </div>

          <div className="socratic-header-right">
            <div className="subject-dropdown-wrap" ref={dropdownRef}>
              <button
                type="button"
                className="subject-trigger-btn"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <FaBookOpen />
                <span>{selectedSubject}</span>
                <FaChevronDown className={menuOpen ? 'rotated' : ''} />
              </button>

              {menuOpen && (
                <div className="subject-dropdown-menu" role="menu">
                  {SUBJECTS.map((subj) => (
                    <button
                      key={subj}
                      type="button"
                      role="menuitem"
                      className={`subject-dropdown-item ${
                        selectedSubject === subj ? 'is-selected' : ''
                      }`}
                      onClick={() => {
                        setSelectedSubject(subj);
                        setMenuOpen(false);
                      }}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language switcher */}
              <div className="language-switcher">
                <span className="language-label">Lang:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="language-select"
                >
                  <option value="auto">Auto</option>
                  <option value="english">English</option>
                  <option value="shona">Shona</option>
                </select>
              </div>

              <span className="socratic-status">
              <span className="socratic-status-dot" />
              Online
            </span>
          </div>
        </div>

        <div className="socratic-messages">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`socratic-msg-row ${isUser ? 'is-user' : 'is-ai'}`}
              >
                {!isUser && (
                  <div className="socratic-avatar">
                    <FaRobot />
                  </div>
                )}
                <div className="socratic-bubble">
                  <div className="socratic-meta">
                    {isUser
                      ? `${msg.subject || selectedSubject} · YOU`
                      : 'AI · SOCRATIC TUTOR'}
                  </div>
                  <div className="socratic-text">{msg.text}</div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="socratic-msg-row is-ai">
              <div className="socratic-avatar">
                <FaRobot />
              </div>
              <div className="socratic-bubble">
                <div className="socratic-meta">AI · SOCRATIC TUTOR</div>
                <div className="socratic-text">Thinking…</div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <form className="socratic-input-form" onSubmit={handleAskAI}>
          <input
            type="text"
            className="socratic-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask a ${selectedSubject} school question in English or Shona...`}
            disabled={loading}
          />
          <button
            type="submit"
            className="socratic-send-btn"
            disabled={loading || !question.trim()}
            aria-label="Ask AI"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </section>
  );
}