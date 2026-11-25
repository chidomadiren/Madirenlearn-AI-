const SEEN_STORAGE_KEY = 'madirenlearn-seen-quiz-ids';

/**
 * Calculates total timer seconds based on how many questions are in the quiz.
 * Example: 90s per question (min 60s). Adjust SECONDS_PER_QUESTION to taste.
 */
export function calculateQuizDurationSeconds(
  questionCount,
  secondsPerQuestion = 90,
  minSeconds = 60
) {
  const count = Math.max(0, Number(questionCount) || 0);
  if (count === 0) return 0;
  return Math.max(minSeconds, count * secondsPerQuestion);
}

export function formatTimeLeft(totalSeconds) {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function readSeenMap() {
  try {
    return JSON.parse(localStorage.getItem(SEEN_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeSeenMap(map) {
  try {
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
}

export function getSeenQuestionIds(subject) {
  const map = readSeenMap();
  const key = (subject || 'general').toLowerCase();
  return Array.isArray(map[key]) ? map[key] : [];
}

export function markQuestionsAsSeen(subject, questionIds) {
  if (!Array.isArray(questionIds) || questionIds.length === 0) return;
  const map = readSeenMap();
  const key = (subject || 'general').toLowerCase();
  const existing = new Set(Array.isArray(map[key]) ? map[key] : []);
  questionIds.forEach((id) => {
    if (id !== undefined && id !== null) existing.add(String(id));
  });
  map[key] = [...existing];
  writeSeenMap(map);
}

export function clearSeenQuestions(subject) {
  const map = readSeenMap();
  const key = (subject || 'general').toLowerCase();
  delete map[key];
  writeSeenMap(map);
}

/**
 * Picks `desiredCount` questions while prioritizing unseen IDs for that subject.
 * If fewer unseen questions remain than `desiredCount`, tops up from remaining
 * questions and resets seen history when the full pool has been exhausted.
 */
export function selectFreshQuestions(allQuestions, { subject, desiredCount = 10 }) {
  if (!Array.isArray(allQuestions) || allQuestions.length === 0) return [];

  const normalized = allQuestions.map((q, index) => {
    const id = String(q.id ?? q._id ?? `${subject}-${index}-${q.question || q.prompt || ''}`);
    const rawOptions = Array.isArray(q.options) ? q.options : [];
    const shuffledOptions = shuffleArray(rawOptions);
    return {
      ...q,
      id,
      options: shuffledOptions,
    };
  });

  const seenSet = new Set(getSeenQuestionIds(subject));
  const unseen = shuffleArray(normalized.filter((q) => !seenSet.has(q.id)));
  const seen = shuffleArray(normalized.filter((q) => seenSet.has(q.id)));

  const targetCount = Math.min(desiredCount, normalized.length);
  let picked = unseen.slice(0, targetCount);

  if (picked.length < targetCount) {
    const needed = targetCount - picked.length;
    picked = [...picked, ...seen.slice(0, needed)];
    // Full pool cycled—reset seen IDs and record just the newly picked batch
    clearSeenQuestions(subject);
  }

  markQuestionsAsSeen(
    subject,
    picked.map((q) => q.id)
  );

  return shuffleArray(picked);
}
