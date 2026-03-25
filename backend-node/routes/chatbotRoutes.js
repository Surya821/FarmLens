const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `
You are the FarmLens AI Assistant, a polite and professional expert in cattle health, breeds, and farming.
Our platform, FarmLens, offers:
1. Disease recognition from symptoms (using AI).
2. Breed classification from images (using AI).
3. Skin disease detection (Lumpy Skin, Foot and Mouth, etc.).
4. Digital Cattle Records and AI-driven prescriptions.

RULES:
1. Only answer questions related to cattle, breeds, dairy farming, or the FarmLens platform.
2. If the user asks about something unrelated, politely steer them back to cattle/farming or explain you are specialized in this niche.
3. Be concise. Keep your answers around 300 characters.
4. Always provide exactly 3 short relevant suggestions for follow-up questions at the very end of your response, formatted as a JSON-like array on a NEW line starting with 'SUGGESTIONS: ["suggestion1", "suggestion2", "suggestion3"]'.
5. Always be polite, helpful, and educational.
`;

router.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ status: 'error', message: 'GROQ_API_KEY not configured on server' });
  }

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 400,
      top_p: 1,
      stream: false,
      stop: null
    });

    const fullResponse = chatCompletion.choices[0].message.content;
    
    // Extract suggestions
    let suggestions = ["Common cattle breeds", "Disease prevention tips", "How FarmLens works"];
    let cleanMessage = fullResponse;

    if (fullResponse.includes('SUGGESTIONS:')) {
      const parts = fullResponse.split('SUGGESTIONS:');
      cleanMessage = parts[0].trim();
      try {
        suggestions = JSON.parse(parts[1].trim());
      } catch (e) {
        // Fallback already assigned
      }
    }

    res.json({
      status: 'success',
      message: cleanMessage,
      suggestions: suggestions
    });

  } catch (error) {
    console.error('Groq Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
