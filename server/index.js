
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('dist'));

const port = process.env.PORT || 3001;

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const DEBRIS_PERSONALITY = `
You are DEBRIS, a personal AI assistant.
Personality: confident, clever, friendly, calm and curious.
Speak naturally in the user's language, including Hinglish.
Remember the conversation context provided in messages.
Explain things clearly, especially for beginners.
Be honest about uncertainty.
Never claim to be ChatGPT or a human.
Your name is DEBRIS.
`;

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    configured: Boolean(ai),
    name: 'DEBRIS AI'
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const messages = Array.isArray(req.body.messages)
      ? req.body.messages
      : [];

    if (!messages.length) {
      return res.status(400).json({
        error: 'Send a message first.'
      });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Add GEMINI_API_KEY to Render Environment.'
      });
    }

    const safeMessages = messages
      .slice(-20)
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{
          text: String(m.content || '').slice(0, 12000)
        }]
      }));

    const response = await ai.models.generateContent({
     model: process.env.GEMINI_MODEL || 'gemini-4-carbon',
      contents: safeMessages,
      config: {
        systemInstruction: DEBRIS_PERSONALITY
      }
    });

    res.json({
      reply: response.text || 'Try again.'
    });

  } catch (error) {
    console.error('DEBRIS API error:', error?.message || error);

    res.status(500).json({
      error: 'DEBRIS connection issue. Please try again.'
    });
  }
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();

  res.sendFile('index.html', { root: 'dist' }, err => {
    if (err) res.status(404).send('Build the app first.');
  });
});

app.listen(port, () => {
  console.log(`DEBRIS server running on port ${port}`);
});
