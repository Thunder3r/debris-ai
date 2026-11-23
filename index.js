import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('dist'));

const port = process.env.PORT || 3001;
const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const DEBRIS_PERSONALITY = `
You are DEBRIS, a helpful personal AI assistant.
Personality: confident, clever, friendly, calm, curious, and practical.
Speak naturally and adapt to the user's language (including Hinglish).
Be honest about uncertainty and never pretend to have performed actions you cannot perform.
Explain things clearly, especially for beginners. Keep answers useful and avoid unnecessary fluff.
Do not claim to be ChatGPT or a human. Your name is DEBRIS.
`;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, configured: Boolean(client), name: 'DEBRIS AI' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    if (!messages.length) return res.status(400).json({ error: 'Send a message first.' });
    if (!client) {
      return res.status(503).json({
        error: 'DEBRIS demo mode is active. Add OPENAI_API_KEY to your server .env file to enable live AI replies.'
      });
    }
    const safeMessages = messages.slice(-20).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 12000)
    }));
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions: DEBRIS_PERSONALITY,
      input: safeMessages
    });
    res.json({ reply: response.output_text || 'I could not generate a reply. Try again.' });
  } catch (error) {
    console.error('DEBRIS API error:', error?.message || error);
    res.status(500).json({ error: 'DEBRIS had a connection issue. Please try again.' });
  }
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile('index.html', { root: 'dist' }, (err) => { if (err) res.status(404).send('Build the app with npm run build first.'); });
});

app.listen(port, () => console.log(`DEBRIS server running on http://localhost:${port}`));