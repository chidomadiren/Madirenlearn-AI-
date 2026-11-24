const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const TUTOR_SYSTEM_INSTRUCTION = `
You are MadirenLearn AI, a clear, structured Socratic tutor for students across all subjects and extra courses.

RULES:
1. ANSWER CLEAR QUESTIONS:
   - Answer clear questions across all school subjects, extra courses, and study topics helpfully and accurately.
2. VAGUE INPUTS ONLY:
   - Only when a student's message is genuinely vague or unclear (such as "help me", "explain this", "what about that?", or an unclear fragment with no context), briefly ask 1–2 short clarifying questions so they can specify what they need.
   - If the message is a clear question (such as "2+3" or "what is a noun"), answer it directly right away.
3. LANGUAGE & TRANSLATION RULES (ENGLISH & SHONA):
   - Respect the requested language mode ("english", "shona", or "both").
   - If the student writes in Shona or asks to translate/explain in Shona, respond in Shona (and include brief English equivalents when helpful).
   - If the language mode is "english" and the student writes in English without asking for Shona, respond clearly in English.
   - If the language mode is "both", provide clear guidance in both English and Shona.
4. CHATGPT-STYLE FORMATTING:
   - Use clean headings, short paragraphs, and bullet points with bold key terms so responses are easy to read.
   - End with 1 short guiding question.
`.trim();

function extractQuestion(body = {}, depth = 0) {
  if (!body || depth > 4) return '';
  if (typeof body === 'string') {
    const trimmed = body.trim();
    const skip = new Set([
      'user',
      'assistant',
      'model',
      'online',
      'ai · socratic tutor',
      'the tutor service returned an empty answer. please try again.',
    ]);
    return trimmed && !skip.has(trimmed.toLowerCase()) ? trimmed : '';
  }
  if (Array.isArray(body)) {
    for (let i = body.length - 1; i >= 0; i--) {
      const found = extractQuestion(body[i], depth + 1);
      if (found) return found;
    }
    return '';
  }
  if (typeof body === 'object') {
    const keys = [
      'question',
      'message',
      'prompt',
      'text',
      'input',
      'query',
      'content',
      'msg',
      'q',
      'data',
      'payload',
    ];
    for (const k of keys) {
      if (k in body) {
        const found = extractQuestion(body[k], depth + 1);
        if (found) return found;
      }
    }
    for (const val of Object.values(body)) {
      if (typeof val === 'string' && val.trim()) {
        return val.trim();
      }
    }
  }
  return '';
}

function extractGeminiText(response) {
  if (!response) return '';
  if (typeof response.text === 'string' && response.text.trim()) {
    return response.text.trim();
  }
  const parts = response?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    const joined = parts
      .map((p) => (typeof p?.text === 'string' ? p.text : ''))
      .join('\n')
      .trim();
    if (joined) return joined;
  }
  return '';
}

async function handleTutorQuestion(req, res) {
  const body = req.body || {};
  const subject = String(
    body.subject || body.course || body.topic || 'General'
  ).trim();
  const languageMode = String(
    body.language || body.preferredLanguage || 'english'
  )
    .trim()
    .toLowerCase();
  const rawQuestion = extractQuestion(body);

  if (!rawQuestion) {
    const msg =
      'Your message looks empty or unclear—what topic or question would you like help with?';
    return res.status(400).json({
      error: msg,
      tutorResponse: msg,
      reply: msg,
      answer: msg,
      message: msg,
      response: msg,
    });
  }

  try {
    const history = Array.isArray(body.history)
      ? body.history
      : Array.isArray(body.messages)
        ? body.messages
        : [];

    const contents = history
      .filter((m) => {
        const txt = m && (m.content ?? m.text ?? m.message);
        return (
          m &&
          typeof txt === 'string' &&
          txt.trim().length > 0 &&
          !txt.trim().includes('returned an empty answer')
        );
      })
      .slice(-6)
      .map((m) => {
        const isAssistant =
          m.role === 'assistant' ||
          m.role === 'model' ||
          m.sender === 'ai' ||
          m.sender === 'assistant' ||
          m.from === 'ai';
        return {
          role: isAssistant ? 'model' : 'user',
          parts: [{ text: String(m.content ?? m.text ?? m.message).trim() }],
        };
      });

    const last = contents[contents.length - 1];
    if (!last || last.role !== 'user' || last.parts?.[0]?.text !== rawQuestion) {
      contents.push({
        role: 'user',
        parts: [{ text: rawQuestion }],
      });
    }

    const geminiResponse = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: `${TUTOR_SYSTEM_INSTRUCTION}\nSelected Subject / Course: ${subject}.\nPreferred Language Mode: ${languageMode}.`,
        temperature: 0.35,
      },
    });

    const text =
      extractGeminiText(geminiResponse) ||
      'Could you share a little more detail about what you would like to work on?';

    return res.json({
      tutorResponse: text,
      reply: text,
      answer: text,
      message: text,
      response: text,
    });
  } catch (err) {
    console.error('Tutor route error:', err?.message || err);
    const fallbackError =
      'I had trouble connecting to the AI tutor service right now. Please try again.';
    return res.status(500).json({
      error: fallbackError,
      tutorResponse: fallbackError,
      reply: fallbackError,
      answer: fallbackError,
      message: fallbackError,
      response: fallbackError,
    });
  }
}

router.post('/ask', handleTutorQuestion);
router.post('/', handleTutorQuestion);

module.exports = router;