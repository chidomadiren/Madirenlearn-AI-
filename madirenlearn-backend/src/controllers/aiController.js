require('dotenv').config({ quiet: true });
const { GoogleGenAI } = require('@google/genai');

const MODEL = (process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite').trim();

const FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || 'gemini-2.5-flash-lite,gemini-3.8-flash')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 20000; // per Gemini call
const TOTAL_DEADLINE_MS = Number(process.env.GEMINI_DEADLINE_MS) || 45000; // whole request

let client = null;

const getClient = () => {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return null;
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isTimeout = (error) =>
  /timeout|timed out|aborted|abort/i.test(String(error?.message || '')) ||
  /abort|timeout/i.test(String(error?.name || ''));

const describeGeminiError = (error) => {
  const status = Number(error?.status || error?.code) || 0;
  const message = String(error?.message || '');

  if (/api key not valid|API_KEY_INVALID|invalid api key/i.test(message) || status === 401 || status === 403) {
    return {
      code: 502,
      error: 'Gemini rejected the API key. Create a new key in Google AI Studio, put it in the backend .env, and restart the backend.',
    };
  }
  if (isTimeout(error)) {
    return { code: 504, error: 'The AI took too long to answer. Please try again in a moment.' };
  }
  if (status === 503 || /high demand|UNAVAILABLE|overloaded/i.test(message)) {
    return { code: 503, error: 'The AI is very busy right now. Please try again in a few seconds.' };
  }
  if (status === 429 || /quota|rate limit|RESOURCE_EXHAUSTED/i.test(message)) {
    return { code: 429, error: 'The AI service is busy or the free quota is used up. Please try again in a minute.' };
  }
  if (status === 404 || /not found|no longer available/i.test(message)) {
    return {
      code: 502,
      error: `The Gemini model "${MODEL}" is not available. Set GEMINI_MODEL in .env to a model from the model list.`,
    };
  }
  if (status === 400) {
    return { code: 502, error: 'Gemini rejected the request. Check the backend terminal for details.' };
  }
  return { code: 500, error: 'Could not reach the AI service.' };
};

const askGemini = async (prompt) => {
  const ai = getClient();
  if (!ai) {
    const err = new Error('MISSING_KEY');
    err.missingKey = true;
    throw err;
  }

  const models = [...new Set([MODEL, ...FALLBACK_MODELS])];
  const startedAt = Date.now();
  let lastError;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      if (Date.now() - startedAt > TOTAL_DEADLINE_MS) {
        throw lastError || new Error('Request timed out');
      }

      const t0 = Date.now();
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { httpOptions: { timeout: REQUEST_TIMEOUT_MS } },
        });
        console.log(`Gemini ${model} answered in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
        return (response.text || '').trim();
      } catch (error) {
        lastError = error;
        const status = Number(error?.status || error?.code) || 0;
        console.warn(
          `Gemini ${model} attempt ${attempt} failed after ${((Date.now() - t0) / 1000).toFixed(1)}s (${status || error?.name || 'no status'}):`,
          String(error?.message || '').slice(0, 120)
        );

        if (status === 503 || status === 429 || status === 500) {
          if (attempt < 2) await sleep(1000);
          continue; // retry once, then try the next model
        }
        if (status === 404 || isTimeout(error) || !status) break; // go straight to the next model
        throw error; // bad key or bad request: retrying will not help
      }
    }
  }

  throw lastError;
};

const handleError = (label, error, res) => {
  if (error?.missingKey) {
    return res.status(503).json({
      error: 'The AI is not configured. Add GEMINI_API_KEY to the backend .env file and restart the backend.',
    });
  }
  console.error(`${label}:`, error?.status || '', error?.message || error, error?.cause || '');
  const { code, error: message } = describeGeminiError(error);
  return res.status(code).json({ error: message });
};

const getAiTutorResponse = async (req, res) => {
  try {
    const { studentQuery, subject } = req.body || {};

    if (!studentQuery || !String(studentQuery).trim()) {
      return res.status(400).json({ error: 'Student query is required.' });
    }

    const prompt = `You are MadirenLearn AI, a careful, friendly tutor for Zimbabwean high school students.
The selected study subject is ${subject || 'General learning'}.
Learner question: "${studentQuery}"

Instructions:
- Give a direct, useful answer with clear reasoning and a suitable example when helpful.
- Be accurate and age-appropriate.
- For Shona language or schoolwork, keep the answer in Shona unless requested otherwise.
- Use readable steps for calculations and concise language.
- Write in plain text only: no Markdown symbols, tables or LaTeX. Use simple numbered steps and write equations in plain text, for example: x^2 + 3x = 10.
- Keep the answer under 250 words unless the learner asks for more.`;

    const tutorResponse = await askGemini(prompt);

    if (!tutorResponse) {
      return res.status(502).json({ error: 'The AI service returned an empty answer. Please try asking again.' });
    }

    return res.json({ success: true, tutorResponse });
  } catch (error) {
    return handleError('Tutor controller error', error, res);
  }
};

const generateStudyNotes = async (req, res) => {
  try {
    const subject = String(req.body?.subject || '').trim();
    const topic = String(req.body?.topic || '').trim();
    const syllabus = String(req.body?.syllabus || '').trim();

    if (!subject || !topic) {
      return res.status(400).json({ error: 'Select a subject and topic before generating notes.' });
    }

    const prompt = `Create study notes for a Zimbabwean secondary-school learner.

Subject: ${subject}
Topic: ${topic}
Syllabus: ${syllabus || 'Standard coverage'}

Instructions:
- Keep it clear, structured with short headings, and under 600 words.
- Write in PLAIN TEXT only. Do not use Markdown symbols (no #, **, *, |, tables or ---) and no LaTeX or $ signs.
- Put each heading on its own line in CAPITAL LETTERS, and start list items with a simple "- ".
- Write chemical equations in plain text, for example: 6CO2 + 6H2O -> C6H12O6 + 6O2.
- Make it suitable for a Zimbabwean high school learner.`;

    const notes = await askGemini(prompt);

    if (!notes) {
      return res.status(502).json({ error: 'The AI service returned empty notes.' });
    }

    return res.json({ success: true, subject, topic, notes });
  } catch (error) {
    return handleError('Study notes controller error', error, res);
  }
};

module.exports = { getAiTutorResponse, generateStudyNotes };