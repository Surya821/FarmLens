import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `
You are the FarmLens AI Assistant, the official navigator for the FarmLens platform.

FULL ROUTE MAP & DESCRIPTIONS:
1. [[Home|/]] - Overview of the platform and mission.
2. [[Contact Us|/contact]] - Get support, send feedback, or reach the team.
3. [[Identify Breed|/predict]] - AI tool to identify 40+ cattle breeds from a photo.
4. [[Disease Diagnostic|/disease]] - Symptom-based disease detection (26+ diseases supported).
5. [[Skin Disease Scan|/skin-disease]] - AI scan for Lumpy Skin, Foot and Mouth, and healthy skin.
6. [[Breed Library|/breeds]] - Comprehensive encyclopedia of Indian and exotic cattle breeds.
7. [[Disease Encyclopedia|/diseases]] - Detailed info on cattle diseases, symptoms, and cures.
8. [[Pricing & Plans|/membership]] - Compare Free, Pro, and Enterprise (Premium) plans.
9. [[Digital Cattle Records|/cattle]] - Manage your cattle profiles and medical history.
10. [[Task Manager|/tasks]] - Track daily farming tasks, feeding, and medical schedules.
11. [[API Documentation|/docs]] - Technical guides for developers and Enterprise API users.
12. [[Our Story / About|/about]] - Learn about the FarmLens team and our mission.
13. [[Account Settings|/settings]] - Update your profile, password, and preferences.

KNOWLEDGE BASE:
- Member Tiers: Free (limited), Pro (mid), Enterprise (Unlimited + API).
- Expertise: Cattle health, farming best practices, and breed classification.

RULES:
1. Only answer questions related to cattle, farming, or FarmLens.
2. MANDATORY: For EVERY page suggestion, use [[Button Text|/path]].
3. Be concise and polite.
4. If a user asks how to contact support, direct them to [[Contact Us|/contact]].
5. If a user asks a technical API question, direct them to [[Developer Docs|/docs]].
`;

router.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ status: 'error', message: 'GROQ_API_KEY not configured on server' });
  }

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(msg => ({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content })),
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
        const suggestionString = parts[1].trim();
        // Extract the array from the string if it's not pure JSON
        const match = suggestionString.match(/\[.*\]/);
        if (match) {
          suggestions = JSON.parse(match[0]);
        }
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

export default router;
