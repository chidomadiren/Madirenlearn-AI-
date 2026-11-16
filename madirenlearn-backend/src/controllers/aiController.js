const { GoogleGenAI } = require('@google/genai');

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getAiTutorResponse = async (req, res) => {
  try {
    const { studentQuery, subject } = req.body;

    if (!studentQuery) {
      return res.status(400).json({ error: 'Student query is required.' });
    }

    if (!genai.apiKey) {
      return res.status(503).json({
        error: 'The AI tutor is not configured. Add a valid GEMINI_API_KEY to the backend .env file and restart the backend.',
      });
    }

    const prompt = `You are MadirenLearn AI, a careful, friendly tutor for Zimbabwean high school students.
The selected study subject is ${subject || 'General learning'}. 
Learner question: "${studentQuery}"

Instructions:
- Give a direct, useful answer with clear reasoning and a suitable example when helpful.
- Be accurate and age-appropriate.
- For Shona language or schoolwork, keep the answer in Shona unless requested otherwise.
- Use readable steps for calculations and concise language.`;

    const response = await genai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{
        role: 'user',
        parts: [{ text: prompt }],
      }],
    });

    const tutorResponse = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!tutorResponse) {
      return res.status(502).json({ error: 'The AI service returned an empty answer. Please try asking again.' });
    }

    res.json({
      success: true,
      tutorResponse: tutorResponse.trim(),
    });
  } catch (error) {
    console.error('Tutor controller error:', error);
    if (error?.response?.data) {
      return res.status(502).json({ 
        error: error.response.data.error?.message || 'Gemini API rejected the request. Check your API key.' 
      });
    }
    return res.status(500).json({ error: 'Could not reach the AI tutor service.' });
  }
};

const generateStudyNotes = async (req, res) => {
  try {
    const subject = String(req.body.subject || '').trim();
    const topic = String(req.body.topic || '').trim();
    const syllabus = String(req.body.syllabus || '').trim();

    if (!subject || !topic) {
      return res.status(400).json({ error: 'Select a subject and topic before generating notes.' });
    }

    if (!genai.apiKey) {
      return res.status(503).json({
        error: 'The AI service is not configured. Add a valid GEMINI_API_KEY to the backend .env file and restart the backend.',
      });
    }

    const prompt = `Create study notes for a Zimbabwean secondary-school learner.

Subject: ${subject}
Topic: ${topic}
Syllabus: ${syllabus || 'Standard coverage'}

Instructions:
- Keep it clear, structured with headings, and under 800 words.
- Use readable sections and bullet points where appropriate.
- Make it suitable for a Zimbabwean high school learner.`; // <-- Fixed to semicolon

    const response = await genai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{
        role: 'user',
        parts: [{ text: prompt }],
      }],
    });

    const notes = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!notes) {
      return res.status(502).json({ error: 'The AI service returned empty notes.' });
    }

    return res.json({ success: true, subject, topic, notes });
  } catch (error) {
    console.error('Study notes controller error:', error);
    if (error?.response?.data) {
      return res.status(502).json({ 
        error: error.response.data.error?.message || 'Gemini API rejected the request. Check your API key.' 
      });
    }
    return res.status(500).json({ error: 'Could not generate study notes.' });
  }
};

module.exports = { getAiTutorResponse, generateStudyNotes };