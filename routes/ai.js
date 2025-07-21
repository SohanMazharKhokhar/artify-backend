const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE);

// POST /api/ai/design-steps
router.post('/design-steps', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat();
    const result = await chat.sendMessage(`Provide exactly 5 steps to create a "${prompt}" design.`);
    const response = await result.response;
    const text = response.text();

    const steps = text
      .split('\n')
      .map(l => l.trim())
      .filter(l => /^\d+\./.test(l))
      .map(l => l.replace(/^\d+\.\s*/, ''));

    res.json({ steps, imageUrl: '' }); // Image generation optional
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'AI generation failed.' });
  }
});

module.exports = router;
