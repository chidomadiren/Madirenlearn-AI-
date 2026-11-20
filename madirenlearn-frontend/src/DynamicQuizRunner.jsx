import { useEffect, useState } from 'react';
import {
  calculateQuizDurationSeconds,
  formatTimeLeft,
  selectFreshQuestions,
  getSeenQuestionIds,
} from './quizUtils';
import { API_BASE, apiFetch } from './api';

export function DynamicQuizRunner({ subject = 'Shona', desiredCount = 10, onExit }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const loadNewQuiz = async () => {
    setLoading(true);
    setFinished(false);
    setCurrentIndex(0);
    setSelectedOption(null);

    const seenIds = getSeenQuestionIds(subject);

    try {
      const params = new URLSearchParams({
        subject,
        count: String(desiredCount),
        seed: String(Date.now()),
        excludeIds: seenIds.join(','),
      });

      const res = await apiFetch(`${API_BASE}/quizzes?${params.toString()}`);
      const data = await res.json().catch(() => ({}));
      const rawList = Array.isArray(data) ? data : data.questions || [];

      const fresh = selectFreshQuestions(rawList, { subject, desiredCount });
      setQuestions(fresh);
      setSecondsLeft(calculateQuizDurationSeconds(fresh.length));
    } catch {
      setQuestions([]);
      setSecondsLeft(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, desiredCount]);

  useEffect(() => {
    if (loading || finished || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, finished, secondsLeft]);

  if (loading) {
    return <div className="quiz-card">Preparing fresh {subject} questions…</div>;
  }

  if (!questions.length) {
    return (
      <div className="quiz-card">
        <p>No questions available for {subject} right now.</p>
        <button type="button" onClick={onExit}>Exit Quiz</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <section className="quiz-card">
      <div className="quiz-header-bar">
        <button type="button" className="secondary-btn" onClick={onExit}>
          Exit Quiz
        </button>
        <h2>Quiz: {subject}</h2>
        <div className="quiz-timer-pill">
          Time Left: <strong>{formatTimeLeft(secondsLeft)}</strong>
        </div>
      </div>

      <p className="quiz-progress">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <h3>{currentQuestion.question || currentQuestion.prompt}</h3>

      <div className="quiz-options-column">
        {currentQuestion.options.map((opt, idx) => {
          const label = typeof opt === 'string' ? opt : opt.label || opt.text;
          const value = typeof opt === 'string' ? opt : opt.value ?? label;
          return (
            <label
              key={`${currentQuestion.id}-opt-${idx}`}
              className={`quiz-option-row ${selectedOption === value ? 'is-selected' : ''}`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                checked={selectedOption === value}
                onChange={() => setSelectedOption(value)}
              />
              <span>{label}</span>
            </label>
          );
        })}
      </div>

      <div className="quiz-actions-row">
        {currentIndex + 1 < questions.length ? (
          <button
            type="button"
            className="primary-btn"
            disabled={selectedOption === null}
            onClick={() => {
              setCurrentIndex((i) => i + 1);
              setSelectedOption(null);
            }}
          >
            Next Question
          </button>
        ) : (
          <button
            type="button"
            className="primary-btn"
            disabled={selectedOption === null}
            onClick={() => setFinished(true)}
          >
            Finish Quiz
          </button>
        )}

        <button type="button" className="secondary-btn" onClick={loadNewQuiz}>
          New Set of Questions
        </button>
      </div>
    </section>
  );
}