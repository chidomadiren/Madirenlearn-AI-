const { GoogleGenAI } = require('@google/genai');

const getGeminiApiKey = () => String(process.env.GEMINI_API_KEY || '')
  .trim()
  .replace(/^(['"])(.*)\1$/s, '$2')
  .trim();

const getGeminiErrorResponse = (error, taskName) => {
  const rawStatus = error.status ?? error.statusCode ?? error.response?.status ?? error.error?.code;
  const status = Number(rawStatus);
  const errorCode = String(error.code || error.error?.status || '').toUpperCase();
  const message = String(error.message || '').toLowerCase();

  // Log provider diagnostics without printing request headers or credentials.
  const bodyPreview =
    error.body !== undefined ? String(error.body).slice(0, 1000) : undefined;
  console.error(`${taskName} Gemini error`, {
    status: Number.isFinite(status) && status ? status : undefined,
    code: errorCode || undefined,
    message: error.message,
    ...(bodyPreview ? { body: bodyPreview } : {}),
  });

  if (status === 401 || status === 403 || /unauthorized|permission denied|invalid api key|api key not valid|authentication/.test(message)) {
    return {
      status: 502,
      error: 'Gemini rejected the backend API key. Replace GEMINI_API_KEY with a valid key from Google AI Studio, enable the Gemini API for its project, and restart the backend.',
    };
  }
  if (status === 429 || errorCode.includes('RESOURCE_EXHAUSTED') || /quota|rate.?limit|resource_exhausted/.test(message)) {
    return { status: 503, error: 'The Gemini API quota or rate limit has been reached. Check the project quota or try again later.' };
  }
  if (status === 404 || /model.*not found|not found.*model|unsupported model/.test(message)) {
    return { status: 502, error: 'The configured Gemini model is unavailable to this API key. Check the model name and API access.' };
  }
  if (/fetch failed|enotfound|econnrefused|etimedout|timeout|network|socket hang up|eai_again/.test(message)) {
    return { status: 503, error: 'The backend cannot reach Google Gemini. Check the server internet connection, firewall/proxy settings, and try again.' };
  }
  if (status === 400 || /invalid argument|bad request/.test(message)) {
    return { status: 502, error: 'Gemini rejected the request format. Check the backend prompt/model configuration and try a shorter question.' };
  }
  return {
    status: 502,
    error: `Gemini could not complete the ${taskName.toLowerCase()} request${Number.isFinite(status) && status ? ` (HTTP ${status})` : ''}. Check the backend terminal for the provider error details.`,
  };
};

const getAiTutorResponse = async (req, res) => {
  try {
    const { studentQuery, subject } = req.body;

    if (!studentQuery) {
      return res.status(400).json({ error: 'Student query is required.' });
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(503).json({
        error: 'The AI tutor is not configured. Add a valid GEMINI_API_KEY to the backend .env file and restart the backend.',
      });
    }

    const prompt = `You are MadirenLearn AI, a careful, friendly tutor for students.
    The selected study subject is ${subject || 'General learning'}, but the learner may ask about any topic. Answer the actual question even when it is outside the selected subject.
    Learner question: "${studentQuery}"

    Instructions:
    - Give a direct, useful answer with clear reasoning and a suitable example when helpful. Do not withhold the answer just to ask Socratic questions.
    - If the request is vague or could mean several things, briefly explain what is unclear and ask one specific clarifying question instead of guessing.
    - Be accurate and age-appropriate. Never invent facts; say when you are uncertain and suggest how to verify important information.
    - For Shona language or schoolwork, keep the answer in Shona unless the learner asks for translation or explanation in another language.
    - Use readable steps for calculations and concise language for simple questions.`;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (!response.text?.trim()) {
      return res.status(502).json({ error: 'The AI service returned an empty answer. Please try asking again.' });
    }

    res.json({
      success: true,
      tutorResponse: response.text,
    });
  } catch (error) {
    const failure = getGeminiErrorResponse(error, 'Tutor');
    return res.status(failure.status).json({ error: failure.error });
  }
};

const generateStudyNotes = async (req, res) => {
  try {
    const subject = String(req.body.subject || '').trim().slice(0, 100);
    const topic = String(req.body.topic || '').trim().slice(0, 180);
    const syllabus = String(req.body.syllabus || '').trim().slice(0, 700);

    if (!subject || !topic) {
      return res.status(400).json({ error: 'Select a subject and topic before generating notes.' });
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(503).json({ error: 'AI notes are not configured. Add a valid GEMINI_API_KEY to the backend .env file and restart the backend.' });
    }

    const prompt = `Create accurate, student-friendly study notes for a Zimbabwean secondary-school learner.\nSubject: ${subject}\nTopic: ${topic}\nSyllabus coverage provided by the app: ${syllabus || 'Use standard secondary-school coverage.'}\n\nRequirements:\n- Explain the topic from basics to useful detail.\n- Organize with a short overview, key ideas, worked/example explanation where suitable, common mistakes, and a short recap.\n- Keep Shona-language subject notes in Shona.\n- Do not invent curriculum-specific claims. If syllabus details vary by exam board, clearly say to verify with the learner’s teacher or syllabus.\n- Do not include an answer key or claim these notes are official.\n- Use plain text headings and readable bullets; keep it under about 900 words.`;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    if (!response.text?.trim()) return res.status(502).json({ error: 'The AI service returned empty notes. Please try again.' });

    return res.json({ success: true, subject, topic, notes: response.text.trim() });
  } catch (error) {
    const failure = getGeminiErrorResponse(error, 'Study notes');
    return res.status(failure.status).json({ error: failure.error });
  }
};

module.exports = { getAiTutorResponse, generateStudyNotes };