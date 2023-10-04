import express from 'express';
import cors from 'cors';

import { config } from 'dotenv';
config();

const app = express();
app.use(express.json());
app.use(cors());

let ids = '';

app.get('/', async (req,res) => {
    res.status(200).send({
        message: 'Hello from AI Summarizer',
    })
});

// metaphor
app.post('/search', async (req, res) => {
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-api-key': process.env.VITE_METAPHOR_API_KEY
        },
        body: JSON.stringify({
            numResults: 3, 
            query: req.body.query, 
            useAutoprompt: true
        })
    };
    try {
        const response = await fetch('https://api.metaphor.systems/search', options);
        const data = await response.json();
        ids = '';
        data && data.results.map((item) => {
            ids += 'ids=' + item.id + '&';
        });
        ids = ids.substring(0, ids.length-1);
        res.send(data);
    } catch (error) {
        console.error(error);
    }
});

// metaphor
app.get('/contents', async (req, res) => {
    const options = {
        method: 'GET', 
        headers: {
            accept: 'application/json', 
            'x-api-key': process.env.VITE_METAPHOR_API_KEY
        }};
    try {
        const response = await fetch('https://api.metaphor.systems/contents?' + ids, options);
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error);
    }
});

// openai
app.post('/completions', async (req, res) => {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                // { "role": "system", "content": SYSTEM_MESSAGE },
                { "role": 'user', "content": req.body.message }
            ],
            max_tokens: 300,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error); 
    }
})

app.listen(5000, () => console.log('Your server is running on port 5000')); 