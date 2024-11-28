const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config(); // Đọc file .env

const app = express();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.json());

app.post('/api', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Bạn là một trợ lý AI thông minh và thân thiện.' },
                    { role: 'user', content: message },
                ],
                max_tokens: 4000,
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi kết nối OpenAI' });
    }
});

app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});
