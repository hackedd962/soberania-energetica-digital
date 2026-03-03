import TelegramBot from 'node-telegram-bot-api';
import OpenAI from 'openai';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Soberanía Energética Digital Bot Running ⚡');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const token = process.env.TELEGRAM_BOT_TOKEN;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const bot = new TelegramBot(token, { polling: true });

const systemPrompt = `
Eres un mentor educativo especializado en explicar Bitcoin usando analogías del sistema eléctrico mexicano.
No das asesoría financiera personalizada.
Explicas con claridad y responsabilidad.
Siempre comparas conceptos financieros con conceptos energéticos.
Incluyes advertencias de riesgo.
`;

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  if (!userMessage) return;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    bot.sendMessage(chatId, response.choices[0].message.content);
  } catch (error) {
    bot.sendMessage(chatId, "Ocurrió un error. Intenta nuevamente.");
  }
});
