import React, { useEffect, useMemo, useRef, useState } from 'react';
import { API_BASE } from './api';

export const ALL_SUBJECTS = [
  'Mathematics',
  'English',
  'Shona',
  'Combined Science',
  'Accounts',
  'History',
  'Geography',
  'Commerce',
  'FRS',
  'Heritage Studies',
  'Extra Course',
];

export const REVISION_SUBJECTS = [
  'Accounts',
  'History',
  'Geography',
  'Commerce',
  'FRS',
  'Heritage Studies',
  'Extra Course',
  'Shona',
  'Mathematics',
  'English',
  'Combined Science',
];

const QUIZ_BANK = {
  Shona: [
    {
      id: 'sh-1',
      question: '"Munhu" anova "vanhu" kana ari muzhinji. Ndeipi iri muzhinji ya"mwana"?',
      options: ['Vana', 'Miti', 'Vanhu', 'Zvinhu'],
      answer: 'Vana',
      explanation: 'Muzhinji yezwi "mwana" (kirasi 1 -> kirasi 2) ndi"vana".',
    },
    {
      id: 'sh-2',
      question: 'Tsumo inoti "Kandiro enda kandiro dzoka" inorevei?',
      options: [
        'Kupa zvakanaka kunoita kuti uwanezve zvakanaka',
        'Kufamba kure kunonetsa',
        'Kudya kwakawanda kunorwadza dumbu',
        'Kuvaka imba kunoda mari',
      ],
      answer: 'Kupa zvakanaka kunoita kuti uwanezve zvakanaka',
      explanation: 'Inodzidzisa rupo nekudyidzana kwakanaka pakati pevanhu.',
    },
    {
      id: 'sh-3',
      question: 'Izwi rinopikisana na"chena" nderipi?',
      options: ['Dema', 'Tsvuku', 'Nhema', 'Kukura'],
      answer: 'Nhema',
      explanation: 'Ruvhiyo rwa"chena" (white) ndi"nhema" (black).',
    },
    {
      id: 'sh-4',
      question: 'Chii chinonzi "nyaudzosingwi" muChiShona?',
      options: [
        'Izwi rinotsanangura maitiro kana chimiro zvakajeka',
        'Zita renzvimbo chete',
        'Nhamba dzinoverengwa',
        'Chirevo chisingaperi',
      ],
      answer: 'Izwi rinotsanangura maitiro kana chimiro zvakajeka',
      explanation: 'Nyaudzosingwi dzinosimbisa chiito kana ruvara, somuenzaniso "tsvuku ndo-o".',
    },
  ],
  Mathematics: [
    {
      id: 'math-1',
      question: 'Solve for x: 3x + 6 = 21',
      options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'],
      answer: 'x = 5',
      explanation: 'Subtract 6 from both sides: 3x = 15, then divide by 3 to get x = 5.',
    },
    {
      id: 'math-2',
      question: 'What is the area of a triangle with base 10 cm and height 6 cm?',
      options: ['16 cm²', '30 cm²', '60 cm²', '20 cm²'],
      answer: '30 cm²',
      explanation: 'Area of a triangle = 1/2 × base × height = 0.5 × 10 × 6 = 30 cm².',
    },
    {
      id: 'math-3',
      question: 'Convert 0.75 into a fraction in simplest form.',
      options: ['3/4', '1/2', '2/3', '4/5'],
      answer: '3/4',
      explanation: '0.75 = 75/100; dividing numerator and denominator by 25 gives 3/4.',
    },
  ],
  English: [
    {
      id: 'eng-1',
      question: 'Which word in the sentence "The clever student solved the puzzle" is an adjective?',
      options: ['student', 'clever', 'solved', 'puzzle'],
      answer: 'clever',
      explanation: '"Clever" describes the noun "student", making it an adjective.',
    },
    {
      id: 'eng-2',
      question: 'Choose the grammatically correct sentence:',
      options: [
        'Each of the learners have a workbook.',
        'Each of the learners has a workbook.',
        'Each of the learners were given workbooks.',
        'Each of the learners are ready.',
      ],
      answer: 'Each of the learners has a workbook.',
      explanation: '"Each" is singular and takes the singular verb "has".',
    },
  ],
  'Combined Science': [
    {
      id: 'sci-1',
      question: 'Which gas do green plants absorb during photosynthesis?',
      options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
      answer: 'Carbon dioxide',
      explanation: 'Plants use carbon dioxide, water, and light energy to produce glucose and oxygen.',
    },
    {
      id: 'sci-2',
      question: 'What is the SI unit of electrical resistance?',
      options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
      answer: 'Ohm',
      explanation: 'Electrical resistance is measured in Ohms (Ω).',
    },
  ],
  Accounts: [
    {
      id: 'acc-1',
      question: 'Which equation represents the fundamental accounting equation?',
      options: [
        'Assets = Capital + Liabilities',
        'Assets = Revenue - Expenses',
        'Capital = Assets + Liabilities',
        'Liabilities = Assets + Capital',
      ],
      answer: 'Assets = Capital + Liabilities',
      explanation: 'A business’s economic resources (Assets) are funded by owner equity (Capital) and obligations (Liabilities).',
    },
  ],
  History: [
    {
      id: 'his-1',
      question: 'What is a primary source in historical research?',
      options: [
        'A modern textbook summary',
        'An original document or artifact from the time studied',
        'A fictional movie made decades later',
        'A later encyclopaedia entry',
      ],
      answer: 'An original document or artifact from the time studied',
      explanation: 'Primary sources come directly from the era or event being investigated.',
    },
  ],
  Geography: [
    {
      id: 'geo-1',
      question: 'Which instrument is used to measure atmospheric pressure?',
      options: ['Anemometer', 'Barometer', 'Hygrometer', 'Rain gauge'],
      answer: 'Barometer',
      explanation: 'A barometer measures air pressure; an anemometer measures wind speed.',
    },
  ],
  Commerce: [
    {
      id: 'com-1',
      question: 'What is trade within a single country called?',
      options: ['Home (domestic) trade', 'Entrepot trade', 'Import trade', 'Invisible trade'],
      answer: 'Home (domestic) trade',
      explanation: 'Buying and selling goods/services inside one country is home or domestic trade.',
    },
  ],
  FRS: [
    {
      id: 'frs-1',
      question: 'In Family and Religious Studies (FRS), what does mutual respect in a community promote?',
      options: [
        'Peace, tolerance, and social cohesion',
        'Conflict and exclusion',
        'Ignoring ethical values',
        'Isolation from neighbors',
      ],
      answer: 'Peace, tolerance, and social cohesion',
      explanation: 'Respect across beliefs and backgrounds strengthens harmony and ethical living.',
    },
  ],
  'Heritage Studies': [
    {
      id: 'her-1',
      question: 'Why is preserving intangible cultural heritage (such as oral history, songs, and crafts) important?',
      options: [
        'It preserves community identity and intergenerational knowledge',
        'It replaces all modern skills',
        'It stops cultural exchange',
        'It removes local languages',
      ],
      answer: 'It preserves community identity and intergenerational knowledge',
      explanation: 'Intangible heritage carries shared values, history, and traditions from elders to younger generations.',
    },
  ],
  'Extra Course': [
    {
      id: 'ext-1',
      question: 'In digital literacy and problem solving, why do we break a big task into smaller steps?',
      options: [
        'To make it easier to plan, test, and solve accurately',
        'To make it impossible to finish',
        'To skip checking results',
        'To hide errors',
      ],
      answer: 'To make it easier to plan, test, and solve accurately',
      explanation: 'Decomposition helps tackle complex problems step by step with fewer mistakes.',
    },
  ],
};

function getQuestionsForSubject(subject, desiredCount = 5) {
  const base = QUIZ_BANK[subject] || QUIZ_BANK.Mathematics;
  const list = [];
  for (let i = 0; i < desiredCount; i++) {
    const item = base[i % base.length];
    list.push({
      ...item,
      instanceId: `${item.id}-${i}`,
    });
  }
  return list;
}

export function calculateQuizSeconds(questionCount, secondsPerQuestion = 60) {
  const safeCount = Math.max(1, Number(questionCount) || 1);
  return safeCount * secondsPerQuestion;
}

export function formatClock(totalSeconds) {
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/* -------------------------------------------------------------------------- */
/* 1. SUBJECT PICKER -> START ASSIGNMENT SCREEN -> QUIZ RUNNER                 */
/* -------------------------------------------------------------------------- */

export function SubjectAndQuizFlow({
  selectedSubject: controlledSubject,
  onSelectSubject,
  questionCount = 5,
  secondsPerQuestion = 60,
}) {
  const [internalSubject, setInternalSubject] = useState('Mathematics');
  const activeSubject = controlledSubject || internalSubject;

  const setSubject = (subj) => {
    setInternalSubject(subj);
    if (typeof onSelectSubject === 'function') onSelectSubject(subj);
    setStage('start');
  };

  // Stages: 'choose' | 'start' | 'quiz' | 'summary'
  const [stage, setStage] = useState('choose');
  const [questions, setQuestions] = useState(() => getQuestionsForSubject('Mathematics', questionCount));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(() =>
    calculateQuizSeconds(questionCount, secondsPerQuestion)
  );

  useEffect(() => {
    if (controlledSubject) {
      setInternalSubject(controlledSubject);
    }
  }, [controlledSubject]);

  useEffect(() => {
    if (stage !== 'quiz') return;
    if (secondsLeft <= 0) {
      setStage('summary');
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [stage, secondsLeft]);

  const handleOpenStartScreen = (subj) => {
    setSubject(subj);
    const prepared = getQuestionsForSubject(subj, questionCount);
    setQuestions(prepared);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSecondsLeft(calculateQuizSeconds(prepared.length, secondsPerQuestion));
    setStage('start');
  };

  const handleStartQuiz = () => {
    const prepared = getQuestionsForSubject(activeSubject, questionCount);
    setQuestions(prepared);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSecondsLeft(calculateQuizSeconds(prepared.length, secondsPerQuestion));
    setStage('quiz');
  };

  const currentQuestion = questions[currentIndex];
  const score = useMemo(() => {
    return questions.reduce((acc, q) => {
      return acc + (selectedAnswers[q.instanceId] === q.answer ? 1 : 0);
    }, 0);
  }, [questions, selectedAnswers]);

  return (
    <div className="ml-card">
      {stage === 'choose' && (
        <div>
          <div className="ml-kicker">QUICK START</div>
          <h2 className="ml-heading">Choose a subject</h2>
          <p className="ml-subtext">
            Select a subject to open the Start Assignment screen, then click Start to begin your timed quiz.
          </p>

          <div className="ml-subject-grid">
            {ALL_SUBJECTS.map((subj) => (
              <button
                key={subj}
                type="button"
                className={`ml-subject-tile ${activeSubject === subj ? 'is-active' : ''}`}
                onClick={() => handleOpenStartScreen(subj)}
              >
                <span className="ml-book-badge">📘</span>
                <span>{subj}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'start' && (
        <div className="ml-start-box">
          <button type="button" className="ml-link-btn" onClick={() => setStage('choose')}>
            ← Back to Subjects
          </button>
          <div className="ml-kicker">ASSIGNMENT READY</div>
          <h2 className="ml-heading">Start Assignment — {activeSubject}</h2>
          <p className="ml-subtext">
            This quiz has <strong>{questionCount} questions</strong> and a scaled timer of{' '}
            <strong>{formatClock(calculateQuizSeconds(questionCount, secondsPerQuestion))}</strong> (
            {secondsPerQuestion}s per question). Click <strong>Start</strong> when you are ready.
          </p>

          <div className="ml-meta-pills">
            <span className="ml-pill">Subject: {activeSubject}</span>
            <span className="ml-pill">Questions: {questionCount}</span>
            <span className="ml-pill">
              Time: {formatClock(calculateQuizSeconds(questionCount, secondsPerQuestion))}
            </span>
          </div>

          <div className="ml-actions-row">
            <button type="button" className="ml-primary-btn" onClick={handleStartQuiz}>
              Start
            </button>
          </div>
        </div>
      )}

      {stage === 'quiz' && currentQuestion && (
        <div>
          <div className="ml-quiz-topbar">
            <div className="ml-quiz-title-group">
              <button type="button" className="ml-secondary-btn" onClick={() => setStage('start')}>
                Exit Quiz
              </button>
              <h2 className="ml-quiz-title">Quiz: {activeSubject}</h2>
            </div>

            <div className="ml-timer-badge">
              ⏳ Time Left: <strong>{formatClock(secondsLeft)}</strong>
            </div>
          </div>

          <div className="ml-progress-label">
            Question {currentIndex + 1} of {questions.length}
          </div>

          <h3 className="ml-question-text">{currentQuestion.question}</h3>

          <div className="ml-options-list">
            {currentQuestion.options.map((opt) => {
              const picked = selectedAnswers[currentQuestion.instanceId] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  className={`ml-option-row ${picked ? 'is-selected' : ''}`}
                  onClick={() =>
                    setSelectedAnswers((prev) => ({
                      ...prev,
                      [currentQuestion.instanceId]: opt,
                    }))
                  }
                >
                  <span className="ml-radio">{picked ? '●' : '○'}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="ml-actions-row">
            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                className="ml-primary-btn"
                onClick={() => setCurrentIndex((i) => i + 1)}
              >
                Next Question
              </button>
            ) : (
              <button
                type="button"
                className="ml-primary-btn"
                onClick={() => setStage('summary')}
              >
                Finish Quiz
              </button>
            )}
          </div>
        </div>
      )}

      {stage === 'summary' && (
        <div>
          <div className="ml-kicker">QUIZ COMPLETE</div>
          <h2 className="ml-heading">
            {activeSubject} Result: {score} / {questions.length}
          </h2>
          <div className="ml-actions-row">
            <button type="button" className="ml-primary-btn" onClick={handleStartQuiz}>
              Retake Quiz
            </button>
            <button type="button" className="ml-secondary-btn" onClick={() => setStage('choose')}>
              Choose Another Subject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. CHATGPT-STYLE AI SOCRATIC TUTOR WITH ENGLISH / SHONA LANGUAGE SELECTOR   */
/* -------------------------------------------------------------------------- */

function FormattedMarkdownMessage({ text }) {
  const blocks = useMemo(() => {
    const lines = String(text || '').split('\n');
    const parsed = [];
    let listItems = [];

    const flushList = () => {
      if (listItems.length > 0) {
        parsed.push({ type: 'ul', items: listItems });
        listItems = [];
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        flushList();
        continue;
      }
      if (line.startsWith('### ')) {
        flushList();
        parsed.push({ type: 'h4', text: line.replace(/^###\s+/, '') });
      } else if (line.startsWith('## ')) {
        flushList();
        parsed.push({ type: 'h3', text: line.replace(/^##\s+/, '') });
      } else if (/^[-*•]\s+/.test(line)) {
        listItems.push(line.replace(/^[-*•]\s+/, ''));
      } else if (/^\d+[.)]\s+/.test(line)) {
        listItems.push(line.replace(/^\d+[.)]\s+/, ''));
      } else {
        flushList();
        parsed.push({ type: 'p', text: line });
      }
    }
    flushList();
    return parsed;
  }, [text]);

  const renderInlineBold = (str) => {
    const parts = String(str).split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="ml-chatgpt-prose">
      {blocks.map((block, index) => {
        if (block.type === 'h3') return <h4 key={index}>{renderInlineBold(block.text)}</h4>;
        if (block.type === 'h4') return <h5 key={index}>{renderInlineBold(block.text)}</h5>;
        if (block.type === 'ul') {
          return (
            <ul key={index}>
              {block.items.map((item, i) => (
                <li key={i}>{renderInlineBold(item)}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{renderInlineBold(block.text)}</p>;
      })}
    </div>
  );
}

export function ChatGPTStyleTutor({ selectedSubject = 'Mathematics' }) {
  // 'english' | 'shona' | 'both'
  const [languageMode, setLanguageMode] = useState('english');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text:
        '### Welcome to MadirenLearn AI\n\nAsk me any question in **English** or **Shona**. Use the language selector above to choose **English**, **Shona**, or **Both**—and if you write in Shona or ask for Shona translation, I will reply in Shona.',
    },
  ]);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextHistory = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          question: trimmed,
          message: trimmed,
          language: languageMode,
          preferredLanguage: languageMode,
          history: nextHistory.slice(-6).map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));
      const answerText =
        data.tutorResponse || data.reply || data.answer || data.response || data.message || '';

      if (!res.ok || !String(answerText).trim()) {
        throw new Error(data.error || 'The tutor service returned an empty answer. Please try again.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: String(answerText).trim() }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `**Notice:** ${err.message || 'Please try again.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-card ml-tutor-card">
      <div className="ml-tutor-header">
        <div>
          <div className="ml-kicker">AI CHAT · {selectedSubject.toUpperCase()}</div>
          <h2 className="ml-heading">Your AI Socratic Tutor</h2>
        </div>

        <div className="ml-lang-group" role="group" aria-label="Choose response language">
          <button
            type="button"
            className={`ml-lang-btn ${languageMode === 'english' ? 'is-active' : ''}`}
            onClick={() => setLanguageMode('english')}
          >
            English
          </button>
          <button
            type="button"
            className={`ml-lang-btn ${languageMode === 'shona' ? 'is-active' : ''}`}
            onClick={() => setLanguageMode('shona')}
          >
            Shona
          </button>
          <button
            type="button"
            className={`ml-lang-btn ${languageMode === 'both' ? 'is-active' : ''}`}
            onClick={() => setLanguageMode('both')}
          >
            English + Shona
          </button>
        </div>
      </div>

      <div className="ml-chat-stream">
        {messages.map((m, idx) => (
          <div key={idx} className={`ml-chat-row ${m.role === 'user' ? 'is-user' : 'is-ai'}`}>
            <div className="ml-chat-bubble">
              <div className="ml-chat-role">{m.role === 'user' ? 'YOU' : 'MADIRENLEARN AI'}</div>
              {m.role === 'user' ? (
                <p className="ml-user-msg">{m.text}</p>
              ) : (
                <FormattedMarkdownMessage text={m.text} />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="ml-chat-row is-ai">
            <div className="ml-chat-bubble">
              <div className="ml-chat-role">MADIRENLEARN AI</div>
              <p className="ml-user-msg">Thinking step by step…</p>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form className="ml-chat-form" onSubmit={handleSend}>
        <input
          type="text"
          className="ml-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            languageMode === 'shona'
              ? 'Bvunza mubvunzo wako muShona kana muChirungu...'
              : 'Ask any question in English or Shona...'
          }
          disabled={loading}
        />
        <button type="submit" className="ml-primary-btn" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. REVISION TESTS (PAPER 1 & PAPER 2 ONLY — NO TIMER, SUBMIT + CORRECTIONS) */
/* -------------------------------------------------------------------------- */

const PAPER_SETS = {
  Accounts: {
    paper1: [
      {
        id: 'acc-p1-1',
        prompt: 'Paper 1 · Q1: Which book of prime entry records credit sales?',
        options: ['Sales Journal', 'Purchases Journal', 'Cash Book', 'General Journal'],
        correct: 'Sales Journal',
        correction: 'Credit sales are first recorded in the Sales Journal (Sales Day Book).',
      },
      {
        id: 'acc-p1-2',
        prompt: 'Paper 1 · Q2: Depreciation is recorded to match:',
        options: [
          'The cost of a non-current asset with the periods it benefits',
          'Cash balances with bank statements only',
          'Drawings with capital',
          'Wages with sales',
        ],
        correct: 'The cost of a non-current asset with the periods it benefits',
        correction: 'Depreciation allocates the cost of a non-current asset over its useful life.',
      },
    ],
    paper2: [
      {
        id: 'acc-p2-1',
        prompt: 'Paper 2 · Q1: If Opening Capital is $4,000, Profit for the year is $1,500, and Drawings are $500, what is Closing Capital?',
        options: ['$5,000', '$6,000', '$3,000', '$4,500'],
        correct: '$5,000',
        correction: 'Closing Capital = Opening Capital + Profit - Drawings = $4,000 + $1,500 - $500 = $5,000.',
      },
    ],
  },
  History: {
    paper1: [
      {
        id: 'his-p1-1',
        prompt: 'Paper 1 · Q1: Why do historians cross-check multiple sources?',
        options: [
          'To detect bias, gaps, and inaccuracies',
          'To ignore eyewitness accounts',
          'To shorten research time only',
          'To change historical dates',
        ],
        correct: 'To detect bias, gaps, and inaccuracies',
        correction: 'Comparing sources helps verify facts and spot author bias.',
      },
    ],
    paper2: [
      {
        id: 'his-p2-1',
        prompt: 'Paper 2 · Q1: When answering an essay question on causes and effects, what makes an argument strong?',
        options: [
          'Clear thesis, specific historical evidence, and balanced analysis',
          'Listing unrelated events without explanation',
          'Writing only one sentence',
          'Avoiding any examples',
        ],
        correct: 'Clear thesis, specific historical evidence, and balanced analysis',
        correction: 'Strong Paper 2 answers link concrete evidence directly to the question asked.',
      },
    ],
  },
  Geography: {
    paper1: [
      {
        id: 'geo-p1-1',
        prompt: 'Paper 1 · Q1: Which map feature shows the ratio between map distance and ground distance?',
        options: ['Scale', 'Legend/Key', 'Contour interval', 'Grid north'],
        correct: 'Scale',
        correction: 'The scale shows how distance on the map relates to real distance on the ground.',
      },
    ],
    paper2: [
      {
        id: 'geo-p2-1',
        prompt: 'Paper 2 · Q1: What is a key sustainable practice for preventing soil erosion on slopes?',
        options: ['Contour ploughing', 'Overgrazing', 'Deforestation', 'Clearing riverbanks'],
        correct: 'Contour ploughing',
        correction: 'Ploughing along contours creates ridges that slow water runoff and hold soil.',
      },
    ],
  },
  Commerce: {
    paper1: [
      {
        id: 'com-p1-1',
        prompt: 'Paper 1 · Q1: Which branch of commerce helps move goods from producers to consumers?',
        options: ['Trade and Aids to Trade (transport, warehousing, banking, insurance)', 'Mining extraction only', 'Household budgeting only', 'Tax collection only'],
        correct: 'Trade and Aids to Trade (transport, warehousing, banking, insurance)',
        correction: 'Commerce covers trade plus aids to trade that facilitate distribution.',
      },
    ],
    paper2: [
      {
        id: 'com-p2-1',
        prompt: 'Paper 2 · Q1: Why is insurance important to a trading business?',
        options: [
          'It spreads financial risk from unexpected losses such as fire or theft',
          'It eliminates all business competition',
          'It guarantees zero operating expenses',
          'It replaces bookkeeping',
        ],
        correct: 'It spreads financial risk from unexpected losses such as fire or theft',
        correction: 'Insurance pools risk so a business can recover financially after a covered loss.',
      },
    ],
  },
  FRS: {
    paper1: [
      {
        id: 'frs-p1-1',
        prompt: 'Paper 1 · Q1: In Family and Religious Studies (FRS), what does compassion in action mean?',
        options: [
          'Showing empathy and practical care for others in need',
          'Judging others harshly',
          'Refusing to help anyone',
          'Ignoring community responsibilities',
        ],
        correct: 'Showing empathy and practical care for others in need',
        correction: 'Compassion combines caring feelings with helpful actions toward others.',
      },
    ],
    paper2: [
      {
        id: 'frs-p2-1',
        prompt: 'Paper 2 · Q1: How can family values guide young people in making responsible decisions?',
        options: [
          'By providing honesty, respect, and long-term moral principles',
          'By encouraging reckless choices',
          'By discouraging learning',
          'By removing accountability',
        ],
        correct: 'By providing honesty, respect, and long-term moral principles',
        correction: 'Core family and ethical values help young people weigh consequences wisely.',
      },
    ],
  },
  'Heritage Studies': {
    paper1: [
      {
        id: 'her-p1-1',
        prompt: 'Paper 1 · Q1: What is tangible heritage?',
        options: [
          'Physical sites, monuments, artifacts, and buildings',
          'Only spoken proverbs',
          'Only musical rhythms',
          'Unrecorded thoughts',
        ],
        correct: 'Physical sites, monuments, artifacts, and buildings',
        correction: 'Tangible heritage refers to physical cultural items and historic places.',
      },
    ],
    paper2: [
      {
        id: 'her-p2-1',
        prompt: 'Paper 2 · Q1: How does responsible citizenship support local heritage preservation?',
        options: [
          'Protecting heritage sites, respecting laws, and sharing accurate cultural knowledge',
          'Vandalizing monuments',
          'Selling off community archives without record',
          'Ignoring local history',
        ],
        correct: 'Protecting heritage sites, respecting laws, and sharing accurate cultural knowledge',
        correction: 'Active, respectful citizens help safeguard heritage for future generations.',
      },
    ],
  },
  'Extra Course': {
    paper1: [
      {
        id: 'ext-p1-1',
        prompt: 'Extra Course · Paper 1 · Q1: What is a strong study habit when revising a difficult topic?',
        options: [
          'Active recall and practicing questions without looking at answers first',
          'Passive re-reading while distracted',
          'Skipping weak topics completely',
          'Cramming without breaks',
        ],
        correct: 'Active recall and practicing questions without looking at answers first',
        correction: 'Testing yourself actively strengthens memory far better than passive reading alone.',
      },
    ],
    paper2: [
      {
        id: 'ext-p2-1',
        prompt: 'Extra Course · Paper 2 · Q1: In structured problem-solving, what should you do after finding a solution?',
        options: [
          'Verify whether the answer makes sense and check each step',
          'Erase your steps immediately',
          'Ignore units or context',
          'Assume there are no edge cases',
        ],
        correct: 'Verify whether the answer makes sense and check each step',
        correction: 'Reviewing and checking your steps catches mistakes early.',
      },
    ],
  },
};

function getRevisionPaper(subject, paperKey) {
  const entry = PAPER_SETS[subject];
  if (entry && Array.isArray(entry[paperKey])) return entry[paperKey];
  const fallback = QUIZ_BANK[subject] || QUIZ_BANK.Mathematics;
  return fallback.slice(0, 2).map((q, idx) => ({
    id: `${subject}-${paperKey}-${idx}`,
    prompt: `${paperKey === 'paper1' ? 'Paper 1' : 'Paper 2'} · Q${idx + 1}: ${q.question}`,
    options: q.options,
    correct: q.answer,
    correction: q.explanation,
  }));
}

export function RevisionTestsSection({ initialSubject = 'Accounts' }) {
  const [subject, setSubject] = useState(
    REVISION_SUBJECTS.includes(initialSubject) ? initialSubject : 'Accounts'
  );
  const [paper, setPaper] = useState('paper1'); // 'paper1' | 'paper2'
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialSubject && REVISION_SUBJECTS.includes(initialSubject)) {
      setSubject(initialSubject);
      setAnswers({});
      setSubmitted(false);
    }
  }, [initialSubject]);

  const items = useMemo(() => getRevisionPaper(subject, paper), [subject, paper]);

  const results = useMemo(() => {
    const total = items.length;
    let correctCount = 0;
    const missed = [];

    items.forEach((item) => {
      const chosen = answers[item.id];
      if (chosen === item.correct) {
        correctCount += 1;
      } else {
        missed.push({
          ...item,
          chosen: chosen || 'No answer selected',
        });
      }
    });

    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return {
      total,
      correctCount,
      pct,
      failed: pct < 50 || missed.length > 0,
      missed,
    };
  }, [items, answers]);

  const handleSelectSubject = (subj) => {
    setSubject(subj);
    setAnswers({});
    setSubmitted(false);
  };

  const handleSelectPaper = (p) => {
    setPaper(p);
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="ml-card">
      <div className="ml-kicker">REVISION TESTS · QUESTION PAPERS (NO TIMER)</div>
      <h2 className="ml-heading">Revision Tests — {subject}</h2>
      <p className="ml-subtext">
        Practice <strong>Paper 1</strong> and <strong>Paper 2</strong> question papers at your own pace, then click{' '}
        <strong>Submit Assignment</strong> to view your mark and corrections.
      </p>

      <div className="ml-chip-row">
        {REVISION_SUBJECTS.map((subj) => (
          <button
            key={subj}
            type="button"
            className={`ml-chip ${subject === subj ? 'is-active' : ''}`}
            onClick={() => handleSelectSubject(subj)}
          >
            {subj}
          </button>
        ))}
      </div>

      <div className="ml-paper-tabs">
        <button
          type="button"
          className={`ml-paper-tab ${paper === 'paper1' ? 'is-active' : ''}`}
          onClick={() => handleSelectPaper('paper1')}
        >
          Paper 1 Question Paper
        </button>
        <button
          type="button"
          className={`ml-paper-tab ${paper === 'paper2' ? 'is-active' : ''}`}
          onClick={() => handleSelectPaper('paper2')}
        >
          Paper 2 Question Paper
        </button>
      </div>

      <div className="ml-paper-questions">
        {items.map((item) => (
          <div key={item.id} className="ml-paper-question-card">
            <div className="ml-paper-prompt">{item.prompt}</div>
            <div className="ml-options-list">
              {item.options.map((opt) => {
                const isPicked = answers[item.id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`ml-option-row ${isPicked ? 'is-selected' : ''}`}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, [item.id]: opt }));
                      setSubmitted(false);
                    }}
                  >
                    <span className="ml-radio">{isPicked ? '●' : '○'}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="ml-actions-row">
        <button
          type="button"
          className="ml-primary-btn"
          onClick={() => setSubmitted(true)}
        >
          Submit Assignment
        </button>
        <button
          type="button"
          className="ml-secondary-btn"
          onClick={() => {
            setAnswers({});
            setSubmitted(false);
          }}
        >
          Clear Answers
        </button>
      </div>

      {submitted && (
        <div className={`ml-corrections-panel ${results.pct >= 50 ? 'is-pass' : 'is-fail'}`}>
          <h3>
            Assignment Submitted — Score: {results.correctCount} / {results.total} ({results.pct}%)
          </h3>
          {results.missed.length === 0 ? (
            <p>Great work! Every question on this question paper was answered correctly.</p>
          ) : (
            <div>
              <p className="ml-fail-banner">
                {results.pct < 50
                  ? 'You scored below 50%. Review the corrections below and try again:'
                  : 'Here are the corrections for the questions you missed:'}
              </p>
              <div className="ml-correction-list">
                {results.missed.map((m) => (
                  <div key={m.id} className="ml-correction-item">
                    <div className="ml-corr-q">{m.prompt}</div>
                    <div>Your answer: <strong>{m.chosen}</strong></div>
                    <div>Correct answer: <strong>{m.correct}</strong></div>
                    <div className="ml-corr-note">Correction: {m.correction}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. STUDY RESOURCES & GENERATE NOTES (CLEAN SANS-SERIF + MORE TOPICS)       */
/* -------------------------------------------------------------------------- */

const SUBJECT_NOTES_LIBRARY = {
  English: {
    'Composition & Essay Writing': [
      'Plan your structure (Introduction, 2–3 body paragraphs, Conclusion) before writing.',
      'Narrative essays need clear setting, conflict, character progression, and resolution.',
      'Descriptive essays use vivid sensory details ("show, don’t tell") rather than vague labels.',
      'Argumentative essays state a clear stance, support claims with reasons, and address counterarguments.',
    ],
    'Summary & Comprehension Skills': [
      'Read the passage carefully and underline key ideas tied directly to the prompt.',
      'Write summaries in your own words without copying long sentences verbatim.',
      'Stay strictly within the word limit and focus only on relevant facts.',
    ],
    'Grammar, Clauses & Punctuation': [
      'Ensure subject-verb agreement across singular and plural subjects.',
      'Use commas, colons, semicolons, and apostrophes accurately to avoid run-on sentences.',
    ],
  },
  Mathematics: {
    'Algebra & Linear Equations': [
      'Perform the same inverse operation on both sides of an equation to isolate the unknown.',
      'Expand brackets carefully and combine like terms before solving.',
    ],
    'Geometry, Mensuration & Angles': [
      'Angles on a straight line sum to 180°; angles around a point sum to 360°.',
      'Memorize area and volume formulas and always include correct units (cm², cm³).',
    ],
    'Fractions, Ratios, Percentages & Proportion': [
      'Convert percentages to decimals or fractions when calculating increases, decreases, or discounts.',
      'Keep units consistent when simplifying ratios or solving direct/inverse proportion.',
    ],
  },
  Shona: {
    'Zvidavado neMadimikira (Idioms & Figurative Speech)': [
      'Dzidza revo yechadenga yetsumo nemadimikira musingangotori mazwi sezvakaita.',
      'Shandisa tsumo dzakakodzera kupfumisa rondedzero kana hurukuro.',
    ],
    'Mavara, Nzvovera neZvivakashure': [
      'Ongorora musiyano pakati pezvinoitika muuzhinji nemuushoma.',
      'Nyora zviperengo zvakajeka uye tevedza mutauro wakakodzera.',
    ],
  },
  'Combined Science': {
    'Plant Physiology & Photosynthesis': [
      'Word equation: Carbon dioxide + Water -> (light & chlorophyll) -> Glucose + Oxygen.',
      'Stomata allow gas exchange while leaves capture light energy.',
    ],
    'Electricity & Circuits': [
      'Current (Amps), Potential Difference/Voltage (Volts), and Resistance (Ohms) relate via V = IR.',
      'In a series circuit, there is a single path for current; parallel branches share voltage.',
    ],
    'Biology: Human Body Systems': [
      'Digestive system: process of ingestion, digestion, absorption and elimination.',
      'Respiratory system: gas exchange through lungs and blood circulation.',
    ],
    'Chemistry: Matter & Change': [
      'Understand states of matter (solid, liquid, gas) and phase changes.',
      'Law of conservation of mass in chemical reactions.',
    ],
  },
  Geography: {
    'Double Entry & Books of Prime Entry': [
      'Every transaction affects at least two accounts: Debit the receiver / asset in, Credit the giver / value out.',
      'Use Sales Journal, Purchases Journal, Returns Journals, and Cash Book before posting to ledgers.',
    ],
    'Trial Balance, Trading & Profit/Loss Statements': [
      'Gross Profit = Net Sales - Cost of Sales.',
      'Net Profit = Gross Profit + Other Income - Expenses.',
    ],
  },
  History: {
    'Source Evaluation & Historical Evidence': [
      'Identify origin, purpose, audience, and potential bias in every source.',
      'Support claims with specific dates, events, and cause-and-effect links.',
    ],
    'Governance, Resistance & Social Change': [
      'Compare short-term triggers with long-term economic, social, and political factors.',
    ],
  },
  Geography: {
    'Map Work, Contours & Fieldwork': [
      'Close contour lines indicate steep slopes; widely spaced lines indicate gentle slopes.',
      'Always state direction, grid references, and map evidence clearly.',
    ],
    'Weather, Climate & Sustainable Land Use': [
      'Understand how relief, latitude, and moisture affect rainfall and temperature.',
      'Apply conservation measures such as contour ridging and afforestation.',
    ],
  },
  Commerce: {
    'Production, Home Trade & International Trade': [
      'Distinguish primary, secondary, and tertiary production.',
      'Understand wholesale vs. retail roles, credit terms, and balance of trade.',
    ],
    'Banking, Insurance & Transport': [
      'Compare modes of transport by cost, speed, security, and load type.',
      'Review indemnity, insurable interest, and risk reduction in commerce.',
    ],
  },
  FRS: {
    'Financial Recording': [
      'Record business transactions using double-entry bookkeeping.',
      'Use daybooks, ledgers and the accounting equation to maintain records.',
    ],
    'Final Accounts': [
      'Prepare income statements and statements of financial position.',
      'Calculate gross profit, net profit and depreciation.',
    ],
    'Business Finance': [
      'Sources of finance for small businesses: loans, equity, overdrafts.',
      'Understanding interest rates and repayment terms.',
    ],
  },
  'Heritage Studies': {
    'National Identity, Symbols & Indigenous Knowledge': [
      'Study traditional governance, customs, arts, and community problem-solving practices.',
    ],
    'Heritage Conservation & Civic Responsibility': [
      'Explain how protecting cultural and natural heritage benefits present and future citizens.',
    ],
    'Cultural Heritage': [
      'Identify tangible and intangible heritage sites in Zimbabwe.',
      ' significance of Great Zimbabwe, Khami and other stone cities.',
    ],
    'Community & Identity': [
      'Role of culture in shaping community identity and values.',
      'Preservation of traditions and oral history for future generations.',
    ],
    'Conservation & Tourism': [
      'Impact of tourism on heritage sites and local communities.',
      'Sustainable practices for protecting cultural resources.',
    ],
  },
  Agriculture: {
    'Crop Production': [
      'Major crops in Zimbabwe: maize, tobacco, cotton, small grains.',
      'Planting seasons, crop rotation and soil conservation methods.',
    ],
    'Livestock & Animal Husbandry': [
      'Common livestock: cattle, goats, poultry and piggery.',
      'Feeding, housing and health management of animals.',
    ],
    'Agricultural Economics': [
      'Market forces affecting farm produce prices.',
      'Role of agriculture in national food security and economy.',
    ],
  },
  'Extra Course': {
    'Exam Technique, Note-Making & Time Management': [
      'Use active recall, spaced revision, and past-paper timed practice.',
      'Break multi-step problems into clear sub-goals and double-check units.',
    ],
    'Digital Skills & Logical Problem Solving': [
      'Define the input, process, and expected output before writing code or solving a workflow.',
    ],
  },
};

export function StudyResourcesNotes({ initialSubject = 'English' }) {
  const [subject, setSubject] = useState(
    ALL_SUBJECTS.includes(initialSubject) ? initialSubject : 'English'
  );
  const topicsObj = SUBJECT_NOTES_LIBRARY[subject] || SUBJECT_NOTES_LIBRARY.English;
  const topicNames = Object.keys(topicsObj);

  const [selectedTopic, setSelectedTopic] = useState(topicNames[0]);
  const [generatedNotes, setGeneratedNotes] = useState(null);

  useEffect(() => {
    const nextLib = SUBJECT_NOTES_LIBRARY[subject] || SUBJECT_NOTES_LIBRARY.English;
    const keys = Object.keys(nextLib);
    setSelectedTopic(keys[0]);
    setGeneratedNotes({
      subject,
      topic: keys[0],
      points: nextLib[keys[0]],
    });
  }, [subject]);

  const handleGenerateNotes = () => {
    const points = topicsObj[selectedTopic] || [];
    setGeneratedNotes({
      subject,
      topic: selectedTopic,
      points,
    });
  };

  return (
    <div className="ml-card ml-notes-card">
      <div className="ml-kicker">STUDY RESOURCES</div>
      <h2 className="ml-heading">Study Resources &amp; Notes</h2>
      <p className="ml-subtext">
        Select a subject and topic, then click <strong>Generate Notes</strong> to read clean, well-structured revision notes.
      </p>

      <div className="ml-chip-row">
        {ALL_SUBJECTS.map((subj) => (
          <button
            key={subj}
            type="button"
            className={`ml-chip ${subject === subj ? 'is-active' : ''}`}
            onClick={() => setSubject(subj)}
          >
            {subj}
          </button>
        ))}
      </div>

      <div className="ml-topic-row">
        <label htmlFor="ml-topic-select" className="ml-topic-label">
          Choose Topic ({subject}):
        </label>
        <select
          id="ml-topic-select"
          className="ml-topic-select"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          {topicNames.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button type="button" className="ml-primary-btn" onClick={handleGenerateNotes}>
          Generate Notes
        </button>
      </div>

      {generatedNotes && (
        <article className="ml-notes-document">
          <div className="ml-notes-doc-header">
            <span className="ml-notes-tag">{generatedNotes.subject}</span>
            <h3>{generatedNotes.topic}</h3>
          </div>
          <ul className="ml-notes-bullets">
            {generatedNotes.points.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        </article>
      )}
    </div>
  );
}